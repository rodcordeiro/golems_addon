import {
    world,
    system,
    Player,
    EquipmentSlot,
    GameMode
} from '@minecraft/server';

// --- CONFIGURATION ---
const TIER_CONFIGS = {
    'minecraft:wood_tier': { amplifier: 0, durationInSeconds: 5, chance: 5 },
    'minecraft:stone_tier': { amplifier: 0, durationInSeconds: 8, chance: 8 },
    'minecraft:copper_tier': { amplifier: 0, durationInSeconds: 10, chance: 10 },
    'minecraft:iron_tier': { amplifier: 1, durationInSeconds: 8, chance: 15 },
    'fv:steel_tier': { amplifier: 1, durationInSeconds: 10, chance: 18 },
    'fv:illasteel_tier': { amplifier: 1, durationInSeconds: 10, chance: 18 },
    'minecraft:diamond_tier': { amplifier: 2, durationInSeconds: 8, chance: 20 },
    'minecraft:netherite_tier': { amplifier: 2, durationInSeconds: 10, chance: 30 },
    'fv:illudiamondite_tier': { amplifier: 2, durationInSeconds: 10, chance: 30 },
    'fv:diamet_tier': { amplifier: 2, durationInSeconds: 10, chance: 30 },
};

const DAMAGE_TIERS = {
    'minecraft:wood_tier': 8,
    'minecraft:stone_tier': 10,
    'minecraft:copper_tier': 11,
    'minecraft:iron_tier': 12,
    'fv:steel_tier': 13,
    'fv:illasteel_tier': 13,
    'minecraft:diamond_tier': 14,
    'minecraft:netherite_tier': 16,
    'fv:illudiamondite_tier': 16,
    'fv:diamet_tier': 16
};

// --- HELPER FUNCTIONS ---
function applyDurabilityLoss(source, itemStack, slot) {
    if (source.getGameMode() === GameMode.Creative) return;

    const durability = itemStack.getComponent("minecraft:durability");
    if (!durability) return;

    const enchantable = itemStack.getComponent("minecraft:enchantable");
    const unbreakingLevel = enchantable?.getEnchantment("unbreaking")?.level;
    const damageChance = durability.getDamageChance(unbreakingLevel) / 100;

    if (Math.random() > damageChance) return;

    if (durability.damage + 1 >= durability.maxDurability) {
        slot.setItem(undefined);
        source.playSound("random.break");
    } else {
        durability.damage++;
        slot.setItem(itemStack);
    }
}

// --- COMPONENTS ---

// 1. Hit Logic (Effect)
const spearHitComponentLogic = {
    onHitEntity({ attackingEntity, hitEntity, itemStack }) {
        if (!attackingEntity || !itemStack || !hitEntity) return;

        let config = null;
        for (const tag in TIER_CONFIGS) {
            if (itemStack.hasTag(tag)) {
                config = TIER_CONFIGS[tag];
                break;
            }
        }

        if (config && Math.random() * 100 <= config.chance) {
            hitEntity.addEffect("slowness", config.durationInSeconds * 20, {
                amplifier: config.amplifier,
                showParticles: true
            });
        }
    }
};

// 2. Animation Logic (Charging)
const spearAnimationComponentLogic = {
    onUse({ source }) {
        if (!source || !(source instanceof Player)) return;

        const equippable = source.getComponent("minecraft:equippable");
        // Lấy slot Offhand (đúng chuẩn API Enum: EquipmentSlot.Offhand)
        const offhandSlot = equippable?.getEquipmentSlot(EquipmentSlot.Offhand);
        const hasOffhandItem = offhandSlot && offhandSlot.hasItem();

        // ✔️ Đã sửa tên animation theo yêu cầu
        const animationName = hasOffhandItem
            ? "animation.nguoimau.halberd_one_hand_using"
            : "animation.nguoimau.halberd_two_hand_using";

        // Animation sẽ dừng khi người chơi thả tay (query.is_using_item = false)
        source.playAnimation(animationName, {
            stopExpression: "!query.is_using_item"
        });
    }
};

// --- GLOBAL EVENTS ---

// 3. Release Logic (Attack & Damage)
world.afterEvents.itemReleaseUse.subscribe(event => {
    const { source, itemStack } = event;
    if (!source || !(source instanceof Player) || !itemStack || !itemStack.hasTag("fv:is_halberd")) {
        return;
    }

    let damageAmount = 0;
    for (const tag in DAMAGE_TIERS) {
        if (itemStack.hasTag(tag)) {
            damageAmount = DAMAGE_TIERS[tag];
            break;
        }
    }

    if (damageAmount > 0) {
        const equippable = source.getComponent("minecraft:equippable");
        const mainhandSlot = equippable?.getEquipmentSlot(EquipmentSlot.Mainhand);
        const offhandSlot = equippable?.getEquipmentSlot(EquipmentSlot.Offhand);
        const hasOffhandItem = offhandSlot && offhandSlot.hasItem();

        // Chạy Animation tấn công (Release)
        const attackAnimation = hasOffhandItem
            ? "animation.nguoimau.halberd_one_hand_attacked"
            : "animation.nguoimau.halberd_two_hand_attacked";

        source.playAnimation(attackAnimation, {
            blendOutTime: 0.3
        });

        // Delay 2 ticks để sát thương khớp với animation chém
        system.runTimeout(() => {
            if (!source.isValid) return;

            const entitiesInView = source.getEntitiesFromViewDirection({
                maxDistance: 6
            });

            if (entitiesInView.length > 0) {
                const targetEntity = entitiesInView[0].entity;
                if (targetEntity && targetEntity.isValid) {
                    targetEntity.applyDamage(damageAmount, {
                        damagingEntity: source,
                        cause: "entityAttack"
                    });
                }
            }
        }, 2);

        // Trừ độ bền
        if (mainhandSlot && mainhandSlot.hasItem()) {
            const currentItem = mainhandSlot.getItem();
            if (currentItem) {
                applyDurabilityLoss(source, currentItem, mainhandSlot);
            }
        }
    }
});

// --- REGISTRATION ---
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("fv:spear_hit", spearHitComponentLogic);
    itemComponentRegistry.registerCustomComponent("fv:spear_third_persion_animation", spearAnimationComponentLogic);
});