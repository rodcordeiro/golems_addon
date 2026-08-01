import { world } from "@minecraft/server";

world.afterEvents.itemUse.subscribe(event => {
    const player = event.source;
    const item = event.itemStack;
    if (!player || !item) return;

    // Chỉ xử lý khi dùng item với typeId là parachute của bạn
    if (item.typeId !== "fv:parachute") return;

    // Kiểm tra player đang cưỡi một thực thể?
    const ridingComp = player.getComponent("minecraft:riding");
    if (ridingComp && ridingComp.isValid && ridingComp.entityRidingOn) {
        player.sendMessage({ translate: "message.cannot_use_while_riding" });
        return;
    }

    // Kiểm tra player đang “chân chạm đất” hoặc trong chất lỏng?
    const loc = player.location;
    const blockUnder = player.dimension.getBlock({
        x: Math.floor(loc.x),
        y: Math.floor(loc.y - 0.1),
        z: Math.floor(loc.z)
    });
    if (blockUnder && blockUnder.typeId !== "minecraft:air") {
        player.sendMessage({ translate: "message.player_on_ground" });
        return;
    }
    const blockAt = player.dimension.getBlock({
        x: Math.floor(loc.x),
        y: Math.floor(loc.y),
        z: Math.floor(loc.z)
    });
    if (blockAt && (blockAt.typeId.includes("water") || blockAt.typeId.includes("lava"))) {
        player.sendMessage({ translate: "message.player_on_ground" });
        return;
    }

    // Lấy hướng nhìn của player
    const viewDir = player.getViewDirection(); // Vector3 { x, y, z }

    // Spawn parachute tại vị trí player
    const parachuteEntity = player.dimension.spawnEntity("fv:parachute", loc);

    // Tính góc quay (yaw, pitch) để parachute nhìn theo hướng player
    // công thức:
    const yaw = Math.atan2(viewDir.x, viewDir.z) * (180 / Math.PI);
    const pitch = Math.asin(viewDir.y) * (180 / Math.PI);
    parachuteEntity.setRotation({ x: pitch, y: yaw }); // setRotation dùng Vector2 { x:pitch, y:yaw } theo tài liệu :contentReference[oaicite:0]{index=0}

    // Kích hoạt event từ player
    parachuteEntity.triggerEvent("fv:from_player");

    // Trừ độ bền item
    const durability = item.getComponent("minecraft:durability");
    if (durability) {
        durability.damage += 1;
        if (durability.damage >= durability.maxDurability) {
            const inv = player.getComponent("minecraft:inventory");
            if (inv && inv.container) {
                inv.container.setItem(event.slot, undefined);
            }
        }
    }
});
