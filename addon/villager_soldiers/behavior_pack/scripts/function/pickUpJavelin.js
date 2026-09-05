import {
    world,
    Player,
    ItemStack,
    system
} from '@minecraft/server';

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

// SCRIPT NHẶT JAVELIN
system.afterEvents.scriptEventReceive.subscribe(event => {
    if (event.id !== "fv:pickup_javelin") return;

    const javelinEntity = event.sourceEntity;

    // SỬA LỖI: Lấy người chơi gần nhất thay vì dùng initiator
    const playersInDimension = javelinEntity.dimension.getPlayers({ closest: 2 });
    const playerWhoTriggered = playersInDimension[0];

    // Kiểm tra xem có người chơi ở gần không
    if (!playerWhoTriggered) {
        return;
    }

    const itemTypeId = THROWN_TO_ITEM_MAP.get(javelinEntity.typeId);
    if (!itemTypeId) {
        return;
    }

    try {
        const remainingDurability = javelinEntity.getDynamicProperty("fv:item_durability");

        const javelinItem = new ItemStack(itemTypeId, 1);
        const durabilityComponent = javelinItem.getComponent("minecraft:durability");

        if (durabilityComponent && typeof remainingDurability === 'number' && remainingDurability <= 0) {
            javelinEntity.remove();
            return;
        }

        if (durabilityComponent && typeof remainingDurability === 'number') {
            const newDamage = durabilityComponent.maxDurability - remainingDurability;
            durabilityComponent.damage = newDamage;
        }

        const inventory = playerWhoTriggered.getComponent("minecraft:inventory");
        if (inventory) {
            inventory.container.addItem(javelinItem);
        }

        javelinEntity.remove();

    } catch (e) {
        // ...
    }
});