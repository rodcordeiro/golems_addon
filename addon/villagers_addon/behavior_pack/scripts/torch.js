/**
 * Tunnel lighting (MINER-019): cadence, wall/floor torch placement.
 */

import { BlockPermutation } from "@minecraft/server";
import {
  DP,
  TORCH_ID,
  WALL_TORCH_ID,
  TORCH_PLACE_EVERY,
  countTorches,
  consumeOneTorch,
  perpendicular,
  isSoftStop,
} from "./common.js";

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
 * Solid support (not air/liquid/soft stop).
 * @param {import('@minecraft/server').Block | undefined} block
 */
function isSupportSolid(block) {
  if (!block || block.isAir || block.isLiquid) return false;
  if (isSoftStop(block.typeId)) return false;
  return true;
}

/**
 * @param {import('@minecraft/server').Block | undefined} block
 */
function isReplaceableAir(block) {
  return !!(block && block.isAir);
}

/**
 * torch_facing_direction: direction the torch points (away from the wall).
 * @param {number} dx
 * @param {number} dz
 */
function facingFromDelta(dx, dz) {
  if (dx === 1) return "east";
  if (dx === -1) return "west";
  if (dz === 1) return "south";
  if (dz === -1) return "north";
  return undefined;
}

/**
 * Prefer wall_torch on outer solid face (w=+/-2); torch block at lateral w=+/-1, Y=foot+1.
 * @param {import('@minecraft/server').Entity} miner
 * @param {{x:number,y:number,z:number}} foot
 * @param {{x:number,z:number}} lat
 * @param {number} side
 */
function tryPlaceWallTorch(miner, foot, lat, side) {
  const dim = miner.dimension;
  const torchPos = {
    x: foot.x + lat.x * side,
    y: foot.y + 1,
    z: foot.z + lat.z * side,
  };
  const solidPos = {
    x: foot.x + lat.x * side * 2,
    y: foot.y + 1,
    z: foot.z + lat.z * side * 2,
  };

  const air = getBlockSafe(dim, torchPos);
  const solid = getBlockSafe(dim, solidPos);
  if (!isReplaceableAir(air) || !isSupportSolid(solid)) return false;

  // Facing = from wall toward torch (away from support).
  const facing = facingFromDelta(-lat.x * side, -lat.z * side);
  if (!facing) return false;

  try {
    air.setPermutation(
      BlockPermutation.resolve(WALL_TORCH_ID, {
        torch_facing_direction: facing,
      })
    );
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Fallback floor torch on lateral cell if floor is solid.
 * @param {import('@minecraft/server').Entity} miner
 * @param {{x:number,y:number,z:number}} foot
 * @param {{x:number,z:number}} lat
 * @param {number} side
 */
function tryPlaceFloorTorch(miner, foot, lat, side) {
  const dim = miner.dimension;
  const floorPos = {
    x: foot.x + lat.x * side,
    y: foot.y,
    z: foot.z + lat.z * side,
  };
  const torchPos = {
    x: floorPos.x,
    y: foot.y + 1,
    z: floorPos.z,
  };

  const floor = getBlockSafe(dim, floorPos);
  const air = getBlockSafe(dim, torchPos);
  if (!isSupportSolid(floor) || !isReplaceableAir(air)) return false;

  try {
    air.setPermutation(BlockPermutation.resolve(TORCH_ID));
    return true;
  } catch (_) {
    try {
      air.setType(TORCH_ID);
      return true;
    } catch (_) {
      return false;
    }
  }
}

/**
 * @param {import('@minecraft/server').Entity} miner
 * @returns {number} preferred side (+1 / -1)
 */
function preferredSide(miner) {
  const v = miner.getDynamicProperty(DP.torchSide);
  if (v === 1 || v === -1) return /** @type {number} */ (v);
  return 1;
}

/**
 * Attempt placement for current preferred side. On success: consume, reset
 * counter, flip side. On fail: leave stock and counter unchanged.
 * @param {import('@minecraft/server').Entity} miner
 * @param {{x:number,y:number,z:number}} foot
 * @param {{x:number,z:number}} digDir
 */
function tryPlaceTorch(miner, foot, digDir) {
  if (countTorches(miner) <= 0) return false;

  const side = preferredSide(miner);
  const lat = perpendicular(digDir);

  const placed =
    tryPlaceWallTorch(miner, foot, lat, side) ||
    tryPlaceFloorTorch(miner, foot, lat, side);

  if (!placed) return false;

  if (!consumeOneTorch(miner)) {
    // Placement succeeded but stock race — leave block; still flip cadence.
  }
  miner.setDynamicProperty(DP.torchDist, 0);
  miner.setDynamicProperty(DP.torchSide, -side);
  return true;
}

/**
 * Call after a successful dig step (axis / branch / stair).
 * @param {import('@minecraft/server').Entity} miner
 * @param {{x:number,y:number,z:number}} foot
 * @param {{x:number,z:number}} digDir
 */
export function afterSuccessfulMineStep(miner, foot, digDir) {
  if (!miner.isValid) return;

  const prev = miner.getDynamicProperty(DP.torchDist);
  const dist = (typeof prev === "number" ? prev : 0) + 1;
  miner.setDynamicProperty(DP.torchDist, dist);

  if (dist < TORCH_PLACE_EVERY) return;
  // No torches: keep mining unlit; keep counter for later retry.
  if (countTorches(miner) <= 0) return;

  tryPlaceTorch(miner, foot, digDir);
}
