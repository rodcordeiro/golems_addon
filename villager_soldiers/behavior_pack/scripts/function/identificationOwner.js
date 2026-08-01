import { world, EquipmentSlot } from "@minecraft/server";

world.afterEvents.playerInteractWithEntity.subscribe(({ player, target }) => {

    // Kiểm tra isValid (Module 2.4.0 không có ngoặc)
    if (!target || !target.isValid) return;
    if (!player || !player.isValid) return;

    // 1. Kiểm tra Tamed
    if (!target.hasComponent("minecraft:is_tamed")) return;

    // 2. Lấy component Equippable
    const equip = player.getComponent("minecraft:equippable");
    if (!equip) return;

    const mainHandSlot = equip.getEquipmentSlot(EquipmentSlot.Mainhand);
    const mainHand = mainHandSlot.getItem();

    // 3. Kiểm tra thẻ bài
    if (!mainHand || mainHand.typeId !== "fv:identification_soldier_card") return;

    // 4. Logic Gắn Tag & Đổi Tên
    const ownerTag = `owner_${player.name}_${player.id}`;
    const newName = `${player.name} soldier`;

    if (target.isValid) {
        // --- PHẦN THÊM: Nếu lính chưa có tag này (bị thiếu), thì thêm vào ---
        if (!target.getTags().includes(ownerTag)) {
            target.addTag(ownerTag);
        }

        // Đổi tên (Cập nhật lại tên nếu cần)
        target.nameTag = newName;

        // Message theo đúng định dạng bạn yêu cầu
        player.sendMessage({
            translate: "message.soldier.assign_owner",
            with: ["§a✔", newName, target.typeId]
        });
    }
});