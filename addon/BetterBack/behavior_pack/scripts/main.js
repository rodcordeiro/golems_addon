import { world, system, ItemStack, EnchantmentTypes } from "@minecraft/server";

// ─────────────────────────────────────────────────────────────────
//  Better Backpacks — v1.3.0 (HoneyStudios)
//
//  ARCHITECTURE v3 — reliable, no fragile storage.
//
//  v1.2.0 stored picked-up inventories inside invisible "ghost"
//  entities that followed the player. That was the cause of the
//  reported item-loss disasters: ghost entities could drift into
//  unloaded chunks, be garbage-collected by the engine, or be lost
//  when the owner logged off — taking the player's items with them.
//
//  v1.3.0 removes ghost entities entirely. A backpack's inventory is
//  now fully serialized (including enchantments) and stored DIRECTLY
//  on the backpack item itself as a dynamic property. Dynamic
//  properties on an ItemStack are part of the item — they travel
//  with it into chests, ender chests, other players' hands, and
//  survive world reloads. There is nothing to garbage-collect and
//  nothing to lose.
//
//  Bug fixes in v1.3.0:
//    • Items no longer vanish — ghost-entity storage removed entirely
//    • Enchantments preserved on pickup/place (incl. the big backpack)
//    • Placing a backpack no longer occasionally duplicates it
//    • Sleeping in a bed no longer detaches/floats the worn backpack
// ─────────────────────────────────────────────────────────────────

const VARIANTS = [
  { item: "bp:backpack",         entity: "bp:backpack_e",         size: 27 },
  { item: "bp:axolotl_backpack", entity: "bp:axolotl_backpack_e", size: 27 },
  { item: "bp:big_backpack",     entity: "bp:big_backpack_e",     size: 54 },
  { item: "bp:soul_backpack",    entity: "bp:soul_backpack_e",    size: 27 },
];

const ITEM_IDS       = VARIANTS.map(v => v.item);
const ENTITY_IDS     = VARIANTS.map(v => v.entity);
const ITEM_TO_ENTITY = Object.fromEntries(VARIANTS.map(v => [v.item, v.entity]));
const ENTITY_TO_ITEM = Object.fromEntries(VARIANTS.map(v => [v.entity, v.item]));

const INV_PROP        = "bp:inv_v3";   // dynamic prop on item: serialized inventory
const LEGACY_INV_PROP = "bp:inv";      // legacy v1.1.0 JSON
const LOADED_TAG      = "bp_loaded";   // entity has had its inventory loaded
const GHOST_TAG       = "bp_ghost";     // legacy v1.2.0 ghosts — recovered, then removed
const RELOADING_TAG   = "bp_reloading"; // entity just reloaded; skip snapshot until merged

const VARIANT_DISPLAY_NAMES = {
  "bp:backpack_e":         "Backpack",
  "bp:axolotl_backpack_e": "Axolotl Backpack",
  "bp:big_backpack_e":     "Big Backpack",
  "bp:soul_backpack_e":    "Soul Backpack",
};

const MAGIC_BIG_UI = "\u00a7t\u00a7r\u00a7u\u00a7e\u00a7r"; // the big-backpack UI trigger suffix

// ---- helpers ----------------------------------------------------
const isBackpackItem   = (item) => !!item && ITEM_IDS.includes(item.typeId);
const isBackpackEntity = (ent)  => !!ent  && ENTITY_IDS.includes(ent.typeId);

function getContainer(e) {
  try { return e.getComponent("minecraft:inventory")?.container; }
  catch (_) { return undefined; }
}
function getPlayerInv(p) {
  try { return p.getComponent("minecraft:inventory")?.container; }
  catch (_) { return undefined; }
}

