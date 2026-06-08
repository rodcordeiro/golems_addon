import {
    world,
    system,
    Player,
    EquipmentSlot,
    GameMode
} from '@minecraft/server';

// Hàm tiện ích để xử lý việc trừ độ bền.
function applyDamage(source) {
    if (!(source instanceof Player)) return;

    const equippable = source.getComponent("minecraft:equippable");
    if (!equippable) return;

    const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
    if (!mainhand.hasItem()) return;

    if (source.getGameMode() === GameMode.Creative) return;

    const itemStack = mainhand.getItem();
    const durability = itemStack.getComponent("minecraft:durability");
    if (!durability) return;

    const enchantable = itemStack.getComponent("minecraft:enchantable");
    const unbreakingLevel = enchantable?.getEnchantment("unbreaking")?.level;
    const damageChance = durability.getDamageChance(unbreakingLevel) / 100;

    if (Math.random() > damageChance) return;

    const shouldBreak = durability.damage + 1 >= durability.maxDurability;

    if (shouldBreak) {
        mainhand.setItem(undefined);
        source.playSound("random.break");
    } else {
        durability.damage++;
        mainhand.setItem(itemStack);
    }
}

// Logic cho custom component 'fv:pike_hit'
const pikeHitComponentLogic = {
    onHitEntity({ attackingEntity, hitEntity, itemStack }) {
        const tierConfigs = {
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

        if (!attackingEntity || !itemStack || !hitEntity) {
            return;
        }

        let config = null;
        for (const tag in tierConfigs) {
            if (itemStack.hasTag(tag)) {
                config = tierConfigs[tag];
                break;
            }
        }

        if (config) {
            if (Math.random() * 100 <= config.chance) {
                hitEntity.addEffect("slowness", config.durationInSeconds * 20, {
                    amplifier: config.amplifier,
                    showParticles: true
                });
            }
        }
    }
};

const pikeAnimationComponentLogic = {
    onUse({ source }) {
        if (!source) return;
        source.playAnimation("animation.nguoimau.using_spear", {
            stopExpression: "!query.is_using_item"
        });
    }
};

// Lắng nghe sự kiện thả nút sử dụng (Đâm xuyên)
world.afterEvents.itemReleaseUse.subscribe(event => {
    const { source, itemStack } = event;
    if (!source || !itemStack || !itemStack.hasTag("fv:is_pike")) {
        return;
    }

    const damageTiers = {
        'minecraft:stone_tier': 14,
        'minecraft:copper_tier': 16,
        'minecraft:iron_tier': 18,
        'fv:steel_tier': 20,
        'fv:illasteel_tier': 22,
        'minecraft:diamond_tier': 24,
        'minecraft:netherite_tier': 26,
        'fv:illudiamondite_tier': 28,
        'fv:diamet_tier': 28
    };

    let damageAmount = 0;
    for (const tag in damageTiers) {
        if (itemStack.hasTag(tag)) {
            damageAmount = damageTiers[tag];
            break;
        }
    }

    if (damageAmount > 0) {
        // Lấy TẤT CẢ thực thể nằm trên đường thẳng tầm đánh 8 blocks
        const entitiesInView = source.getEntitiesFromViewDirection({
            maxDistance: 8
        });

        // Gây sát thương xuyên thấu qua mọi thực thể trong danh sách
        if (entitiesInView.length > 0) {
            for (const hit of entitiesInView) {
                const targetEntity = hit.entity;

                // Đảm bảo không tự gây sát thương lên bản thân người chơi
                if (targetEntity.id !== source.id) {
                    targetEntity.applyDamage(damageAmount, {
                        damagingEntity: source,
                        cause: "entityAttack"
                    });
                }
            }
        }

        source.playAnimation("animation.nguoimau.spear_attacked", {
            blendOutTime: 0.1
        });

        applyDamage(source);
    }
});

system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("fv:pike_hit", pikeHitComponentLogic);
    itemComponentRegistry.registerCustomComponent("fv:pike_third_persion_animation", pikeAnimationComponentLogic);
});