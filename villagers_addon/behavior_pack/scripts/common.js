/** Shared constants and helpers for Tunnel Miner. */

import { ItemStack } from "@minecraft/server";

export const MINER_ID = "va:villager_miner";
export const CONTRACT_ID = "va:mining_contract";
export const COMMAND_FLAG_ID = "va:command_flag";
export const FREE_HANDLE_ID = "fv:villager_free_handle";
export const BANNER_ITEM_ID = "va:tunnel_start_banner";
export const BANNER_ENTITY_ID = "va:tunnel_start_banner_marker";
export const OWNER_TAG_PREFIX = "va_owner_";
export const MAX_DISTANCE = 64;
export const TICK_INTERVAL = 10;
export const CHEST_SEARCH_RADIUS = 24;
export const CHEST_SEARCH_Y = 6;
export const BRANCH_CHANCE = 0.12;
export const BRANCH_MIN_LEN = 2;
export const BRANCH_MAX_LEN = 4;
export const STAIR_CHANCE = 0.1;
export const STAIR_STEPS = 2;

/** Inventory item for lighting (MINER-019); wall_torch is placement-only. */
export const TORCH_ID = "minecraft:torch";
export const WALL_TORCH_ID = "minecraft:wall_torch";
/** Place a torch every N successful dig steps. */
export const TORCH_PLACE_EVERY = 10;
/** Restock from copper chest when below this count. */
export const TORCH_RESTOCK_MIN = 8;
/** Target torch count after restock. */
export const TORCH_RESTOCK_TARGET = 16;

/** Inventory slot reserved for the mining pickaxe (cargo uses the rest). */
export const TOOL_SLOT = 0;

export const DP = {
  dirX: "va_dir_x",
  dirZ: "va_dir_z",
  hireX: "va_hire_x",
  hireY: "va_hire_y",
  hireZ: "va_hire_z",
  axisX: "va_axis_x",
  axisY: "va_axis_y",
  axisZ: "va_axis_z",
  state: "va_state",
  toolSlot: "va_tool_slot",
  branchRem: "va_branch_rem",
  branchDirX: "va_branch_dx",
  branchDirZ: "va_branch_dz",
  stairRem: "va_stair_rem",
  stairSign: "va_stair_sign",
  chestX: "va_chest_x",
  chestY: "va_chest_y",
  chestZ: "va_chest_z",
  /** Successful dig steps since last placed torch. */
  torchDist: "va_torch_dist",
  /** Preferred lateral side for next torch (+1 / -1). */
  torchSide: "va_torch_side",
};

/** @typedef {'mining' | 'returning' | 'waiting' | 'stopped' | 'depositing'} MinerState */

export const FILL_BLOCKS = new Set([
  "minecraft:stone",
  "minecraft:cobblestone",
  "minecraft:mossy_cobblestone",
  "minecraft:deepslate",
  "minecraft:cobbled_deepslate",
  "minecraft:netherrack",
  "minecraft:granite",
  "minecraft:diorite",
  "minecraft:andesite",
  "minecraft:tuff",
  "minecraft:calcite",
  "minecraft:smooth_basalt",
  "minecraft:basalt",
  "minecraft:blackstone",
]);

export const COPPER_CHESTS = new Set([
  "minecraft:copper_chest",
  "minecraft:exposed_copper_chest",
  "minecraft:weathered_copper_chest",
  "minecraft:oxidized_copper_chest",
  "minecraft:waxed_copper_chest",
  "minecraft:waxed_exposed_copper_chest",
  "minecraft:waxed_weathered_copper_chest",
  "minecraft:waxed_oxidized_copper_chest",
]);

export const HARD_STOP = new Set([
  "minecraft:bedrock",
  "minecraft:barrier",
  "minecraft:reinforced_deepslate",
  "minecraft:obsidian",
  "minecraft:crying_obsidian",
  "minecraft:spawner",
  "minecraft:mob_spawner",
  "minecraft:chest",
  "minecraft:trapped_chest",
  "minecraft:ender_chest",
  "minecraft:command_block",
  "minecraft:chain_command_block",
  "minecraft:repeating_command_block",
  "minecraft:structure_block",
  "minecraft:jigsaw",
  "minecraft:end_portal",
  "minecraft:end_portal_frame",
  "minecraft:nether_portal",
  "minecraft:portal",
  ...COPPER_CHESTS,
]);

export const SOFT_STOP = new Set([
  "minecraft:water",
  "minecraft:flowing_water",
  "minecraft:lava",
  "minecraft:flowing_lava",
]);

const ORE_SUFFIX = "_ore";
const RAW_MAP = {
  "minecraft:iron_ore": "minecraft:raw_iron",
  "minecraft:deepslate_iron_ore": "minecraft:raw_iron",
  "minecraft:copper_ore": "minecraft:raw_copper",
  "minecraft:deepslate_copper_ore": "minecraft:raw_copper",
  "minecraft:gold_ore": "minecraft:raw_gold",
  "minecraft:deepslate_gold_ore": "minecraft:raw_gold",
  "minecraft:nether_gold_ore": "minecraft:gold_nugget",
};

