# Minecraft Textures — Referencia de Assets

Mapa dos assets vanilla em `assets/texturas minecraft`, para agentes e desenvolvedores saberem **quais texturas/itens existem** e **como localiza-los** ao criar addons Bedrock neste monorepo.

ASCII preferido. Este dump e formato **Java Edition** (`assets/minecraft`), nao o layout nativo de Resource Pack Bedrock.

---

## 1. Fonte e proposito

| Campo | Valor |
|-------|-------|
| Caminho | `assets/texturas minecraft/` |
| Layout | Java: `textures/`, `models/`, `blockstates/`, `atlases/`, `particles/`, `shaders/`, `font/`, `lang/` |
| Contagem PNG em `textures/` | ~2431 |
| Texturas de item | 582 (`textures/item/*.png`) |
| Texturas de bloco | 928 (`textures/block/*.png`) |
| Models de item | 1675 (`models/item/*.json`) |
| Models de bloco | 2016 (`models/block/*.json`) |
| Texturas de entity | 481 |
| Chaves `lang/en_us.json` | 6217 |
| Inventario machine-readable | `docs/references/minecraft-textures-inventory.json` |
| Catalogo completo (listas) | `docs/references/minecraft-textures-catalog.md` |

Uso tipico neste repo:

- Referencia visual / nomes canonicos de itens e blocos vanilla
- Extrair IDs (`apple`, `iron_ingot`, `oak_planks`) para receitas, loot, scripts e `item_texture.json`
- Comparar arte custom (`addon:`, `va:`, `fv:`) com a base vanilla

**Nao** copiar texturas vanilla para packs redistribuidos sem checar licenca/ToS da Microsoft/Mojang. Para desenvolvimento local e referencia, ok.

---

## 2. Mapa de pastas

```
assets/texturas minecraft/
  atlases/          # atlas JSON (blocks, banners, beds, signs, ...)
  blockstates/      # estados de bloco -> models
  font/
  lang/en_us.json   # nomes localizados (item.*, block.*, entity.*, ...)
  models/
    block/          # geometria/texturas de bloco
    item/           # parent + layer0..N -> textures/item|block
  particles/
  shaders/
  texts/
  textures/
    block/          # PNG de faces de bloco (+ .mcmeta animacao)
    item/           # PNG de itens (inventario / hand)
    entity/         # skins de mobs, armaduras, boats, shields, ...
    gui/            # HUD, containers, widgets
    particle/
    mob_effect/
    painting/
    trims/           # armor trim patterns + palettes
    models/          # armor layers (ex.: chainmail, diamond)
    colormap/ environment/ font/ map/ misc/ effect/
```

### 2.1 Contagens por pasta em `textures/`

| Pasta | PNG |
|-------|-----|
| `block` | 928 |
| `colormap` | 2 |
| `effect` | 1 |
| `entity` | 481 |
| `environment` | 6 |
| `font` | 5 |
| `gui` | 86 |
| `item` | 582 |
| `map` | 3 |
| `misc` | 13 |
| `mob_effect` | 33 |
| `models` | 15 |
| `painting` | 31 |
| `particle` | 194 |
| `trims` | 51 |

### 2.2 Pastas no root do dump

| Pasta | Arquivos (aprox.) |
|-------|-------------------|
| `atlases` | 12 |
| `blockstates` | 1005 |
| `font` | 7 |
| `lang` | 1 |
| `models` | 3691 |
| `particles` | 88 |
| `shaders` | 276 |
| `texts` | 4 |
| `textures` | 2504 |

---

## 3. Como item Java mapeia para textura

Model tipico (`models/item/diamond_sword.json`):

```json
{
  "parent": "minecraft:item/handheld",
  "textures": {
    "layer0": "minecraft:item/diamond_sword"
  }
}
```

Resolucao:

1. ID logico: `minecraft:diamond_sword`
2. Model: `models/item/diamond_sword.json`
3. Textura: `textures/item/diamond_sword.png` (namespace `minecraft:item/...`)
4. Nome localizado: chave em `lang/en_us.json` (ex.: `item.minecraft.diamond_sword`)

Itens gerados a partir de bloco costumam apontar `layer0` para `minecraft:block/...`.

Casos especiais Java:

| Caso | Padrao neste dump |
|------|-------------------|
| Spawn eggs | so `spawn_egg.png` + `spawn_egg_overlay.png` (tint por entidade no client) |
| Pocao / tipped arrow | poucas bases + overlay colorido |
| Relogio / bussola | muitas frames (`clock_00`.., `compass_00`..) |
| Arco puxado | `bow_pulling_0/1/2` |
| Blocos animados | `textures/block/*.png.mcmeta` com `animation.frametime` |

