import {
    world,
    Entity,
    EntityTypeFamilyComponent,
} from '@minecraft/server';

// Định danh thực thể và Properties
const TARGET_ENTITY_ID = "fv:villager_tanker";
const XP_PROPERTY = "fv:xp";
const LEVEL_PROPERTY = "fv:level";
const MAX_LEVEL = 4;
const MAX_XP_VALUE = 100;
const LEVEL_UP_XP = 100;
const CHAMPION_EVENT = "fv:become_champion";

// KHÓA LOCALIZATION MỚI (theo yêu cầu của bạn)
const LVL_UP_KEY = "mess.level.tanker";
const CHAMP_REACHED_KEY = "mess.become.champion";

// Bảng giá trị XP dựa trên Family của thực thể bị giết (Giữ nguyên)
const XP_FAMILY_MAP = new Map([
    ["pillager", 3],
    ["vindicator", 4],
    ["evocation_illager", 5],
    ["boss", 50],
    ["mainboss", 100],
]);

/**
 * Hàm kiểm tra và cập nhật level cho thực thể tanker.
 */
function checkLevelUp(tanker, currentXP) {
    let currentLevel = Number(tanker.getProperty(LEVEL_PROPERTY)) || 0;
    currentLevel = Math.min(MAX_LEVEL, Math.floor(currentLevel));

    // Logic LÊN CẤP (Level < 4)
    if (currentLevel < MAX_LEVEL && currentXP >= LEVEL_UP_XP) {

        const newLevel = currentLevel + 1;
        const remainingXP = currentXP - LEVEL_UP_XP;

        // Sửa lỗi TYPE ERROR: Đảm bảo số nguyên
        tanker.setProperty(LEVEL_PROPERTY, Math.floor(newLevel));
        tanker.setProperty(XP_PROPERTY, Math.floor(remainingXP));

        // --- GỬI TIN NHẮN LOCALIZATION TỐI GIẢN (CHỈ DÙNG translate + with) ---
        world.sendMessage({
            "translate": LVL_UP_KEY,
            "with": [newLevel.toString()] // Chỉ truyền số cấp mới
        });
        // -----------------------------------------------------------------------

        checkLevelUp(tanker, remainingXP);

        // Logic CẤP TỐI ĐA (Level 4)
    } else if (currentLevel === MAX_LEVEL && currentXP >= LEVEL_UP_XP) {

        tanker.triggerEvent(CHAMPION_EVENT);

        // --- GỬI TIN NHẮN LOCALIZATION TỐI GIẢN (CHỈ DÙNG translate) ---
        world.sendMessage({
            "translate": CHAMP_REACHED_KEY
        });
        // -----------------------------------------------------------------

        tanker.setProperty(XP_PROPERTY, 0);
    }
}


/**
 * Lắng nghe sự kiện sau khi một thực thể bị tiêu diệt. (Giữ nguyên)
 */
world.afterEvents.entityDie.subscribe((event) => {
    const killedEntity = event.deadEntity;
    const killer = event.damageSource.damagingEntity;

    if (killer && killer.typeId === TARGET_ENTITY_ID) {

        let xpGained = 2; // XP mặc định

        try {
            const familyComponent = killedEntity.getComponent("minecraft:type_family");
            if (familyComponent) {
                for (const [familyTag, bonusXP] of XP_FAMILY_MAP.entries()) {
                    if (familyComponent.hasTypeFamily(familyTag)) {
                        xpGained = bonusXP;
                        break;
                    }
                }
            }
        } catch (e) {
            console.error(`Lỗi khi truy cập Family Component: ${e}`);
        }

        let currentXP = Number(killer.getProperty(XP_PROPERTY)) || 0;
        const totalXPAfterKill = currentXP + xpGained;

        const xpToSet = Math.min(MAX_XP_VALUE, Math.floor(totalXPAfterKill));
        killer.setProperty(XP_PROPERTY, xpToSet);

        // Ghi log (Không đổi)
        const killedId = killedEntity.typeId;
        const currentLevel = Number(killer.getProperty(LEVEL_PROPERTY));
        console.warn(`[XP LOG] ${TARGET_ENTITY_ID} killed ${killedId}. XP gained: ${xpGained}. Total XP: ${totalXPAfterKill}. Level: ${currentLevel}`);

        checkLevelUp(killer, totalXPAfterKill);
    }
});

console.warn("Script đã được cập nhật, sử dụng cú pháp Localization Key đơn giản nhất.");