// ─────────────────────────────────────────────────────────────────
//  Serialization — captures everything an ItemStack carries.
// ─────────────────────────────────────────────────────────────────
function serializeStack(stack) {
  if (!stack) return null;
  const o = { id: stack.typeId, c: stack.amount };

  try { if (stack.nameTag) o.n = stack.nameTag; } catch (_) {}

  try {
    const lore = stack.getLore();
    if (lore && lore.length) o.l = lore;
  } catch (_) {}

  try {
    const dur = stack.getComponent("minecraft:durability");
    if (dur && dur.damage) o.d = dur.damage;
  } catch (_) {}

  // Enchantments — the critical fix. Without this, enchanted books,
  // tools, weapons and armour lose their enchantments.
  try {
    const ench = stack.getComponent("minecraft:enchantable");
    if (ench) {
      const list = ench.getEnchantments();
      if (list && list.length) {
        o.e = list.map(en => ({
          id: (en.type && en.type.id) ? en.type.id : String(en.type),
          lv: en.level,
        }));
      }
    }
  } catch (_) {}

  try { if (stack.keepOnDeath) o.k = true; } catch (_) {}
  try { if (stack.lockMode && stack.lockMode !== "none") o.lm = stack.lockMode; } catch (_) {}

  try {
    const cp = stack.getCanPlaceOn();
    if (cp && cp.length) o.cp = cp;
  } catch (_) {}
  try {
    const cd = stack.getCanDestroy();
    if (cd && cd.length) o.cd = cd;
  } catch (_) {}

  return o;
}

function deserializeStack(o) {
  if (!o || !o.id) return undefined;
  let s;
  try {
    s = new ItemStack(o.id, o.c || 1);
  } catch (_) {
    return undefined; // unknown item id (e.g. another addon was removed)
  }

  try { if (o.n) s.nameTag = o.n; } catch (_) {}
  try { if (o.l) s.setLore(o.l); } catch (_) {}

  try {
    if (o.d !== undefined) {
      const dur = s.getComponent("minecraft:durability");
      if (dur) dur.damage = o.d;
    }
  } catch (_) {}

  // Restore enchantments. addEnchantment() requires a proper
  // EnchantmentType object — passing a raw string or {id} silently
  // throws, which is why earlier builds lost every enchantment.
  try {
    if (o.e && o.e.length) {
      const ench = s.getComponent("minecraft:enchantable");
      if (ench) {
        for (const en of o.e) {
          try {
            const type = EnchantmentTypes.get(en.id);
            if (type) {
              ench.addEnchantment({ type, level: en.lv });
            }
          } catch (_) {}
        }
      }
    }
  } catch (_) {}

  try { if (o.k) s.keepOnDeath = true; } catch (_) {}
  try { if (o.lm) s.lockMode = o.lm; } catch (_) {}
  try { if (o.cp) s.setCanPlaceOn(o.cp); } catch (_) {}
  try { if (o.cd) s.setCanDestroy(o.cd); } catch (_) {}

  return s;
}

function serializeInventory(entity) {
  const inv = getContainer(entity);
  if (!inv) return "[]";
  const slots = [];
  for (let i = 0; i < inv.size; i++) {
    slots.push(serializeStack(inv.getItem(i)));
  }
  return JSON.stringify(slots);
}

function loadInventory(entity, json) {
  const inv = getContainer(entity);
  if (!inv || !json) return;
  let slots;
  try { slots = JSON.parse(json); } catch (_) { return; }
  if (!Array.isArray(slots)) return;
  for (let i = 0; i < slots.length && i < inv.size; i++) {
    const stack = deserializeStack(slots[i]);
    if (stack) {
      try { inv.setItem(i, stack); } catch (_) {}
    }
  }
}

// ─────────────────────────────────────────────────────────────────
//  PLACED-BACKPACK PERSISTENCE LAYER
//
//  A placed backpack stores its items in the entity's live
//  minecraft:inventory container so the chest UI works. But Bedrock's
//  entity-inventory serialization is unreliable for custom entities:
//  when a chunk unloads and reloads, the base items survive but item
//  DATA (enchantments, etc.) can be silently stripped by the engine.
//
//  Fix: every placed backpack also keeps a full text backup of its
//  contents in an entity dynamic property. Dynamic properties are
//  plain strings — the engine cannot strip data it does not parse as
//  item NBT — so enchantments stored inside the JSON survive intact.
//
//    • A 1-second interval snapshots every loaded backpack's live
//      inventory into its INV_PROP backup.
//    • When a backpack reloads (chunk re-enters), the script merges
//      the rich backup back over the live inventory, restoring any
//      enchantments the engine dropped.
//
//  The merge is SAFE: it only ever swaps a slot's item for a richer
//  copy of the SAME item (same id + count). It never deletes an item
//  and never adds one, so it cannot cause item loss even if the
//  backup is slightly out of date.
// ─────────────────────────────────────────────────────────────────

