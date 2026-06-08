import {
    system,
    world,
    EquipmentSlot
} from "@minecraft/server";

// --- CẤU HÌNH ---
// SỬA: Thêm tiền tố minecraft: cho ID hiệu ứng
const EFFECT_ID = "minecraft:absorption";
const EFFECT_DURATION_HIT = 1 * 60 * 20; // 1 phút
const CHANCE_TO_ACTIVATE = 0.30; // 30%

// SỬA: Thêm tiền tố minecraft: cho danh sách hiệu ứng xấu
const BAD_EFFECTS = [
    "minecraft:blindness", "minecraft:nausea", "minecraft:hunger",
    "minecraft:poison", "minecraft:slowness", "minecraft:weakness",
    "minecraft:wither", "minecraft:mining_fatigue"
];

const WARLORD_ARMOR_IDS = {
    [EquipmentSlot.Head]: "fv:imperial_warlord_helmet",
    [EquipmentSlot.Chest]: "fv:imperial_warlord_chestplate",
    [EquipmentSlot.Legs]: "fv:imperial_warlord_leggings",
    [EquipmentSlot.Feet]: "fv:imperial_warlord_boots"
};

const COMMANDER_ARMOR_IDS = {
    [EquipmentSlot.Head]: "fv:imperial_commander_helmet",
    [EquipmentSlot.Chest]: "fv:imperial_commander_chestplate",
    [EquipmentSlot.Legs]: "fv:imperial_commander_leggings",
    [EquipmentSlot.Feet]: "fv:imperial_commander_boots"
};

const ARMOR_SLOTS = [
    EquipmentSlot.Head, EquipmentSlot.Chest, EquipmentSlot.Legs, EquipmentSlot.Feet
];

// --- HÀM KIỂM TRA GIÁP (ĐÃ FIX LỖI COMPONENT) ---
function checkFullArmorSetById(player, armorIdList) {
    try {
        // SỬA QUAN TRỌNG: Phải dùng "minecraft:equippable"
        const equippable = player.getComponent("minecraft:equippable");
        if (!equippable) return false;

        for (const slot of ARMOR_SLOTS) {
            const item = equippable.getEquipment(slot);
            const requiredId = armorIdList[slot];

            // Kiểm tra item
            if (!item || item.typeId !== requiredId) {
                return false;
            }
        }
        return true;
    } catch (e) {
        return false;
    }
}

// -----------------------------------------------------------------------
// TÍNH NĂNG 1: MIỄN NHIỄM HIỆU ỨNG BẤT LỢI
// -----------------------------------------------------------------------
system.runInterval(() => {
    for (const player of world.getPlayers()) {
        if (!player.isValid) continue;

        const hasWarlordSet = checkFullArmorSetById(player, WARLORD_ARMOR_IDS);
        const hasCommanderSet = checkFullArmorSetById(player, COMMANDER_ARMOR_IDS);

        const hasNoBadEffectAbility = hasWarlordSet || hasCommanderSet;

        if (hasNoBadEffectAbility) {
            const currentEffects = player.getEffects();
            for (const effect of currentEffects) {
                // effect.typeId trong bản mới sẽ trả về "minecraft:poison"
                if (BAD_EFFECTS.includes(effect.typeId)) {
                    player.removeEffect(effect.typeId);
                }
            }
        }
    }
}, 5);


// -----------------------------------------------------------------------
// TÍNH NĂNG 2: HẤP THỤ TIM VÀNG (ABSORPTION) - KHI BỊ ĐÁNH
// -----------------------------------------------------------------------
world.afterEvents.entityHurt.subscribe((event) => {
    const { hurtEntity } = event;

    // Kiểm tra an toàn
    if (!hurtEntity.isValid) return;

    // SỬA: Kiểm tra kiểu player bằng typeId thay vì instanceof (An toàn hơn)
    if (hurtEntity.typeId !== "minecraft:player") return;

    const player = hurtEntity;
    const hasCommanderSet = checkFullArmorSetById(player, COMMANDER_ARMOR_IDS);

    // 1. Kiểm tra mặc set Commander
    if (!hasCommanderSet) return;

    // 2. Kiểm tra đã có hiệu ứng chưa (Dùng string ID trực tiếp)
    const hasAbsorption = player.getEffect(EFFECT_ID);
    if (hasAbsorption) return;

    // 3. Tính xác suất 30%
    if (Math.random() < CHANCE_TO_ACTIVATE) {
        // Áp dụng hiệu ứng
        player.addEffect(EFFECT_ID, EFFECT_DURATION_HIT, {
            amplifier: 0,
            showParticles: true
        });

        // Gửi tin nhắn debug (có thể xóa sau này)
        player.sendMessage(`§a[ABSORP] Kích hoạt Tim Vàng (30%) trong 1 phút.`);
    }
});