---

## 4. Uso em addons Bedrock (este monorepo)

Bedrock **nao** le este dump diretamente. Ao portar referencia:

| Conceito Java | Equivalente Bedrock tipico |
|---------------|----------------------------|
| `textures/item/foo.png` | `resource_pack/textures/items/foo.png` (plural `items` comum) |
| `textures/block/foo.png` | `resource_pack/textures/blocks/foo.png` |
| `models/item` + parent | `item_texture.json` + attachables / geo quando preciso |
| `minecraft:apple` | `minecraft:apple` (mesmo ID vanilla no Script API) |
| Entity skin `textures/entity/...` | `textures/entity/...` no RP (caminho pode diferir) |

Checklist pratico:

1. Confirme o **nome de arquivo** neste dump (`iron_ingot`, nao `Iron Ingot`).
2. Para item **vanilla** em receita/loot/script, use ID `minecraft:<nome>` — nao precisa copiar textura.
3. Para item **custom** (`addon:`, `va:`), crie PNG novo no RP do addon + entrada em `item_texture.json` + lang.
4. Se precisar **derivar** arte vanilla (recolor, remix), trabalhe a partir destes PNG e renomeie para namespace proprio.
5. Mantenha isolamento: nao misture texturas entre `gollem_addon`, `villagers_addon` e `villager_soldiers` sem pedido.

Namespaces do monorepo: `addon:`, `va:`, `fv:` (+ secundarios do pack de soldados). Vanilla permanece `minecraft:`.

---

## 5. Catalogo de itens por categoria

Lista dos **582 PNG** em `textures/item/`. Cada nome e o stem do arquivo (= ID util para `minecraft:<nome>` na maioria dos casos).

Detalhe completo tambem em `minecraft-textures-catalog.md` e no JSON.

### 5.1 Barcos e balsas (18)

`acacia_boat`, `acacia_chest_boat`, `bamboo_chest_raft`, `bamboo_raft`, `birch_boat`, `birch_chest_boat`, `cherry_boat`, `cherry_chest_boat`, `dark_oak_boat`, `dark_oak_chest_boat`, `jungle_boat`, `jungle_chest_boat`, `mangrove_boat`, `mangrove_chest_boat`, `oak_boat`, `oak_chest_boat`, `spruce_boat`, `spruce_chest_boat`

### 5.2 Portas e placas (item) (34)

`acacia_door`, `acacia_hanging_sign`, `acacia_sign`, `bamboo_door`, `bamboo_hanging_sign`, `bamboo_sign`, `birch_door`, `birch_hanging_sign`, `birch_sign`, `cherry_door`, `cherry_hanging_sign`, `cherry_sign`, `crimson_door`, `crimson_hanging_sign`, `crimson_sign`, `dark_oak_door`, `dark_oak_hanging_sign`, `dark_oak_sign`, `iron_door`, `jungle_door`, `jungle_hanging_sign`, `jungle_sign`, `mangrove_door`, `mangrove_hanging_sign`, `mangrove_sign`, `oak_door`, `oak_hanging_sign`, `oak_sign`, `spruce_door`, `spruce_hanging_sign`, `spruce_sign`, `warped_door`, `warped_hanging_sign`, `warped_sign`

### 5.3 Pottery sherds (20)

`angler_pottery_sherd`, `archer_pottery_sherd`, `arms_up_pottery_sherd`, `blade_pottery_sherd`, `brewer_pottery_sherd`, `burn_pottery_sherd`, `danger_pottery_sherd`, `explorer_pottery_sherd`, `friend_pottery_sherd`, `heart_pottery_sherd`, `heartbreak_pottery_sherd`, `howl_pottery_sherd`, `miner_pottery_sherd`, `mourner_pottery_sherd`, `plenty_pottery_sherd`, `prize_pottery_sherd`, `sheaf_pottery_sherd`, `shelter_pottery_sherd`, `skull_pottery_sherd`, `snort_pottery_sherd`

### 5.4 Armaduras e equipamento (34)