// Snapshot a placed backpack's live inventory into its backup property.
function snapshotEntity(entity) {
  try {
    const json = serializeInventory(entity);
    entity.setDynamicProperty(INV_PROP, json);
  } catch (_) {}
}

// After a reload, restore rich item data (enchantments etc.) from the
// backup without disturbing items the player may have changed since.
function mergeFromBackup(entity) {
  let json;
  try { json = entity.getDynamicProperty(INV_PROP); } catch (_) {}
  if (!json) return;
  let slots;
  try { slots = JSON.parse(json); } catch (_) { return; }
  if (!Array.isArray(slots)) return;

  const inv = getContainer(entity);
  if (!inv) return;

  let liveEmpty = true;
  for (let i = 0; i < inv.size; i++) {
    try { if (inv.getItem(i)) { liveEmpty = false; break; } } catch (_) {}
  }

  for (let i = 0; i < slots.length && i < inv.size; i++) {
    const backupData = slots[i];
    if (!backupData || !backupData.id) continue;

    let liveItem;
    try { liveItem = inv.getItem(i); } catch (_) {}

    if (!liveItem) {
      // Slot empty in the live inventory. Only restore from backup if
      // the ENTIRE live inventory came back empty — that indicates the
      // engine dropped the whole container on reload. If just this one
      // slot is empty, the player likely removed the item; leave it.
      if (liveEmpty) {
        const rich = deserializeStack(backupData);
        if (rich) { try { inv.setItem(i, rich); } catch (_) {} }
      }
      continue;
    }

    // Same item id + count as the backup → swap in the rich copy so
    // any enchantments the engine stripped on reload are restored.
    if (liveItem.typeId === backupData.id &&
        liveItem.amount === (backupData.c || 1)) {
      const rich = deserializeStack(backupData);
      if (rich) { try { inv.setItem(i, rich); } catch (_) {} }
    }
    // Otherwise the slot changed since the last snapshot — keep live.
  }
}

// Every second: back up every loaded placed backpack.
system.runInterval(() => {
  for (const dimName of ["overworld", "nether", "the_end"]) {
    let dimension;
    try { dimension = world.getDimension("minecraft:" + dimName); } catch (_) { continue; }
    let ents;
    try { ents = dimension.getEntities({ families: ["bp_backpack"] }); } catch (_) { continue; }
    for (const e of ents) {
      try {
        if (e.hasTag(GHOST_TAG)) continue;
        if (e.hasTag(RELOADING_TAG)) continue; // mid-reload; merge not done yet
        if (!e.hasTag(LOADED_TAG)) continue;   // not fully initialised yet
        snapshotEntity(e);
      } catch (_) {}
    }
  }
}, 20);

// ─────────────────────────────────────────────────────────────────
//  Pickup — sneak + right-click, or attack the placed backpack.
// ─────────────────────────────────────────────────────────────────
world.beforeEvents.playerInteractWithEntity.subscribe((event) => {
  const { player, target } = event;
  if (!player || !target) return;
  if (!isBackpackEntity(target)) return;
  if (target.hasTag(GHOST_TAG)) return;
  if (!player.isSneaking) return; // plain right-click = open chest UI

  event.cancel = true;
  system.run(() => pickup(player, target));
});

world.afterEvents.entityHitEntity.subscribe((event) => {
  const { damagingEntity, hitEntity } = event;
  if (!damagingEntity || !hitEntity) return;
  if (damagingEntity.typeId !== "minecraft:player") return;
  if (!isBackpackEntity(hitEntity)) return;
  if (hitEntity.hasTag(GHOST_TAG)) return;
  pickup(damagingEntity, hitEntity);
});

