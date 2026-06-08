import { world } from "@minecraft/server";

// Danh sách các từ khóa trong ID block mà lính KHÔNG ĐƯỢC phép spawn lên trên
// (Giường là nguyên nhân chính gây kẹt đầu vào trần nhà)
const UNSAFE_BLOCKS = [
    "bed",      // Chặn tất cả các loại giường (minecraft:yellow_bed, red_bed...)
    "carpet",   // (Tùy chọn) Chặn thảm để tránh lơ lửng lạ
    "slab"      // (Tùy chọn) Chặn slab nếu trần nhà quá thấp
];

// Hàm kiểm tra xem block có an toàn để đứng lên không
function isUnsafeBlock(block) {
    if (!block) return true;
    const typeId = block.typeId;

    // Kiểm tra xem ID của block có chứa từ khóa cấm không (ví dụ "bed")
    return UNSAFE_BLOCKS.some(unsafe => typeId.includes(unsafe));
}

// Lắng nghe sự kiện DataDrivenEntityTrigger
world.afterEvents.dataDrivenEntityTrigger.subscribe(({ eventId, entity }) => {
    // Chỉ xử lý với event "minecraft:spawn_from_village" và đúng entity là minecraft:villager_v2
    if (eventId !== "minecraft:spawn_from_village" || entity.typeId !== "minecraft:villager_v2") return;

    const { location, dimension } = entity;

    // Kiểm tra isValid cho an toàn
    if (!entity.isValid || !location || !dimension) return;

    spawnRandomCustomVillager(dimension, location);
});

// Hàm spawn 1 trong 2 thực thể custom ngẫu nhiên gần Villager
function spawnRandomCustomVillager(dimension, location) {
    const mobTypes = ["fv:villager_vanguard", "fv:villager_ranged"];
    const randomMob = mobTypes[Math.floor(Math.random() * mobTypes.length)];

    // Tăng số lần thử lên 15 để dễ tìm vị trí hơn nếu nhà quá chật
    for (let attempt = 0; attempt < 15; attempt++) {
        const offsetX = Math.random() * 10 - 5;
        const offsetZ = Math.random() * 10 - 5;

        // Làm tròn tọa độ để lấy tâm block, giúp kiểm tra block chính xác hơn
        const spawnX = Math.floor(location.x + offsetX) + 0.5;
        const spawnZ = Math.floor(location.z + offsetZ) + 0.5;
        const spawnY = Math.floor(location.y);

        const blockBelow = dimension.getBlock({ x: spawnX, y: spawnY - 1, z: spawnZ });
        const blockAt = dimension.getBlock({ x: spawnX, y: spawnY, z: spawnZ });
        const blockAbove = dimension.getBlock({ x: spawnX, y: spawnY + 1, z: spawnZ });

        // Kiểm tra tồn tại block
        if (!blockAt || !blockAbove || !blockBelow) continue;

        // 1. Kiểm tra không gian trống (Phải là Air)
        const isAirAt = blockAt.typeId === "minecraft:air" || blockAt.typeId === "minecraft:light_block";
        const isAirAbove = blockAbove.typeId === "minecraft:air" || blockAbove.typeId === "minecraft:light_block";

        // 2. Kiểm tra đất nền (Không được là Air)
        const hasGround = blockBelow.typeId !== "minecraft:air";

        // 3. QUAN TRỌNG: Kiểm tra xem block bên dưới HOẶC block đang đứng có phải là Giường không
        // (Đôi khi chân thực thể tính là đang đứng TRONG block giường)
        const isSafeFromBed = !isUnsafeBlock(blockBelow) && !isUnsafeBlock(blockAt);

        if (isAirAt && isAirAbove && hasGround && isSafeFromBed) {
            try {
                dimension.spawnEntity(randomMob, { x: spawnX, y: spawnY, z: spawnZ });
                // console.log(`Spawned ${randomMob} at safe location.`);
                return;
            } catch (e) {
                console.warn(`Failed to spawn ${randomMob}: ${e}`);
            }
        }
    }

    // console.warn("Không tìm được vị trí spawn lính phù hợp (đã né giường).");
}