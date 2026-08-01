// TeamBookManager.js
import { world, ItemStack, EntityComponentTypes, EquipmentSlot } from "@minecraft/server";
import { ActionFormData } from "@minecraft/server-ui";

// Danh sách team + màu
const teams = [
    "blue", "red", "grey", "yellow", "green", "black", "brown",
    "white", "purple", "cyan", "lime", "pink", "orange", "light_blue"
];
const teamColors = {
    "blue": "§9", "red": "§c", "grey": "§7", "yellow": "§e",
    "green": "§a", "black": "§0", "brown": "§6", "white": "§f",
    "purple": "§5", "cyan": "§3", "lime": "§a", "pink": "§d",
    "orange": "§6", "light_blue": "§b"
};
const resetColor = "§f";

function resetName(text) {
    return resetColor +
        text.replace(/\[.*? team\]\s*/g, "")
            .replace(/§[0-9a-fk-or]/gi, "")
            .trim();
}

function processSoldiers(player, team, isJoin) {
    const plainName = player.name.replace(/\s/g, "_");
    const ownerTag = `owner_${plainName}_${player.id}`;
    const ents = player.dimension.getEntities({
        location: player.location, maxDistance: 30, families: ["irongolem"]
    });
    ents.forEach(ent => {
        if (ent.hasTag(ownerTag) && ent.getComponent("minecraft:is_tamed")) {
            teams.forEach(t => ent.removeTag(t));
            if (isJoin) {
                ent.addTag(team);
                ent.nameTag = `${teamColors[team]}[${team} team] ${player.name} soldier`;
            } else {
                ent.nameTag = resetName(ent.nameTag);
            }
        }
    });
}

// --- TÍNH NĂNG MỚI: Tự động tô màu tên khi Join Game ---
world.afterEvents.playerSpawn.subscribe(ev => {
    const { player, initialSpawn } = ev;

    // Kiểm tra tính hợp lệ
    if (!player || !player.isValid) return;

    // Chỉ chạy khi người chơi vừa tham gia game (initialSpawn = true)
    if (initialSpawn) {
        const currentTeam = teams.find(t => player.hasTag(t));
        if (currentTeam) {
            // Khôi phục NameTag theo team
            player.nameTag = `${teamColors[currentTeam]}[${currentTeam} team] ${player.name}`;
        }
    }
});

world.afterEvents.itemUse.subscribe(ev => {
    const p = ev.source;
    const id = ev.itemStack.typeId;
    const currentTeam = teams.find(t => p.hasTag(t));

    // Swap default book nếu đã có team
    if (id === "fv:team_book_default" && currentTeam) {
        p.getComponent(EntityComponentTypes.Equippable)
            ?.setEquipment(EquipmentSlot.Mainhand, new ItemStack(`fv:team_book_${currentTeam}`, 1));
        return;
    }

    // Nếu dùng default book lần đầu để chọn team
    if (id === "fv:team_book_default" && !currentTeam) {
        const form = new ActionFormData()
            .title({ translate: "gui.team_book.select_title" })
            .body({ translate: "gui.team_book.select_body" });
        teams.forEach(t => form.button({ translate: `team.${t}` }));

        form.show(p).then(res => {
            if (res.canceled) return;
            const team = teams[res.selection];
            p.addTag(team);
            p.nameTag = `${teamColors[team]}[${team} team] ${p.name}`;
            p.getComponent(EntityComponentTypes.Equippable)
                ?.setEquipment(EquipmentSlot.Mainhand,
                    new ItemStack(`fv:team_book_${team}`, 1));
        }).catch(console.error);
        return;
    }

    // Nếu dùng sách team color
    if (id.startsWith("fv:team_book_") && id !== "fv:team_book_default") {
        const team = id.replace("fv:team_book_", "");
        if (!p.hasTag(team)) {
            p.sendMessage({ translate: "message.team.not_in_team" });
            return;
        }

        const form = new ActionFormData()
            .title({ translate: "gui.team_book.menu_title", with: [team] })
            .body({ translate: "gui.team_book.menu_body" })
            .button({ translate: "gui.team_book.button.join" })
            .button({ translate: "gui.team_book.button.leave" })
            .button({ translate: "gui.team_book.button.restore_name" });

        form.show(p).then(res => {
            if (res.canceled) return;
            const eq = p.getComponent(EntityComponentTypes.Equippable);

            if (res.selection === 0) {
                processSoldiers(p, team, true);
                p.sendMessage({ translate: "message.team.joined", with: [team] });
            }
            else if (res.selection === 1) {
                teams.forEach(t => p.removeTag(t));
                p.nameTag = resetColor + resetName(p.nameTag);
                eq?.setEquipment(EquipmentSlot.Mainhand,
                    new ItemStack("fv:team_book_default", 1));
                processSoldiers(p, team, false);
                p.sendMessage({ translate: "message.team.left" });
            }
            else if (res.selection === 2) {
                p.nameTag = `${teamColors[team]}[${team} team] ${p.name}`;
                p.sendMessage({ translate: "message.team.restored", with: [team] });
            }
        }).catch(console.error);
    }
});