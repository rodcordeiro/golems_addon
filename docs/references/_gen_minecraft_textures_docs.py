#!/usr/bin/env python3
"""Generate minecraft texture reference docs from assets/texturas minecraft."""

from __future__ import annotations

import json
import re
from collections import OrderedDict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / "assets" / "texturas minecraft"
REFS = ROOT / "docs" / "references"
TEX = BASE / "textures"


def list_png_stems(folder: Path) -> list[str]:
    if not folder.is_dir():
        return []
    return sorted(p.stem for p in folder.glob("*.png"))


def list_rel_png(folder: Path) -> list[str]:
    if not folder.is_dir():
        return []
    return sorted(p.relative_to(folder).as_posix() for p in folder.rglob("*.png"))


def count_files(folder: Path) -> int:
    if not folder.is_dir():
        return 0
    return sum(1 for _ in folder.rglob("*") if _.is_file())


def categorize_items(items: list[str]) -> OrderedDict[str, list[str]]:
    rules: list[tuple[str, str]] = [
        ("boats_rafts", r"(_boat|_raft)$"),
        ("doors_signs_hanging", r"(_door|_sign|_hanging_sign)$"),
        ("pottery_sherds", r"_pottery_sherd$"),
        (
            "armor_equipment",
            r"(_helmet|_chestplate|_leggings|_boots)$|horse_armor|turtle_helmet|^elytra$|^shield$|wolf_armor",
        ),
        (
            "tools_weapons",
            r"(_sword|_pickaxe|_axe|_shovel|_hoe)$|^(bow|crossbow|trident|mace|fishing_rod|carrot_on_a_stick|warped_fungus_on_a_stick|flint_and_steel|shears|brush|spyglass|recovery_compass|compass|clock|name_tag|lead|saddle)$",
        ),
        ("spawn_eggs", r"spawn_egg"),
        ("music_discs_horns", r"^music_disc_|^goat_horn$"),
        ("banner_patterns", r"_banner_pattern$|banner_pattern"),
        ("dyes", r"_dye$"),
        ("buckets_fluids", r"bucket"),
        ("potions_arrows", r"potion|tipped_arrow|^arrow$|^spectral_arrow$"),
        (
            "food_consumables",
            r"^(apple|baked_potato|beef|beetroot|beetroot_soup|bread|carrot|chicken|chorus_fruit|cooked_|cookie|dried_kelp|enchanted_golden_apple|glow_berries|golden_apple|golden_carrot|honey_bottle|melon_slice|mushroom_stew|mutton|poisonous_potato|porkchop|potato|pufferfish|pumpkin_pie|rabbit|rabbit_stew|rotten_flesh|salmon|spider_eye|suspicious_stew|sweet_berries|tropical_fish|cod)$",
        ),
        (
            "ores_gems_materials",
            r"(_ingot|_nugget|_scrap)$|^(coal|charcoal|diamond|emerald|lapis_lazuli|quartz|amethyst_shard|raw_iron|raw_gold|raw_copper|redstone|glowstone_dust|gunpowder|blaze_powder|blaze_rod|bone|bone_meal|clay_ball|brick|nether_brick|paper|sugar|string|feather|flint|leather|rabbit_hide|slime_ball|magma_cream|ghast_tear|ender_pearl|ender_eye|prismarine_shard|prismarine_crystals|nautilus_shell|heart_of_the_sea|nether_star|echo_shard|breeze_rod|wind_charge|experience_bottle|honeycomb|resin_brick|resin_clump|trial_key|ominous_trial_key|heavy_core)$",
        ),
        ("smithing_templates", r"_smithing_template$|^netherite_upgrade"),
        ("armor_trims", r"armor_trim"),
        ("minecarts", r"minecart"),
        (
            "books_maps",
            r"^(book|written_book|writable_book|enchanted_book|knowledge_book|map|filled_map|empty_map)$",
        ),
        (
            "seeds_crops",
            r"^(wheat_seeds|pumpkin_seeds|melon_seeds|beetroot_seeds|torchflower_seeds|pitcher_pod|cocoa_beans|nether_wart|wheat|sugar_cane|kelp)$",
        ),
        ("fireworks", r"firework|fire_charge"),
        ("rails_redstone_items", r"^(repeater|comparator)$"),
    ]

    assigned: set[str] = set()
    cats: OrderedDict[str, list[str]] = OrderedDict()
    for name, pattern in rules:
        rx = re.compile(pattern)
        hit = [i for i in items if i not in assigned and rx.search(i)]
        for h in hit:
            assigned.add(h)
        cats[name] = hit
    cats["misc_items"] = [i for i in items if i not in assigned]
    return cats


