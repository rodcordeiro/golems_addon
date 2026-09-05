# Armas

IDs de melee/cerco usam `fv:`. Guns tambem usam namespaces `flintlock_musket:`, `flintlock_pistol:`, `deadlight_rifle:`, `percussion_cap_musket:`, `golden_reaper:`, `snow:`.

Soldado usa a arma que estiver na mao. Variant client: 1 hand, 2 sword/axe, 3 spear melee, 4 halberd, 5 spear (controller vindicator), 6 bow.

## Familias melee (craft)

Cada familia e o mesmo padrao com o lingote/bloco do tier. Tiers com receita shaped completa: copper, iron, steel (`fv:steel_ingot`), diamond, diamet, illasteel, illudiamondite. Netherite: smithing da versao diamond + `minecraft:netherite_upgrade_smithing_template` + `minecraft:netherite_ingot`.

| Familia | Padrao | Ingredientes por craft |
|---|---|---|
| saber | `  i /  i  / s  ` | 2x material + stick |
| desert_sword | ` ii /  i  / s  ` | 3x material + stick |
| battle_axe | `iii / isi /  s ` | 5x material + 2 stick |
| hammer | ` ii /  ii / s  ` | 4x material + stick |
| pike | `  i /  s  / s  ` | 1x material + 2 `fv:long_stick` |
| javelin | `  i /  s ` | 1x material + 1 `fv:long_stick` |
| lance | ` ii / isi / s  ` | 4x material + 2 `fv:long_stick` |
| halberd | ` ii /  i  / s  ` | 3x material + 1 `fv:long_stick` |
| giant_sword | `#ii / iii / si#` | 6x material + stick; `#` no JSON fonte nao tem key (placeholder) |

`fv:long_stick`: shapeless leather + stick.

Subset extra:

- wooden/stone: halberd, javelin, pike, hammer (stone/wood onde existir)
- gold: saber, battle_axe, giant_sword
- `fv:steel_sword` / `fv:diamet_sword`: padrao vanilla `c / c / s`
- `fv:illasteel_sword` / `fv:illudiamondite_sword`: `i / i / s` (pasta illagers)
- `fv:get_back_hammer`: 6 cobblestone + stick — tambem contrata builder

ID resultante: `fv:{tier}_{familia}` (ex. `fv:iron_pike`, `fv:diamet_saber`).

## Boss / promocao

| Item | Como |
|---|---|
| `fv:vanguard_marshals_diamorite_sword` | craft blade + hilt (diamorite + gold) |
| `fv:diamorite_sovereign_halberd` | craft blade + spear_point + shaft (diamorite + emerald/gold) |
| `fv:giant_gemheart_broadsword_lv2/lv3` | smithing com `fv:imperial_forge_plate` / `fv:imperial_overforge_plate` |
| `fv:regeneration_axe_lv2/lv3` | idem |
| `fv:velocithief_blade_lv2/lv3` | idem |
| `fv:withering_spear_lv2/lv3` | idem |

Bases lv1 dessas armas de boss nao tem receita de mesa no dump — loot/boss.

## Guns

Sem receita de mesa no dump de 160 JSONs. Obtencao: loot de illagers/gunners e chests.

| Vazio (item inventario) | Carregado (namespace proprio) | Onde aparece |
|---|---|---|
| `fv:flintlock_musket_empty` | `flintlock_musket:bow` | loot `gunner_gear` |
| `fv:flintlock_pistol_empty` | `flintlock_pistol:bow` | illager savanna |
| `fv:percussion_cap_musket_empty` | `percussion_cap_musket:bow` | pillager gunner, chests |
| `fv:deadlight_rifle_empty` | `deadlight_rifle:bow` | cowboy/general savanna |
| `fv:golden_reaper_empty` | `golden_reaper:bow` | loot/boss |

Municao: `fv:bullet` = shapeless gunpowder + iron_nugget + paper. Scripts `Items/Flintlock*.js` etc. tratam use/reload. Tag `fv:guns` no item e o que o free_handle aceita para virar gunner.

## Cerco

| Item | Craft |
|---|---|
| `fv:potato_cannon` | 4x: stripped_bamboo_block + 2 planks (`b / oo`) |
| `fv:big_potato_cannon` | 2x: 2 stripped_bamboo_block + chest + 2 planks |
| `fv:potato_explode` | shapeless gunpowder + potato |
| `fv:catapult` | item/estrutura; disparo `shootCatapult.js` |

`fv:copper_boom`: ` cs / cgc / c ` — 4 copper + gunpowder + string. Contrata gunner.

## Escudos e util

`fv:copper_shield`: 1 copper + 6 planks. `fv:copper_wrench`: 4 copper (builder).
