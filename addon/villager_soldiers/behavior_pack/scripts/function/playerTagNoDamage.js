import { world, system } from "@minecraft/server";

// Danh sách các tag faction hợp lệ
const colorTags = [
    "blue", "red", "grey", "yellow", "green", "black", "brown",
    "white", "purple", "cyan", "lime", "pink", "orange", "light_blue"
];

world.afterEvents.entityHurt.subscribe((event) => {
    const { hurtEntity: player, damage, damageSource } = event;

    // 1. KIỂM TRA AN TOÀN (Bắt buộc cho module 2.4.0)
    // Nếu entity bị đánh không hợp lệ (đã chết/mất kết nối), dừng ngay.
    if (!player || !player.isValid) return;

    // Chỉ áp dụng cho người chơi
    if (player.typeId !== "minecraft:player") return;

    const damager = damageSource.damagingEntity;

    // 2. Kiểm tra Damager tồn tại và hợp lệ
    if (!damager || !damager.isValid) return;

    // 3. Kiểm tra Family (Dùng string "minecraft:type_family" cho an toàn)
    const famComp = damager.getComponent("minecraft:type_family");
    if (!famComp || !famComp.hasTypeFamily("irongolem")) return;

    const playerTags = player.getTags();
    const damagerTags = damager.getTags();

    // Biến xác định có cần "miễn sát thương" không
    let isFriendlyFire = false;

    // --- ƯU TIÊN 1: CHECK OWNER ---
    const ownerTag = playerTags.find(tag => tag.startsWith("owner_") && damagerTags.includes(tag));
    if (ownerTag) {
        isFriendlyFire = true;
    }
    // --- ƯU TIÊN 2: CHECK FACTION ---
    else {
        const factionTag = colorTags.find(t => playerTags.includes(t) && damagerTags.includes(t));
        if (factionTag) {
            isFriendlyFire = true;
        }
    }

    // --- XỬ LÝ NẾU LÀ ĐỒNG ĐỘI ---
    if (isFriendlyFire) {
        // Vì đây là AfterEvent (chuyện đã rồi), ta phải dùng system.run để xử lý hồi phục ở tick tiếp theo
        // Điều này giúp tránh xung đột dữ liệu khi entity đang trong trạng thái bị thương
        system.run(() => {
            // Kiểm tra lại lần nữa vì sau 1 tick mọi thứ có thể thay đổi
            if (!player.isValid || !damager.isValid) return;

            // 1. Hồi lại máu (Bù lại số damage vừa nhận)
            const hpComp = player.getComponent("minecraft:health");
            if (hpComp) {
                // Tính toán máu mới: Máu hiện tại + Damage đã nhận (nhưng không quá Max)
                // Lưu ý: Lúc này player đã bị trừ máu rồi, nên cộng vào là huề.
                const newHp = Math.min(hpComp.currentValue + damage, hpComp.effectiveMax);
                hpComp.setCurrentValue(newHp);
            }

            // 2. Triệt tiêu Knockback (Quán tính bị đẩy lùi)
            // Teleport Player về đúng vị trí hiện tại để stop quán tính bay
            player.teleport(player.location, {
                dimension: player.dimension,
                rotation: player.getRotation(),
                checkForBlocks: false,
                keepVelocity: false // Quan trọng: Xóa bỏ vận tốc đẩy
            });

            // 3. Đẩy lùi con Golem ra (như code cũ của bạn)
            try {
                // Tính hướng từ Player -> Golem để đẩy Golem ra xa
                const pushDir = {
                    x: damager.location.x - player.location.x,
                    z: damager.location.z - player.location.z
                };

                // Chuẩn hóa vector (tùy chọn, ở đây dùng trực tiếp cũng được nhưng applyKnockback cần cẩn thận)
                damager.applyKnockback(pushDir.x, pushDir.z, 1.5, 0.5);
            } catch (e) {
                // Bỏ qua lỗi nếu Golem đang kháng knockback
            }
        });
    }
});