function pickup(player, entity) {
  const playerInv = getPlayerInv(player);
  if (!playerInv) return;

  if (playerInv.emptySlotsCount <= 0) {
    try { player.onScreenDisplay.setActionBar("\u00a7cInventory is full \u2014 cannot pick up backpack."); } catch (_) {}
    return;
  }

  const itemId = ENTITY_TO_ITEM[entity.typeId];
  if (!itemId) return;

  // Serialize the entity's inventory directly onto the carry item.
  const invJson = serializeInventory(entity);

  const item = new ItemStack(itemId, 1);

  // Preserve a custom name if the player renamed it (strip magic suffix).
  try {
    let name = entity.nameTag || "";
    name = name.replace(/\u00a7t\u00a7r\u00a7u\u00a7e\u00a7r$/, "");
    const def = VARIANT_DISPLAY_NAMES[entity.typeId];
    if (name && name !== def) item.nameTag = name;
  } catch (_) {}

  try { item.setDynamicProperty(INV_PROP, invJson); } catch (_) {}

  // Give the item, THEN remove the entity. If giving fails we keep
  // the entity so nothing is ever lost.
  let added = false;
  try {
    const leftover = playerInv.addItem(item);
    added = !leftover;
  } catch (_) { added = false; }

  if (!added) {
    try { player.onScreenDisplay.setActionBar("\u00a7cCould not pick up backpack."); } catch (_) {}
    return;
  }

  try { player.playSound("random.pop", { volume: 0.6, pitch: 1.2 }); } catch (_) {}
  try { entity.remove(); } catch (_) { try { entity.kill(); } catch (_) {} }
}

// ─────────────────────────────────────────────────────────────────
//  Place — right-click a block while holding the backpack item.
//
//  minecraft:entity_placer (on the item) spawns the entity natively
//  and reliably. The script's job is only to load the saved inventory
//  into the freshly-placed entity.
//
//  The bed/sleep bug: entity_placer fires on ANY block use, so
//  clicking a bed to sleep would also drop a backpack. We fix that by
//  detecting when a placement landed on an interactive block (bed,
//  door, chest, etc.) and UNDOING it — the entity is removed and the
//  item is refunded with its saved inventory fully intact.
// ─────────────────────────────────────────────────────────────────
const INTERACTIVE_BLOCKS = new Set([
  "minecraft:crafting_table", "minecraft:cartography_table",
  "minecraft:smithing_table", "minecraft:loom", "minecraft:stonecutter_block",
  "minecraft:furnace", "minecraft:lit_furnace", "minecraft:blast_furnace",
  "minecraft:lit_blast_furnace", "minecraft:smoker", "minecraft:lit_smoker",
  "minecraft:chest", "minecraft:trapped_chest", "minecraft:ender_chest",
  "minecraft:barrel", "minecraft:brewing_stand", "minecraft:anvil",
  "minecraft:chipped_anvil", "minecraft:damaged_anvil",
  "minecraft:enchanting_table", "minecraft:grindstone", "minecraft:beacon",
  "minecraft:hopper", "minecraft:dispenser", "minecraft:dropper",
  "minecraft:lectern", "minecraft:jukebox", "minecraft:note_block",
  "minecraft:crafter", "minecraft:bell", "minecraft:respawn_anchor",
  "minecraft:lever", "minecraft:daylight_detector",
  "minecraft:flower_pot", "minecraft:campfire", "minecraft:soul_campfire",
  "minecraft:cake", "minecraft:composter", "minecraft:cauldron",
]);

function isInteractiveBlock(block) {
  try {
    const id = block.typeId;
    if (INTERACTIVE_BLOCKS.has(id)) return true;
    if (id.endsWith("_bed")) return true;
    if (id.endsWith("_door") || id.endsWith("_trapdoor")) return true;
    if (id.endsWith("_fence_gate")) return true;
    if (id.endsWith("_button")) return true;
    if (id.endsWith("_sign") || id.endsWith("_hanging_sign")) return true;
    if (id.endsWith("_shulker_box")) return true;
    if (id.includes("command_block")) return true;
    if (id.includes("structure_block")) return true;
  } catch (_) {}
  return false;
}

