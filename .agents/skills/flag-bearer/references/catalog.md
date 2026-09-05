# Catalogo de IDs

## Cores

`black`, `blue`, `brown`, `cyan`, `dark_green`, `gray`, `green`, `light_blue`, `light_gray`, `magenta`, `orange`, `pink`, `purple`, `red`, `white`, `yellow`.

## Wearable (item) ↔ Flagpole (entity)

Para cada cor e familia:

| Familia | Item | Flagpole entity |
|---|---|---|
| Gonfalon | `dcfb:{c}_gonfalon` | `dcfb:{c}_gonfalon_flagpole` |
| Swallow Tail Guidon | `dcfb:{c}_swallow_tail_guidon` | `dcfb:{c}_swallow_tail_guidon_flagpole` |
| Pear Tail Guidon | `dcfb:{c}_pear_tail_guidon` | `dcfb:{c}_pear_tail_guidon_flagpole` |
| Banneret | `dcfb:{c}_banneret` | `dcfb:{c}_banneret_flagpole` |
| Pear Tail Standard | `dcfb:{c}_pear_tail_standard` | `dcfb:{c}_pear_tail_standard_flagpole` |
| Pennon Tail Standard | `dcfb:{c}_pennon_tail_standard` | `dcfb:{c}_pennon_tail_standard_flagpole` |
| Rounded Tail Standard | `dcfb:{c}_rounded_tail_standard` | `dcfb:{c}_rounded_tail_standard_flagpole` |
| Rectangle Sashimono | `dcfb:{c}_rectangle_sashimono` | `dcfb:{c}_rectangle_sashimono_flagpole` |
| Square Sashimono | `dcfb:{c}_square_sashimono` | `dcfb:{c}_square_sashimono_flagpole` |

Lang tambem lista `item.spawn_egg.entity.dcfb:…_flagpole` para cada flagpole.

## Blocos / util

| ID | Nome (lang) |
|---|---|
| `dcfb:banner_table` | Banner Table (tile + entity no lang) |
| `dcfb:flagpole_stick` | Flagpole Stick |
| `dcfb:flagpole_block` | Flagpole Block |
| `dcfb:{c}_swallow_tail_guidon_flag` | Swallow Tail Guidon Flag (tile) |

`blocks.json` no RP so registra `dcfb:banner_table` (sound wood). Demais tiles dependem do BP ausente.

## Categorias do creative (lang)

`dcfb:gonfalons`, `dcfb:guidons`, `dcfb:bannerets`, `dcfb:pear_tail_standards`, `dcfb:pennon_tail_standards`, `dcfb:rounded_tail_standards`, `dcfb:sashimono_rectangle`, `dcfb:sashimono_square`, `dcfb:swallow_tail_guidon_flag_blocks`.

## Contagem aproximada

9 familias × 16 cores = **144** pares item/flagpole, mais tiles swallow-tail (16), stick, flagpole block, banner table.

## Typos conhecidos no lang

Alguns `entity.dcfb:light_gray…` perdem underscore (`light_graygonfalon_flagpole`, `light_graypear_tail_…`). Labels trocados em banneret light_blue/light_gray. `green_square_sashimono` lang diz "Green Rectangle Sashimono". Ao citar IDs, prefira o padrao com underscore; confira o arquivo se o jogo nao resolver.
