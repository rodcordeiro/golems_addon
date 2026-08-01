// velocithief_blade_with_absorption.js
import { world, system } from "@minecraft/server"; // ✔️ Thêm system

/* ---------- Helpers ---------- */

const TICKS_PER_SECOND = 20;
const secToTicks = s => Math.max(0, Math.floor(s * TICKS_PER_SECOND));

// Helper kiểm tra Tag tối ưu cho API mới
function hasTagSafe(itemStack, tagName) {
    if (!itemStack) return false;
    // API mới ưu tiên hasTag
    if (itemStack.hasTag) {
        return itemStack.hasTag(tagName);
    }
    // Fallback cơ bản
    return itemStack.typeId === tagName;
}

function angleBetweenVectorsXZ(v1, v2) {
    const dot = v1.x * v2.x + v1.z * v2.z;
    const mag1 = Math.hypot(v1.x, v1.z);
    const mag2 = Math.hypot(v2.x, v2.z);
    if (mag1 === 0 || mag2 === 0) return Infinity;
    let cosTheta = dot / (mag1 * mag2);
    cosTheta = Math.max(-1, Math.min(1, cosTheta));
    return Math.acos(cosTheta) * (180 / Math.PI);
}

/* ---------- Area damage + poison (no knockback) ---------- */

function applyAreaDamageAndPoisonFromSource(source, {
    distance = 4,            // cố định theo bạn nói
    angleDeg = 90,           // cố định 90 độ
    damageAmount = 3,
    poisonSeconds = 20,
    poisonAmplifier = 0
}) {
    if (!source || !source.isValid) return false;

    let viewDir;
    try {
        viewDir = source.getViewDirection();
    } catch (e) {
        return false;
    }
    let viewDirXZ = { x: viewDir.x, z: viewDir.z };
    const mag = Math.hypot(viewDirXZ.x, viewDirXZ.z);
    if (mag === 0) return false;
    viewDirXZ.x /= mag;
    viewDirXZ.z /= mag;

    const pos = source.location;
    const dimension = source.dimension;
    if (!dimension) return false;

    const nearby = dimension.getEntities({ location: pos, maxDistance: distance });
    let hitAny = false;  // để biết có thực thể nào trúng không

    for (const ent of nearby) {
        try {
            if (!ent || !ent.isValid) continue;
            if (ent.id === source.id) continue;
            if (!ent.hasComponent || !ent.hasComponent("minecraft:health")) continue;

            const dx = ent.location.x - pos.x;
            const dz = ent.location.z - pos.z;
            const distXZ = Math.hypot(dx, dz);
            if (distXZ === 0 || distXZ > distance) continue;

            const dirTo = { x: dx / distXZ, z: dz / distXZ };
            const angle = angleBetweenVectorsXZ(viewDirXZ, dirTo);
            if (angle <= angleDeg) {
                // thực thể bị trúng
                hitAny = true;

                // apply damage
                try {
                    ent.applyDamage(damageAmount, {
                        damagingEntity: source,
                        cause: "entityAttack"
                    });
                } catch (errD) {
                    console.error("velocithief: applyDamage error:", errD);
                }
                // apply poison effect
                try {
                    ent.addEffect("poison", secToTicks(poisonSeconds), { amplifier: poisonAmplifier });
                } catch (errE) {
                    console.error("velocithief: addEffect(poison) error:", errE);
                }
            }
        } catch (e) {
            console.error("velocithief: error iterating nearby entity:", e);
        }
    }

    return hitAny;
}

/* ---------- Register custom item components ---------- */

