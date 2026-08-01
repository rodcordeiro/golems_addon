import { world, system } from "@minecraft/server";

system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("fv:snow_bow_melee", {
        onHitEntity(event) {
            const attacker = event.attackingEntity;
            const hitEntity = event.hitEntity;
            const itemStack = event.itemStack;

            // Kiểm tra tồn tại và tính hợp lệ (isValid)
            if (!attacker || !hitEntity || !itemStack) return;
            if (!attacker.isValid || !hitEntity.isValid) return;

            // 1. Gây hiệu ứng Slowness
            try {
                if (hitEntity.isValid) {
                    const duration = 5 * 20;
                    const amplifier = 3;
                    hitEntity.addEffect("minecraft:slowness", duration, {
                        amplifier: amplifier,
                        showParticles: false
                    });
                }
            } catch (e) { }

            // 2. Xử lý Knockback (Đẩy lùi)
            if (!attacker.isValid) return;

            // TÍNH TOÁN VECTOR HƯỚNG (Target - Attacker)
            // Cách này chính xác hơn dùng ViewDirection vì nó đẩy quái ra xa người chơi bất kể góc nhìn
            const locAttacker = attacker.location;
            const locTarget = hitEntity.location;

            let dirX = locTarget.x - locAttacker.x;
            let dirZ = locTarget.z - locAttacker.z;

            // Chuẩn hóa Vector
            const magnitude = Math.sqrt(dirX * dirX + dirZ * dirZ);
            if (magnitude < 0.0001) {
                dirX = 1; dirZ = 0;
            } else {
                dirX /= magnitude;
                dirZ /= magnitude;
            }

            // Cấu hình lực đẩy
            const horizontalForce = 0.5 * 10; // Lực ngang (5.0)
            const verticalForce = 0.5;        // Lực dọc

            // Đẩy vào system.run
            system.run(() => {
                if (hitEntity.isValid) {
                    try {
                        // SỬA LỖI: Áp dụng cú pháp chuẩn 2 tham số
                        // Tham số 1: Vector {x, z} (Hướng * Lực)
                        // Tham số 2: Lực dọc (number)
                        hitEntity.applyKnockback(
                            {
                                x: dirX * horizontalForce,
                                z: dirZ * horizontalForce
                            },
                            verticalForce
                        );
                    } catch (e) {
                        // Bỏ qua nếu lỗi
                    }
                }
            });
        }
    });
});