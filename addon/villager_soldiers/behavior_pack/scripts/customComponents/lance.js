import {
    world,
    system,
    EquipmentSlot,
    GameMode,
} from "@minecraft/server";

/* ========= Constants ========= */
const SPEED_REF = 0.20;
const KB_BASE = 2.0;
const KB_SCALE_MAX = 3.0;

/* ========= Durability Utility ========= */
function applyLanceDurability(source, totalDamageDone) {
    if (source.getGameMode() === GameMode.Creative) return;

    const equippable = source.getComponent("minecraft:equippable");
    const mainhandSlot = equippable?.getEquipmentSlot(EquipmentSlot.Mainhand);
    const item = mainhandSlot?.getItem();

    if (!item) return;

    const durCmp = item.getComponent("minecraft:durability");
    if (!durCmp) return;

    const enchantable = item.getComponent("minecraft:enchantable");
    const unbreakingLevel = enchantable?.getEnchantment("unbreaking")?.level || 0;
    const chance = 100 / (unbreakingLevel + 1);

    let durabilityLoss = 0;
    for (let i = 0; i < totalDamageDone; i++) {
        if (Math.random() * 100 < chance) {
            durabilityLoss++;
        }
    }

    if (durCmp.damage + durabilityLoss >= durCmp.maxDurability) {
        mainhandSlot.setItem(undefined);
        source.playSound("random.break");
    } else {
        durCmp.damage += durabilityLoss;
        mainhandSlot.setItem(item);
    }
}

const DAMAGE_BY_TIER = {
    "minecraft:copper_tier": 8,
    "minecraft:iron_tier": 9,
    "fv:steel_tier": 10,
    "fv:illasteel_tier": 10,
    "minecraft:diamond_tier": 11,
    "minecraft:netherite_tier": 12,
    "fv:illudiamondite_tier": 13,
    "fv:diamet_tier": 13,
};

/* ========= Component Definitions ========= */
const lanceHitComponent = {
    onHitEntity({ attackingEntity, itemStack }) {
        // Trống
    },
};

const lanceAnimationComponent = {
    onUse({ source }) {
        if (!source) return;
        source.playAnimation("animation.nguoimau.using_lance", {
            stopExpression: "!query.is_using_item",
        });
    },
};

/* ========= Main Event: itemReleaseUse ========= */
world.afterEvents.itemReleaseUse.subscribe(({ source, itemStack }) => {
    if (!source || !itemStack || !itemStack.hasTag("fv:is_lance")) return;

    let baseDmg = 0;
    for (const tierTag in DAMAGE_BY_TIER) {
        if (itemStack.hasTag(tierTag)) {
            baseDmg = DAMAGE_BY_TIER[tierTag];
            break;
        }
    }
    if (baseDmg <= 0) baseDmg = 5;

    let multiplier = 1;
    let speedBonus = 0;
    let speed = 0;

    const rideCmp = source.getComponent("minecraft:riding");
    const mount = rideCmp?.entityRidingOn;

    if (mount) {
        const v = mount.getVelocity();
        speed = Math.sqrt(v.x * v.x + v.z * v.z);
        if (speed > 0.01) multiplier = 4;
        speedBonus = Math.min(Math.floor(speed / 0.1), 5);
    }

    const hits = source.getEntitiesFromViewDirection({ maxDistance: 8 });
    if (hits.length === 0) return;

    const target = hits[0].entity;
    if (!target.isValid) return;

    const totalDmg = (baseDmg * multiplier) + speedBonus;

    target.applyDamage(totalDmg, {
        damagingEntity: source,
        cause: "entityAttack",
    });

    if (multiplier === 4) {
        const scale = Math.min(speed / SPEED_REF, KB_SCALE_MAX);
        const strength = KB_BASE * scale * 2; // Gấp đôi lực đẩy theo logic cũ của bạn

        const view = source.getViewDirection();

        // CHUẨN V2: Tham số 1 là object VectorXZ {x, z}, Tham số 2 là vertical number
        target.applyKnockback({ x: view.x * strength, z: view.z * strength }, 0.4);

        target.addEffect("nausea", 200, { amplifier: 2, showParticles: true });
        target.addEffect("blindness", 200, { amplifier: 2, showParticles: true });
    }

    source.playAnimation("animation.nguoimau.lance_attacked", {
        blendOutTime: 0.1
    });

    applyLanceDurability(source, Math.floor(totalDmg));
});

/* ========= Register Components ========= */
system.beforeEvents.startup.subscribe(({ itemComponentRegistry }) => {
    itemComponentRegistry.registerCustomComponent("fv:lance_hit", lanceHitComponent);
    itemComponentRegistry.registerCustomComponent(
        "fv:lance_third_persion_animation",
        lanceAnimationComponent
    );
});