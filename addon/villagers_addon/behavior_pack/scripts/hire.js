import {
  world,
  system,
  EquipmentSlot,
} from "@minecraft/server";
import {
  MINER_ID,
  CONTRACT_ID,
  FREE_HANDLE_ID,
  DP,
  ownerTag,
  yawToCardinal,
  setState,
  blockPos,
} from "./common.js";

/**
 * @param {import('@minecraft/server').Entity} source
 * @param {import('@minecraft/server').Entity} miner
 * @param {number} mark
 */
function applyMarkVariant(miner, mark) {
  try {
    const dst = miner.getComponent("minecraft:mark_variant");
    if (dst && typeof mark === "number") {
      dst.value = mark;
    }
  } catch (_) {
    /* keep default plains */
  }
}

world.afterEvents.playerInteractWithEntity.subscribe((event) => {
  const { player, target } = event;
  if (!player?.isValid || !target?.isValid) return;
  if (target.typeId !== FREE_HANDLE_ID) return;

  const eq = player.getComponent("minecraft:equippable");
  const item = eq?.getEquipment(EquipmentSlot.Mainhand);
  if (!item || item.typeId !== CONTRACT_ID) return;
  if (target.hasComponent("minecraft:is_baby")) return;

  const pos = { x: target.location.x, y: target.location.y, z: target.location.z };
  const dim = target.dimension;
  const dir = yawToCardinal(player.getRotation().y);
  const hire = blockPos(pos);
  const sourceRef = target;

  system.run(() => {
    try {
      if (!player.isValid) return;

      const hand = eq?.getEquipment(EquipmentSlot.Mainhand);
      if (!hand || hand.typeId !== CONTRACT_ID) return;

      if (hand.amount > 1) {
        hand.amount -= 1;
        eq.setEquipment(EquipmentSlot.Mainhand, hand);
      } else {
        eq.setEquipment(EquipmentSlot.Mainhand, undefined);
      }

      let mark = 0;
      try {
        mark = sourceRef.getComponent("minecraft:mark_variant")?.value ?? 0;
      } catch (_) {}

      if (sourceRef.isValid) {
        sourceRef.remove();
      }

      const miner = dim.spawnEntity(MINER_ID, pos);
      if (!miner?.isValid) return;

      miner.addTag(ownerTag(player.id));
      miner.nameTag = "Minerador de Tunel";
      applyMarkVariant(miner, mark);

      miner.setProperty("va:stay_mode", false);
      miner.setDynamicProperty(DP.dirX, dir.x);
      miner.setDynamicProperty(DP.dirZ, dir.z);
      miner.setDynamicProperty(DP.hireX, hire.x);
      miner.setDynamicProperty(DP.hireY, hire.y);
      miner.setDynamicProperty(DP.hireZ, hire.z);
      miner.setDynamicProperty(DP.axisX, hire.x);
      miner.setDynamicProperty(DP.axisY, hire.y);
      miner.setDynamicProperty(DP.axisZ, hire.z);
      setState(miner, "waiting");

      const yaw =
        dir.z === 1 ? 0 : dir.x === -1 ? 90 : dir.z === -1 ? 180 : -90;
      try {
        miner.setRotation({ x: 0, y: yaw });
      } catch (_) {}

      player.sendMessage(
        "Contrato aceito: Minerador de Tunel contratado. Entregue uma picareta para iniciar."
      );
    } catch (e) {
      console.warn(`[va] hire failed: ${e}`);
    }
  });
});
