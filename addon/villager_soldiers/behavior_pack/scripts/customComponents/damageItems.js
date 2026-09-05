import {
    world,
    system, // ✔️ Thêm system
    ItemComponentRegistry,
    Player,
    EquipmentSlot,
    GameMode
} from '@minecraft/server';

// Hàm tiện ích để xử lý việc trừ độ bền.
// Hàm này được dùng chung cho tất cả các sự kiện.
function applyDamage(source) {
    // Lấy slot tay chính
    const equippable = source.getComponent("minecraft:equippable");
    if (!equippable) return;

    const mainhand = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
    if (!mainhand.hasItem()) return;

    // Bỏ qua nếu người chơi ở chế độ sáng tạo
    if (source.getGameMode() === GameMode.Creative) return;

    const itemStack = mainhand.getItem();
    const durability = itemStack.getComponent("minecraft:durability");
    if (!durability) return;

    // Tính toán dựa trên bùa chú Unbreaking
    const enchantable = itemStack.getComponent("minecraft:enchantable");
    const unbreakingLevel = enchantable?.getEnchantment("unbreaking")?.level;
    const damageChance = durability.getDamageChance(unbreakingLevel) / 100;

    if (Math.random() > damageChance) return;

    // Giảm độ bền
    const shouldBreak = durability.damage + 1 >= durability.maxDurability;

    if (shouldBreak) {
        mainhand.setItem(undefined);
        source.playSound("random.break");
    } else {
        durability.damage++;
        mainhand.setItem(itemStack);
    }
}

// Logic cho custom component onUse
const onUseComponentLogic = {
    onUse({ source }) {
        if (source instanceof Player) {
            applyDamage(source);
        }
    }
};

// Logic cho custom component onUseComplete
const onUseCompleteComponentLogic = {
    onUseComplete({ source }) {
        if (source instanceof Player) {
            applyDamage(source);
        }
    }
};

// Logic cho custom component onUseOn
const onUseOnComponentLogic = {
    onUseOn({ source }) {
        if (source instanceof Player) {
            applyDamage(source);
        }
    }
};

// Logic cho custom component onMineBlock
const onMineBlockComponentLogic = {
    onMineBlock({ source }) {
        if (source instanceof Player) {
            applyDamage(source);
        }
    }
};

// Logic cho custom component onHitEntity
const onHitEntityComponentLogic = {
    onHitEntity({ attackingEntity }) {
        if (attackingEntity instanceof Player) {
            applyDamage(attackingEntity);
        }
    }
};

// SỬA LỖI API: Dùng system.beforeEvents.startup thay vì world.beforeEvents.worldInitialize
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("fv:durability_loss_on_use", onUseComponentLogic);
    itemComponentRegistry.registerCustomComponent("fv:durability_loss_on_use_complete", onUseCompleteComponentLogic);
    itemComponentRegistry.registerCustomComponent("fv:durability_loss_on_use_on", onUseOnComponentLogic);
    itemComponentRegistry.registerCustomComponent("fv:durability_loss_on_mine_block", onMineBlockComponentLogic);
    itemComponentRegistry.registerCustomComponent("fv:durability_loss_on_hit_entity", onHitEntityComponentLogic);
});