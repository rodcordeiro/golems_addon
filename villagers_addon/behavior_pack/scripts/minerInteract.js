import {
  world,
  system,
  EquipmentSlot,
  ItemStack,
} from "@minecraft/server";
import {
  MINER_ID,
  isOwner,
  isPickaxe,
  getState,
  setState,
} from "./common.js";

const TOOL_SLOT = 0;

/**
 * @param {import('@minecraft/server').Entity} miner
 */
function getContainer(miner) {
  return miner.getComponent("minecraft:inventory")?.container;
}

/**
 * @param {import('@minecraft/server').Entity} miner
 */
export function hasPickaxe(miner) {
  const c = getContainer(miner);
  if (!c) return false;
  const item = c.getItem(TOOL_SLOT);
  return !!(item && isPickaxe(item.typeId));
}

/**
 * Apply 1 durability to tool in slot 0. Returns false if tool broke / missing.
 * @param {import('@minecraft/server').Entity} miner
 */
export function damageTool(miner) {
  const container = getContainer(miner);
  if (!container) return false;
  const tool = container.getItem(TOOL_SLOT);
  if (!tool || !isPickaxe(tool.typeId)) return false;

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

      const prev = getContainer(target)?.getItem(TOOL_SLOT);
      getContainer(target)?.setItem(TOOL_SLOT, given);
      if (prev) {
        try {
          eq.setEquipment(EquipmentSlot.Mainhand, prev);
        } catch (_) {
          player.dimension.spawnItem(prev, player.location);
        }
      }

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
        if (hasPickaxe(target) && getState(target) !== "returning") {
          setState(target, "mining");
        }
      }
    } catch (e) {
      console.warn(`[va] stay toggle failed: ${e}`);
    }
  });
});
