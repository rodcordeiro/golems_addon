# Receitas e obtencao

~160 JSONs em `behavior_pack/recipes/`. Nomes traduzidos nao substituem o ID. `UNDEFINED(#)` no dump original e key ausente no JSON fonte.

## Materiais

| Resultado | Como |
|---|---|
| `fv:steel_ingot` | blast_furnace: 1 iron_ingot |
| `fv:diamet_ingot` | 8 steel + 1 diamond (`iii / idi / iii`) |
| `fv:illudiamondite_ingot` | 8 illasteel + 1 diamond (mesmo padrao) |
| `fv:diamorite_ingot` | 8 diamet + 1 netherite_scrap (mesmo padrao) |
| `fv:imperial_forge_ingot` | 4 netherite_scrap + 4 illudiamondite + 1 `fv:imperial_forge_plate` |
| `fv:long_stick` | shapeless leather + stick |
| `fv:illasteel_ingot` | sem receita neste dump; loot/illager |

Escada de arma: wood/stone (subset) → copper → iron → steel → diamond → netherite (smithing) e ramo custom diamet / illasteel / illudiamondite / diamorite.

## Gestao (mesa)

| Resultado | Tipo | Ingredientes |
|---|---|---|
| `fv:paper_writable` | shapeless | feather + paper |
| `fv:identification_soldier_card` | ` i / ici / i ` | name_tag + 4 iron_nugget |
| `fv:bullet` | shapeless | gunpowder + iron_nugget + paper |
| `fv:team_call_horn` | shapeless | `fv:team_book_default` + goat_horn |
| `fv:team_attack_horn` | shapeless | call horn + red_dye |
| `fv:team_stand_horn` | shapeless | call horn + green_dye |
| `fv:league_general_badge` | shapeless | 7 clan medals (plains, desert, jungle, savanna, snow, swamp, taiga) |
| `fv:get_back_hammer` | `sss / sss / t ` | 6 cobblestone + stick |
| `fv:potato_explode` | shapeless | gunpowder + potato |

`fv:freehand_decree` e `fv:discharge_letter` saem da UI do paper writable, nao da mesa.

## Sem receita de mesa (trade / loot / UI)

| Item | Fonte documentada |
|---|---|
| `fv:command_flag` | mysterious merchant; clan leaders |
| `fv:team_book_default` | mysterious merchant; miner trader; UI pinta as 14 cores |
| `fv:league_medal` | loot `league_soldier_gear/buymedal`; trades League |
| `fv:{biome}_clan_medal` | clan / structures / leader |
| guns (flintlock, deadlight, percussion, reaper) | loot illager/gunner/chest |
| `fv:steed_saddled` / `fv:baby_steed` | mounts; interact em `fv:steed` |
| spawn eggs de algumas unidades | trades do builder / merchant (`set_actor_id`) |

## Armaduras craftaveis

Padrao vanilla de pecas com o lingote do set, salvo nota:

| Set | Notas |
|---|---|
| `fv:steel_*` | helmet/chest/legs/boots + tools (axe, hoe, pick, shovel, sword) |
| `fv:diamet_*` | helmet usa 5 diamet + 1 green_wool no topo |
| `fv:illasteel_*` / `fv:illudiamondite_*` | 4 pecas |
| tanker illudiamondite | upgrade do tanker illasteel + 8 illudiamondite |
| `fv:diamorite_*` | upgrade da peca diamet correspondente + lingotes diamorite |
| `fv:imperial_warlord_*` | `fv:imperial_forge_ingot`; helmet + red_wool |
| `fv:imperial_commander_*` | smithing: overforge plate + peca warlord + netherite_ingot |
| `fv:straw_hat_helmet` | 4 wheat |

## Golems craftaveis

| Resultado | Padrao | Ingredientes |
|---|---|---|
| `fv:melon_golem` | `ms / m / sss` | 2 melon_block + 4 stick |
| `fv:bamboo_turret` | `sb / b / c` | bamboo_block, mosaic, bamboo |

Iron golem guard e hay golem: rituais de bloco (abobora + iron / hay), nao JSON de crafting_table.

## Cobre

| Resultado | Ingredientes |
|---|---|
| `fv:copper_shield` | 1 copper + 6 planks |
| `fv:copper_wrench` | 4 copper |
| `fv:copper_boom` | 4 copper + gunpowder + string |

## Armas

Padroes e tiers: [weapons.md](weapons.md). Para um ID `fv:{tier}_{familia}`, aplique o padrao da familia com o item de material do tier. Netherite = smithing da diamond da mesma familia.

## Fornalha

`fv:steel_ingot` no blast_furnace a partir de iron_ingot. Nuggets vanilla a partir de `fv:raw_*_nugget` em furnace/blast.
