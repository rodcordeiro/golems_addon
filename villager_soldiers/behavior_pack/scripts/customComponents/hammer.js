import { world, system } from "@minecraft/server";

const TIERS = {
    "minecraft:stone_tier": { chance: 0.05, duration: 3, amp: 5, kb: 0.2 },
    "minecraft:copper_tier": { chance: 0.08, duration: 5, amp: 6, kb: 0.3 },
    "minecraft:iron_tier": { chance: 0.10, duration: 7, amp: 7, kb: 0.4 },
    "fv:steel_tier": { chance: 0.12, duration: 9, amp: 8, kb: 0.5 },
    "fv:illasteel_tier": { chance: 0.12, duration: 9, amp: 8, kb: 0.5 },
    "minecraft:diamond_tier": { chance: 0.14, duration: 11, amp: 9, kb: 0.6 },
    "minecraft:netherite_tier": { chance: 0.16, duration: 13, amp: 10, kb: 0.7 },
    "fv:illudiamondite_tier": { chance: 0.16, duration: 13, amp: 10, kb: 0.7 },
    "fv:diamet_tier": { chance: 0.16, duration: 13, amp: 10, kb: 0.7 },
};

system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("fv:hammer_hit", {
        onHitEntity(event) {
            const attacker = event.attackingEntity;
            const hitEntity = event.hitEntity;
            const itemStack = event.itemStack;

            // 1. Kiểm tra tồn tại
            if (!attacker || !hitEntity || !itemStack) return;
            if (!attacker.isValid || !hitEntity.isValid) return;

            // 2. Kiểm tra Tag
            let tierTag = null;
            for (const key in TIERS) {
                if (itemStack.hasTag(key)) {
                    tierTag = key;
                    break;
                }
            }
            if (!tierTag) return;
            const tier = TIERS[tierTag];

            // 3. Hiệu ứng Slowness & Âm thanh
            if (Math.random() < tier.chance) {
                if (hitEntity.isValid) {
                    try {
                        hitEntity.addEffect("minecraft:slowness", tier.duration * 20, {
                            amplifier: tier.amp, showParticles: false
                        });
                        const { x, y, z } = hitEntity.location;
                        if (attacker.isValid) {
                            attacker.runCommand(`playsound weapon.bonk @a ${x} ${y} ${z} 4`);
                        }
                    } catch (e) { }
                }
            }

            // 4. Xử lý Knockback
            if (!attacker.isValid) return;

            // --- KIỂM TRA KHOẢNG CÁCH ---
            const locAttacker = attacker.location;
            const locTarget = hitEntity.location;

            // Tính bình phương khoảng cách
            const distSq = (locAttacker.x - locTarget.x) ** 2 +
                (locAttacker.y - locTarget.y) ** 2 +
                (locAttacker.z - locTarget.z) ** 2;

            // Nếu khoảng cách > 2 block (bình phương > 4) thì KHÔNG đẩy
            if (distSq > 4.0) return;

            // --- TÍNH TOÁN VECTOR HƯỚNG ---
            let dirX = locTarget.x - locAttacker.x;
            let dirZ = locTarget.z - locAttacker.z;

            // Chuẩn hóa Vector
            const magnitude = Math.sqrt(dirX * dirX + dirZ * dirZ);

            if (magnitude < 0.0001) {
                dirX = 1;
                dirZ = 0;
            } else {
                dirX /= magnitude;
                dirZ /= magnitude;
            }

            const horizontalStrength = tier.kb * 5;
            const verticalStrength = tier.kb * 0.8;

            // Đẩy vào system.run
            system.run(() => {
                if (hitEntity.isValid) {
                    try {
                        // Áp dụng Knockback với 2 tham số (Chuẩn)
                        hitEntity.applyKnockback(
                            {
                                x: dirX * horizontalStrength,
                                z: dirZ * horizontalStrength
                            },
                            verticalStrength
                        );
                    } catch (e) {
                        console.warn("Knockback Error: " + e);
                    }
                }
            });
        }
    });
});