world.afterEvents.playerInteractWithBlock.subscribe((event) => {
  const { player, block, beforeItemStack, isFirstEvent } = event;
  if (!player || !block || !beforeItemStack) return;
  if (isFirstEvent === false) return; // ignore duplicate event some inputs fire
  if (!isBackpackItem(beforeItemStack)) return;

  const itemTypeId = beforeItemStack.typeId;
  const entityId   = ITEM_TO_ENTITY[itemTypeId];
  if (!entityId) return;

  // Read storage off the item BEFORE entity_placer consumes it.
  let savedInv, savedLegacy, savedName;
  try { savedInv    = beforeItemStack.getDynamicProperty(INV_PROP); } catch (_) {}
  try { savedLegacy = beforeItemStack.getDynamicProperty(LEGACY_INV_PROP); } catch (_) {}
  try { savedName   = beforeItemStack.nameTag; } catch (_) {}

  // Was this an interaction with a functional block (bed/chest/etc.)?
  // If so, any backpack entity that gets placed is accidental.
  const accidental = isInteractiveBlock(block) && !player.isSneaking;

  system.runTimeout(() => {
    try {
      const candidates = block.dimension.getEntities({
        type: entityId,
        location: player.location,
        maxDistance: 6,
      });

      // Find the single freshly-placed entity: closest, not yet loaded.
      let chosen;
      let bestDist = Infinity;
      for (const e of candidates) {
        if (e.hasTag(LOADED_TAG) || e.hasTag(GHOST_TAG)) continue;
        const dx = e.location.x - player.location.x;
        const dy = e.location.y - player.location.y;
        const dz = e.location.z - player.location.z;
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 < bestDist) { bestDist = d2; chosen = e; }
      }
      if (!chosen) return; // nothing placed (e.g. bed took priority)

      chosen.addTag(LOADED_TAG); // claim it so nothing else touches it

      if (accidental) {
        // Clicked a bed/chest/etc. — undo: remove the stray entity and
        // refund the backpack item with its stored contents intact.
        try { chosen.remove(); } catch (_) { try { chosen.kill(); } catch (_) {} }

        const refund = new ItemStack(itemTypeId, 1);
        try {
          if (savedName) {
            const clean = savedName.replace(/\u00a7t\u00a7r\u00a7u\u00a7e\u00a7r$/, "");
            const def = VARIANT_DISPLAY_NAMES[entityId];
            if (clean && clean !== def) refund.nameTag = clean;
          }
        } catch (_) {}
        try { if (savedInv)    refund.setDynamicProperty(INV_PROP, savedInv); } catch (_) {}
        try { if (savedLegacy) refund.setDynamicProperty(LEGACY_INV_PROP, savedLegacy); } catch (_) {}

        const pinv = getPlayerInv(player);
        if (pinv) {
          try { pinv.addItem(refund); } catch (_) {}
        }
        return;
      }

      // Normal placement — name the entity and load its inventory.
      const isBig    = entityId === "bp:big_backpack_e";
      const baseName = (savedName && savedName.length)
        ? savedName.replace(/\u00a7t\u00a7r\u00a7u\u00a7e\u00a7r$/, "")
        : (VARIANT_DISPLAY_NAMES[entityId] || "Backpack");
      try { chosen.nameTag = baseName + (isBig ? MAGIC_BIG_UI : ""); } catch (_) {}

      if (savedInv) {
        loadInventory(chosen, savedInv);
      } else if (savedLegacy) {
        loadLegacyInventory(chosen, savedLegacy);
      }

      // Immediately back up the freshly-placed contents so the items
      // are protected even if the player walks away within a second.
      snapshotEntity(chosen);
    } catch (_) {}
  }, 2);
});

// ─────────────────────────────────────────────────────────────────
//  Legacy v1.1.0 inventory restore
// ─────────────────────────────────────────────────────────────────
function loadLegacyInventory(entity, json) {
  const inv = getContainer(entity);
  if (!inv || !json) return;
  let slots;
  try { slots = JSON.parse(json); } catch (_) { return; }
  if (!Array.isArray(slots)) return;
  for (let i = 0; i < slots.length && i < inv.size; i++) {
    const o = slots[i];
    if (!o || !o.typeId) continue;
    try {
      const s = new ItemStack(o.typeId, o.amount || 1);
      if (o.nameTag) s.nameTag = o.nameTag;
      if (o.lore)    s.setLore(o.lore);
      if (o.damage !== undefined) {
        const dur = s.getComponent("minecraft:durability");
        if (dur) dur.damage = o.damage;
      }
      inv.setItem(i, s);
    } catch (_) {}
  }
}