// SỬA LỖI API: Dùng system.beforeEvents.startup thay vì world.beforeEvents.worldInitialize
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {

    // fv:velocithief_blade_hit
    itemComponentRegistry.registerCustomComponent("fv:velocithief_blade_hit", {
        onHitEntity(event) {
            try {
                const { attackingEntity, hitEntity, itemStack } = event;
                if (!attackingEntity || !hitEntity) return;

                const isLv1 = hasTagSafe(itemStack, "fv:velocithief_blade_lv1");
                const isLv2 = hasTagSafe(itemStack, "fv:velocithief_blade_lv2");
                const isLv3 = hasTagSafe(itemStack, "fv:velocithief_blade_lv3");
                if (!isLv1 && !isLv2 && !isLv3) return;

                let chance = 0;
                let speedAmpl = 0;
                let speedSec = 10;
                if (isLv1) {
                    chance = 30; speedAmpl = 0; speedSec = 10;
                } else if (isLv2) {
                    chance = 50; speedAmpl = 1; speedSec = 10;
                } else if (isLv3) {
                    chance = 70; speedAmpl = 1; speedSec = 20;
                }

                if (Math.random() * 100 <= chance) {
                    try {
                        attackingEntity.addEffect("speed", secToTicks(speedSec), { amplifier: speedAmpl });
                    } catch (err) {
                        console.error("velocithief: addEffect(speed) error:", err);
                    }
                }

                let poisonSec = 20;
                if (isLv1) poisonSec = 20;
                else if (isLv2) poisonSec = 30;
                else if (isLv3) poisonSec = 40;

                try {
                    if (hitEntity.hasComponent && hitEntity.hasComponent("minecraft:health")) {
                        hitEntity.addEffect("poison", secToTicks(poisonSec), { amplifier: 0 });
                    }
                } catch (err2) {
                    console.error("velocithief: addEffect(poison) on hitEntity error:", err2);
                }

            } catch (err) {
                console.error("velocithief_blade_hit onHitEntity error:", err);
            }
        }
    });

    // fv:velocithief_blade_use
    itemComponentRegistry.registerCustomComponent("fv:velocithief_blade_use", {
        onUse(event) {
            try {
                const { source, itemStack } = event;
                if (!source) return;

                if (!hasTagSafe(itemStack, "fv:velocithief_blade_lv1") &&
                    !hasTagSafe(itemStack, "fv:velocithief_blade_lv2") &&
                    !hasTagSafe(itemStack, "fv:velocithief_blade_lv3")) return;

                source.playAnimation("animation.nguoimau.chuanbichem", {
                    stopExpression: "!query.is_using_item",
                    blendOutTime: 0.3
                });
            } catch (err) {
                console.error("velocithief_blade_use onUse error:", err);
            }
        }
    });
});

/* ---------- Handle release-use (charged attack) + Absorption ---------- */

world.afterEvents.itemReleaseUse.subscribe(event => {
    try {
        const { source, itemStack, useDuration } = event;
        if (!source || !itemStack) return;

        if (typeof useDuration !== "number" || useDuration < 6) return;

        const isLv1 = hasTagSafe(itemStack, "fv:velocithief_blade_lv1");
        const isLv2 = hasTagSafe(itemStack, "fv:velocithief_blade_lv2");
        const isLv3 = hasTagSafe(itemStack, "fv:velocithief_blade_lv3");
        if (!isLv1 && !isLv2 && !isLv3) return;

        source.playAnimation("animation.nguoimau.donchem", { blendOutTime: 0.1 });

        // các thông số cố định
        const RANGE = 4;
        const ANGLE_DEGREES = 90;

        let damage = 18;
        let poisonSec = 20;
        let absorptionLevel = 1;
        let absorptionSec = 40;

        if (isLv1) {
            damage = 18; poisonSec = 20; absorptionLevel = 1; absorptionSec = 40;
        } else if (isLv2) {
            damage = 20; poisonSec = 30; absorptionLevel = 2; absorptionSec = 50;
        } else if (isLv3) {
            damage = 22; poisonSec = 40; absorptionLevel = 3; absorptionSec = 60;
        }

        // apply area damage & poison
        const hitAny = applyAreaDamageAndPoisonFromSource(source, {
            distance: RANGE,
            angleDeg: ANGLE_DEGREES,
            damageAmount: damage,
            poisonSeconds: poisonSec,
            poisonAmplifier: 0
        });

        // nếu chém trúng ít nhất một thực thể → source nhận Absorption
        if (hitAny) {
            try {
                source.addEffect("absorption", secToTicks(absorptionSec), { amplifier: absorptionLevel - 1 });
            } catch (errA) {
                console.error("velocithief: addEffect(absorption) error:", errA);
            }
        }

    } catch (err) {
        console.error("velocithief itemReleaseUse handler error:", err);
    }
});