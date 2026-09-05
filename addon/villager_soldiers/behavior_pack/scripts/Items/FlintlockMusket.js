// File: FlintlockMusket.js
import {
    world,
    system,
    ItemStack,
    GameMode,
    ItemComponentTypes,
    EntityComponentTypes,
} from "@minecraft/server";

const TYPE_BOW = "flintlock_musket:bow";
const TYPE_EMPTY = "fv:flintlock_musket_empty";
const TYPE_BULLET_ITEM = "fv:bullet";
const TYPE_BULLET_ENTITY = "fv:entity_bullet";

const COOLDOWN_CAT = "flintlock_musket_empty";
const KEY_NO_BULLET = "actionbar.fv.no_bullet";
const PROP_FIRED = "flintlock_fired";
const PROP_SAVED_DAMAGE = "flintlock_saved_damage";
const SPAWN_OFFSET = 1;
const MIN_DMG = 10;
const MAX_DMG = 20;

// Helper: tạo token an toàn
function makeReloadToken() {
    return `${Date.now()}_${Math.floor(Math.random() * 1e9)}`;
}

// FIX LỖI 1A: Xử lý trừ đạn an toàn (Tránh lỗi amount = 0)
function findAndRemoveOneBullet(player) {
    const inv = player.getComponent("inventory")?.container;
    const sel = player.selectedSlotIndex;
    if (!inv) return false;

    for (let i = 0; i < inv.size; i++) {
        if (i === sel) continue;

        const it = inv.getItem(i);
        if (it && it.typeId === TYPE_BULLET_ITEM) {
            // FIX: Không dùng it.amount-- trực tiếp để tránh giá trị 0
            if (it.amount > 1) {
                it.amount -= 1;
                inv.setItem(i, it);
            } else {
                inv.setItem(i, undefined); // Nếu chỉ có 1 viên, xóa hẳn slot
            }
            return true;
        }
    }
    return false;
}

// --- Tracking reload state ---
const reloadStates = new Map();

function restoreBullet(player) {
    const state = reloadStates.get(player.name);
    if (!state || state.removed !== 1) return;
    const inv = player.getComponent("inventory")?.container;
    if (!inv) return;
    try {
        const give = new ItemStack(TYPE_BULLET_ITEM, 1);
        const leftover = inv.addItem(give);
        if (leftover) {
            try { player.dimension.spawnItem(leftover, player.getHeadLocation()); } catch { }
        }
    } catch (e) { }
}

let watcherStarted = false;
if (!watcherStarted) {
    watcherStarted = true;
    system.runInterval(() => {
        for (const [playerName, state] of reloadStates.entries()) {
            try {
                const player = world.getAllPlayers().find(p => p.name === playerName);
                if (!player) {
                    reloadStates.delete(playerName);
                    continue;
                }
                if (player.selectedSlotIndex !== state.slotIndex) {
                    try {
                        const inv = player.getComponent("inventory")?.container;
                        if (inv) {
                            const originSlot = inv.getSlot(state.slotIndex);
                            const it = originSlot?.getItem();
                            if (it && it.typeId === TYPE_EMPTY) {
                                const t = it.getDynamicProperty('fv:reload_token');
                                if (t && t === state.token) {
                                    it.setDynamicProperty('fv:reload_token', undefined);
                                    originSlot.setItem(it);
                                }
                            }
                        }
                    } catch (e) { }
                    try { restoreBullet(player); } catch (e) { }
                    try { player.startItemCooldown(COOLDOWN_CAT, 0); } catch (e) { }
                    reloadStates.delete(playerName);
                }
            } catch (e) {
                reloadStates.delete(playerName);
            }
        }
    }, 1);
}

// Xử lý bắn súng
world.afterEvents.itemReleaseUse.subscribe(ev => {
    const player = ev.source;
    if (!player || typeof player.getComponent !== 'function') return;
    const inv = player.getComponent("inventory")?.container;
    const slot = inv?.getSlot(player.selectedSlotIndex);
    const bow = slot?.getItem();
    if (!bow || bow.typeId !== TYPE_BOW) return;

    if (bow.getDynamicProperty(PROP_FIRED)) return;

    const durComp = bow.getComponent(ItemComponentTypes.Durability);
    if (!durComp) return;

    const damage = Math.floor(Math.random() * (MAX_DMG - MIN_DMG + 1)) + MIN_DMG;
    durComp.damage += damage;

    bow.setDynamicProperty(PROP_FIRED, true);
    bow.setDynamicProperty(PROP_SAVED_DAMAGE, durComp.damage);
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
        const projComp = bullet.getComponent(EntityComponentTypes.Projectile);
        if (projComp) {
            try { projComp.owner = player; } catch (e) { }
        }
        projComp?.shoot(dir, { uncertainty: 0 });
        try { bullet.applyImpulse({ x: dir.x * 80, y: dir.y * 80, z: dir.z * 80 }); } catch { }
        bullet.triggerEvent("fv:flintlock");
    }
    player.dimension.playSound("musket.shoot", head, { volume: 6 });
});

