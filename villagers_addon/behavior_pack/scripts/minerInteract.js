import {
  world,
  system,
  EquipmentSlot,
  ItemStack,
} from "@minecraft/server";
import {
  MINER_ID,
  TOOL_SLOT,
  isOwner,
  isPickaxe,
  isEmptySlot,
  getMinerContainer,
  getState,
  setState,
} from "./common.js";

/**
 * @param {import('@minecraft/server').Entity} miner
 */
export function getContainer(miner) {
  return getMinerContainer(miner);
}

/**
 * Find pickaxe anywhere in inventory (UI may shift slots).
 * @param {import('@minecraft/server').Entity} miner
 * @returns {number} slot index or -1
 */
export function findPickaxeSlot(miner) {
  const c = getMinerContainer(miner);
  if (!c) return -1;
  for (let i = 0; i < c.size; i++) {
    const item = c.getItem(i);
    if (item && !isEmptySlot(item) && isPickaxe(item.typeId)) return i;
  }
  return -1;
}

/**
 * Keep tool in slot 0 so cargo checks ignore the pickaxe.
 * @param {import('@minecraft/server').Entity} miner
 * @returns {boolean}
 */
export function ensureToolInSlot0(miner) {
  const c = getMinerContainer(miner);
  if (!c) return false;
  const slot = findPickaxeSlot(miner);
  if (slot < 0) return false;
  if (slot === TOOL_SLOT) return true;

  const tool = c.getItem(slot);
  const prev0 = c.getItem(TOOL_SLOT);
  c.setItem(TOOL_SLOT, tool);
  c.setItem(slot, isEmptySlot(prev0) ? undefined : prev0);
  return true;
}

/**
 * @param {import('@minecraft/server').Entity} miner
 */
export function hasPickaxe(miner) {
  return findPickaxeSlot(miner) >= 0;
}

/**
 * Apply 1 durability to the pickaxe (normalized to slot 0).
 * @param {import('@minecraft/server').Entity} miner
 */
export function damageTool(miner) {
  if (!ensureToolInSlot0(miner)) return false;
  const container = getMinerContainer(miner);
  if (!container) return false;
  const tool = container.getItem(TOOL_SLOT);
  if (!tool || isEmptySlot(tool) || !isPickaxe(tool.typeId)) return false;

  try {
    const dur = tool.getComponent("minecraft:durability");
    if (dur) {
      if (dur.damage + 1 >= dur.maxDurability) {
        container.setItem(TOOL_SLOT, undefined);
        return false;
      }
      dur.damage += 1;
      container.setItem(TOOL_SLOT, tool);
    }
  } catch (_) {
    /* tools without durability component */
  }
  return true;
}

world.afterEvents.playerInteractWithEntity.subscribe((event) => {
  const { player, target } = event;
  if (!player?.isValid || !target?.isValid) return;
  if (target.typeId !== MINER_ID) return;
  if (!isOwner(target, player)) {
    player.sendMessage("Este minerador nao e seu.");
    return;
  }

  const eq = player.getComponent("minecraft:equippable");
  const hand = eq?.getEquipment(EquipmentSlot.Mainhand);

  system.run(() => {
    if (!player.isValid || !target.isValid) return;

    if (hand && isPickaxe(hand.typeId)) {
      const given = new ItemStack(hand.typeId, 1);
      try {
        const d = hand.getComponent("minecraft:durability");
        const gd = given.getComponent("minecraft:durability");
        if (d && gd) gd.damage = d.damage;
      } catch (_) {}

      if (hand.amount > 1) {
        hand.amount -= 1;
        eq.setEquipment(EquipmentSlot.Mainhand, hand);
      } else {
        eq.setEquipment(EquipmentSlot.Mainhand, undefined);
      }

      const container = getMinerContainer(target);
      const prev = container?.getItem(TOOL_SLOT);
      container?.setItem(TOOL_SLOT, given);
      if (prev && !isEmptySlot(prev) && !isPickaxe(prev.typeId)) {
        try {
          eq.setEquipment(EquipmentSlot.Mainhand, prev);
        } catch (_) {
          player.dimension.spawnItem(prev, player.location);
        }
      }

      ensureToolInSlot0(target);

      if (getState(target) === "waiting" || getState(target) === "stopped") {
        try {
          if (!target.getProperty("va:stay_mode")) {
            setState(target, "mining");
          }
        } catch (_) {
          setState(target, "mining");
        }
      }
      player.sendMessage("Picareta entregue ao Minerador de Tunel.");
      return;
    }

    if (player.isSneaking) return;

    try {
      const stay = !!target.getProperty("va:stay_mode");
      target.setProperty("va:stay_mode", !stay);
      if (!stay) {
        player.sendMessage("Minerador: pausado (stay).");
      } else {
        player.sendMessage("Minerador: retomando.");
        ensureToolInSlot0(target);
        if (hasPickaxe(target) && getState(target) !== "returning") {
          setState(target, "mining");
        }
      }
    } catch (e) {
      console.warn(`[va] stay toggle failed: ${e}`);
    }
  });
});
