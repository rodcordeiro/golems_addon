import { system, GameMode, EquipmentSlot } from "@minecraft/server";

system.beforeEvents.startup.subscribe((initEvent) => {
    initEvent.itemComponentRegistry.registerCustomComponent("fv:ancient_tome_use", {
        onUse(event) {
            const { itemStack, source: player } = event;

            // Kiểm tra player hợp lệ (Module 2.4.0: isValid không có ngoặc)
            if (!player || !player.isValid) return;

            // 1. Cộng thẳng 30 cấp độ cho người chơi
            player.addLevels(30);

            // 2. Hiệu ứng âm thanh tăng cấp (Tùy chọn)
            player.dimension.playSound("random.levelup", player.location, { volume: 1, pitch: 1 });

            // 3. Xử lý trừ 1 item (Chỉ trừ khi người chơi ở chế độ Sinh tồn/Phiêu lưu)
            if (player.getGameMode() !== GameMode.creative) {
                const equipment = player.getComponent("minecraft:equippable");
                if (equipment) {
                    const slot = equipment.getEquipmentSlot(EquipmentSlot.Mainhand);

                    if (itemStack.amount > 1) {
                        // Nếu item đang xếp chồng, giảm số lượng đi 1
                        itemStack.amount -= 1;
                        slot.setItem(itemStack);
                    } else {
                        // Nếu chỉ có 1 item, xóa item khỏi tay
                        slot.setItem(undefined);
                    }
                }
            }
        }
    });
});