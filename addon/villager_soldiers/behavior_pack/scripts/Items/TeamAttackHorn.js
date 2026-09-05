// teamAttackHorn.js
import { world, system, Player } from "@minecraft/server";

// SỬA LỖI API: Thay thế world.beforeEvents.worldInitialize bằng system.beforeEvents.startup
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("fv:team_attack_horn", {
        onUse(event) {
            const player = event.source;
            // Đảm bảo đây là người chơi và là một thực thể hợp lệ
            if (!(player instanceof Player) || !player.isValid) return;

            const origin = player.location;
            const targetTag = `owner_${player.name}_${player.id}`;

            // Thêm tag tạm thời cho người chơi
            player.addTag(targetTag);

            let targetPropertyModeValue = false; // Giá trị để lọc entity
            let setPropertyToValue = true; // Giá trị để đặt mới

            // --- Xác định chế độ dựa trên trạng thái sneaking ---
            if (player.isSneaking) {
                targetPropertyModeValue = true;
                setPropertyToValue = false;
            } else {
                targetPropertyModeValue = false;
                setPropertyToValue = true;
            }

            // Lấy các thực thể xung quanh với các điều kiện lọc
            const nearbyEntities = player.dimension.getEntities({
                location: origin,
                maxDistance: 60,
                families: ["irongolem"],
                tags: [targetTag],
                propertyOptions: [
                    { propertyId: "fv:kill_player_mode", value: { equals: targetPropertyModeValue } }
                ]
            });

            for (const ent of nearbyEntities) {
                if (ent.isValid && ent.hasComponent("minecraft:is_tamed")) {
                    try {
                        ent.setProperty("fv:kill_player_mode", setPropertyToValue);
                    } catch (e) {
                        console.error(`Failed to set property for entity ${ent.id}: ${e}`);
                    }
                }
            }

            // Loại bỏ tag tạm thời
            system.runTimeout(() => {
                if (player.isValid) {
                    player.removeTag(targetTag);
                }
            }, 5);

            // SỬA LỖI COMMAND: Dùng system.run + player.runCommand (Sync)
            system.run(() => {
                if (player.isValid) {
                    try {
                        player.runCommand(
                            `playsound villager_call_horn @a ${origin.x} ${origin.y} ${origin.z} 4`
                        );
                    } catch (e) {
                        console.error(`Failed to play sound: ${e}`);
                    }
                }
            });
        }
    });
});