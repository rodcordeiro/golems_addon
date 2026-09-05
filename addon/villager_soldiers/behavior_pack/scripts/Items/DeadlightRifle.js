// File: DeadlightRifle.js
// Script API: "@minecraft/server" v2.4.0
import {
    world,
    system,
    ItemStack,
    GameMode,
    ItemComponentTypes,
    EntityComponentTypes
} from "@minecraft/server";

const TYPE_REAPER_BOW = "deadlight_rifle:bow";
const TYPE_REAPER_EMPTY = "fv:deadlight_rifle_empty";
const TYPE_BULLET_ITEM = "fv:cartridge";
const TYPE_BULLET_ENTITY = "fv:entity_cartridge";

const COOLDOWN_CAT = "deadlight_rifle_empty";
const KEY_NO_BULLET = "actionbar.fv.no_cartridge";
const PROP_GUN_FIRED = "gun_fired";
const PROP_SAVED_DAMAGE = "gun_saved_damage";
const PROP_AMMO = "ammo";
const SPAWN_OFFSET = 1;
const MIN_DMG = 10;
const MAX_DMG = 20;
const MAX_AMMO = 12;

// Map lưu trạng thái reload đang chạy: key = player.name, value = { slotIndex, removed, saved }
// removed = số đạn đã trừ (để trả lại nếu huỷ)
const reloadStates = new Map();

// Khởi watcher 1 lần: check mỗi tick xem player đổi slot khi đang reload không
let reloadWatcherStarted = false;
if (!reloadWatcherStarted) {
    reloadWatcherStarted = true;
    system.runInterval(() => {
        for (const [playerName, state] of reloadStates.entries()) {
            try {
                const player = world.getAllPlayers().find(p => p.name === playerName);
                if (!player) { // player rời game
                    reloadStates.delete(playerName);
                    continue;
                }
                const invCont = player.getComponent("inventory")?.container;
                if (!invCont) {
                    reloadStates.delete(playerName);
                    continue;
                }
                // Nếu player đã chuyển slot => huỷ reload: trả đạn + clear cooldown
                if (player.selectedSlotIndex !== state.slotIndex) {
                    // trả lại bullets đã trừ
                    try {
                        const giveStack = new ItemStack(TYPE_BULLET_ITEM, state.removed);
                        const leftover = invCont.addItem(giveStack);
                        if (leftover) {
                            // nếu còn dư không vào inventory được -> thả xuống đất
                            try { player.dimension.spawnItem(leftover, player.getHeadLocation()); } catch { }
                        }
                    } catch { /* ignore add failures */ }

                    // hủy cooldown category (bằng cách set duration = 0)
                    try { player.startItemCooldown(COOLDOWN_CAT, 0); } catch { }

                    // xóa state reload
                    reloadStates.delete(playerName);
                }
            } catch (e) {
                // an toàn: nếu có lỗi, xóa state để tránh treo
                reloadStates.delete(playerName);
            }
        }
    }, 1); // check mỗi tick
}

// Helper: cập nhật lore ammo
function updateAmmoLore(item) {
    try {
        const ammo = item.getDynamicProperty(PROP_AMMO) ?? MAX_AMMO;
        item.setLore([`Ammo: ${ammo}/${MAX_AMMO}`]);
    } catch { }
}

// 1. Set ammo when cầm súng lần đầu
world.afterEvents.itemUse.subscribe(ev => {
    const player = ev.source;
    const stack = ev.itemStack;
    if (!stack || stack.typeId !== TYPE_REAPER_BOW) return;
    if (stack.getDynamicProperty(PROP_AMMO) === undefined) {
        stack.setDynamicProperty(PROP_AMMO, MAX_AMMO);
        updateAmmoLore(stack);
        const slot = player.getComponent("inventory").container.getSlot(player.selectedSlotIndex);
        if (slot) slot.setItem(stack);
    }
});

// 2. Xử lý bắn (FIX LỖI OWNER)
world.afterEvents.itemReleaseUse.subscribe(ev => {
    const player = ev.source;
    const inv = player.getComponent("inventory")?.container;
    const slot = inv?.getSlot(player.selectedSlotIndex);
    const bow = slot?.getItem();
    if (!bow || bow.typeId !== TYPE_REAPER_BOW) return;

    const ammo = bow.getDynamicProperty(PROP_AMMO) ?? MAX_AMMO;
    if (ammo <= 0) return;

    const durComp = bow.getComponent(ItemComponentTypes.Durability);
    if (!durComp) return;

    const dmg = Math.floor(Math.random() * (MAX_DMG - MIN_DMG + 1)) + MIN_DMG;
    durComp.damage += dmg;
    bow.setDynamicProperty(PROP_SAVED_DAMAGE, durComp.damage);

    const newAmmo = ammo - 1;
    bow.setDynamicProperty(PROP_AMMO, newAmmo);
    updateAmmoLore(bow);

    if (newAmmo === 0) bow.setDynamicProperty(PROP_GUN_FIRED, true);
    slot.setItem(bow);
    if (durComp.damage >= durComp.maxDurability) {
        slot.setItem(undefined);
        return;
    }

    const head = player.getHeadLocation();
    const dir = player.getViewDirection();
    const spawn = {
        x: head.x + dir.x * SPAWN_OFFSET,
        y: head.y + dir.y * SPAWN_OFFSET,
        z: head.z + dir.z * SPAWN_OFFSET
    };

    const bullet = player.dimension.spawnEntity(TYPE_BULLET_ENTITY, spawn);
    if (bullet) {
        // ÁP DỤNG FIX OWNER: Thiết lập người chơi là chủ sở hữu đạn
        const projComp = bullet.getComponent(EntityComponentTypes.Projectile);
        if (projComp) {
            try { projComp.owner = player; } catch (e) { /* ignore */ }
        }

        projComp?.shoot(dir, { uncertainty: 0 });
        try { bullet.applyImpulse({ x: dir.x * 100, y: dir.y * 100, z: dir.z * 100 }); } catch { }
        bullet.triggerEvent("fv:deadlight_rifle");
    }
    player.dimension.playSound("rifle.shoot", head, { volume: 6 });
});