`chainmail_boots`, `chainmail_chestplate`, `chainmail_helmet`, `chainmail_leggings`, `diamond_boots`, `diamond_chestplate`, `diamond_helmet`, `diamond_horse_armor`, `diamond_leggings`, `elytra`, `empty_armor_slot_boots`, `empty_armor_slot_chestplate`, `empty_armor_slot_helmet`, `empty_armor_slot_leggings`, `golden_boots`, `golden_chestplate`, `golden_helmet`, `golden_horse_armor`, `golden_leggings`, `iron_boots`, `iron_chestplate`, `iron_helmet`, `iron_horse_armor`, `iron_leggings`, `leather_boots`, `leather_chestplate`, `leather_helmet`, `leather_horse_armor`, `leather_leggings`, `netherite_boots`, `netherite_chestplate`, `netherite_helmet`, `netherite_leggings`, `turtle_helmet`

### 5.5 Ferramentas e armas (47)

`bow`, `brush`, `carrot_on_a_stick`, `diamond_axe`, `diamond_hoe`, `diamond_pickaxe`, `diamond_shovel`, `diamond_sword`, `empty_slot_axe`, `empty_slot_hoe`, `empty_slot_pickaxe`, `empty_slot_shovel`, `empty_slot_sword`, `fishing_rod`, `flint_and_steel`, `golden_axe`, `golden_hoe`, `golden_pickaxe`, `golden_shovel`, `golden_sword`, `iron_axe`, `iron_hoe`, `iron_pickaxe`, `iron_shovel`, `iron_sword`, `lead`, `name_tag`, `netherite_axe`, `netherite_hoe`, `netherite_pickaxe`, `netherite_shovel`, `netherite_sword`, `saddle`, `shears`, `spyglass`, `stone_axe`, `stone_hoe`, `stone_pickaxe`, `stone_shovel`, `stone_sword`, `trident`, `warped_fungus_on_a_stick`, `wooden_axe`, `wooden_hoe`, `wooden_pickaxe`, `wooden_shovel`, `wooden_sword`

### 5.6 Spawn egg (bases) (2)

`spawn_egg`, `spawn_egg_overlay`

### 5.7 Discos e buzinas (17)

`goat_horn`, `music_disc_11`, `music_disc_13`, `music_disc_5`, `music_disc_blocks`, `music_disc_cat`, `music_disc_chirp`, `music_disc_far`, `music_disc_mall`, `music_disc_mellohi`, `music_disc_otherside`, `music_disc_pigstep`, `music_disc_relic`, `music_disc_stal`, `music_disc_strad`, `music_disc_wait`, `music_disc_ward`

### 5.8 Padroes de banner (6)

`creeper_banner_pattern`, `flower_banner_pattern`, `globe_banner_pattern`, `mojang_banner_pattern`, `piglin_banner_pattern`, `skull_banner_pattern`

### 5.9 Corantes (16)

`black_dye`, `blue_dye`, `brown_dye`, `cyan_dye`, `gray_dye`, `green_dye`, `light_blue_dye`, `light_gray_dye`, `lime_dye`, `magenta_dye`, `orange_dye`, `pink_dye`, `purple_dye`, `red_dye`, `white_dye`, `yellow_dye`

### 5.10 Baldes (11)

`axolotl_bucket`, `bucket`, `cod_bucket`, `lava_bucket`, `milk_bucket`, `powder_snow_bucket`, `pufferfish_bucket`, `salmon_bucket`, `tadpole_bucket`, `tropical_fish_bucket`, `water_bucket`

### 5.11 Pocoes e flechas (8)

`arrow`, `lingering_potion`, `potion`, `potion_overlay`, `spectral_arrow`, `splash_potion`, `tipped_arrow_base`, `tipped_arrow_head`

### 5.12 Comida / consumiveis (32)

`apple`, `baked_potato`, `beef`, `beetroot`, `beetroot_soup`, `bread`, `carrot`, `chicken`, `chorus_fruit`, `cod`, `cookie`, `dried_kelp`, `glow_berries`, `golden_apple`, `golden_carrot`, `honey_bottle`, `melon_slice`, `mushroom_stew`, `mutton`, `poisonous_potato`, `porkchop`, `potato`, `pufferfish`, `pumpkin_pie`, `rabbit`, `rabbit_stew`, `rotten_flesh`, `salmon`, `spider_eye`, `suspicious_stew`, `sweet_berries`, `tropical_fish`

### 5.13 Materiais, gemas e drops (48)

