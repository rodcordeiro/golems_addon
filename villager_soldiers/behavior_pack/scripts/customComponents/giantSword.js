// giantSword.js
import { world, system } from "@minecraft/server"; // ✔️ Đã thêm system

/**
 * 🛠 TUỲ CHỈNH DỄ DÀNG:
 * - Đổi "fv:giant_sword_component" thành tên component khác
 * - Sửa `TIER_CONFIG` để định nghĩa tier cho item mới
 */
const COMPONENT_ID = "fv:giant_sword_component";

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

const GiantSwordComponent = {
    onHitEntity(event) {
        const { hitEntity, hadEffect, itemStack } = event;
        if (!hadEffect || !itemStack) return;

        for (const tier of TIER_CONFIG) {
            if (itemStack.hasTag(tier.tag)) {
                if (Math.random() < tier.chance) {
                    const weaknessDuration = (20 + tier.extraTime) * 20;
                    const slownessDuration = (10 + tier.extraTime) * 20;
                    hitEntity.addEffect("minecraft:weakness", weaknessDuration, { amplifier: tier.amp });
                    hitEntity.addEffect("minecraft:slowness", slownessDuration, { amplifier: tier.amp });
                }
                break;
            }
        }
    }
};

// SỬA LỖI API: Thay thế world.beforeEvents.worldInitialize bằng system.beforeEvents.startup
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent(
        COMPONENT_ID,
        GiantSwordComponent
    );
});