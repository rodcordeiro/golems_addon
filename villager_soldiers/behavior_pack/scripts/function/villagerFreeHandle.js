import { world, system, EquipmentSlot } from "@minecraft/server";

console.warn("[FV-DEBUG] >>> VILLAGER HANDLE SCRIPT UPDATED <<<");

// --- HÀM LẤY EVENT BIOME (Dành cho lính thường) ---
function getVillagerEventSafe(target) {
    try {
        if (!target.isValid) return "fv:plains";
        const markComp = target.getComponent("minecraft:mark_variant");
        const val = markComp ? markComp.value : 0;
        const events = ["fv:plains", "fv:desert", "fv:jungle", "fv:savanna", "fv:snow", "fv:swamp", "fv:taiga"];
        return events[val] || "fv:plains";
    } catch (e) { return "fv:plains"; }
}

// --- HÀM THỰC THI SPAWN ---
function executeSpawn(dimension, spawnPos, eventName, target, player, equippableComp, entityTypeId) {
    system.run(() => {
        if (target.isValid) target.remove();
        try {
            // Thực hiện spawn với event được chỉ định
            dimension.spawnEntity(entityTypeId, spawnPos, { spawnEvent: eventName });
        } catch (err) {
            try { dimension.spawnEntity(entityTypeId, spawnPos); } catch (e) { }
        }

        // Trừ Item (Chỉ trừ nếu là người chơi dùng)
        try {
            if (player && player.isValid && equippableComp) {
                const item = equippableComp.getEquipment(EquipmentSlot.Mainhand);
                if (item && item.amount > 1) {
                    item.amount -= 1;
                    equippableComp.setEquipment(EquipmentSlot.Mainhand, item);
                } else {
                    equippableComp.setEquipment(EquipmentSlot.Mainhand, undefined);
                }
            }
        } catch (e) { }
    });
}

// --- XỬ LÝ TƯƠNG TÁC (INTERACT) ---
world.afterEvents.playerInteractWithEntity.subscribe((event) => {
    const { player, target } = event;

    if (!player.isValid || !target.isValid) return;
    if (target.typeId !== "minecraft:villager_v2") return;

    // Kiểm tra Item trên tay
    const eq = player.getComponent("minecraft:equippable");
    const item = eq?.getEquipment(EquipmentSlot.Mainhand);
    if (item?.typeId !== "fv:freehand_decree") return;

    try {
        if (target.hasComponent("minecraft:is_baby")) return;
        const fam = target.getComponent("minecraft:type_family");
        if (!fam) return;

        // Bỏ qua Nitwit/Unskilled trong phần interact (để OnHit xử lý)
        if (fam.hasTypeFamily("nitwit") || fam.hasTypeFamily("unskilled")) return;

        let finalEntityType = "fv:villager_free_handle";
        let spawnEvent = getVillagerEventSafe(target);

        // PHÂN LOẠI NGHỀ
        if (fam.hasTypeFamily("fletcher")) {
            finalEntityType = "fv:villager_ranged";
        } else if (fam.hasTypeFamily("weaponsmith")) {
            finalEntityType = "fv:villager_tanker";
        }
        // THÊM: Xử lý Healer từ Cleric
        else if (fam.hasTypeFamily("cleric")) {
            finalEntityType = "fv:villager_healer";
            spawnEvent = "minecraft:entity_spawned"; // Gán cứng event cho healer
        }

        const spawnPos = target.location;
        const dim = target.dimension;

        executeSpawn(dim, spawnPos, spawnEvent, target, player, eq, finalEntityType);

    } catch (e) { }
});

// --- XỬ LÝ KHI BỊ ĐÁNH (ON HIT) ---
world.afterEvents.entityHurt.subscribe((event) => {
    const { projectile, damageSource, target } = event;
    const player = damageSource.damagingEntity;

    if (!player || player.typeId !== "minecraft:player" || !player.isValid) return;
    if (!target.isValid || target.typeId !== "minecraft:villager_v2") return;

    // Kiểm tra Item trên tay
    const eq = player.getComponent("minecraft:equippable");
    const item = eq?.getEquipment(EquipmentSlot.Mainhand);
    if (item?.typeId !== "fv:freehand_decree") return;

    try {
        if (target.hasComponent("minecraft:is_baby")) return;
        const fam = target.getComponent("minecraft:type_family");
        if (!fam) return;

        let finalEntityType = "";
        let spawnEvent = "";

        // THÊM: Cleric bị đánh cũng thành Healer
        if (fam.hasTypeFamily("cleric")) {
            finalEntityType = "fv:villager_healer";
            spawnEvent = "minecraft:entity_spawned";
        }
        // Nitwit hoặc dân làng không nghề bị đánh thành lính tự do
        else if (fam.hasTypeFamily("nitwit") || fam.hasTypeFamily("unskilled")) {
            finalEntityType = "fv:villager_free_handle";
            spawnEvent = getVillagerEventSafe(target);
        }

        if (finalEntityType !== "") {
            const spawnPos = target.location;
            const dim = target.dimension;
            executeSpawn(dim, spawnPos, spawnEvent, target, player, eq, finalEntityType);
        }

    } catch (e) { }
});