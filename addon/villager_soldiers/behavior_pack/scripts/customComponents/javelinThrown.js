import {
    world,
    system,
    Player,
    EquipmentSlot,
    ItemStack
} from '@minecraft/server';

const TIER_MODIFIERS = new Map([
    ["minecraft:wood_tier", -1.5],
    ["minecraft:stone_tier", -1.0],
    ["minecraft:copper_tier", -0.5],
    ["minecraft:iron_tier", 0.0],
    ["fv:steel_tier", 0.5],
    ["fv:illasteel_tier", 0.5],
    ["minecraft:diamond_tier", 1.0],
    ["minecraft:netherite_tier", 1.5],
    ["fv:illudiamondite_tier", 1.5],
    ["fv:diamet_tier", 1.5],
]);

const TIER_ENTITY_MAP = new Map([
    ["minecraft:wood_tier", "fv:thrown_wooden_javelin"],
    ["minecraft:stone_tier", "fv:thrown_stone_javelin"],
    ["minecraft:copper_tier", "fv:thrown_copper_javelin"],
    ["minecraft:iron_tier", "fv:thrown_iron_javelin"],
    ["fv:steel_tier", "fv:thrown_steel_javelin"],
    ["fv:illasteel_tier", "fv:thrown_illasteel_javelin"],
    ["minecraft:diamond_tier", "fv:thrown_diamond_javelin"],
    ["minecraft:netherite_tier", "fv:thrown_netherite_javelin"],
    ["fv:illudiamondite_tier", "fv:thrown_illudiamondite_javelin"],
    ["fv:diamet_tier", "fv:thrown_diamet_javelin"],
]);

const THROWN_TO_ITEM_MAP = new Map([
    ["fv:thrown_wooden_javelin", "fv:wooden_javelin"],
    ["fv:thrown_stone_javelin", "fv:stone_javelin"],
    ["fv:thrown_copper_javelin", "fv:copper_javelin"],
    ["fv:thrown_iron_javelin", "fv:iron_javelin"],
    ["fv:thrown_steel_javelin", "fv:steel_javelin"],
    ["fv:thrown_illasteel_javelin", "fv:illasteel_javelin"],
    ["fv:thrown_diamond_javelin", "fv:diamond_javelin"],
    ["fv:thrown_netherite_javelin", "fv:netherite_javelin"],
    ["fv:thrown_illudiamondite_javelin", "fv:illudiamondite_javelin"],
    ["fv:thrown_diamet_javelin", "fv:diamet_javelin"],
]);

const TIER_DURABILITY_LOSS = new Map([
    ["minecraft:wood_tier", 13],
    ["minecraft:stone_tier", 14],
    ["minecraft:copper_tier", 15],
    ["minecraft:iron_tier", 16],
    ["fv:steel_tier", 17],
    ["fv:illasteel_tier", 17],
    ["minecraft:diamond_tier", 18],
    ["minecraft:netherite_tier", 19],
    ["fv:illudiamondite_tier", 19],
    ["fv:diamet_tier", 19],
]);

// 1️⃣ ĐĂNG KÝ DYNAMIC PROPERTIES (Giữ nguyên cấu trúc của bạn)
system.beforeEvents.startup.subscribe(({ propertyRegistry }) => {
    const javelinTypes = Array.from(TIER_ENTITY_MAP.values());
    for (const entityTypeId of javelinTypes) {
        try {
            propertyRegistry.registerEntityTypeDynamicProperties({
                properties: [
                    { id: "fv:item_durability", type: "float", defaultValue: 0 },
                    { id: "fv:durability_loss", type: "float", defaultValue: 1 }
                ]
            }, entityTypeId);
        } catch (e) { }
    }
});

// 2️⃣ SỰ KIỆN NÉM LAO
world.afterEvents.itemReleaseUse.subscribe(event => {
    const { source, itemStack } = event;

    if (!source || !itemStack || !(source instanceof Player)) return;
    if (!itemStack.hasTag("fv:is_javelin")) return;

    try {
        const eyeLocation = source.getHeadLocation();
        const viewDirection = source.getViewDirection();

        let tierModifier = 0.0;
        let thrownEntityId = "fv:thrown_iron_javelin";
        let durabilityLoss = 16;

        for (const [tag, entityId] of TIER_ENTITY_MAP) {
            if (itemStack.hasTag(tag)) {
                thrownEntityId = entityId;
                if (TIER_MODIFIERS.has(tag)) tierModifier = TIER_MODIFIERS.get(tag);
                if (TIER_DURABILITY_LOSS.has(tag)) durabilityLoss = TIER_DURABILITY_LOSS.get(tag);
                break;
            }
        }

        const basePower = 4.0;
        const finalPower = basePower + tierModifier;

        // FIX 1: Tăng khoảng cách spawn để tránh va chạm với hitbox người chơi khi đang chạy
        const spawnDistance = 1.5;
        const spawnLocation = {
            x: eyeLocation.x + viewDirection.x * spawnDistance,
            y: eyeLocation.y + viewDirection.y * spawnDistance,
            z: eyeLocation.z + viewDirection.z * spawnDistance
        };

        const thrownJavelin = source.dimension.spawnEntity(thrownEntityId, spawnLocation);
        const projectileComponent = thrownJavelin.getComponent("minecraft:projectile");

        if (projectileComponent) {
            // FIX 2: Set chủ sở hữu cho thực thể lao
            projectileComponent.owner = source;

            projectileComponent.shoot({
                x: viewDirection.x * finalPower,
                y: viewDirection.y * finalPower,
                z: viewDirection.z * finalPower
            });
        }

        const durability = itemStack.getComponent("minecraft:durability");
        if (durability) {
            const remainingDurability = durability.maxDurability - durability.damage;
            try {
                thrownJavelin.setDynamicProperty("fv:item_durability", remainingDurability);
                thrownJavelin.setDynamicProperty("fv:durability_loss", durabilityLoss);
            } catch (propErr) { }
        }

        const equippable = source.getComponent("minecraft:equippable");
        if (equippable) equippable.getEquipmentSlot(EquipmentSlot.Mainhand).setItem(undefined);

        source.playSound("item.trident.throw");

    } catch (e) { }
});

// 3️⃣ SỰ KIỆN TRÚNG MỤC TIÊU (Giữ nguyên logic của bạn)
world.afterEvents.projectileHitEntity.subscribe(event => {
    const { projectile } = event;
    const isJavelin = THROWN_TO_ITEM_MAP.has(projectile.typeId);
    if (!isJavelin) return;

    try {
        const currentRemainingDurability = projectile.getDynamicProperty("fv:item_durability");
        const remainingDurability = typeof currentRemainingDurability === 'number' ? currentRemainingDurability : 0;
        const durabilityLoss = projectile.getDynamicProperty("fv:durability_loss") || 1;

        projectile.setDynamicProperty("fv:item_durability", remainingDurability - durabilityLoss);
    } catch (e) { }
});