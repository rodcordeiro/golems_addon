/**
 * Tunnel Miner work loop.
 * MINER-012 3x3, MINER-013 formigueiro, MINER-014 stairs,
 * MINER-016 deposit, MINER-019 torches.
 */

import { system, world } from "@minecraft/server";
import {
  MINER_ID,
  DP,
  MAX_DISTANCE,
  TICK_INTERVAL,
  BRANCH_CHANCE,
  BRANCH_MIN_LEN,
  BRANCH_MAX_LEN,
  STAIR_CHANCE,
  STAIR_STEPS,
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
  perpendicular,
  horizDist,
} from "./common.js";
import { hasPickaxe, damageTool, ensureToolInSlot0 } from "./minerInteract.js";
import { locateDepositChest, depositAndRestock } from "./deposit.js";
import { resolveTunnelOrigin } from "./tunnelBanner.js";
import { afterSuccessfulMineStep } from "./torch.js";

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
 * Hire point, overridden by tunnel-start banner when present.
 * @param {import('@minecraft/server').Entity} miner
 */
function originPos(miner) {
  return resolveTunnelOrigin(miner, hirePos(miner));
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
function mainDir(miner) {
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
 * 3x3 cross-section cells: width +/-1 perpendicular, height foot..foot+2.
 * @param {{x:number,y:number,z:number}} foot
 * @param {{x:number,z:number}} digDir
 */
export function tunnelCells3x3(foot, digDir) {
  const lat = perpendicular(digDir);
  /** @type {{x:number,y:number,z:number}[]} */
  const cells = [];
  for (let w = -1; w <= 1; w++) {
    for (let h = 0; h <= 2; h++) {
      cells.push({
        x: foot.x + lat.x * w,
        y: foot.y + h,
        z: foot.z + lat.z * w,
      });
    }
  }
  return cells;
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
 * Ore scan radius 1 around 3x3 section, then clear section cells.
 * @param {import('@minecraft/server').Entity} miner
 * @param {{x:number,y:number,z:number}} foot
 * @param {{x:number,z:number}} digDir
 */
function mineStep3x3(miner, foot, digDir) {
  const dim = miner.dimension;
  const cells = tunnelCells3x3(foot, digDir);
  const scanned = new Set();

  for (const base of cells) {
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (let dz = -1; dz <= 1; dz++) {
          const p = { x: base.x + dx, y: base.y + dy, z: base.z + dz };
          const key = `${p.x},${p.y},${p.z}`;
          if (scanned.has(key)) continue;
          scanned.add(key);
          const b = getBlockSafe(dim, p);
          if (!b || !isOre(b.typeId)) continue;
          const r = processBlock(miner, b);
          if (r === "full") return "full";
          if (r === "stop") return "stop";
        }
      }
    }
  }

  for (const cell of cells) {
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
 * @param {{x:number,y:number,z:number}} target
 */
function teleportTo(miner, target) {
  try {
    miner.teleport(
      { x: target.x + 0.5, y: target.y, z: target.z + 0.5 },
      { dimension: miner.dimension, keepVelocity: false }
    );
  } catch (_) {
    try {
      miner.teleport({ x: target.x + 0.5, y: target.y, z: target.z + 0.5 });
    } catch (e) {
      console.warn(`[va] teleport failed: ${e}`);
    }
  }
}

/**
 * @param {import('@minecraft/server').Entity} miner
 */
function teleportToOrigin(miner) {
  teleportTo(miner, originPos(miner));
}

/**
 * @param {import('@minecraft/server').Entity} miner
 * @returns {number}
 */
function branchRemaining(miner) {
  const v = miner.getDynamicProperty(DP.branchRem);
  return typeof v === "number" ? v : 0;
}

/**
 * @param {import('@minecraft/server').Entity} miner
 * @returns {number}
 */
function stairRemaining(miner) {
  const v = miner.getDynamicProperty(DP.stairRem);
  return typeof v === "number" ? v : 0;
}

/**
 * Occasional lateral gallery (formigueiro) + stair step planning.
 * @param {import('@minecraft/server').Entity} miner
 * @param {{x:number,y:number,z:number}} axis
 * @returns {{ next: {x:number,y:number,z:number}, digDir: {x:number,z:number} }}
 */
function planNextStep(miner, axis) {
  const md = mainDir(miner);
  let rem = branchRemaining(miner);
  let digDir = md;

  if (rem > 0) {
    digDir = {
      x: /** @type {number} */ (miner.getDynamicProperty(DP.branchDirX) ?? md.x),
      z: /** @type {number} */ (miner.getDynamicProperty(DP.branchDirZ) ?? md.z),
    };
    miner.setDynamicProperty(DP.branchRem, rem - 1);
  } else if (Math.random() < BRANCH_CHANCE) {
    const lat = perpendicular(md);
    const sign = Math.random() < 0.5 ? 1 : -1;
    digDir = { x: lat.x * sign, z: lat.z * sign };
    const len =
      BRANCH_MIN_LEN +
      Math.floor(Math.random() * (BRANCH_MAX_LEN - BRANCH_MIN_LEN + 1));
    miner.setDynamicProperty(DP.branchDirX, digDir.x);
    miner.setDynamicProperty(DP.branchDirZ, digDir.z);
    miner.setDynamicProperty(DP.branchRem, len - 1);
  }

  let y = axis.y;
  let sRem = stairRemaining(miner);
  if (sRem > 0) {
    const sign = /** @type {number} */ (miner.getDynamicProperty(DP.stairSign) ?? 1);
    y = axis.y + sign;
    miner.setDynamicProperty(DP.stairRem, sRem - 1);
  } else if (rem <= 0 && Math.random() < STAIR_CHANCE) {
    const sign = Math.random() < 0.5 ? 1 : -1;
    miner.setDynamicProperty(DP.stairSign, sign);
    miner.setDynamicProperty(DP.stairRem, STAIR_STEPS - 1);
    y = axis.y + sign;
  }

  return {
    next: { x: axis.x + digDir.x, y, z: axis.z + digDir.z },
    digDir,
  };
}

/**
 * Cargo full: try copper chest deposit; else return to origin and wait.
 * @param {import('@minecraft/server').Entity} miner
 */
function handleFullCargo(miner) {
  const origin = originPos(miner);
  const chest = locateDepositChest(miner, origin);
  if (!chest) {
    setState(miner, "returning");
    teleportToOrigin(miner);
    setState(miner, "waiting");
    return;
  }

  setState(miner, "depositing");
  const cp = blockPos(chest.location);
  teleportTo(miner, { x: cp.x, y: cp.y, z: cp.z });

  const { freed } = depositAndRestock(miner, chest);
  if (freed && hasPickaxe(miner) && !stayOn(miner)) {
    setState(miner, "mining");
    return;
  }

  teleportToOrigin(miner);
  setState(miner, "waiting");
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
    teleportToOrigin(miner);
    setState(miner, "waiting");
    return;
  }

  if (state === "depositing") {
    const origin = originPos(miner);
    const chest = locateDepositChest(miner, origin);
    if (!chest) {
      teleportToOrigin(miner);
      setState(miner, "waiting");
      return;
    }
    const cp = blockPos(chest.location);
    teleportTo(miner, { x: cp.x, y: cp.y, z: cp.z });
    const { freed } = depositAndRestock(miner, chest);
    if (freed && hasPickaxe(miner) && !stayOn(miner)) {
      setState(miner, "mining");
      state = "mining";
    } else {
      teleportToOrigin(miner);
      setState(miner, "waiting");
      return;
    }
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
    handleFullCargo(miner);
    return;
  }

  const axis = axisPos(miner);
  const { next, digDir } = planNextStep(miner, axis);
  const origin = originPos(miner);

  if (horizDist(next, origin) > MAX_DISTANCE) {
    setState(miner, "stopped");
    teleportToOrigin(miner);
    return;
  }

  const result = mineStep3x3(miner, next, digDir);
  if (result === "stop") {
    setState(miner, "stopped");
    return;
  }
  if (result === "full") {
    handleFullCargo(miner);
    return;
  }

  // Cadence counts dig success even if the pickaxe breaks this step.
  afterSuccessfulMineStep(miner, next, digDir);

  if (!damageTool(miner)) {
    setState(miner, "waiting");
    return;
  }

  setAxis(miner, next);
  teleportTo(miner, next);
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
