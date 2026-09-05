import { world, EntityInitializationCause } from "@minecraft/server";

// Cấu hình giới hạn MAX theo JSON của bạn
const MAX_DAY_IN_JSON = 500;

world.afterEvents.entitySpawn.subscribe((event) => {
    const { entity, cause } = event;

    // 1. Chỉ chạy khi Entity được SPAWN mới
    if (cause !== EntityInitializationCause.Spawned) {
        return;
    }

    // 2. Kiểm tra tính hợp lệ
    if (!entity || !entity.isValid) return;

    try {
        // 3. Kiểm tra xem Entity có property 'fv:day' không
        const val = entity.getProperty("fv:day");
        if (val === undefined) return;

        // 4. Lấy ngày hiện tại
        const currentDay = world.getDay();

        // 5. [QUAN TRỌNG] Giới hạn giá trị để không vượt quá range trong JSON
        // Nếu ngày > 500, nó sẽ lấy 500. Nếu < 500, nó lấy ngày thực tế.
        const safeDay = Math.min(currentDay, MAX_DAY_IN_JSON);

        entity.setProperty("fv:day", safeDay);

        // Debug nếu cần
        // console.log(`Set day: ${safeDay} for ${entity.typeId}`);

    } catch (e) {
        // Bỏ qua nếu có lỗi bất ngờ
    }
});