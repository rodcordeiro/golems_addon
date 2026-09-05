/**
 * MINER-017 — va:command_flag ModalForm (direction + stay).
 * Pattern: villager_soldiers soldierAction.js (system.run + ModalForm v2).
 */
import { world, system, EquipmentSlot } from "@minecraft/server";
import { ModalFormData } from "@minecraft/server-ui";
import {
  MINER_ID,
  COMMAND_FLAG_ID,
  DP,
  isOwner,
  blockPos,
  getState,
  setState,
  cargoHasSpace,
} from "./common.js";
import { hasPickaxe, ensureToolInSlot0 } from "./minerInteract.js";

export { COMMAND_FLAG_ID };

/** Dropdown order: North, East, South, West (yawToCardinal cardinals). */
const DIR_OPTIONS = ["North", "East", "South", "West"];
const DIR_VECS = [
  { x: 0, z: -1 }, // N
  { x: 1, z: 0 }, // E
  { x: 0, z: 1 }, // S
  { x: -1, z: 0 }, // W
];

/**
 * @param {number} dx
 * @param {number} dz
 */
function dirToIndex(dx, dz) {
  for (let i = 0; i < DIR_VECS.length; i++) {
    if (DIR_VECS[i].x === dx && DIR_VECS[i].z === dz) return i;
  }
  return 2; // South default
}

/**
 * @param {{x:number,z:number}} d
 */
function yawFromDir(d) {
  if (d.z === 1) return 0;
  if (d.x === -1) return 90;
  if (d.z === -1) return 180;
  return -90;
}

/**
 * Clear formigueiro / escada dynamic props (keep torch cadence).
 * @param {import('@minecraft/server').Entity} miner
 */
function clearBranchAndStair(miner) {
  miner.setDynamicProperty(DP.branchRem, 0);
  miner.setDynamicProperty(DP.branchDirX, 0);
  miner.setDynamicProperty(DP.branchDirZ, 0);
  miner.setDynamicProperty(DP.stairRem, 0);
  miner.setDynamicProperty(DP.stairSign, 0);
}

/**
 * @param {import('@minecraft/server').Player} player
 * @param {import('@minecraft/server').Entity} miner
 */
function showMinerCommandForm(player, miner) {
  if (!player?.isValid || !miner?.isValid) return;

  const dx = /** @type {number} */ (miner.getDynamicProperty(DP.dirX) ?? 0);
  const dz = /** @type {number} */ (miner.getDynamicProperty(DP.dirZ) ?? 1);
  const defaultDir = dirToIndex(dx, dz);

  let stayMode = false;
  try {
    const raw = miner.getProperty("va:stay_mode");
    stayMode = typeof raw === "boolean" ? raw : false;
  } catch (_) {}

  const prevState = getState(miner);

  const modalForm = new ModalFormData()
    .title("Minerador — comando")
    .dropdown("Direcao", DIR_OPTIONS, { defaultValueIndex: defaultDir })
    .toggle("Stay (pausado)", { defaultValue: stayMode });

  modalForm
    .show(player)
    .then((formData) => {
      if (formData.canceled || !formData.formValues) return;
      if (!player.isValid || !miner.isValid) return;

      const [dirIndex, staySelected] = formData.formValues;
      const idx =
        typeof dirIndex === "number" && dirIndex >= 0 && dirIndex < DIR_VECS.length
          ? dirIndex
          : defaultDir;
      const stay = !!staySelected;
      const dir = DIR_VECS[idx];

      try {
        miner.setDynamicProperty(DP.dirX, dir.x);
        miner.setDynamicProperty(DP.dirZ, dir.z);

        const pos = blockPos(miner.location);
        miner.setDynamicProperty(DP.axisX, pos.x);
        miner.setDynamicProperty(DP.axisY, pos.y);
        miner.setDynamicProperty(DP.axisZ, pos.z);

        clearBranchAndStair(miner);
        // va_torch_dist intentionally unchanged

        miner.setProperty("va:stay_mode", stay);

        try {
          miner.setRotation({ x: 0, y: yawFromDir(dir) });
        } catch (_) {}

        if (stay) {
          player.sendMessage("Minerador: direcao atualizada; pausado (stay).");
          return;
        }

        if (prevState === "stopped") {
          ensureToolInSlot0(miner);
          if (hasPickaxe(miner) && cargoHasSpace(miner)) {
            setState(miner, "mining");
            player.sendMessage("Minerador: direcao atualizada; retomando mineracao.");
            return;
          }
        }

        player.sendMessage(
          `Minerador: direcao ${DIR_OPTIONS[idx]} (eixo na posicao atual).`
        );
      } catch (e) {
        console.warn(`[va] command flag apply failed: ${e}`);
      }
    })
    .catch(() => {
      /* player closed / disconnect */
    });
}

world.afterEvents.playerInteractWithEntity.subscribe((event) => {
  const player = event.player;
  const target = event.target;
  if (!player?.isValid || !target?.isValid) return;
  if (target.typeId !== MINER_ID) return;

  try {
    const eq = player.getComponent("minecraft:equippable");
    const hand = eq?.getEquipment(EquipmentSlot.Mainhand);
    if (!hand || hand.typeId !== COMMAND_FLAG_ID) return;

    // Non-owner error comes from minerInteract (same interact).
    if (!isOwner(target, player)) return;

    system.run(() => {
      if (player.isValid && target.isValid) {
        showMinerCommandForm(player, target);
      }
    });
  } catch (_) {
    /* ignored */
  }
});
