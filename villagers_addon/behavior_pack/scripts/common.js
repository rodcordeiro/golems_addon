/** Shared constants and helpers for Tunnel Miner. */

export const MINER_ID = "va:villager_miner";
export const CONTRACT_ID = "va:mining_contract";
export const FREE_HANDLE_ID = "fv:villager_free_handle";
export const OWNER_TAG_PREFIX = "va_owner_";
export const MAX_DISTANCE = 64;
export const TICK_INTERVAL = 10;

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
};

/** @typedef {'mining' | 'returning' | 'waiting' | 'stopped'} MinerState */

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
  "minecraft:copper_chest",
  "minecraft:exposed_copper_chest",
  "minecraft:weathered_copper_chest",
  "minecraft:oxidized_copper_chest",
  "minecraft:waxed_copper_chest",
  "minecraft:command_block",
  "minecraft:chain_command_block",
  "minecraft:repeating_command_block",
  "minecraft:structure_block",
  "minecraft:jigsaw",
  "minecraft:end_portal",
  "minecraft:end_portal_frame",
  "minecraft:nether_portal",
  "minecraft:portal",
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
 * @param {import('@minecraft/server').Entity} entity
 * @param {string} playerId
 */
export function ownerTag(playerId) {
  return `${OWNER_TAG_PREFIX}${playerId}`;
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