/**
 * @param {string} typeId
 */
export function isOre(typeId) {
  if (!typeId?.startsWith("minecraft:")) return false;
  if (typeId.includes("ore")) return true;
  return false;
}

/**
 * @param {string} typeId
 */
export function oreDropId(typeId) {
  if (RAW_MAP[typeId]) return RAW_MAP[typeId];
  if (typeId.endsWith(ORE_SUFFIX) || typeId.includes("_ore")) return typeId;
  return typeId;
}

/**
 * @param {string} typeId
 */
export function isFill(typeId) {
  return FILL_BLOCKS.has(typeId);
}

/**
 * @param {string} typeId
 */
export function isCopperChest(typeId) {
  return COPPER_CHESTS.has(typeId);
}

/**
 * @param {string} typeId
 */
export function isHardStop(typeId) {
  return HARD_STOP.has(typeId);
}

/**
 * @param {string} typeId
 */
export function isSoftStop(typeId) {
  return SOFT_STOP.has(typeId) || typeId.includes("water") || typeId.includes("lava");
}

/**
 * Bedrock yaw: 0 = south (+Z), 90 = west (-X).
 * @param {number} yaw
 */
export function yawToCardinal(yaw) {
  const y = ((yaw % 360) + 360) % 360;
  if (y >= 315 || y < 45) return { x: 0, z: 1 };
  if (y >= 45 && y < 135) return { x: -1, z: 0 };
  if (y >= 135 && y < 225) return { x: 0, z: -1 };
  return { x: 1, z: 0 };
}

/**
 * Horizontal perpendicular (left) of a cardinal dig direction.
 * @param {{x:number,z:number}} d
 */
export function perpendicular(d) {
  return { x: -d.z, z: d.x };
}

/**
 * @param {import('@minecraft/server').Entity} entity
 * @param {string} playerId
 */
export function ownerTag(playerId) {
  return `${OWNER_TAG_PREFIX}${playerId}`;
}

/**
 * @param {import('@minecraft/server').Entity} entity
 * @returns {string | undefined}
 */
export function getOwnerId(entity) {
  for (const tag of entity.getTags()) {
    if (tag.startsWith(OWNER_TAG_PREFIX)) {
      return tag.slice(OWNER_TAG_PREFIX.length);
    }
  }
  return undefined;
}

/**
 * @param {import('@minecraft/server').Entity} entity
 * @param {import('@minecraft/server').Player} player
 */
export function isOwner(entity, player) {
  return entity.hasTag(ownerTag(player.id));
}

/**
 * @param {import('@minecraft/server').Entity} entity
 * @returns {MinerState}
 */
export function getState(entity) {
  return /** @type {MinerState} */ (entity.getDynamicProperty(DP.state) ?? "waiting");
}

/**
 * @param {import('@minecraft/server').Entity} entity
 * @param {MinerState} state
 */
export function setState(entity, state) {
  entity.setDynamicProperty(DP.state, state);
}

/**
 * @param {string} typeId
 */
export function isPickaxe(typeId) {
  return typeof typeId === "string" && typeId.includes("pickaxe");
}

/**
 * Inventory lighting stock only (`minecraft:torch`).
 * @param {string} typeId
 */
export function isTorch(typeId) {
  return typeId === TORCH_ID;
}

/**
 * @param {import('@minecraft/server').Entity} miner
 * @returns {import('@minecraft/server').Container | undefined}
 */
export function getMinerContainer(miner) {
  return miner.getComponent("minecraft:inventory")?.container;
}

/**
 * Empty / air / zero-amount stacks (Bedrock may return air instead of undefined).
 * @param {import('@minecraft/server').ItemStack | undefined} item
 */
export function isEmptySlot(item) {
  if (!item) return true;
  if (!item.typeId || item.typeId === "minecraft:air") return true;
  if (typeof item.amount === "number" && item.amount <= 0) return true;
  return false;
}

/**
 * True if the stack is the mining tool (never counts as cargo).
 * @param {import('@minecraft/server').ItemStack | undefined} item
 */
export function isToolItem(item) {
  return !!(item && !isEmptySlot(item) && isPickaxe(item.typeId));
}

/**
 * True if the stack is torch stock (consumption, not cargo).
 * @param {import('@minecraft/server').ItemStack | undefined} item
 */
export function isTorchItem(item) {
  return !!(item && !isEmptySlot(item) && isTorch(item.typeId));
}

/**
 * Cargo has room for ore (empty / partial / misplaced pickaxe in slots 1+).
 * Slot 0 is reserved for the pickaxe and never counts as cargo capacity.
 * Torch stacks are ignored (not ore capacity, not "full cargo" fillers).
 * @param {import('@minecraft/server').Entity} miner
 */
