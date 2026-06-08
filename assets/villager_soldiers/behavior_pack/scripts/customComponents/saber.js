import { world, system, EffectTypes, EquipmentSlot, GameMode, ItemComponentTypes } from "@minecraft/server"; // ✔️ Thêm system

// 🔹 Cấu hình phản đòn và tier — giữ nguyên
const tierData = {
    "minecraft:gold_tier": { chance: 0.05, weak: 1, fatigue: 2 },
    "minecraft:copper_tier": { chance: 0.08, weak: 1, fatigue: 3 },
    "minecraft:iron_tier": { chance: 0.10, weak: 2, fatigue: 4 },
    "fv:steel_tier": { chance: 0.12, weak: 2, fatigue: 5 },
    "fv:illasteel_tier": { chance: 0.12, weak: 2, fatigue: 5 },
    "minecraft:diamond_tier": { chance: 0.14, weak: 3, fatigue: 6 },
    "minecraft:netherite_tier": { chance: 0.16, weak: 3, fatigue: 7 },
    "fv:illudiamondite_tier": { chance: 0.16, weak: 3, fatigue: 7 },
    "fv:diamet_tier": { chance: 0.16, weak: 3, fatigue: 7 }
};

// 🔹 Component xử lý hit entity
class SaberHitComponent {
    onHitEntity(event) {
        const { hitEntity, itemStack } = event;

        // SỬA LỖI: Di chuyển EffectTypes.get vào bên trong hàm để tránh lỗi "early execution"
        const effectWeakness = EffectTypes.get("minecraft:weakness");
        const effectFatigue = EffectTypes.get("minecraft:mining_fatigue");

        if (!hitEntity || !effectWeakness || !effectFatigue) return;

        let data = null;
        for (const tag in tierData) {
            if (itemStack.hasTag(tag)) { data = tierData[tag]; break; }
        }
        if (!data) return;

        if (Math.random() <= data.chance) {
            const duration = 20 * 4;
            hitEntity.addEffect(effectWeakness, duration, { amplifier: data.weak });
            hitEntity.addEffect(effectFatigue, duration, { amplifier: data.fatigue });
        }
    }
}

// 🔹 Theo dõi phản đòn
const recentlyUsed = new Set();
class SaberUseComponent {
    onUse(event) {
        const player = event.source;
        if (!player?.id) return;

        // Lưu player để kích hoạt phản đòn
        recentlyUsed.add(player.id);

        // Chạy animation block
        player.playAnimation("animation.vanilla_item.block", {
            blendInTime: 0.05,
            blendOutTime: 0.1,
            stopExpression: "!query.is_using_item"
        });

        // Hiển thị action bar
        player.onScreenDisplay.setActionBar({
            translate: "sabers.use.reaction"
        });
    }
}


// ✅ SỬA LỖI API: Dùng system.beforeEvents.startup thay vì world.beforeEvents.worldInitialize
system.beforeEvents.startup.subscribe(e => {
    const reg = e.itemComponentRegistry;
    reg.registerCustomComponent("fv:saber_hit", new SaberHitComponent());
    reg.registerCustomComponent("fv:saber_use", new SaberUseComponent());
});

// 🛡️ Xử lý entity bị đánh
world.afterEvents.entityHurt.subscribe(event => {
    const { hurtEntity: player, damage, damageSource } = event;
    if (!player?.id || typeof damage !== "number") return;
    if (!recentlyUsed.has(player.id)) return;
    recentlyUsed.delete(player.id);

    const attacker = damageSource.damagingEntity ?? damageSource.damagingProjectile;
    if (!attacker?.id || damage > 20) return;

    // ▶️ Animation block khi phản đòn
    player.playAnimation("animation.vanilla_item.block", {
        blendInTime: 0.05,
        blendOutTime: 0.1,
        stopExpression: "!query.is_using_item"
    });

    // ⚔ Phản sát thương
    attacker.applyDamage(damage, {
        damagingEntity: player,
        cause: "entityAttack"
    });

    // ❤️ Hồi 50% máu đã mất
    const healthComp = player.getComponent("minecraft:health");
    if (healthComp) {
        const current = healthComp.currentValue;
        const max = healthComp.effectiveMax;
        const healAmt = damage * 0.5;
        const newVal = Math.min(current + healAmt, max);
        if (!isNaN(newVal)) {
            healthComp.setCurrentValue(newVal);
        }
    }

    // 🛠 Giảm độ bền item tương ứng nguồn sát thương
    const equippable = player.getComponent("minecraft:equippable");
    if (!equippable) return;
    const slot = equippable.getEquipmentSlot(EquipmentSlot.Mainhand);
    if (!slot.hasItem()) return;
    if (player.getGameMode() === GameMode.Creative) return;

    const itemStack = slot.getItem();
    const durabilityComp = itemStack.getComponent(ItemComponentTypes.Durability);
    if (!durabilityComp) return;

    // Áp dụng logical: damage của source -> trừ durability
    const applied = Math.floor(damage);
    for (let i = 0; i < applied; i++) {
        const enchantComp = itemStack.getComponent(ItemComponentTypes.Enchantable);
        const unbLevel = enchantComp?.getEnchantment("unbreaking")?.level ?? 0;
        const chance = durabilityComp.getDamageChance(unbLevel) / 100;
        if (Math.random() <= chance) {
            durabilityComp.damage++;
        }
    }

    // Kiểm tra item hỏng
    if (durabilityComp.damage >= durabilityComp.maxDurability) {
        slot.setItem(undefined);
        player.playSound("random.break");
    } else {
        slot.setItem(itemStack);
    }
});