import { world, system } from "@minecraft/server"; // ✔️ Thêm system

// Định nghĩa Custom Component với ID: fv:vanguard_marshals_diamorite_sword_component
const VanguardMarshalsDiamoriteSwordComponent = {
    /**
     * Xử lý khi vật phẩm gắn component này đánh trúng một thực thể.
     */
    onHitEntity({ hitEntity, attackingEntity }) {

        // KIỂM TRA AN TOÀN
        if (!attackingEntity || !hitEntity) {
            return;
        }

        // --- 1. Cơ chế 30% - Nhận hiệu ứng Kháng cự (Resistance) ---
        const resistanceChance = 0.30;
        if (Math.random() < resistanceChance) {
            const resistanceId = "resistance";
            const durationTicks = 100; // 5s

            attackingEntity.addEffect(resistanceId, durationTicks, { amplifier: 1, showParticles: true });
            // console.log(`[${attackingEntity.typeId}] đã nhận Kháng cự II.`);
        }

        // --- 2. Cơ chế 10% - Nhận hiệu ứng Hấp thụ (Absorption) CÓ ĐIỀU KIỆN ---
        const absorptionChance = 0.10;
        if (Math.random() < absorptionChance) {
            const absorptionId = "absorption";
            const hasAbsorption = attackingEntity.getEffect(absorptionId);

            if (!hasAbsorption) {
                const durationTicks = 600; // 30s
                attackingEntity.addEffect(absorptionId, durationTicks, { amplifier: 1, showParticles: true });
                // console.log(`[${attackingEntity.typeId}] đã nhận Hấp thụ II.`);
            }
        }

        // --- 3. Cơ chế 2% - Gây sát thương thêm và phát âm thanh ---
        const extraDamageChance = 0.02;
        const extraDamage = 150;

        if (Math.random() < extraDamageChance) {
            // applyDamage
            hitEntity.applyDamage(extraDamage);
            // console.log(`Gây ${extraDamage} sát thương thêm lên [${hitEntity.typeId}].`);

            const { x, y, z } = hitEntity.location;
            const dimension = hitEntity.dimension;

            // ✔️ SỬA LỖI ÂM THANH: Dùng runCommand đồng bộ thay vì Async
            try {
                dimension.runCommand(`playsound item.trident.thunder @a ${x} ${y} ${z} 6`);
                // console.log(`Executed playsound at position ${x}, ${y}, ${z}`);
            } catch (error) {
                // console.error(`Failed to execute playsound:`, error);
            }
        }
    }
};

// Đăng ký custom component fv:vanguard_marshals_diamorite_sword_component
// SỬA LỖI API: Dùng system.beforeEvents.startup
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent(
        "fv:vanguard_marshals_diamorite_sword_component",
        VanguardMarshalsDiamoriteSwordComponent
    );
});