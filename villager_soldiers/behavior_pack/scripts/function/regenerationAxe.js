import { world, system, EquipmentSlot } from "@minecraft/server";

function getHealPercentForItem(itemType) {
    switch (itemType) {
        case "fv:regeneration_axe": return 0.30;
        case "fv:regeneration_axe_lv2": return 0.40;
        case "fv:regeneration_axe_lv3": return 0.50;
        default: return null;
    }
}

world.afterEvents.entityHurt.subscribe((ev) => {
    const attacker = ev.damageSource?.damagingEntity;
    const damage = ev.damage;

    // Kiểm tra ban đầu
    if (!attacker || !damage || damage <= 0) return;
    // Kiểm tra isValid ngay từ đầu cho an toàn
    if (!attacker.isValid) return;

    system.run(() => {
        // QUAN TRỌNG: Sau 1 tick, attacker có thể đã chết/thoát game.
        // Phải kiểm tra isValid lần nữa trước khi getComponent
        if (!attacker.isValid) return;

        const equippable = attacker.getComponent("minecraft:equippable");
        if (!equippable) return;

        const mainHandSlot = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
        const item = mainHandSlot.getItem();

        if (!item) return;

        const percent = getHealPercentForItem(item.typeId);
        if (!percent) return;

        const health = attacker.getComponent("minecraft:health");
        if (!health) return;

        const amount = Math.floor(damage * percent);
        // Kiểm tra máu hiện tại < max mới hồi
        if (amount > 0 && health.currentValue < health.effectiveMax) {
            health.setCurrentValue(Math.min(health.currentValue + amount, health.effectiveMax));
        }
    });
});