// Reload xử lý OnUse
world.afterEvents.itemUse.subscribe(async ev => {
    const player = ev.source;
    if (!player || typeof player.getComponent !== 'function') return;
    const stack = ev.itemStack;
    const inv = player.getComponent("inventory")?.container;
    const slot = inv?.getSlot(player.selectedSlotIndex);

    // Chuyển Bow đã bắn sang trạng thái Empty
    if (stack?.typeId === TYPE_BOW && stack.getDynamicProperty(PROP_FIRED)) {
        const saved = stack.getDynamicProperty(PROP_SAVED_DAMAGE) ?? 0;
        const empty = new ItemStack(TYPE_EMPTY);
        const de = empty.getComponent(ItemComponentTypes.Durability);
        if (de) de.damage = saved;

        const token = makeReloadToken();
        try { empty.setDynamicProperty('fv:reload_token', token); } catch { }
        empty.setDynamicProperty(PROP_FIRED, false);
        slot?.setItem(empty);
        return;
    }

    // Chỉ xử lý logic nạp đạn cho Empty
    if (!stack || stack.typeId !== TYPE_EMPTY) return;

    // FIX LỖI 2: Kiểm tra nếu đang trong thời gian hồi chiêu (đang nạp) thì thoát ngay
    if (player.getItemCooldown(COOLDOWN_CAT) > 0) return;

    const mode = player.getGameMode();
    const isCreative = (mode === GameMode.Creative);
    let removed = 0;

    if (!isCreative) {
        // Trừ đạn an toàn
        const ok = findAndRemoveOneBullet(player);
        if (!ok) {
            player.onScreenDisplay.setActionBar({ translate: KEY_NO_BULLET });
            return;
        }
        removed = 1;
    }

    let reloadToken = null;
    try {
        reloadToken = stack.getDynamicProperty('fv:reload_token');
    } catch (e) { reloadToken = null; }

    if (!reloadToken) {
        reloadToken = makeReloadToken();
        try {
            stack.setDynamicProperty('fv:reload_token', reloadToken);
            slot?.setItem(stack);
        } catch (e) { }
    }

    if (!isCreative && removed > 0) {
        reloadStates.set(player.name, {
            slotIndex: player.selectedSlotIndex,
            removed: removed,
            token: reloadToken
        });
    }

    player.playAnimation("animation.nguoimau.reload_flintlock_musket", {
        blendOutTime: 0.3,
        stopExpression: "!query.equipped_item_any_tag('slot.weapon.mainhand', 'fv:flintlock_musket_empty')"
    });

    const ticks = stack.getComponent(ItemComponentTypes.Cooldown)?.cooldownTicks ?? 20;
    player.startItemCooldown(COOLDOWN_CAT, ticks);

    const saved = stack.getComponent(ItemComponentTypes.Durability)?.damage ?? 0;

    await system.waitTicks(ticks);

    const state = reloadStates.get(player.name);
    if (!isCreative && (!state || state.token !== reloadToken)) {
        reloadStates.delete(player.name);
        return;
    }

    const container = player.getComponent("inventory")?.container;
    if (!container) {
        reloadStates.delete(player.name);
        return;
    }

    let foundSlot = null;
    for (let i = 0; i < container.size; i++) {
        const s = container.getSlot(i);
        if (!s) continue;
        const it = s.getItem();
        if (!it) continue;
        if (it.typeId === TYPE_EMPTY) {
            try {
                const t = it.getDynamicProperty('fv:reload_token');
                if (t && t === reloadToken) {
                    foundSlot = s;
                    break;
                }
            } catch (e) { }
        }
    }

    if (!foundSlot) {
        reloadStates.delete(player.name);
        return;
    }

    const bow = new ItemStack(TYPE_BOW);
    const durBow = bow.getComponent(ItemComponentTypes.Durability);
    if (durBow) durBow.damage = saved;

    try {
        bow.setDynamicProperty('fv:reload_token', undefined);
        bow.setDynamicProperty(PROP_FIRED, false);
        bow.setDynamicProperty(PROP_SAVED_DAMAGE, undefined);
    } catch (e) { }

    foundSlot.setItem(bow);
    reloadStates.delete(player.name);
});