CAT_TITLES = {
    "tools_weapons": "Ferramentas e armas",
    "armor_equipment": "Armaduras e equipamento",
    "ores_gems_materials": "Materiais, gemas e drops",
    "food_consumables": "Comida / consumiveis",
    "buckets_fluids": "Baldes",
    "dyes": "Corantes",
    "pottery_sherds": "Pottery sherds",
    "boats_rafts": "Barcos e balsas",
    "doors_signs_hanging": "Portas e placas (item)",
    "minecarts": "Minecarts",
    "books_maps": "Livros e mapas",
    "seeds_crops": "Sementes e cultivos",
    "music_discs_horns": "Discos e buzinas",
    "banner_patterns": "Padroes de banner",
    "smithing_templates": "Smithing templates",
    "armor_trims": "Armor trims (item)",
    "potions_arrows": "Pocoes e flechas",
    "fireworks": "Fogos / fire charge",
    "spawn_eggs": "Spawn egg (bases)",
    "rails_redstone_items": "Redstone (subset item)",
    "misc_items": "Outros / frames / placeables",
}


def inline_code_list(names: list[str]) -> str:
    return ", ".join(f"`{n}`" for n in names)


def main() -> None:
    items = list_png_stems(TEX / "item")
    blocks = list_png_stems(TEX / "block")
    cats = categorize_items(items)
    entity_files = list_rel_png(TEX / "entity")
    gui_files = list_rel_png(TEX / "gui")
    particle_files = list_png_stems(TEX / "particle")
    # particle may have subdirs
    if (TEX / "particle").is_dir():
        particle_files = sorted(
            {p.stem for p in (TEX / "particle").rglob("*.png")}
        )
    mob_effects = list_png_stems(TEX / "mob_effect")
    paintings = list_png_stems(TEX / "painting")
    trims = list_rel_png(TEX / "trims")

    tex_folders = []
    for d in sorted((TEX).iterdir() if TEX.is_dir() else []):
        if d.is_dir():
            png = sum(1 for _ in d.rglob("*.png"))
            tex_folders.append({"name": d.name, "png": png})

    top_level = []
    for d in sorted(BASE.iterdir()):
        if d.is_dir():
            top_level.append({"name": d.name, "files": count_files(d)})

    item_models = (
        sum(1 for _ in (BASE / "models" / "item").glob("*.json"))
        if (BASE / "models" / "item").is_dir()
        else 0
    )
    block_models = (
        sum(1 for _ in (BASE / "models" / "block").glob("*.json"))
        if (BASE / "models" / "block").is_dir()
        else 0
    )

    lang_keys = 0
    lang_path = BASE / "lang" / "en_us.json"
    if lang_path.is_file():
        lang_keys = len(json.loads(lang_path.read_text(encoding="utf-8")))

    atlases = sorted(p.stem for p in (BASE / "atlases").glob("*.json")) if (BASE / "atlases").is_dir() else []

    entity_dirs = []
    entity_root = TEX / "entity"
    if entity_root.is_dir():
        for d in sorted(entity_root.iterdir()):
            if d.is_dir():
                entity_dirs.append(
                    {"name": d.name, "n": sum(1 for _ in d.rglob("*.png"))}
                )
        loose = sum(1 for p in entity_root.glob("*.png"))
    else:
        loose = 0

    inv = {
        "source_path": "assets/texturas minecraft",
        "edition_hint": "Java Edition resource assets (assets/minecraft layout)",
        "generated_note": "Inventario derivado dos arquivos locais; nao e o pack Bedrock nativo.",
        "totals": {
            "top_level_folders": len(top_level),
            "texture_png_approx": sum(t["png"] for t in tex_folders),
            "item_textures": len(items),
            "block_textures": len(blocks),
            "item_models": item_models,
            "block_models": block_models,
            "entity_textures": len(entity_files),
            "lang_keys_en_us": lang_keys,
        },
        "top_level": top_level,
        "texture_folders": tex_folders,
        "item_categories": cats,
        "all_items": items,
        "all_blocks": blocks,
        "entity_textures": entity_files,
        "gui_textures": gui_files,
        "particle_textures": particle_files,
        "mob_effects": mob_effects,
        "paintings": paintings,
        "trims": trims,
        "atlases": atlases,
    }

    inv_path = REFS / "minecraft-textures-inventory.json"
    inv_path.write_text(json.dumps(inv, indent=2, ensure_ascii=True) + "\n", encoding="utf-8")
    print(f"Wrote {inv_path}")

    png_total = sum(t["png"] for t in tex_folders)
    lines: list[str] = []
    a = lines.append

    a("# Minecraft Textures — Referencia de Assets")
    a("")
    a(
        "Mapa dos assets vanilla em `assets/texturas minecraft`, para agentes e desenvolvedores saberem "
        "**quais texturas/itens existem** e **como localiza-los** ao criar addons Bedrock neste monorepo."
    )
    a("")
    a(
        "ASCII preferido. Este dump e formato **Java Edition** (`assets/minecraft`), "
        "nao o layout nativo de Resource Pack Bedrock."
    )
    a("")
    a("---")
    a("")
    a("## 1. Fonte e proposito")
    a("")
    a("| Campo | Valor |")
    a("|-------|-------|")
    a("| Caminho | `assets/texturas minecraft/` |")
    a("| Layout | Java: `textures/`, `models/`, `blockstates/`, `atlases/`, `particles/`, `shaders/`, `font/`, `lang/` |")
    a(f"| Contagem PNG em `textures/` | ~{png_total} |")
    a(f"| Texturas de item | {len(items)} (`textures/item/*.png`) |")
    a(f"| Texturas de bloco | {len(blocks)} (`textures/block/*.png`) |")
    a(f"| Models de item | {item_models} (`models/item/*.json`) |")
    a(f"| Models de bloco | {block_models} (`models/block/*.json`) |")
    a(f"| Texturas de entity | {len(entity_files)} |")
    a(f"| Chaves `lang/en_us.json` | {lang_keys} |")
    a("| Inventario machine-readable | `docs/references/minecraft-textures-inventory.json` |")
    a("| Catalogo completo (listas) | `docs/references/minecraft-textures-catalog.md` |")
    a("")
    a("Uso tipico neste repo:")
    a("")
    a("- Referencia visual / nomes canonicos de itens e blocos vanilla")
    a("- Extrair IDs (`apple`, `iron_ingot`, `oak_planks`) para receitas, loot, scripts e `item_texture.json`")
    a("- Comparar arte custom (`addon:`, `va:`, `fv:`) com a base vanilla")
    a("")
    a(
        "**Nao** copiar texturas vanilla para packs redistribuidos sem checar licenca/ToS da Microsoft/Mojang. "
        "Para desenvolvimento local e referencia, ok."
    )
    a("")
    a("---")
    a("")
    a("## 2. Mapa de pastas")
    a("")
    a("```")
    a("assets/texturas minecraft/")
    a("  atlases/          # atlas JSON (blocks, banners, beds, signs, ...)")
    a("  blockstates/      # estados de bloco -> models")
    a("  font/")
    a("  lang/en_us.json   # nomes localizados (item.*, block.*, entity.*, ...)")
    a("  models/")
    a("    block/          # geometria/texturas de bloco")
    a("    item/           # parent + layer0..N -> textures/item|block")
    a("  particles/")
    a("  shaders/")
    a("  texts/")
    a("  textures/")
    a("    block/          # PNG de faces de bloco (+ .mcmeta animacao)")
    a("    item/           # PNG de itens (inventario / hand)")
    a("    entity/         # skins de mobs, armaduras, boats, shields, ...")
    a("    gui/            # HUD, containers, widgets")
    a("    particle/")
    a("    mob_effect/")
    a("    painting/")
    a("    trims/           # armor trim patterns + palettes")
    a("    models/          # armor layers (ex.: chainmail, diamond)")
    a("    colormap/ environment/ font/ map/ misc/ effect/")
    a("```")
    a("")
    a("### 2.1 Contagens por pasta em `textures/`")
    a("")
    a("| Pasta | PNG |")
    a("|-------|-----|")
    for t in tex_folders:
        a(f"| `{t['name']}` | {t['png']} |")
    a("")
    a("### 2.2 Pastas no root do dump")
    a("")
    a("| Pasta | Arquivos (aprox.) |")
    a("|-------|-------------------|")
    for t in top_level:
        a(f"| `{t['name']}` | {t['files']} |")
    a("")
    a("---")
    a("")
    a("## 3. Como item Java mapeia para textura")
    a("")
    a("Model tipico (`models/item/diamond_sword.json`):")
    a("")
    a("```json")
    a("{")
    a('  "parent": "minecraft:item/handheld",')
    a('  "textures": {')
    a('    "layer0": "minecraft:item/diamond_sword"')
    a("  }")
    a("}")
    a("```")
    a("")
    a("Resolucao:")
    a("")
    a("1. ID logico: `minecraft:diamond_sword`")
    a("2. Model: `models/item/diamond_sword.json`")
    a("3. Textura: `textures/item/diamond_sword.png` (namespace `minecraft:item/...`)")
    a("4. Nome localizado: chave em `lang/en_us.json` (ex.: `item.minecraft.diamond_sword`)")
    a("")
    a("Itens gerados a partir de bloco costumam apontar `layer0` para `minecraft:block/...`.")
    a("")
    a("Casos especiais Java:")
    a("")
    a("| Caso | Padrao neste dump |")
    a("|------|-------------------|")
    a("| Spawn eggs | so `spawn_egg.png` + `spawn_egg_overlay.png` (tint por entidade no client) |")
    a("| Pocao / tipped arrow | poucas bases + overlay colorido |")
    a("| Relogio / bussola | muitas frames (`clock_00`.., `compass_00`..) |")
    a("| Arco puxado | `bow_pulling_0/1/2` |")
    a("| Blocos animados | `textures/block/*.png.mcmeta` com `animation.frametime` |")
    a("")
    a("---")
    a("")
    a("## 4. Uso em addons Bedrock (este monorepo)")
    a("")
    a("Bedrock **nao** le este dump diretamente. Ao portar referencia:")
    a("")
    a("| Conceito Java | Equivalente Bedrock tipico |")
    a("|---------------|----------------------------|")
    a("| `textures/item/foo.png` | `resource_pack/textures/items/foo.png` (plural `items` comum) |")
    a("| `textures/block/foo.png` | `resource_pack/textures/blocks/foo.png` |")
    a("| `models/item` + parent | `item_texture.json` + attachables / geo quando preciso |")
    a("| `minecraft:apple` | `minecraft:apple` (mesmo ID vanilla no Script API) |")
    a("| Entity skin `textures/entity/...` | `textures/entity/...` no RP (caminho pode diferir) |")
    a("")
    a("Checklist pratico:")
    a("")
    a("1. Confirme o **nome de arquivo** neste dump (`iron_ingot`, nao `Iron Ingot`).")
    a("2. Para item **vanilla** em receita/loot/script, use ID `minecraft:<nome>` — nao precisa copiar textura.")
    a("3. Para item **custom** (`addon:`, `va:`), crie PNG novo no RP do addon + entrada em `item_texture.json` + lang.")
    a("4. Se precisar **derivar** arte vanilla (recolor, remix), trabalhe a partir destes PNG e renomeie para namespace proprio.")
    a("5. Mantenha isolamento: nao misture texturas entre `gollem_addon`, `villagers_addon` e `villager_soldiers` sem pedido.")
    a("")
    a("Namespaces do monorepo: `addon:`, `va:`, `fv:` (+ secundarios do pack de soldados). Vanilla permanece `minecraft:`.")
    a("")
    a("---")
    a("")
    a("## 5. Catalogo de itens por categoria")
    a("")
    a(
        f"Lista dos **{len(items)} PNG** em `textures/item/`. Cada nome e o stem do arquivo "
        "(= ID util para `minecraft:<nome>` na maioria dos casos)."
    )
    a("")
    a("Detalhe completo tambem em `minecraft-textures-catalog.md` e no JSON.")
    a("")

    for idx, key in enumerate(cats.keys(), start=1):
        lst = cats[key]
        title = CAT_TITLES.get(key, key)
        a(f"### 5.{idx} {title} ({len(lst)})")
        a("")
        a(inline_code_list(lst))
        a("")

    a("---")
    a("")
    a("## 6. Blocos (`textures/block/`)")
    a("")
    a(
        f"Ha **{len(blocks)}** PNG de bloco (faces, estados `_on`, `_top`, `_side`, portas `_bottom`/`_top`, etc.). "
        "Um bloco logico pode ter varias texturas."
    )
    a("")
    a("Exemplos de familia de nome:")
    a("")
    a("| Prefixo / familia | Exemplos |")
    a("|-------------------|----------|")
    a("| Madeiras | `oak_planks`, `spruce_log`, `bamboo_door_bottom` |")
    a("| Pedras | `stone`, `cobblestone`, `andesite`, `deepslate_*` |")
    a("| Minerios | `iron_ore`, `deepslate_diamond_ore`, `raw_iron_block` |")
    a("| Cobre | `copper_block`, `exposed_cut_copper`, `oxidized_copper` |")
    a("| Coloridos | `*_wool`, `*_concrete`, `*_terracotta`, `*_stained_glass` |")
    a("| Nether / End | `netherrack`, `glowstone`, `end_stone`, `purpur_block` |")
    a("| Redstone | `redstone_lamp_on`, `piston_side`, `observer_front` |")
    a("")
    a("Lista completa: secao Blocos em `minecraft-textures-catalog.md` e chave `all_blocks` no JSON.")
    a("")
    a("---")
    a("")
    a("## 7. Entities, GUI, particulas, efeitos")
    a("")
    a("### 7.1 Entity (subpastas)")
    a("")
    a("| Subpasta | PNG |")
    a("|----------|-----|")
    for e in entity_dirs:
        a(f"| `{e['name']}` | {e['n']} |")
    a(f"| _(arquivos soltos na raiz entity)_ | {loose} |")
    a("")
    a("### 7.2 Mob effects")
    a("")
    a(inline_code_list(mob_effects))
    a("")
    a("### 7.3 Paintings")
    a("")
    a(inline_code_list(paintings))
    a("")
    a(
        f"### 7.4 Particles ({len(particle_files)}) / GUI ({len(gui_files)}) / Trims ({len(trims)})"
    )
    a("")
    a("Listas completas no JSON (`particle_textures`, `gui_textures`, `trims`, `entity_textures`).")
    a("")
    a("---")
    a("")
    a("## 8. Atlases Java")
    a("")
    a("Arquivos em `atlases/` (referencia de packing Java; Bedrock usa atlases diferentes):")
    a("")
    a(inline_code_list(atlases))
    a("")
    a("---")
    a("")
    a("## 9. Como consultar rapidamente")
    a("")
    a("```powershell")
    a('# Itens cujo nome contem "iron"')
    a('Get-ChildItem "assets/texturas minecraft/textures/item" -Filter "*iron*.png" |')
    a("  Select-Object -ExpandProperty BaseName")
    a("")
    a("# Blocos de cobre")
    a('Get-ChildItem "assets/texturas minecraft/textures/block" -Filter "*copper*.png" |')
    a("  Select-Object -ExpandProperty BaseName")
    a("")
    a("# Model JSON de um item")
    a('Get-Content "assets/texturas minecraft/models/item/trident.json" -Raw')
    a("")
    a("# Inventario gerado")
    a('$inv = Get-Content "docs/references/minecraft-textures-inventory.json" -Raw | ConvertFrom-Json')
    a("$inv.totals")
    a("```")
    a("")
    a("Regenerar docs apos atualizar o dump:")
    a("")
    a("```powershell")
    a("python docs/references/_gen_minecraft_textures_docs.py")
    a("```")
    a("")
    a("---")
    a("")
    a("## 10. Manutencao")
    a("")
    a("- Se o dump em `assets/texturas minecraft` for atualizado (nova versao do jogo), regenere este doc + JSON.")
    a("- Preferir o JSON para busca programatica; o Markdown para leitura humana.")
    a("- Nao tratar este inventario como validacao in-game Bedrock.")
    a("")
    a(
        "*Documento gerado a partir dos arquivos locais do dump. "
        "Comportamento de rendering Java/Bedrock nao foi revalidado in-game nesta sessao.*"
    )
    a("")

    main_path = REFS / "minecraft-textures.md"
    main_path.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {main_path} ({main_path.stat().st_size} bytes)")

    # Catalog
    c: list[str] = []
    b = c.append
    b("# Minecraft Textures — Catalogo completo")
    b("")
    b("Anexo de `minecraft-textures.md`. Listas flat geradas do dump local.")
    b("")
    b("## Itens (`textures/item/*.png`)")
    b("")
    b(f"Total: **{len(items)}**")
    b("")
    for key, lst in cats.items():
        b(f"### {CAT_TITLES.get(key, key)} ({len(lst)})")
        b("")
        for name in lst:
            b(f"- `{name}`")
        b("")
    b("## Todos os itens (A-Z)")
    b("")
    for name in items:
        b(f"- `{name}`")
    b("")
    b("## Blocos (`textures/block/*.png`)")
    b("")
    b(f"Total: **{len(blocks)}**")
    b("")
    for name in blocks:
        b(f"- `{name}`")
    b("")
    b("## Entity textures (relativo a `textures/entity/`)")
    b("")
    for name in entity_files:
        b(f"- `{name}`")
    b("")
    b("## Particles")
    b("")
    for name in particle_files:
        b(f"- `{name}`")
    b("")
    b("## GUI (relativo a `textures/gui/`)")
    b("")
    for name in gui_files:
        b(f"- `{name}`")
    b("")
    b("## Trims (relativo a `textures/trims/`)")
    b("")
    for name in trims:
        b(f"- `{name}`")
    b("")

    cat_path = REFS / "minecraft-textures-catalog.md"
    cat_path.write_text("\n".join(c), encoding="utf-8")
    print(f"Wrote {cat_path} ({cat_path.stat().st_size} bytes)")

    # cleanup old temps if any
    for tmp in ("_texture_categories.json", "_texture_inventory.json"):
        p = REFS / tmp
        if p.exists():
            p.unlink()
            print(f"Removed {p.name}")


if __name__ == "__main__":
    main()
