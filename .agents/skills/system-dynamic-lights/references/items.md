# Fontes de luz

Matching: `item.typeId.includes(key)` na ordem dos grupos 6 → 9 → 11 → 13 → 15, depois de especiais. O primeiro hit ganha. Por isso `soul_lantern` fica em 13 (checado antes de `lantern` em 15) e `soul_campfire` fica em 13 (antes de `:campfire` em 15).

`catalyst` casa `sculk_catalyst`. `magma` casa qualquer ID com essa substring (`magma_block`, `magma_cream`, etc.).

## Especiais (antes dos grupos)

| Substring | Nivel | Special | Efeito extra |
|---|---|---|---|
| `lit_pumpkin` | 15 | `noOffhand` | Lore sem dica de offhand; function `light15` |
| `froglight` | 15 | `noOffhand` | Qualquer froglight |
| `sea_pickle` | 13 | `sea_pickle` | Function que tambem substitui agua; lore "You can use it underwater" |
| `ender_eye` | 6 | `noOffhand` | |
| `glow_berries` | 6 | `noOffhand` | |
| `experience_bottle` | 6 | `noOffhand` | |
| `enchanted_book` | 6 | `noOffhand` | |
| `glowstone_dust` | 6 | — | Explicitado antes do loop; mesmo nivel do grupo 6 |

## Grupo 15

Keys: `lit_pumpkin`, `lava_bucket`, `glowstone`, `shroomlight`, `beacon`, `minecraft:lantern`, `sea_lantern`, `:campfire`, `froglight`, `end_rod`, `conduit`.

`minecraft:lantern` evita casar so com a palavra solta cedo demais; `:campfire` casa `minecraft:campfire` sem precisar do prefixo completo.

## Grupo 13

Keys: `minecraft:torch`, `soul_lantern`, `soul_campfire`, `candle`, `copper_lantern`.

`candle` cobre as 16 cores e a candle simples. `copper_lantern` cobre waxed/oxidized/exposed via substring (tambem listadas em `LIGHT_ALL` para swap).

## Grupo 11

Keys: `crying_obsidian`, `soul_torch`.

## Grupo 9

Keys: `fire_charge`, `redstone_torch`, `ender_chest`, `enchanting_table`, `catalyst`, `totem_of_undying`, `nether_star`.

## Grupo 6

Keys: `enchanted_book`, `dragon_breath`, `ender_eye`, `magma`, `blaze_rod`, `blaze_powder`, `glow_ink_sac`, `glow_berries`, `glowstone_dust`, `experience_bottle`, `firefly_bush`, `glow_item_frame`, `brewing_stand`.

## Offhand swap (`LIGHT_ALL`)

`itemUse` sem bloco a 8 blocos, offhand vazia, `typeId === minecraft:<stem>`:

`black_candle` … `orange_candle` (16 cores), lanterns de cobre (waxed/weathered/oxidized/exposed), `dragon_breath`, `lava_bucket`, `glowstone`, `shroomlight`, `beacon`, `lantern`, `sea_lantern`, `campfire`, `end_rod`, `torch`, `soul_lantern`, `soul_campfire`, `candle`, `crying_obsidian`, `soul_torch`, `fire_charge`, `redstone_torch`, `ender_chest`, `enchanting_table`, `catalyst`, `totem_of_undying`, `nether_star`, `magma`, `blaze_rod`, `blaze_powder`, `glow_ink_sac`, `glowstone_dust`, `sea_pickle`, `glow_item_frame`, `brewing_stand`, `conduit`, `firefly_bush`.

Move o stack inteiro para offhand e limpa a mainhand. Itens `noOffhand` podem estar nesta lista (ex. glow_berries nao esta; sea_pickle esta). O swap nao consulta `noOffhand` — so a lista e a ausencia de bloco.

## Capacetes

Substring no item da Head slot; luz 15; tag `helmet_light`; bloqueia mao/offhand:

`lantern_gold_helmet`, `lantern_iron_helmet`, `lantern_diamond_helmet`, `lantern_netherite_helmet`, `lantern_chainmain_helmet` (typo chainmail no codigo), `lantern_copper_helmet`.

Definicoes desses itens nao estao no BP deste checkout — esperadas no RP ausente.

## Mobs (overworld)

| Condicao | Function |
|---|---|
| `minecraft:onfire` ou `minecraft:blaze` | `light11` em `~~1~` |
| `minecraft:magma_cube` | `light9` em `~~1~` |
| `minecraft:glow_squid` | `sea_pickle` em `~~1~` |
| item entity no chao com ID luminoso | function do nivel em `~~~` |

Tag `onFire` no mob enquanto brilha. `entityDie` desses tipos corre `no_light`.

## Lore

Primeira vez que o item aparece no inventario do jogador (lore vazio):

```text
§6Lightning: §7<N> Blocks
[+ linha offhand ou underwater]
§d[System Dynamic Lights]
```

Nao reescreve lore ja existente.
