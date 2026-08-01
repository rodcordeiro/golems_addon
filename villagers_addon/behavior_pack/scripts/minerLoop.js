import { system, world } from "@minecraft/server";
import {
  MINER_ID,
  DP,
  MAX_DISTANCE,
  TICK_INTERVAL,
  getState,
  setState,
  isOre,
  isFill,
  isHardStop,
  isSoftStop,
  oreDropId,
  blockPos,
  cargoHasSpace,
  tryAddOre,
} from "./common.js";
import { hasPickaxe, damageTool, ensureToolInSlot0 } from "./minerInteract.js";

/**
 * @param {import('@minecraft/server').Entity} miner
 */
function stayOn(miner) {
  try {
    return !!miner.getProperty("va:stay_mode");
  } catch (_) {
    return false;
  }
}

/**
 * @param {import('@minecraft/server').Entity} miner
 */
function hirePos(miner) {
  return {
    x: /** @type {number} */ (miner.getDynamicProperty(DP.hireX) ?? blockPos(miner.location).x),
    y: /** @type {number} */ (miner.getDynamicProperty(DP.hireY) ?? blockPos(miner.location).y),
    z: /** @type {number} */ (miner.getDynamicProperty(DP.hireZ) ?? blockPos(miner.location).z),
  };
}

/**
 * @param {import('@minecraft/server').Entity} miner
 */
function axisPos(miner) {
  return {
    x: /** @type {number} */ (miner.getDynamicProperty(DP.axisX) ?? hirePos(miner).x),
    y: /** @type {number} */ (miner.getDynamicProperty(DP.axisY) ?? hirePos(miner).y),
    z: /** @type {number} */ (miner.getDynamicProperty(DP.axisZ) ?? hirePos(miner).z),
  };
}

/**
 * @param {import('@minecraft/server').Entity} miner
 * @param {{x:number,y:number,z:number}} p
 */
function setAxis(miner, p) {
  miner.setDynamicProperty(DP.axisX, p.x);
  miner.setDynamicProperty(DP.axisY, p.y);
  miner.setDynamicProperty(DP.axisZ, p.z);
}

/**
 * @param {import('@minecraft/server').Entity} miner
 */
function dir(miner) {
  return {
    x: /** @type {number} */ (miner.getDynamicProperty(DP.dirX) ?? 0),
    z: /** @type {number} */ (miner.getDynamicProperty(DP.dirZ) ?? 1),
  };
}

/**
 * @param {import('@minecraft/server').Dimension} dim
 * @param {{x:number,y:number,z:number}} p
 */
function getBlockSafe(dim, p) {
  try {
    return dim.getBlock(p);
  } catch (_) {
    return undefined;
  }
}

/**
 * @param {import('@minecraft/server').Entity} miner
 * @param {import('@minecraft/server').Block} block
 * @returns {'ok'|'full'|'stop'|'skip'}
 */
function processBlock(miner, block) {
  if (!block || block.isAir || block.isLiquid) {
    if (block?.isLiquid || (block && isSoftStop(block.typeId))) return "stop";
    return "skip";
  }
  const id = block.typeId;
  if (isHardStop(id) || isSoftStop(id)) return "stop";

  if (isOre(id)) {
    const drop = oreDropId(id);
    if (!tryAddOre(miner, drop, 1)) return "full";
    block.setType("minecraft:air");
    return "ok";
  }

  if (isFill(id)) {
    block.setType("minecraft:air");
    return "ok";
  }

  // Unknown solid: treat as hard stop to avoid grief
  return "stop";
}

/**
 * Scan ore in radius 1 around foot and head cells, then clear tunnel cells.
 * @param {import('@minecraft/server').Entity} miner
 * @param {{x:number,y:number,z:number}} foot
 */
