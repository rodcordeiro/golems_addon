import { world, system } from "@minecraft/server";

const DIMENSIONS = ["overworld", "nether", "the_end"]; // sửa/ thêm nếu bạn có dimension custom
const INTERVAL = 1; // ticks (1 = mỗi tick). Thay nếu quá spam.

system.runInterval(() => {
    for (const dimName of DIMENSIONS) {
        let dim;
        try {
            dim = world.getDimension(dimName);
        } catch {
            world.sendMessage(`[Kiểmtra] Dimension "${dimName}" không tồn tại.`);
            continue;
        }

        // Lấy tất cả pillager trong dimension
        const pillagers = dim.getEntities({ type: "minecraft:pillager" });
        for (const p of pillagers) {
            // Bước 0: entity có hợp lệ không
            if (!p.isValid()) {
                world.sendMessage(`[Kiểmtra] Pillager ${p.id} không hợp lệ (invalid).`);
                continue;
            }
            world.sendMessage(`[Kiểmtra] Bắt đầu kiểm tra Pillager ${p.id} ở ${dimName}.`);

            // Bước 1: lấy property (KHÔNG phải dynamic)
            let val;
            try {
                val = p.getProperty("fv:day");
            } catch (err) {
                world.sendMessage(`[Kiểmtra] Lỗi khi gọi getProperty trên ${p.id}: ${err}`);
                continue;
            }

            // Bước 2: kiểm tra tồn tại / undefined
            if (val === undefined) {
                world.sendMessage(`[Kiểmtra] Pillager ${p.id} KHÔNG có property "fv:day" (undefined).`);
                continue;
            }

            world.sendMessage(`[Kiểmtra] Pillager ${p.id} có property "fv:day" = ${val}.`);

            // Bước 3: đặt nameTag bằng giá trị
            try {
                p.nameTag = String(val);
                world.sendMessage(`[Kiểmtra] Đã đặt nameTag = "${val}" cho Pillager ${p.id}.`);
            } catch (err) {
                world.sendMessage(`[Kiểmtra] Lỗi khi đặt nameTag cho ${p.id}: ${err}`);
            }
        }
    }
}, INTERVAL);