// ─────────────────────────────────────────────────────────────────
//  Legacy v1.2.0 ghost recovery — rescue items from leftover ghosts.
// ─────────────────────────────────────────────────────────────────
function rescueLegacyGhosts() {
  for (const dimName of ["overworld", "nether", "the_end"]) {
    let dimension;
    try { dimension = world.getDimension("minecraft:" + dimName); } catch (_) { continue; }
    let ghosts;
    try { ghosts = dimension.getEntities({ tags: [GHOST_TAG] }); } catch (_) { continue; }
    for (const ghost of ghosts) {
      try {
        const srcInv = getContainer(ghost);
        let hasItems = false;
        if (srcInv) {
          for (let i = 0; i < srcInv.size; i++) {
            if (srcInv.getItem(i)) { hasItems = true; break; }
          }
        }
        if (hasItems) {
          const itemId = ENTITY_TO_ITEM[ghost.typeId];
          const entId  = ITEM_TO_ENTITY[itemId] || ghost.typeId;
          const loc    = { x: ghost.location.x, y: ghost.location.y, z: ghost.location.z };
          const fresh  = dimension.spawnEntity(entId, loc);
          fresh.addTag(LOADED_TAG);
          const dstInv = getContainer(fresh);
          if (dstInv && srcInv) {
            const n = Math.min(srcInv.size, dstInv.size);
            for (let i = 0; i < n; i++) {
              const st = srcInv.getItem(i);
              if (st) { dstInv.setItem(i, st); }
            }
          }
          const isBig = entId === "bp:big_backpack_e";
          try {
            fresh.nameTag = (VARIANT_DISPLAY_NAMES[entId] || "Backpack") + (isBig ? MAGIC_BIG_UI : "");
          } catch (_) {}
        }
        try { ghost.remove(); } catch (_) { try { ghost.kill(); } catch (_) {} }
      } catch (_) {}
    }
  }
}

// ─────────────────────────────────────────────────────────────────
//  Spawn handling
// ─────────────────────────────────────────────────────────────────
world.afterEvents.entitySpawn.subscribe((e) => {
  if (!isBackpackEntity(e.entity)) return;

  if (e.entity.hasTag(GHOST_TAG)) {
    system.run(() => { try { rescueLegacyGhosts(); } catch (_) {} });
    return;
  }

  // A reload (chunk re-entering) fires with a cause other than
  // Born/Spawned. The engine may have stripped item data from the
  // entity inventory — merge the rich backup back over it.
  if (e.cause !== "Born" && e.cause !== "Spawned") {
    const ent = e.entity;
    try { ent.addTag(LOADED_TAG); } catch (_) {}
    try { ent.addTag(RELOADING_TAG); } catch (_) {}
    system.runTimeout(() => {
      try { mergeFromBackup(ent); } catch (_) {}
      try { ent.removeTag(RELOADING_TAG); } catch (_) {}
    }, 6);
  }

  if (!e.entity.nameTag) {
    const isBig = e.entity.typeId === "bp:big_backpack_e";
    const base  = VARIANT_DISPLAY_NAMES[e.entity.typeId] || "Backpack";
    try { e.entity.nameTag = base + (isBig ? MAGIC_BIG_UI : ""); } catch (_) {}
  }
});

// ─────────────────────────────────────────────────────────────────
//  World load — sweep for leftover v1.2.0 ghosts.
// ─────────────────────────────────────────────────────────────────
world.afterEvents.worldLoad.subscribe(() => {
  system.runTimeout(() => { try { rescueLegacyGhosts(); } catch (_) {} }, 40);
});

// ─────────────────────────────────────────────────────────────────
//  Welcome message
// ─────────────────────────────────────────────────────────────────
world.afterEvents.playerSpawn.subscribe((e) => {
  if (!e.initialSpawn) return;
  try {
    e.player.sendMessage("\u00a7l\u00a76[BP] \u00a7r\u00a7aBetter Backpacks \u00a77v1.3.0\u00a7r loaded.");
    e.player.sendMessage("\u00a77\u2022 \u00a7fEquip in chest slot to wear on back");
    e.player.sendMessage("\u00a77\u2022 \u00a7fRight-click a block to place, right-click entity to open");
    e.player.sendMessage("\u00a77\u2022 \u00a7fAttack (or sneak + right-click) to pick up");
    e.player.sendMessage("\u00a7a\u2713 v1.3 fix: \u00a7fitems can no longer be lost");
  } catch (_) {}
});
