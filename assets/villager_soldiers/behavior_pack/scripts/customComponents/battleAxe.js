import { system } from "@minecraft/server";

// Cấu hình theo tier tag
const EFFECT_BY_TIER = [
    { tag: "minecraft:gold_tier", strAmp: 0, weakAmp: 0, weakDur: 5 * 20 },
    { tag: "minecraft:copper_tier", strAmp: 0, weakAmp: 0, weakDur: 8 * 20 },
    { tag: "minecraft:iron_tier", strAmp: 1, weakAmp: 1, weakDur: 10 * 20 },
    { tag: "fv:steel_tier", strAmp: 1, weakAmp: 1, weakDur: 12 * 20 },
    { tag: "fv:illasteel_tier", strAmp: 1, weakAmp: 1, weakDur: 12 * 20 },
    { tag: "minecraft:diamond_tier", strAmp: 1, weakAmp: 2, weakDur: 14 * 20 },
    { tag: "minecraft:netherite_tier", strAmp: 2, weakAmp: 3, weakDur: 14 * 20 },
    { tag: "fv:illudiamondite_tier", strAmp: 2, weakAmp: 3, weakDur: 14 * 20 },
    { tag: "fv:diamet_tier", strAmp: 2, weakAmp: 3, weakDur: 14 * 20 },
];

// SỬA LỖI ĐĂNG KÝ: Dùng system.beforeEvents.startup theo MẪU CHUẨN 2.4.0
system.beforeEvents.startup.subscribe((initEvent) => {
    initEvent.itemComponentRegistry.registerCustomComponent("fv:battle_axe_hit", {
        onHitEntity(event) {
            const attacker = event.attackingEntity;
            const victim = event.hitEntity;
            const item = event.itemStack;

            if (!attacker || !victim || !item) return;

            // Chỉ áp dụng nếu attacker đang HP thấp
            if (!attacker.hasTag("lowHP")) {
                attacker.removeEffect("strength");
                return;
            }

            // Kiểm tra tier để dùng đúng hiệu ứng
            const itemTags = item.getTags();
            for (const ef of EFFECT_BY_TIER) {
                if (itemTags.includes(ef.tag)) {
                    // CẬP NHẬT API: Dùng chuỗi tên hiệu ứng
                    attacker.addEffect("strength", 40, { amplifier: ef.strAmp, showParticles: false });

                    victim.addEffect("weakness", ef.weakDur, { amplifier: ef.weakAmp, showParticles: true });

                    break;
                }
            }
        }
    });
});