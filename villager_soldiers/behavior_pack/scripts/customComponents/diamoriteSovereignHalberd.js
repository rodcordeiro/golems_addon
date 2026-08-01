// diamoriteHalberd_GameplayEnhancement.js
import { world, system } from "@minecraft/server";

/* ---------- Utility Functions ---------- */

function safeApplyKnockback(entity, dirNormalized, horizStrength, verticalStrength) {
    if (!entity || !entity.isValid) return;

    // Đẩy vào system.run để đảm bảo vật lý được xử lý an toàn
    system.run(() => {
        if (!entity.isValid) return;
        try {
            // SỬA LỖI: Chuyển về cú pháp 2 tham số
            // Tham số 1: Vector đẩy ({x, z}) = Hướng * Lực
            // Tham số 2: Lực nảy lên (vertical strength)
            entity.applyKnockback(
                {
                    x: dirNormalized.x * horizStrength,
                    z: dirNormalized.z * horizStrength
                },
                verticalStrength
            );
        } catch (err) {
            // Bỏ qua lỗi (ví dụ entity kháng knockback hoặc đã chết)
        }
    });
}

// Hàm AoE 360 độ (Hình tròn)
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
        const distXZ = Math.sqrt(dx * dx + dz * dz); // Dùng sqrt để tính khoảng cách thực

        if (distXZ === 0 || distXZ > distance) continue;

        // Hướng đẩy lùi là HƯỚNG RA XA người chơi (360 độ)
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

/* ---------- Register Custom Components ---------- */

system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {

    // Tính số ticks từ giây
    const secToTicks = (s) => Math.max(0, Math.floor(s * 20));

    // fv:diamorite_sovereign_halberd_component (onHitEntity)
    itemComponentRegistry.registerCustomComponent("fv:diamorite_sovereign_halberd_component", {
        onHitEntity(event) {
            try {
                const { attackingEntity, hitEntity, itemStack } = event;
                if (!attackingEntity || !hitEntity || !itemStack) return;

                // Kiểm tra isValid cho chắc chắn
                if (!attackingEntity.isValid || !hitEntity.isValid) return;

                // Kiểm tra Tag cả ở đây cho chắc chắn
                if (itemStack.hasTag && !itemStack.hasTag("fv:diamorite_sovereign_halberd")) return;

                // 1. KIỂM TRA TỈ LỆ 20%
                if (Math.random() * 100 <= 20) {
                    if (hitEntity.isValid) {
                        hitEntity.addEffect("weakness", secToTicks(5), { amplifier: 1, showParticles: true });
                    }
                    if (attackingEntity.isValid) {
                        const hasRegeneration = attackingEntity.getEffect("regeneration");
                        if (!hasRegeneration) {
                            attackingEntity.addEffect("regeneration", secToTicks(10), { amplifier: 1, showParticles: true });
                        }
                    }
                }
            } catch (err) {
                console.error("onHitEntity fv:diamorite_sovereign_halberd_component error:", err);
            }
        }
    });

    // fv:diamorite_sovereign_halberd_use (onUse)
    itemComponentRegistry.registerCustomComponent("fv:diamorite_sovereign_halberd_use", {
        onUse(event) {
            try {
                const { source, itemStack } = event;
                if (!source || !source.isValid || !itemStack) return;

                // Kiểm tra Tag trước khi chạy animation
                if (itemStack.hasTag && !itemStack.hasTag("fv:diamorite_sovereign_halberd")) return;

                source.playAnimation("animation.nguoimau.chuanbichem", {
                    stopExpression: "!query.is_using_item",
                    blendOutTime: 0.3
                });
            } catch (err) {
                console.error("onUse fv:diamorite_sovereign_halberd_use error:", err);
            }
        }
    });
});

/* ---------- Handle itemReleaseUse event (Đòn chém AoE 360 độ) ---------- */

world.afterEvents.itemReleaseUse.subscribe(event => {
    try {
        const { source, itemStack, useDuration } = event;
        if (!source || !source.isValid || !itemStack) return;

        // 1. Kiểm tra Tag
        if (itemStack.hasTag && !itemStack.hasTag("fv:diamorite_sovereign_halberd")) {
            return;
        }

        // 2. Kiểm tra thời gian dùng item (useDuration) ≥ 0.3s => 6 ticks
        if (typeof useDuration !== "number" || useDuration < 6) {
            return;
        }

        // Chạy animation chém
        source.playAnimation("animation.nguoimau.donchem", { blendOutTime: 0.1 });

        // THAM SỐ CẤU HÌNH
        const damage = 26;
        const KNOCKBACK_DISTANCE = 4;
        const KNOCKBACK_STRENGTH = 1.2;
        const VERTICAL_STRENGTH = 0.5;

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