`amethyst_shard`, `blaze_powder`, `blaze_rod`, `bone`, `bone_meal`, `brick`, `charcoal`, `clay_ball`, `coal`, `copper_ingot`, `diamond`, `echo_shard`, `emerald`, `empty_slot_ingot`, `ender_eye`, `ender_pearl`, `experience_bottle`, `feather`, `flint`, `ghast_tear`, `glowstone_dust`, `gold_ingot`, `gold_nugget`, `gunpowder`, `heart_of_the_sea`, `honeycomb`, `iron_ingot`, `iron_nugget`, `lapis_lazuli`, `leather`, `magma_cream`, `nautilus_shell`, `nether_brick`, `nether_star`, `netherite_ingot`, `netherite_scrap`, `paper`, `prismarine_crystals`, `prismarine_shard`, `quartz`, `rabbit_hide`, `raw_copper`, `raw_gold`, `raw_iron`, `redstone`, `slime_ball`, `string`, `sugar`

### 5.14 Smithing templates (17)

`coast_armor_trim_smithing_template`, `dune_armor_trim_smithing_template`, `eye_armor_trim_smithing_template`, `host_armor_trim_smithing_template`, `netherite_upgrade_smithing_template`, `raiser_armor_trim_smithing_template`, `rib_armor_trim_smithing_template`, `sentry_armor_trim_smithing_template`, `shaper_armor_trim_smithing_template`, `silence_armor_trim_smithing_template`, `snout_armor_trim_smithing_template`, `spire_armor_trim_smithing_template`, `tide_armor_trim_smithing_template`, `vex_armor_trim_smithing_template`, `ward_armor_trim_smithing_template`, `wayfinder_armor_trim_smithing_template`, `wild_armor_trim_smithing_template`

### 5.15 Armor trims (item) (1)

`empty_slot_smithing_template_armor_trim`

### 5.16 Minecarts (6)

`chest_minecart`, `command_block_minecart`, `furnace_minecart`, `hopper_minecart`, `minecart`, `tnt_minecart`

### 5.17 Livros e mapas (7)

`book`, `enchanted_book`, `filled_map`, `knowledge_book`, `map`, `writable_book`, `written_book`

### 5.18 Sementes e cultivos (11)

`beetroot_seeds`, `cocoa_beans`, `kelp`, `melon_seeds`, `nether_wart`, `pitcher_pod`, `pumpkin_seeds`, `sugar_cane`, `torchflower_seeds`, `wheat`, `wheat_seeds`

### 5.19 Fogos / fire charge (5)

`crossbow_firework`, `fire_charge`, `firework_rocket`, `firework_star`, `firework_star_overlay`

### 5.20 Redstone (subset item) (2)

`comparator`, `repeater`

### 5.21 Outros / frames / placeables (240)

