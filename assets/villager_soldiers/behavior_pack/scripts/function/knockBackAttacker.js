import { world, system } from "@minecraft/server";

const MAX_DISTANCE = 2;
const H_FORCE = 5;
const V_FORCE = 0.3;
const FAMILY_NAME = "knockbackable";

// Hàm kiểm tra Family
function isKnockbackable(entity) {
    // Phải kiểm tra isValid trước khi getComponent
    if (!entity || !entity.isValid) return false;

    const comp = entity.getComponent("minecraft:type_family");
    if (!comp) return false;

    return comp.hasTypeFamily(FAMILY_NAME);
}

world.afterEvents.entityHitEntity.subscribe(event => {
    const attacker = event.damagingEntity; // Entity tấn công
    const target = event.hitEntity;       // Entity bị tấn công

    // 1. Kiểm tra tồn tại và isValid (Bắt buộc để không lỗi khi truy cập location)
    if (!attacker || !target) return;
    if (!attacker.isValid || !target.isValid) return;

    // 2. Kiểm tra điều kiện (Family)
    if (!isKnockbackable(attacker)) return;

    // 3. Tính toán khoảng cách
    const dx = target.location.x - attacker.location.x;
    const dz = target.location.z - attacker.location.z;

    // So sánh bình phương khoảng cách (tối ưu hơn Math.sqrt)
    if (dx * dx + dz * dz > MAX_DISTANCE * MAX_DISTANCE) return;

    // 4. Tính toán hướng đẩy
    const viewDir = attacker.getViewDirection();
    const mag = Math.hypot(viewDir.x, viewDir.z) || 1; // Tránh chia cho 0
    const dirX = viewDir.x / mag;
    const dirZ = viewDir.z / mag;

    // 5. Áp dụng Knockback an toàn
    system.run(() => {
        // Kiểm tra isValid lần cuối bên trong system.run
        if (target && target.isValid) {
            try {
                // SỬA LỖI: Chuyển về cú pháp 2 tham số chuẩn API hiện tại
                // Tham số 1: Vector {x, z} (Hướng * Lực)
                // Tham số 2: Lực dọc
                target.applyKnockback(
                    {
                        x: dirX * H_FORCE,
                        z: dirZ * H_FORCE
                    },
                    V_FORCE
                );
            } catch (e) {
                // Ignored
            }
        }
    });
});