// 3. Reload (Giữ nguyên logic multi-ammo đã tối ưu)
world.afterEvents.itemUse.subscribe(async ev => {
    const player = ev.source;
    const stack = ev.itemStack;
    const invCont = player.getComponent("inventory")?.container;
    const slot = invCont?.getSlot(player.selectedSlotIndex);

    if (stack?.typeId === TYPE_REAPER_BOW && stack.getDynamicProperty(PROP_GUN_FIRED)) {
        const saved = stack.getDynamicProperty(PROP_SAVED_DAMAGE) ?? 0;
        const empty = new ItemStack(TYPE_REAPER_EMPTY);
        const de = empty.getComponent(ItemComponentTypes.Durability);
        if (de) de.damage = saved;
        slot?.setItem(empty);
        return;
    }
    if (!stack || stack.typeId !== TYPE_REAPER_EMPTY) return;

    const mode = player.getGameMode();
    const isCreative = mode === GameMode.Creative;
    let removedCount = 0; // số đạn thực tế đã trừ (dùng để trả nếu huỷ)
    const sel = player.selectedSlotIndex;

    if (!isCreative) {
        // Đếm tổng bullet
        let total = 0;
        for (let i = 0; i < invCont.size; i++) {
            if (i === sel) continue;
            const it = invCont.getSlot(i)?.getItem();
            if (it && it.typeId === TYPE_BULLET_ITEM) total += (it.amount ?? 1);
        }
        if (total < MAX_AMMO) {
            player.onScreenDisplay.setActionBar({ translate: KEY_NO_BULLET });
            return;
        }
        // Xóa đúng số lượng đạn, đồng thời tính removedCount
        let toRemove = MAX_AMMO;
        removedCount = 0;
        for (let i = 0; i < invCont.size; i++) {
            if (i === sel) continue;
            const slotI = invCont.getSlot(i);
            const it = slotI?.getItem();
            if (it && it.typeId === TYPE_BULLET_ITEM) {
                const take = Math.min(it.amount ?? 1, toRemove);
                const newAmt = (it.amount ?? 1) - take;
                if (newAmt > 0) {
                    it.amount = newAmt;
                    slotI.setItem(it);
                } else {
                    slotI.setItem(undefined);
                }
                toRemove -= take;
                removedCount += take;
                if (toRemove <= 0) break;
            }
        }
    }

    // Lưu trạng thái reload (chỉ khi có đạn đã trừ hoặc muốn monitor)
    if (!isCreative && removedCount > 0) {
        // lưu slot ban đầu + số đạn đã trừ
        reloadStates.set(player.name, { slotIndex: sel, removed: removedCount });
    }

    player.playAnimation("animation.nguoimau.deadlight_reloading", {
        blendOutTime: 0.3,
        stopExpression: "!query.equipped_item_any_tag('slot.weapon.mainhand', 'fv:deadlight_rifle_empty')"
    });
    const ticks = stack.getComponent(ItemComponentTypes.Cooldown)?.cooldownTicks ?? 20;
    // start cooldown như trước (nếu bị huỷ ta sẽ gọi startItemCooldown(..., 0) để reset)
    player.startItemCooldown(COOLDOWN_CAT, ticks);

    // Lưu damage trước khi đợi (dùng khi hoàn tất nạp)
    const savedDamage = stack.getComponent(ItemComponentTypes.Durability)?.damage ?? 0;

    // đợi cooldown hoàn tất
    await system.waitTicks(ticks);

    // Nếu state bị xoá (nghĩa là reload đã bị huỷ trong lúc đợi) thì dừng ở đây
    if (reloadStates.has(player.name) === false && !isCreative && removedCount > 0) {
        // reload đã bị huỷ -> không tiếp tục nạp
        return;
    }

    // Nếu đến đây thì reload hoàn tất bình thường -> đặt lại bow + ammo
    const finalSlot = player.getComponent("inventory")?.container.getSlot(player.selectedSlotIndex);
    if (!finalSlot) {
        // dọn state (nếu có)
        reloadStates.delete(player.name);
        return;
    }

    const bow = new ItemStack(TYPE_REAPER_BOW);
    const db = bow.getComponent(ItemComponentTypes.Durability);
    if (db) db.damage = savedDamage;
    bow.setDynamicProperty(PROP_AMMO, MAX_AMMO);
    updateAmmoLore(bow);

    finalSlot.setItem(bow);
    bow.setDynamicProperty(PROP_GUN_FIRED, false); // Đã sửa: gán cho item, không phải player
    // xóa state reload cho chắc
    reloadStates.delete(player.name);
});