import { world, system, Player, EquipmentSlot } from "@minecraft/server";

/**
 * 🛠 Cấu hình Tuỳ chỉnh
 */
const COMPONENT_ID = "fv:gemheart_broadsword_component";

const EFFECT_CONFIG = [
    { tag: "fv:giant_gemheart_broadsword_lv1", chance: 0.40, amp: 2, extraTime: 5, healthBoostLevel: 1, healLevel: 1, resistanceChance: 0.50, strength: null },
    { tag: "fv:giant_gemheart_broadsword_lv2", chance: 0.50, amp: 3, extraTime: 6, healthBoostLevel: 2, healLevel: 2, resistanceChance: 0.60, strength: { chance: 0.10, duration: 200, level: 1 } },
    { tag: "fv:giant_gemheart_broadsword_lv3", chance: 0.60, amp: 4, extraTime: 7, healthBoostLevel: 3, healLevel: 3, resistanceChance: 0.70, strength: { chance: 0.20, duration: 300, level: 2 } }
];

// --- HÀM HỖ TRỢ ---

function getConfigByItemStack(itemStack) {
    if (!itemStack) return null;
    for (const config of EFFECT_CONFIG) {
        if (itemStack.hasTag(config.tag)) {
            return config;
        }
    }
    return null;
}

// -----------------------------------------------------------
// TÍNH NĂNG 1: ON HIT
// -----------------------------------------------------------
const GemheartBroadswordHitComponent = {
    onHitEntity(event) {
        const { hitEntity, hadEffect, itemStack, attackingEntity } = event;

        if (!hadEffect || !itemStack || !(attackingEntity instanceof Player)) return;

        const config = getConfigByItemStack(itemStack);
        if (!config) return;

        // Apply Weakness/Slowness
        if (Math.random() < config.chance) {
            const weaknessDuration = (20 + config.extraTime) * 20;
            const slownessDuration = (10 + config.extraTime) * 20;
            hitEntity.addEffect("minecraft:weakness", weaknessDuration, { amplifier: config.amp });
            hitEntity.addEffect("minecraft:slowness", slownessDuration, { amplifier: config.amp });
        }

        // Apply Resistance lên người chơi
        if (Math.random() < config.resistanceChance) {
            attackingEntity.addEffect("minecraft:resistance", 10 * 20, { amplifier: 2, showParticles: true });
        }

        // Apply Strength (Lv2/Lv3)
        if (config.strength) {
            if (Math.random() < config.strength.chance) {
                attackingEntity.addEffect("minecraft:strength", config.strength.duration, { amplifier: config.strength.level, showParticles: false });
            }
        }
    }
};

// -----------------------------------------------------------
// TÍNH NĂNG 3: HEAL ON KILL
// -----------------------------------------------------------
world.afterEvents.entityDie.subscribe((event) => {
    const { damageSource } = event;
    const attacker = damageSource.damagingEntity;

    if (!(attacker instanceof Player)) return;

    const equippable = attacker.getComponent("minecraft:equippable");
    const mainhandItem = equippable?.getEquipment(EquipmentSlot.Mainhand);

    if (!mainhandItem) return;

    const config = getConfigByItemStack(mainhandItem);
    if (!config) return;

    if (Math.random() < config.chance) {
        attacker.addEffect("minecraft:regeneration", 80, { amplifier: config.healLevel, showParticles: true });
    }
});


// -----------------------------------------------------------
// TÍNH NĂNG 2: HEALTH BOOST (Refresh liên tục)
// -----------------------------------------------------------
const HEALTH_BOOST_DURATION = 72000; // 1 giờ

system.runInterval(() => {
    for (const player of world.getPlayers()) {
        if (!player.isValid) continue;

        const equippable = player.getComponent("minecraft:equippable");
        const mainhandItem = equippable?.getEquipment(EquipmentSlot.Mainhand);

        let shouldHaveHealthBoost = false;
        let requiredLevel = 0;

        if (mainhandItem) {
            const config = getConfigByItemStack(mainhandItem);
            if (config) {
                requiredLevel = config.healthBoostLevel;
                shouldHaveHealthBoost = true;
            }
        }

        const currentHealthBoost = player.getEffect("minecraft:health_boost");

        if (shouldHaveHealthBoost) {
            // Logic hạ cấp: Nếu đang có level cao hơn level kiếm hiện tại -> Xóa đi để add lại cái thấp hơn
            if (currentHealthBoost && currentHealthBoost.amplifier > requiredLevel) {
                player.removeEffect("minecraft:health_boost");
            }

            // Logic thêm mới/duy trì: Nếu chưa có hoặc sai level -> Add lại
            const updatedHealthBoost = player.getEffect("minecraft:health_boost");
            if (!updatedHealthBoost || updatedHealthBoost.amplifier !== requiredLevel) {
                player.addEffect("minecraft:health_boost", HEALTH_BOOST_DURATION, { amplifier: requiredLevel, showParticles: false });
            }
        } else {
            // Logic tháo kiếm: Xóa hiệu ứng nếu nó thuộc về bộ kiếm này
            if (currentHealthBoost) {
                if (currentHealthBoost.amplifier >= 1 && currentHealthBoost.amplifier <= 3) {
                    player.removeEffect("minecraft:health_boost");
                }
            }
        }
    }
}, 40); // Refresh mỗi 2 giây


// -----------------------------------------------------------
// ĐĂNG KÝ COMPONENT
// -----------------------------------------------------------
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent(
        COMPONENT_ID,
        GemheartBroadswordHitComponent
    );
});