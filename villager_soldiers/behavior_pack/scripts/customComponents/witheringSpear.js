// witheringSpear_GameplayEnhancement.js
import { world, system } from "@minecraft/server";

/* ---------- Utility Functions ---------- */

function safeApplyKnockback(entity, dirNormalized, horizStrength, verticalStrength) {
    if (!entity || !entity.isValid) return;

    // Đẩy vào system.run để đảm bảo an toàn vật lý
    system.run(() => {
        if (!entity.isValid) return;
        try {
            // SỬA LỖI QUAN TRỌNG:
            // API hiện tại chỉ nhận 2 tham số:
            // 1. Object Vector ({ x, z }) -> Phải nhân hướng (dir) với lực (strength) tại đây
            // 2. Lực dọc (number)
            entity.applyKnockback(
                {
                    x: dirNormalized.x * horizStrength,
                    z: dirNormalized.z * horizStrength
                },
                verticalStrength
            );
        } catch (err) {
            // Ignored
        }
    });
}

// Hàm thực hiện AoE 360 độ (dạng hình tròn)
function applyKnockbackAndDamageFromSource(source, { distance, horizStrength, verticalStrength, damageAmount }) {
    if (!source || !source.isValid) return;

    const playerPos = source.location;
    const dimension = source.dimension;

    // Lấy tất cả thực thể trong phạm vi 'distance'
    const nearbyEntities = dimension.getEntities({ location: playerPos, maxDistance: distance });

    for (const entity of nearbyEntities) {
        if (!entity || !entity.isValid) continue;
        if (entity.id === source.id) continue; // Bỏ qua người dùng

        const dx = entity.location.x - playerPos.x;
        const dz = entity.location.z - playerPos.z;
        // Tính khoảng cách
        const distXZ = Math.sqrt(dx * dx + dz * dz);

        if (distXZ === 0 || distXZ > distance) continue;

        // Tính hướng đẩy (Normalized Vector)
        const dirToEntity = { x: dx / distXZ, z: dz / distXZ };

        // Gọi hàm knockback đã sửa
        safeApplyKnockback(entity, dirToEntity, horizStrength, verticalStrength);

        try {
            entity.applyDamage(damageAmount, {
                damagingEntity: source,
                cause: "entityAttack"
            });
        } catch (errD) {
            console.error("applyDamage error:", errD);
        }
    }
}

// Helper kiểm tra Tag an toàn
function hasTagSafe(itemStack, tagName) {
    if (!itemStack) return false;
    if (itemStack.hasTag) {
        return itemStack.hasTag(tagName);
    }
    return itemStack.typeId === tagName;
}

/* ---------- Register Custom Components during Startup ---------- */

system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {

    // fv:withering_spear_hit
    itemComponentRegistry.registerCustomComponent("fv:withering_spear_hit", {
        onHitEntity(event) {
            try {
                const { attackingEntity, hitEntity, itemStack } = event;

                // Kiểm tra isValid ngay lập tức
                if (!attackingEntity || !hitEntity || !itemStack) return;
                if (!attackingEntity.isValid || !hitEntity.isValid) return;

                const secToTicks = (s) => Math.max(0, Math.floor(s * 20));

                // Tỉ lệ % gây wither
                let chance = 0;
                if (hasTagSafe(itemStack, "fv:withering_spear_lv1")) {
                    chance = 30;
                } else if (hasTagSafe(itemStack, "fv:withering_spear_lv2")) {
                    chance = 50;
                } else if (hasTagSafe(itemStack, "fv:withering_spear_lv3")) {
                    chance = 70;
                } else {
                    return;
                }

                if (Math.random() * 100 <= chance) {
                    if (hitEntity.isValid) {
                        if (hasTagSafe(itemStack, "fv:withering_spear_lv1")) {
                            hitEntity.addEffect("wither", secToTicks(6), { amplifier: 0 });
                        } else if (hasTagSafe(itemStack, "fv:withering_spear_lv2")) {
                            hitEntity.addEffect("wither", secToTicks(8), { amplifier: 0 });
                        } else if (hasTagSafe(itemStack, "fv:withering_spear_lv3")) {
                            hitEntity.addEffect("wither", secToTicks(8), { amplifier: 1 });
                            if (attackingEntity.isValid) {
                                attackingEntity.addEffect("regeneration", secToTicks(5), { amplifier: 1 });
                            }
                        }
                    }
                }

            } catch (err) {
                console.error("onHitEntity error:", err);
            }
        }
    });

    // fv:withering_spear_use
    itemComponentRegistry.registerCustomComponent("fv:withering_spear_use", {
        onUse(event) {
            try {
                const { source, itemStack } = event;
                if (!source || !source.isValid) return;

                // Chỉ chạy animation nếu đúng là withering spear
                if (!hasTagSafe(itemStack, "fv:withering_spear_lv1") &&
                    !hasTagSafe(itemStack, "fv:withering_spear_lv2") &&
                    !hasTagSafe(itemStack, "fv:withering_spear_lv3")) {
                    return;
                }

                source.playAnimation("animation.nguoimau.chuanbichem", {
                    stopExpression: "!query.is_using_item",
                    blendOutTime: 0.3
                });
            } catch (err) {
                console.error("onUse error:", err);
            }
        }
    });
});

/* ---------- Handle itemReleaseUse event ---------- */

world.afterEvents.itemReleaseUse.subscribe(event => {
    try {
        const { source, itemStack, useDuration } = event;
        if (!source || !source.isValid || !itemStack) return;

        // kiểm tra thời gian dùng item (useDuration) ≥ 0.3s => 6 ticks
        if (typeof useDuration !== "number" || useDuration < 6) {
            return;
        }

        const isLv1 = hasTagSafe(itemStack, "fv:withering_spear_lv1");
        const isLv2 = hasTagSafe(itemStack, "fv:withering_spear_lv2");
        const isLv3 = hasTagSafe(itemStack, "fv:withering_spear_lv3");
        if (!isLv1 && !isLv2 && !isLv3) return;

        // play attack animation
        source.playAnimation("animation.nguoimau.donchem", { blendOutTime: 0.1 });

        // set các tham số theo level
        let damage = 18;
        let KNOCKBACK_DISTANCE = 6;
        let KNOCKBACK_STRENGTH = 1.2;
        if (isLv2) {
            damage = 22;
            KNOCKBACK_DISTANCE = 8;
            KNOCKBACK_STRENGTH = 1.6;
        } else if (isLv3) {
            damage = 26;
            KNOCKBACK_DISTANCE = 10;
            KNOCKBACK_STRENGTH = 1.8;
        }

        const VERTICAL_STRENGTH = 0.5;

        // Gây Damage & Knockback diện rộng
        applyKnockbackAndDamageFromSource(source, {
            distance: KNOCKBACK_DISTANCE,
            horizStrength: KNOCKBACK_STRENGTH,
            verticalStrength: VERTICAL_STRENGTH,
            damageAmount: damage
        });

    } catch (err) {
        console.error("itemReleaseUse error:", err);
    }
});