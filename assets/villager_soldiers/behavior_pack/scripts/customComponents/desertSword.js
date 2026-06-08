import { world, system } from "@minecraft/server"; // ✔️ Thêm system

/**
 * 🛠 TUỲ CHỈNH DỄ DÀNG:
 * - Đổi "fv:giant_sword_component" thành tên component khác
 * - Sửa `TIER_CONFIG` để định nghĩa tier cho item mới
 */
const COMPONENT_ID = "fv:desert_sword_component";

// ← TÙY BIẾN: Danh sách tier.
const TIER_CONFIG = [
    { tag: "minecraft:copper_tier", chance: 0.10, amp: 0, extraTime: 0 },
    { tag: "minecraft:gold_tier", chance: 0.08, amp: 0, extraTime: 0 },
    { tag: "minecraft:iron_tier", chance: 0.10, amp: 1, extraTime: 0 },
    { tag: "fv:steel_tier", chance: 0.20, amp: 1, extraTime: 0 },
    { tag: "fv:illasteel_tier", chance: 0.20, amp: 1, extraTime: 0 },
    { tag: "minecraft:diamond_tier", chance: 0.30, amp: 2, extraTime: 0 },
    { tag: "minecraft:netherite_tier", chance: 0.40, amp: 2, extraTime: 5 },
    { tag: "fv:illudiamondite_tier", chance: 0.40, amp: 2, extraTime: 5 },
    { tag: "fv:diamet_tier", chance: 0.40, amp: 2, extraTime: 5 }
];

const DesertSwordComponent = {
    onHitEntity(event) {
        const { hitEntity, hadEffect, itemStack } = event;
        if (!hadEffect || !itemStack) return;

        for (const tier of TIER_CONFIG) {
            if (itemStack.hasTag(tier.tag)) {
                if (Math.random() < tier.chance) {
                    const poisonDuration = (5 + tier.extraTime) * 20;
                    const hungerDuration = (10 + tier.extraTime) * 20;
                    // Apply hiệu ứng Poison và Hunger
                    hitEntity.addEffect("minecraft:poison", poisonDuration, { amplifier: tier.amp });
                    hitEntity.addEffect("minecraft:hunger", hungerDuration, { amplifier: tier.amp });
                }
                break;
            }
        }
    }
};

// SỬA LỖI API: Dùng system.beforeEvents.startup thay vì world.beforeEvents.worldInitialize
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent(
        COMPONENT_ID,
        DesertSwordComponent
    );
});