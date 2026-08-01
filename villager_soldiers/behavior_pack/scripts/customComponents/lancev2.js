import {
    world,
    system,
    EntityComponentTypes,
    ItemComponentTypes,
    EquipmentSlot
} from "@minecraft/server";

// Cấu hình sát thương theo cấp độ (Tier)
const tierDamage = {
    "minecraft:copper_tier": 7,
    "minecraft:iron_tier": 8,
    "fv:steel_tier": 10,
    "fv:illasteel_tier": 10,
    "minecraft:diamond_tier": 11,
    "minecraft:netherite_tier": 12,
    "fv:illudiamondite_tier": 13,
    "fv:diamet_tier": 13,
};

/**
 * Hàm hỗ trợ đẩy lùi mục tiêu theo hướng nhìn của người đánh
 */
function applyLanceKnockback(source, target, speed) {
    const view = source.getViewDirection();
    const strength = Math.min(speed * 4, 3.0); // Giới hạn lực đẩy tối đa là 3.0
    // Sử dụng đúng chuẩn API v2: {x, z} và vertical strength
    target.applyKnockback({ x: view.x * strength, z: view.z * strength }, 0.4);
}

/**
 * Đăng ký Custom Component cho cây Lance
 */
system.beforeEvents.startup.subscribe((event) => {
    event.itemComponentRegistry.registerCustomComponent("fv:lance_attack", {
        onHitEntity(ev) {
            const { attackingEntity: attacker, hitEntity: target, itemStack: item } = ev;
            if (!attacker || !target || !item) return;

            let speed = 0;

            // Kiểm tra xem thực thể có phải kỵ binh hoặc đang cưỡi ngựa không
            const typeFamilyComp = attacker.getComponent("minecraft:type_family");
            const isCavalry = typeFamilyComp?.hasTypeFamily("cavalry");

            if (isCavalry) {
                const vel = attacker.getVelocity();
                speed = Math.hypot(vel.x, vel.z);
            } else {
                const ridingComp = attacker.getComponent("minecraft:riding");
                if (ridingComp?.entityRidingOn) {
                    const vel = ridingComp.entityRidingOn.getVelocity();
                    speed = Math.hypot(vel.x, vel.z);
                }
            }

            // Nếu đang di chuyển, áp dụng hiệu ứng đặc biệt
            if (speed > 0.05) {
                applyLanceKnockback(attacker, target, speed);

                // Tính toán sát thương thêm dựa trên Tier
                for (const [tag, extraDmg] of Object.entries(tierDamage)) {
                    if (item.hasTag(tag)) {
                        target.applyDamage(extraDmg, {
                            cause: "entityAttack",
                            damagingEntity: attacker,
                        });
                        break;
                    }
                }
            }
        },
    });
});

/**
 * Tối ưu hóa việc cập nhật Lore: Chỉ cập nhật khi người chơi cầm vật phẩm trên tay
 * Thay thế cho việc quét toàn bộ túi đồ gây lag
 */
world.afterEvents.playerHoldingItemByHandChange?.subscribe((ev) => {
    const { player, itemStack: item } = ev;
    if (!item || !item.hasTag("fv:is_lance")) return;

    const lore = item.getLore();
    if (lore?.[0]?.includes("Riding Damage")) return;

    let dmgValue = 0;
    for (const [tag, dmg] of Object.entries(tierDamage)) {
        if (item.hasTag(tag)) { dmgValue = dmg; break; }
    }

    const newItem = item.clone();
    newItem.setLore([`§r§bSát thương khi cưỡi ngựa: §6${dmgValue}§r`]);

    // Cập nhật lại item vào tay người chơi
    const eq = player.getComponent("minecraft:equippable");
    eq.setEquipment(EquipmentSlot.Mainhand, newItem);
});