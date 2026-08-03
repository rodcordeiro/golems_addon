/** Copper-chest deposit for Tunnel Miner (MINER-016). */

import {
  DP,
  TOOL_SLOT,
  CHEST_SEARCH_RADIUS,
  CHEST_SEARCH_Y,
  isCopperChest,
  isEmptySlot,
  isToolItem,
  getMinerContainer,
  cargoHasSpace,
  blockPos,
  horizDist,
} from "./common.js";

/**
 * @param {import('@minecraft/server').Entity} miner
 * @returns {{x:number,y:number,z:number} | undefined}
 */
export function getCachedChest(miner) {
  const x = miner.getDynamicProperty(DP.chestX);
  const y = miner.getDynamicProperty(DP.chestY);
  const z = miner.getDynamicProperty(DP.chestZ);
  if (typeof x !== "number" || typeof y !== "number" || typeof z !== "number") {
    return undefined;
  }
  return { x, y, z };
}

/**
 * @param {import('@minecraft/server').Entity} miner
 * @param {{x:number,y:number,z:number} | undefined} p
 */
export function setCachedChest(miner, p) {
  if (!p) {
    miner.setDynamicProperty(DP.chestX, undefined);
    miner.setDynamicProperty(DP.chestY, undefined);
    miner.setDynamicProperty(DP.chestZ, undefined);
    return;
  }
  miner.setDynamicProperty(DP.chestX, p.x);
  miner.setDynamicProperty(DP.chestY, p.y);
  miner.setDynamicProperty(DP.chestZ, p.z);
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
 * Validate cached chest still exists and is a copper chest.
 * @param {import('@minecraft/server').Entity} miner
 * @returns {import('@minecraft/server').Block | undefined}
 */
export function resolveCachedChestBlock(miner) {
  const p = getCachedChest(miner);
  if (!p) return undefined;
  const b = getBlockSafe(miner.dimension, p);
  if (!b || !isCopperChest(b.typeId)) {
    setCachedChest(miner, undefined);
    return undefined;
  }
  return b;
}

/**
 * Scan for nearest copper chest around origin (hire/banner).
 * Limited Y band to keep tick cost bounded.
 * @param {import('@minecraft/server').Dimension} dim
 * @param {{x:number,y:number,z:number}} origin
 * @param {number} [radius]
 * @returns {import('@minecraft/server').Block | undefined}
 */
export function findNearestCopperChest(dim, origin, radius = CHEST_SEARCH_RADIUS) {
  let best;
  let bestDist = Infinity;
  const ox = Math.floor(origin.x);
  const oy = Math.floor(origin.y);
  const oz = Math.floor(origin.z);

  for (let dx = -radius; dx <= radius; dx++) {
    for (let dz = -radius; dz <= radius; dz++) {
      const manhattan = Math.abs(dx) + Math.abs(dz);
      if (manhattan > radius || manhattan >= bestDist) continue;
      for (let dy = -CHEST_SEARCH_Y; dy <= CHEST_SEARCH_Y; dy++) {
        const p = { x: ox + dx, y: oy + dy, z: oz + dz };
        const b = getBlockSafe(dim, p);
        if (!b || !isCopperChest(b.typeId)) continue;
        const dist = manhattan + Math.abs(dy);
        if (dist < bestDist) {
          bestDist = dist;
          best = b;
        }
      }
    }
  }
  return best;
}

/**
 * @param {import('@minecraft/server').Block} block
 * @returns {import('@minecraft/server').Container | undefined}
 */
export function getChestContainer(block) {
  try {
    return block.getComponent("minecraft:inventory")?.container;
  } catch (_) {
    return undefined;
  }
}

/**
 * Move one cargo stack into chest; returns items moved count (>0 if progress).
 * @param {import('@minecraft/server').Container} from
 * @param {import('@minecraft/server').Container} to
 * @param {number} slot
 */
function transferSlotToChest(from, to, slot) {
  const item = from.getItem(slot);
  if (isEmptySlot(item) || isToolItem(item)) return 0;

  const before = item.amount;
  try {
    const leftover = to.addItem(item);
    if (!leftover || isEmptySlot(leftover)) {
      from.setItem(slot, undefined);
      return before;
    }
    const moved = before - leftover.amount;
    from.setItem(slot, leftover);
    return moved;
  } catch (_) {
    // Fallback: manual slot copy if addItem unavailable/throws
    for (let i = 0; i < to.size; i++) {
      const cur = to.getItem(i);
      if (isEmptySlot(cur)) {
        to.setItem(i, item);
        from.setItem(slot, undefined);
        return before;
      }
      if (cur.typeId === item.typeId && cur.amount < cur.maxAmount) {
        const space = cur.maxAmount - cur.amount;
        const add = Math.min(space, item.amount);
        cur.amount += add;
        to.setItem(i, cur);
        item.amount -= add;
        if (item.amount <= 0) {
          from.setItem(slot, undefined);
          return before;
        }
        from.setItem(slot, item);
        return add;
      }
    }
    return 0;
  }
}

/**
 * Deposit all inventoriable cargo (slots 1+) into copper chest.
 * Fill is never stored while mining; any cargo present (ores + misc) goes to chest.
 * @param {import('@minecraft/server').Entity} miner
 * @param {import('@minecraft/server').Block} chestBlock
 * @returns {{ moved: number, freed: boolean }}
 */
export function depositCargoToChest(miner, chestBlock) {
  const src = getMinerContainer(miner);
  const dst = getChestContainer(chestBlock);
  if (!src || !dst) return { moved: 0, freed: false };

  let moved = 0;
  for (let i = 0; i < src.size; i++) {
    if (i === TOOL_SLOT) continue;
    moved += transferSlotToChest(src, dst, i);
  }
  return { moved, freed: cargoHasSpace(miner) };
}

/**
 * Find or reuse copper chest near origin; cache on miner.
 * @param {import('@minecraft/server').Entity} miner
 * @param {{x:number,y:number,z:number}} origin
 * @returns {import('@minecraft/server').Block | undefined}
 */
export function locateDepositChest(miner, origin) {
  let block = resolveCachedChestBlock(miner);
  if (block) {
    const bp = blockPos(block.location);
    if (horizDist(bp, origin) <= CHEST_SEARCH_RADIUS + 4) return block;
  }
  block = findNearestCopperChest(miner.dimension, origin);
  if (block) {
    setCachedChest(miner, blockPos(block.location));
  } else {
    setCachedChest(miner, undefined);
  }
  return block;
}
