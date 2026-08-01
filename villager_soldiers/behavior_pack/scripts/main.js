import './spawn/SpawnSoldier.js';
import './spawn/SpawnSoldierFromGolem.js';
import './function/shootCannon.js';
import './function/shootBigCannon.js';
import './function/shootCatapult.js';
import './function/villagerFreeHandle.js';
import './UI/soldierAction.js';
import './Items/PaperWritable.js';
import './Items/CopperShield.js';
import './function/tagArmorFunction.js';
import './function/makingProduction.js';
import './function/playerTagNoDamage.js';
import './function/identificationOwner.js';
import './function/resetTarget.js';
import './function/teamSelecTable.js';
import './UI/ironGolemGuradAction.js';
import './Items/TeamCallHorn.js';
import './Items/TeamAttackHorn.js';
import './Items/TeamStandHorn.js';
import './Items/onMineBlock.js';
import './customComponents/giantSword.js';
import './customComponents/spear.js';
import './customComponents/pike.js';
import './customComponents/lance.js';
import './customComponents/lancev2.js';
import './customComponents/desertSword.js';
import './customComponents/hoe.js';
import './customComponents/damageItems.js';
import './customComponents/javelinThrown.js';
import './function/pickUpJavelin.js';
import './customComponents/saber.js';
import './customComponents/hammer.js';
import './customComponents/snowBow.js';
import './customComponents/battleAxe.js';
import './Items/FlintlockMusket.js';
import './Items/PercussionCapMusket.js';
import './Items/FlintlockPistol.js';
import './Items/GoldenReaper.js';
import './Items/DeadlightRifle.js';
import './function/checkday.js';
import './function/suckBlood.js';
import './function/hitSuckBlood.js';
import './function/knockBackAttacker.js'; // Đã thêm .js
// import './test.js';
import './customComponents/witheringSpear.js';
import './customComponents/velocithiefBlade.js';
import './customComponents/giantGemHeartBroadSword.js';
import './customComponents/vanguardMarshalsDiamoriteSword.js';
import './customComponents/diamoriteSovereignHalberd.js';
import './function/regenerationAxe.js';
import './function/parachute.js';
import './function/plusArmorsFunction.js';
import './function/villagerTankerLevelUp.js'; // Đã thêm .js
import './customComponents/freeHandleDecree.js';
import './customComponents/luckyChest.js';
import './function/ironGolemGuardCraft.js';
import './function/hayGolemCraft.js';
import './function/transformEntityTag.js';
import './customComponents/ancientTomeOfWisdom.js';
import { world, system } from "@minecraft/server";

const LOW_HP_TAG = "lowHP";
const DIMENSIONS = ["overworld", "nether", "the_end"];

system.runInterval(() => {
    for (const dimId of DIMENSIONS) {
        const dim = world.getDimension(dimId);
        if (!dim) continue;

        // Lấy tất cả thực thể
        const ents = dim.getEntities();

        for (const ent of ents) {
            // Kiểm tra component máu
            const hp = ent.getComponent("minecraft:health");
            if (!hp) continue;

            // LƯU Ý QUAN TRỌNG: 
            // Trong bản 2.4.0, dùng 'effectiveMax' thay vì 'defaultValue'
            const maxHP = hp.effectiveMax;
            const currentHP = hp.currentValue;

            if (currentHP <= maxHP / 2) {
                if (!ent.hasTag(LOW_HP_TAG)) ent.addTag(LOW_HP_TAG);
            } else if (ent.hasTag(LOW_HP_TAG)) {
                ent.removeTag(LOW_HP_TAG);
            }
        }
    }
}, 10);