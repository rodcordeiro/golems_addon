import { world, system } from "@minecraft/server";

// Sử dụng system.beforeEvents.startup cho API 2.4.0
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("fv:team_call_horn", {
        onUse(event) {
            const player = event.source;
            if (!player || !player.isValid) return;

            // Lấy các thông tin cần thiết trước
            const origin = player.location;
            const tag = `owner_${player.name}_${player.id}`;
            const dimension = player.dimension;

            // BẮT BUỘC: Dùng system.run để thoát khỏi chế độ Read-Only của onUse
            // Nếu không có system.run, player.runCommand sẽ báo lỗi "read-only mode"
            system.run(() => {
                // Kiểm tra lại player còn tồn tại không
                if (!player.isValid) return;

                // 1. Gắn tag (Cần quyền Ghi)
                player.addTag(tag);

                // 2. Tìm entity xung quanh
                const nearby = dimension.getEntities({
                    location: origin,
                    maxDistance: 60,
                    tags: [tag],
                    families: ["irongolem", "can_tp"],
                    propertyOptions: [
                        { propertyId: "fv:tamed", value: { equals: true } }
                    ]
                });

                // 3. Teleport (Cần quyền Ghi)
                for (const ent of nearby) {
                    if (ent.isValid) ent.teleport(origin);
                }

                // 4. Chạy lệnh âm thanh (Cần quyền Ghi - Synchronous)
                try {
                    // Dùng đúng API: player.runCommand(string)
                    player.runCommand(
                        `playsound villager_call_horn @a ${origin.x} ${origin.y} ${origin.z} 4`
                    );
                } catch (e) {
                    // runCommand sẽ throw error nếu lệnh sai cú pháp hoặc không thực hiện được
                    // Ta bắt lỗi để không crash script
                }
            });
        }
    });
});