export function cargoHasSpace(miner) {
  const c = getMinerContainer(miner);
  if (!c) return false;
  const size = c.size ?? 0;
  for (let i = 0; i < size; i++) {
    if (i === TOOL_SLOT) continue;
    const item = c.getItem(i);
    if (isEmptySlot(item) || isToolItem(item)) return true;
    if (isTorchItem(item)) continue;
    if (item.amount < item.maxAmount) return true;
  }
  return false;
}

/**
 * True if any inventoriable cargo remains in slots 1+ (torches ignored).
 * @param {import('@minecraft/server').Entity} miner
 */
export function hasCargo(miner) {
  const c = getMinerContainer(miner);
  if (!c) return false;
  const size = c.size ?? 0;
  for (let i = 0; i < size; i++) {
    if (i === TOOL_SLOT) continue;
    const item = c.getItem(i);
    if (!isEmptySlot(item) && !isToolItem(item) && !isTorchItem(item)) return true;
  }
  return false;
}

/**
 * Count `minecraft:torch` in slots 1+.
 * @param {import('@minecraft/server').Entity} miner
 */
export function countTorches(miner) {
  const c = getMinerContainer(miner);
  if (!c) return 0;
  let n = 0;
  const size = c.size ?? 0;
  for (let i = 0; i < size; i++) {
    if (i === TOOL_SLOT) continue;
    const item = c.getItem(i);
    if (isTorchItem(item)) n += item.amount;
  }
  return n;
}

/**
 * Add torches into slots 1+ (stack then empty). Returns amount actually added.
 * @param {import('@minecraft/server').Entity} miner
 * @param {number} amount
 */
export function tryAddTorches(miner, amount) {
  if (amount <= 0) return 0;
  const c = getMinerContainer(miner);
  if (!c) return 0;
  let left = amount;
  const size = c.size ?? 0;

  for (let i = 0; i < size && left > 0; i++) {
    if (i === TOOL_SLOT) continue;
    const cur = c.getItem(i);
    if (isEmptySlot(cur) || isToolItem(cur)) continue;
    if (!isTorch(cur.typeId) || cur.amount >= cur.maxAmount) continue;
    const space = cur.maxAmount - cur.amount;
    const add = Math.min(space, left);
    cur.amount += add;
    c.setItem(i, cur);
    left -= add;
  }

  for (let i = 0; i < size && left > 0; i++) {
    if (i === TOOL_SLOT) continue;
    const cur = c.getItem(i);
    if (isToolItem(cur)) continue;
    if (!isEmptySlot(cur)) continue;
    const add = Math.min(64, left);
    c.setItem(i, new ItemStack(TORCH_ID, add));
    left -= add;
  }

  return amount - left;
}

/**
 * Remove one torch from slots 1+. Returns false if none.
 * @param {import('@minecraft/server').Entity} miner
 */
export function consumeOneTorch(miner) {
  const c = getMinerContainer(miner);
  if (!c) return false;
  const size = c.size ?? 0;
  for (let i = 0; i < size; i++) {
    if (i === TOOL_SLOT) continue;
    const item = c.getItem(i);
    if (!isTorchItem(item)) continue;
    if (item.amount <= 1) {
      c.setItem(i, undefined);
    } else {
      item.amount -= 1;
      c.setItem(i, item);
    }
    return true;
  }
  return false;
}

/**
 * @param {import('@minecraft/server').Entity} miner
 * @param {string} itemId
 * @param {number} [amount]
 */
export function tryAddOre(miner, itemId, amount = 1) {
  const c = getMinerContainer(miner);
  if (!c) return false;
  const size = c.size ?? 0;
  for (let i = 0; i < size; i++) {
    if (i === TOOL_SLOT) continue;
    const cur = c.getItem(i);
    if (isEmptySlot(cur) || isToolItem(cur)) continue;
    if (cur.typeId === itemId && cur.amount < cur.maxAmount) {
      const space = cur.maxAmount - cur.amount;
      const add = Math.min(space, amount);
      cur.amount += add;
      c.setItem(i, cur);
      amount -= add;
      if (amount <= 0) return true;
    }
  }
  for (let i = 0; i < size; i++) {
    if (i === TOOL_SLOT) continue;
    const cur = c.getItem(i);
    if (isToolItem(cur)) continue;
    if (isEmptySlot(cur)) {
      c.setItem(i, new ItemStack(itemId, amount));
      return true;
    }
  }
  return false;
}

/**
 * Floor block coords from entity location.
 * @param {import('@minecraft/server').Vector3} loc
 */
export function blockPos(loc) {
  return {
    x: Math.floor(loc.x),
    y: Math.floor(loc.y),
    z: Math.floor(loc.z),
  };
}

/**
 * Manhattan horizontal distance.
 * @param {{x:number,z:number}} a
 * @param {{x:number,z:number}} b
 */
export function horizDist(a, b) {
  return Math.abs(a.x - b.x) + Math.abs(a.z - b.z);
}