function mineStep(miner, foot) {
  const dim = miner.dimension;
  const head = { x: foot.x, y: foot.y + 1, z: foot.z };

  // Ore scan around both cells
  for (const base of [foot, head]) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          const p = { x: base.x + dx, y: base.y + dy, z: base.z + dz };
          const b = getBlockSafe(dim, p);
          if (!b) continue;
          if (!isOre(b.typeId)) continue;
          const r = processBlock(miner, b);
          if (r === "full") return "full";
          if (r === "stop") return "stop";
        }
      }
    }
  }

  for (const cell of [foot, head]) {
    const b = getBlockSafe(dim, cell);
    if (!b) return "stop";
    const r = processBlock(miner, b);
    if (r === "full") return "full";
    if (r === "stop") return "stop";
  }

  return "ok";
}

/**
 * @param {import('@minecraft/server').Entity} miner
 */
function teleportToHire(miner) {
  const h = hirePos(miner);
  try {
    miner.teleport(
      { x: h.x + 0.5, y: h.y, z: h.z + 0.5 },
      { dimension: miner.dimension, keepVelocity: false }
    );
  } catch (_) {
    try {
      miner.teleport({ x: h.x + 0.5, y: h.y, z: h.z + 0.5 });
    } catch (e) {
      console.warn(`[va] teleport hire failed: ${e}`);
    }
  }
}

/**
 * @param {import('@minecraft/server').Entity} miner
 */
function distanceFromHire(miner, axis) {
  const h = hirePos(miner);
  return Math.abs(axis.x - h.x) + Math.abs(axis.z - h.z);
}

/**
 * @param {import('@minecraft/server').Entity} miner
 */
function tickMiner(miner) {
  if (!miner.isValid) return;

  let state = getState(miner);

  if (stayOn(miner)) return;

  if (state === "stopped") return;

  if (state === "returning") {
    teleportToHire(miner);
    setState(miner, "waiting");
    return;
  }

  if (state === "waiting") {
    ensureToolInSlot0(miner);
    if (hasPickaxe(miner) && cargoHasSpace(miner) && !stayOn(miner)) {
      setState(miner, "mining");
      state = "mining";
    } else {
      return;
    }
  }

  if (state !== "mining") return;
  ensureToolInSlot0(miner);
  if (!hasPickaxe(miner)) {
    setState(miner, "waiting");
    return;
  }
  if (!cargoHasSpace(miner)) {
    setState(miner, "returning");
    teleportToHire(miner);
    setState(miner, "waiting");
    return;
  }

  const d = dir(miner);
  const axis = axisPos(miner);
  const next = { x: axis.x + d.x, y: axis.y, z: axis.z + d.z };

  if (distanceFromHire(miner, next) > MAX_DISTANCE) {
    setState(miner, "stopped");
    teleportToHire(miner);
    return;
  }

  const result = mineStep(miner, next);
  if (result === "stop") {
    setState(miner, "stopped");
    return;
  }
  if (result === "full") {
    setState(miner, "returning");
    teleportToHire(miner);
    setState(miner, "waiting");
    return;
  }

  if (!damageTool(miner)) {
    setState(miner, "waiting");
    return;
  }

  setAxis(miner, next);
  try {
    miner.teleport(
      { x: next.x + 0.5, y: next.y, z: next.z + 0.5 },
      { dimension: miner.dimension, keepVelocity: false }
    );
  } catch (_) {
    try {
      miner.teleport({ x: next.x + 0.5, y: next.y, z: next.z + 0.5 });
    } catch (__) {}
  }
}

system.runInterval(() => {
  for (const dim of [
    world.getDimension("overworld"),
    world.getDimension("nether"),
    world.getDimension("the_end"),
  ]) {
    let miners;
    try {
      miners = dim.getEntities({ type: MINER_ID });
    } catch (_) {
      continue;
    }
    for (const miner of miners) {
      try {
        tickMiner(miner);
      } catch (e) {
        console.warn(`[va] miner tick: ${e}`);
      }
    }
  }
}, TICK_INTERVAL);