`armor_stand`, `bamboo`, `barrier`, `bell`, `black_candle`, `blue_candle`, `bow_pulling_0`, `bow_pulling_1`, `bow_pulling_2`, `bowl`, `brewing_stand`, `broken_elytra`, `brown_candle`, `bundle`, `bundle_filled`, `cake`, `campfire`, `candle`, `cauldron`, `chain`, `clock_00`, `clock_01`, `clock_02`, `clock_03`, `clock_04`, `clock_05`, `clock_06`, `clock_07`, `clock_08`, `clock_09`, `clock_10`, `clock_11`, `clock_12`, `clock_13`, `clock_14`, `clock_15`, `clock_16`, `clock_17`, `clock_18`, `clock_19`, `clock_20`, `clock_21`, `clock_22`, `clock_23`, `clock_24`, `clock_25`, `clock_26`, `clock_27`, `clock_28`, `clock_29`, `clock_30`, `clock_31`, `clock_32`, `clock_33`, `clock_34`, `clock_35`, `clock_36`, `clock_37`, `clock_38`, `clock_39`, `clock_40`, `clock_41`, `clock_42`, `clock_43`, `clock_44`, `clock_45`, `clock_46`, `clock_47`, `clock_48`, `clock_49`, `clock_50`, `clock_51`, `clock_52`, `clock_53`, `clock_54`, `clock_55`, `clock_56`, `clock_57`, `clock_58`, `clock_59`, `clock_60`, `clock_61`, `clock_62`, `clock_63`, `compass_00`, `compass_01`, `compass_02`, `compass_03`, `compass_04`, `compass_05`, `compass_06`, `compass_07`, `compass_08`, `compass_09`, `compass_10`, `compass_11`, `compass_12`, `compass_13`, `compass_14`, `compass_15`, `compass_16`, `compass_17`, `compass_18`, `compass_19`, `compass_20`, `compass_21`, `compass_22`, `compass_23`, `compass_24`, `compass_25`, `compass_26`, `compass_27`, `compass_28`, `compass_29`, `compass_30`, `compass_31`, `cooked_beef`, `cooked_chicken`, `cooked_cod`, `cooked_mutton`, `cooked_porkchop`, `cooked_rabbit`, `cooked_salmon`, `crossbow_arrow`, `crossbow_pulling_0`, `crossbow_pulling_1`, `crossbow_pulling_2`, `crossbow_standby`, `cyan_candle`, `disc_fragment_5`, `dragon_breath`, `egg`, `empty_armor_slot_shield`, `empty_slot_amethyst_shard`, `empty_slot_diamond`, `empty_slot_emerald`, `empty_slot_lapis_lazuli`, `empty_slot_quartz`, `empty_slot_redstone_dust`, `empty_slot_smithing_template_netherite_upgrade`, `end_crystal`, `fermented_spider_eye`, `filled_map_markings`, `fishing_rod_cast`, `flower_pot`, `glass_bottle`, `glistering_melon_slice`, `glow_ink_sac`, `glow_item_frame`, `gray_candle`, `green_candle`, `hopper`, `ink_sac`, `item_frame`, `lantern`, `leather_boots_overlay`, `leather_chestplate_overlay`, `leather_helmet_overlay`, `leather_leggings_overlay`, `light`, `light_00`, `light_01`, `light_02`, `light_03`, `light_04`, `light_05`, `light_06`, `light_07`, `light_08`, `light_09`, `light_10`, `light_11`, `light_12`, `light_13`, `light_14`, `light_15`, `light_blue_candle`, `light_gray_candle`, `lime_candle`, `magenta_candle`, `mangrove_propagule`, `nether_sprouts`, `orange_candle`, `painting`, `phantom_membrane`, `pink_candle`, `pink_petals`, `pitcher_plant`, `pointed_dripstone`, `popped_chorus_fruit`, `purple_candle`, `rabbit_foot`, `recovery_compass_00`, `recovery_compass_01`, `recovery_compass_02`, `recovery_compass_03`, `recovery_compass_04`, `recovery_compass_05`, `recovery_compass_06`, `recovery_compass_07`, `recovery_compass_08`, `recovery_compass_09`, `recovery_compass_10`, `recovery_compass_11`, `recovery_compass_12`, `recovery_compass_13`, `recovery_compass_14`, `recovery_compass_15`, `recovery_compass_16`, `recovery_compass_17`, `recovery_compass_18`, `recovery_compass_19`, `recovery_compass_20`, `recovery_compass_21`, `recovery_compass_22`, `recovery_compass_23`, `recovery_compass_24`, `recovery_compass_25`, `recovery_compass_26`, `recovery_compass_27`, `recovery_compass_28`, `recovery_compass_29`, `recovery_compass_30`, `recovery_compass_31`, `red_candle`, `scute`, `sea_pickle`, `seagrass`, `shulker_shell`, `sniffer_egg`, `snowball`, `soul_campfire`, `soul_lantern`, `spyglass_model`, `stick`, `structure_void`, `totem_of_undying`, `turtle_egg`, `white_candle`, `yellow_candle`

---

## 6. Blocos (`textures/block/`)

Ha **928** PNG de bloco (faces, estados `_on`, `_top`, `_side`, portas `_bottom`/`_top`, etc.). Um bloco logico pode ter varias texturas.

Exemplos de familia de nome:

| Prefixo / familia | Exemplos |
|-------------------|----------|
| Madeiras | `oak_planks`, `spruce_log`, `bamboo_door_bottom` |
| Pedras | `stone`, `cobblestone`, `andesite`, `deepslate_*` |
| Minerios | `iron_ore`, `deepslate_diamond_ore`, `raw_iron_block` |
| Cobre | `copper_block`, `exposed_cut_copper`, `oxidized_copper` |
| Coloridos | `*_wool`, `*_concrete`, `*_terracotta`, `*_stained_glass` |
| Nether / End | `netherrack`, `glowstone`, `end_stone`, `purpur_block` |
| Redstone | `redstone_lamp_on`, `piston_side`, `observer_front` |

Lista completa: secao Blocos em `minecraft-textures-catalog.md` e chave `all_blocks` no JSON.

---

## 7. Entities, GUI, particulas, efeitos

### 7.1 Entity (subpastas)

