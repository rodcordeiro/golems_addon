import {
    world
} from '@minecraft/server';

const KILLER_ENTITY_ID = "fv:villager_melee";

world.afterEvents.entityDie.subscribe((event) => {

    const killedEntity = event.deadEntity;
    const killer = event.damageSource.damagingEntity;

    if (killer && killer.typeId === KILLER_ENTITY_ID) {

        const killedEntityName = killedEntity.typeId;

        // 1. Định nghĩa key ngôn ngữ cho cả Kẻ Giết và Thực thể bị giết
        const killerKey = `entity.${KILLER_ENTITY_ID}.name`;
        const killedKey = `entity.${killedEntityName}.name`;

        // 2. TẠO CẤU TRÚC MESSAGE ARRAY/OBJECT
        // Cấu trúc này buộc Minecraft dịch các key 'translate'
        const chatMessage = [
            { translate: killerKey }, // Key 1: Tên Kẻ Giết (sẽ được dịch)
            " đã giết ",
            { translate: killedKey }  // Key 2: Tên Thực thể bị giết (sẽ được dịch)
        ];

        // 3. Gửi tin nhắn dưới dạng đối tượng/array
        // Trong 1.19.0, nếu world.sendMessage(array) không hoạt động, 
        // bạn cần kiểm tra xem hàm này có hỗ trợ cú pháp 'rawtext' hay không.
        world.sendMessage(chatMessage);

        console.warn(`[SUCCESS] Tin nhắn đã được gửi dưới dạng Localization Array.`);
    }
});