| Subpasta | PNG |
|----------|-----|
| `allay` | 1 |
| `armorstand` | 1 |
| `axolotl` | 5 |
| `banner` | 41 |
| `bear` | 1 |
| `bed` | 16 |
| `bee` | 5 |
| `bell` | 1 |
| `boat` | 9 |
| `camel` | 1 |
| `cat` | 13 |
| `chest` | 10 |
| `chest_boat` | 9 |
| `conduit` | 7 |
| `cow` | 3 |
| `creeper` | 2 |
| `decorated_pot` | 22 |
| `end_crystal` | 2 |
| `enderdragon` | 4 |
| `enderman` | 2 |
| `fish` | 17 |
| `fox` | 4 |
| `frog` | 3 |
| `ghast` | 2 |
| `goat` | 1 |
| `hoglin` | 2 |
| `horse` | 19 |
| `illager` | 8 |
| `iron_golem` | 4 |
| `llama` | 22 |
| `panda` | 7 |
| `parrot` | 5 |
| `pig` | 2 |
| `piglin` | 3 |
| `player` | 18 |
| `projectiles` | 3 |
| `rabbit` | 8 |
| `sheep` | 2 |
| `shield` | 41 |
| `shulker` | 18 |
| `signs` | 22 |
| `skeleton` | 4 |
| `slime` | 2 |
| `sniffer` | 1 |
| `spider` | 2 |
| `squid` | 2 |
| `strider` | 3 |
| `tadpole` | 1 |
| `turtle` | 1 |
| `villager` | 27 |
| `warden` | 5 |
| `wither` | 3 |
| `wolf` | 4 |
| `zombie` | 4 |
| `zombie_villager` | 27 |
| _(arquivos soltos na raiz entity)_ | 29 |

### 7.2 Mob effects

`absorption`, `bad_omen`, `blindness`, `conduit_power`, `darkness`, `dolphins_grace`, `fire_resistance`, `glowing`, `haste`, `health_boost`, `hero_of_the_village`, `hunger`, `instant_damage`, `instant_health`, `invisibility`, `jump_boost`, `levitation`, `luck`, `mining_fatigue`, `nausea`, `night_vision`, `poison`, `regeneration`, `resistance`, `saturation`, `slow_falling`, `slowness`, `speed`, `strength`, `unluck`, `water_breathing`, `weakness`, `wither`

### 7.3 Paintings

`alban`, `aztec`, `aztec2`, `back`, `bomb`, `burning_skull`, `bust`, `courbet`, `creebet`, `donkey_kong`, `earth`, `fighters`, `fire`, `graham`, `kebab`, `match`, `pigscene`, `plant`, `pointer`, `pool`, `sea`, `skeleton`, `skull_and_roses`, `stage`, `sunset`, `void`, `wanderer`, `wasteland`, `water`, `wind`, `wither`

### 7.4 Particles (194) / GUI (86) / Trims (51)

Listas completas no JSON (`particle_textures`, `gui_textures`, `trims`, `entity_textures`).

---

## 8. Atlases Java

Arquivos em `atlases/` (referencia de packing Java; Bedrock usa atlases diferentes):

`armor_trims`, `banner_patterns`, `beds`, `blocks`, `chests`, `decorated_pot`, `mob_effects`, `paintings`, `particles`, `shield_patterns`, `shulker_boxes`, `signs`

---

## 9. Como consultar rapidamente

```powershell
# Itens cujo nome contem "iron"
Get-ChildItem "assets/texturas minecraft/textures/item" -Filter "*iron*.png" |
  Select-Object -ExpandProperty BaseName

# Blocos de cobre
Get-ChildItem "assets/texturas minecraft/textures/block" -Filter "*copper*.png" |
  Select-Object -ExpandProperty BaseName

# Model JSON de um item
Get-Content "assets/texturas minecraft/models/item/trident.json" -Raw

# Inventario gerado
$inv = Get-Content "docs/references/minecraft-textures-inventory.json" -Raw | ConvertFrom-Json
$inv.totals
```

Regenerar docs apos atualizar o dump:

```powershell
python docs/references/_gen_minecraft_textures_docs.py
```

---

## 10. Manutencao

- Se o dump em `assets/texturas minecraft` for atualizado (nova versao do jogo), regenere este doc + JSON.
- Preferir o JSON para busca programatica; o Markdown para leitura humana.
- Nao tratar este inventario como validacao in-game Bedrock.

*Documento gerado a partir dos arquivos locais do dump. Comportamento de rendering Java/Bedrock nao foi revalidado in-game nesta sessao.*
