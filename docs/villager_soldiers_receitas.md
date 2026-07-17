# Receitas do Villager Soldiers

Fonte: `assets/villager_soldiers/behavior_pack/recipes`.

Este documento foi gerado por inspecao dos JSONs do addon de referencia `assets/villager_soldiers`. Os nomes abaixo usam IDs canonicos para evitar ambiguidade de traducao/encoding.

Observacao: `UNDEFINED(#)` indica um simbolo usado no pattern sem entrada em `key` no JSON original. Isso foi preservado como possivel problema/placeholder da receita fonte, nao corrigido aqui.

## Como registrar soldados

O item usado para registrar/nomear soldados e `fv:identification_soldier_card` (`Identification soldier card`).

Receita na crafting table:

```text
 i 
ici
 i 
```

- `i` = `minecraft:iron_nugget`
- `c` = `minecraft:name_tag`
- Resultado: `1x fv:identification_soldier_card`

Uso observado nos arquivos: segure o cartao na mao principal e interaja com um soldado/golem domesticado que seja seu. As entidades verificam `fv:identification_soldier_card`, disparam o evento `fv:dadinhdanh`, marcam a propriedade `fv:dadinhdanh` como `true` e o script `scripts/function/identificationOwner.js` adiciona uma tag de dono e define o nome como `<seu_nome> soldier`.

## Resumo

Total de receitas encontradas: 160.

## Golems e estruturas

| Resultado | Qtd | Tipo | Estacao | Padrao | Ingredientes | Arquivo |
|---|---:|---|---|---|---|---|
| `fv:bamboo_turret` | 1 | shaped | `crafting_table` | `sb /  b /  c` | 2x bamboo_block; 1x bamboo_mosaic; 1x bamboo | `golems/bamboo_turret.json` |
| `fv:melon_golem` | 1 | shaped | `crafting_table` | `ms  /  m  / sss` | 2x melon_block; 4x stick | `golems/melon_golem.json` |

## Armaduras

| Resultado | Qtd | Tipo | Estacao | Padrao | Ingredientes | Arquivo |
|---|---:|---|---|---|---|---|
| `fv:diamet_boots` | 1 | shaped | `crafting_table` | `i i / i i` | 4x fv:diamet_ingot | `armors/diamet_boots.json` |
| `fv:diamet_chestplate` | 1 | shaped | `crafting_table` | `i i / iii / iii` | 8x fv:diamet_ingot | `armors/diamet_chestplate.json` |
| `fv:diamet_helmet` | 1 | shaped | `crafting_table` | ` w  / iii / i i` | 5x fv:diamet_ingot; 1x minecraft:green_wool | `armors/diamet_helmet.json` |
| `fv:diamet_leggings` | 1 | shaped | `crafting_table` | `iii / i i / i i` | 7x fv:diamet_ingot | `armors/diamet_leggings.json` |
| `fv:diamorite_boots` | 1 | shaped | `crafting_table` | `iai / i i` | 1x fv:diamet_boots; 4x fv:diamorite_ingot | `armors/diamorite_boots.json` |
| `fv:diamorite_chestplate` | 1 | shaped | `crafting_table` | `iii / iai / iii` | 1x fv:diamet_chestplate; 8x fv:diamorite_ingot | `armors/diamorite_chestplate.json` |
| `fv:diamorite_helmet` | 1 | shaped | `crafting_table` | ` i  / iai /  i ` | 1x fv:diamet_helmet; 4x fv:diamorite_ingot | `armors/diamorite_helmet.json` |
| `fv:diamorite_leggings` | 1 | shaped | `crafting_table` | `iii / iai / i i` | 1x fv:diamet_leggings; 7x fv:diamorite_ingot | `armors/diamorite_leggings.json` |
| `fv:illasteel_boots` | 1 | shaped | `crafting_table` | `i i / i i` | 4x fv:illasteel_ingot | `armors/illasteel_boots.json` |
| `fv:illasteel_chestplate` | 1 | shaped | `crafting_table` | `i i / iii / iii` | 8x fv:illasteel_ingot | `armors/illasteel_chestplate.json` |
| `fv:illasteel_helmet` | 1 | shaped | `crafting_table` | `iii / i i` | 5x fv:illasteel_ingot | `armors/illasteel_helmet.json` |
| `fv:illasteel_leggings` | 1 | shaped | `crafting_table` | `iii / i i / i i` | 7x fv:illasteel_ingot | `armors/illasteel_leggings.json` |
| `fv:illudiamondite_boots` | 1 | shaped | `crafting_table` | `i i / i i` | 4x fv:illudiamondite_ingot | `armors/illudiamondite_boots.json` |
| `fv:illudiamondite_chestplate` | 1 | shaped | `crafting_table` | `i i / iii / iii` | 8x fv:illudiamondite_ingot | `armors/illudiamondite_chestplate.json` |
| `fv:illudiamondite_helmet` | 1 | shaped | `crafting_table` | `iii / i i` | 5x fv:illudiamondite_ingot | `armors/illudiamondite_helmet.json` |
| `fv:illudiamondite_leggings` | 1 | shaped | `crafting_table` | `iii / i i / i i` | 7x fv:illudiamondite_ingot | `armors/illudiamondite_leggings.json` |
| `fv:illudiamondite_tanker_chestplate` | 1 | shaped | `crafting_table` | `iii / iai / iii` | 1x fv:illasteel_tanker_chestplate; 8x fv:illudiamondite_ingot | `armors/illudiamondite_tanker_chestplate.json` |
| `fv:illudiamondite_tanker_helmet` | 1 | shaped | `crafting_table` | `iii / iai / iii` | 1x fv:illasteel_tanker_helmet; 8x fv:illudiamondite_ingot | `armors/illudiamondite_tanker_helmet.json` |
| `fv:imperial_commander_boots` | 1 | smithing_transform | `smithing_table` | `` | template: fv:imperial_overforge_plate; base: fv:imperial_warlord_boots; addition: minecraft:netherite_ingot | `armors/imperial_commander_boots.json` |
| `fv:imperial_commander_chestplate` | 1 | smithing_transform | `smithing_table` | `` | template: fv:imperial_overforge_plate; base: fv:imperial_warlord_chestplate; addition: minecraft:netherite_ingot | `armors/imperial_commander_chestplate.json` |
| `fv:imperial_commander_helmet` | 1 | smithing_transform | `smithing_table` | `` | template: fv:imperial_overforge_plate; base: fv:imperial_warlord_helmet; addition: minecraft:netherite_ingot | `armors/imperial_commander_helmet.json` |
| `fv:imperial_commander_leggings` | 1 | smithing_transform | `smithing_table` | `` | template: fv:imperial_overforge_plate; base: fv:imperial_warlord_leggings; addition: minecraft:netherite_ingot | `armors/imperial_commander_leggings.json` |
| `fv:imperial_warlord_boots` | 1 | shaped | `crafting_table` | `i i / i i` | 4x fv:imperial_forge_ingot | `armors/imperial_warlord_boots.json` |
| `fv:imperial_warlord_chestplate` | 1 | shaped | `crafting_table` | `i i / iii / iii` | 8x fv:imperial_forge_ingot | `armors/imperial_warlord_chestplate.json` |
| `fv:imperial_warlord_helmet` | 1 | shaped | `crafting_table` | ` w  / iii / i i` | 5x fv:imperial_forge_ingot; 1x minecraft:red_wool | `armors/imperial_warlord_helmet.json` |
| `fv:imperial_warlord_leggings` | 1 | shaped | `crafting_table` | `iii / i i / i i` | 7x fv:imperial_forge_ingot | `armors/imperial_warlord_leggings.json` |
| `fv:straw_hat_helmet` | 1 | shaped | `crafting_table` | ` w  / www` | 4x wheat | `armors/straw_hat.json` |

## Armas

| Resultado | Qtd | Tipo | Estacao | Padrao | Ingredientes | Arquivo |
|---|---:|---|---|---|---|---|
| `fv:big_potato_cannon` | 2 | shaped | `crafting_table` | `bb  / ooc` | 2x minecraft:stripped_bamboo_block; 1x chest; 2x planks | `weapons/big_potato_cannon.json` |
| `fv:copper_battle_axe` | 1 | shaped | `crafting_table` | `iii / isi /  s ` | 5x minecraft:copper_ingot; 2x minecraft:stick | `weapons/battle_axe/copper_battle_axe.json` |
| `fv:copper_desert_sword` | 1 | shaped | `crafting_table` | ` ii /  i  / s  ` | 3x minecraft:copper_ingot; 1x minecraft:stick | `weapons/desert_sword/copper_desert_sword.json` |
| `fv:copper_giant_sword` | 1 | shaped | `crafting_table` | `#ii / iii / si#` | 2x UNDEFINED(#); 6x minecraft:copper_ingot; 1x minecraft:stick | `weapons/giant_sword/copper_giant_sword.json` |
| `fv:copper_halberd` | 1 | shaped | `crafting_table` | ` ii /  i  / s  ` | 3x minecraft:copper_ingot; 1x fv:long_stick | `weapons/halberd/copper_halberd.json` |
| `fv:copper_hammer` | 1 | shaped | `crafting_table` | ` ii /  ii / s  ` | 4x minecraft:copper_ingot; 1x minecraft:stick | `weapons/hammer/copper_hammer.json` |
| `fv:copper_javelin` | 1 | shaped | `crafting_table` | `  i /  s ` | 1x minecraft:copper_ingot; 1x fv:long_stick | `weapons/javelin/copper_javelin.json` |
| `fv:copper_lance` | 1 | shaped | `crafting_table` | ` ii / isi / s  ` | 4x minecraft:copper_ingot; 2x fv:long_stick | `weapons/lance/copper_lance.json` |
| `fv:copper_pike` | 1 | shaped | `crafting_table` | `  i /  s  / s  ` | 1x minecraft:copper_ingot; 2x fv:long_stick | `weapons/pike/copper_pike.json` |
| `fv:copper_saber` | 1 | shaped | `crafting_table` | `  i /  i  / s  ` | 2x minecraft:copper_ingot; 1x minecraft:stick | `weapons/saber/copper_saber.json` |
| `fv:diamet_battle_axe` | 1 | shaped | `crafting_table` | `iii / isi /  s ` | 5x fv:diamet_ingot; 2x minecraft:stick | `weapons/battle_axe/diamet_battle_axe.json` |
| `fv:diamet_desert_sword` | 1 | shaped | `crafting_table` | ` ii /  i  / s  ` | 3x fv:diamet_ingot; 1x minecraft:stick | `weapons/desert_sword/diamet_desert_sword.json` |
| `fv:diamet_giant_sword` | 1 | shaped | `crafting_table` | `#ii / iii / si#` | 2x UNDEFINED(#); 6x fv:diamet_ingot; 1x minecraft:stick | `weapons/giant_sword/diamet_giant_sword.json` |
| `fv:diamet_halberd` | 1 | shaped | `crafting_table` | ` ii /  i  / s  ` | 3x fv:diamet_ingot; 1x fv:long_stick | `weapons/halberd/diamet_halberd.json` |
| `fv:diamet_hammer` | 1 | shaped | `crafting_table` | ` ii /  ii / s  ` | 4x fv:diamet_ingot; 1x minecraft:stick | `weapons/hammer/diamet_hammer.json` |
| `fv:diamet_javelin` | 1 | shaped | `crafting_table` | `  i /  s ` | 1x fv:diamet_ingot; 1x fv:long_stick | `weapons/javelin/diamet_javelin.json` |
| `fv:diamet_lance` | 1 | shaped | `crafting_table` | ` ii / isi / s  ` | 4x fv:diamet_ingot; 2x fv:long_stick | `weapons/lance/diamet_lance.json` |
| `fv:diamet_pike` | 1 | shaped | `crafting_table` | `  i /  s  / s  ` | 1x fv:diamet_ingot; 2x fv:long_stick | `weapons/pike/diamet_pike.json` |
| `fv:diamet_saber` | 1 | shaped | `crafting_table` | `  i /  i  / s  ` | 2x fv:diamet_ingot; 1x minecraft:stick | `weapons/saber/diamet_saber.json` |
| `fv:diamond_battle_axe` | 1 | shaped | `crafting_table` | `iii / isi /  s ` | 5x minecraft:diamond; 2x minecraft:stick | `weapons/battle_axe/diamond_battle_axe.json` |
| `fv:diamond_desert_sword` | 1 | shaped | `crafting_table` | ` ii /  i  / s  ` | 3x minecraft:diamond; 1x minecraft:stick | `weapons/desert_sword/diamond_desert_sword.json` |
| `fv:diamond_giant_sword` | 1 | shaped | `crafting_table` | `#ii / iii / si#` | 2x UNDEFINED(#); 6x minecraft:diamond; 1x minecraft:stick | `weapons/giant_sword/diamond_giant_sword.json` |
| `fv:diamond_halberd` | 1 | shaped | `crafting_table` | ` ii /  i  / s  ` | 3x minecraft:diamond; 1x fv:long_stick | `weapons/halberd/diamond_halberd.json` |
| `fv:diamond_hammer` | 1 | shaped | `crafting_table` | ` ii /  ii / s  ` | 4x minecraft:diamond; 1x minecraft:stick | `weapons/hammer/diamond_hammer.json` |
| `fv:diamond_javelin` | 1 | shaped | `crafting_table` | `  i /  s ` | 1x minecraft:diamond; 1x fv:long_stick | `weapons/javelin/diamond_javelin.json` |
| `fv:diamond_lance` | 1 | shaped | `crafting_table` | ` ii / isi / s  ` | 4x minecraft:diamond; 2x fv:long_stick | `weapons/lance/diamond_lance.json` |
| `fv:diamond_pike` | 1 | shaped | `crafting_table` | `  i /  s  / s  ` | 1x minecraft:diamond; 2x fv:long_stick | `weapons/pike/diamond_pike.json` |
| `fv:diamond_saber` | 1 | shaped | `crafting_table` | `  i /  i  / s  ` | 2x minecraft:diamond; 1x minecraft:stick | `weapons/saber/diamond_saber.json` |
| `fv:diamorite_sovereign_halberd` | 1 | shaped | `crafting_table` | `  h /  b / s  ` | 1x fv:diamorite_sovereign_halberd_blade; 1x fv:diamorite_sovereign_halberd_spear_point; 1x fv:diamorite_sovereign_halberd_shaft | `weapons/boss_weapons/diamorite_sovereign_halberd.json` |
| `fv:diamorite_sovereign_halberd_blade` | 1 | shaped | `crafting_table` | `dd / ded / d  ` | 5x fv:diamorite_ingot; 1x minecraft:emerald | `weapons/boss_weapons/diamorite_sovereign_halberd_blade.json` |
| `fv:diamorite_sovereign_halberd_shaft` | 1 | shaped | `crafting_table` | `  g /  g / d  ` | 1x fv:diamorite_ingot; 2x minecraft:gold_ingot | `weapons/boss_weapons/diamorite_sovereign_halberd_shaft.json` |
| `fv:diamorite_sovereign_halberd_spear_point` | 1 | shaped | `crafting_table` | `  d /  g / g  ` | 1x fv:diamorite_ingot; 2x minecraft:gold_ingot | `weapons/boss_weapons/diamorite_sovereign_halberd_spear_point.json` |
| `fv:get_back_hammer` | 1 | shaped | `crafting_table` | `sss / sss /  t ` | 6x minecraft:cobblestone; 1x minecraft:stick | `weapons/get_back_hammer.json` |
| `fv:giant_gemheart_broadsword_lv2` | 1 | smithing_transform | `smithing_table` | `` | template: fv:imperial_forge_plate; base: fv:giant_gemheart_broadsword; addition: minecraft:netherite_ingot | `weapons/boss_weapons/giant_gemheart_broadsword_lv2.json` |
| `fv:giant_gemheart_broadsword_lv3` | 1 | smithing_transform | `smithing_table` | `` | template: fv:imperial_overforge_plate; base: fv:giant_gemheart_broadsword_lv2; addition: minecraft:netherite_ingot | `weapons/boss_weapons/giant_gemheart_broadsword_lv3.json` |
| `fv:golden_battle_axe` | 1 | shaped | `crafting_table` | `iii / isi /  s ` | 5x minecraft:gold_ingot; 2x minecraft:stick | `weapons/battle_axe/golden_battle_axe.json` |
| `fv:golden_giant_sword` | 1 | shaped | `crafting_table` | `#ii / iii / si#` | 2x UNDEFINED(#); 6x minecraft:gold_ingot; 1x minecraft:stick | `weapons/giant_sword/golden_giant_sword.json` |
| `fv:golden_saber` | 1 | shaped | `crafting_table` | `  i /  i  / s  ` | 2x minecraft:gold_ingot; 1x minecraft:stick | `weapons/saber/golden_saber.json` |
| `fv:illasteel_battle_axe` | 1 | shaped | `crafting_table` | `iii / isi /  s ` | 5x fv:illasteel_ingot; 2x minecraft:stick | `weapons/battle_axe/illasteel_battle_axe.json` |
| `fv:illasteel_desert_sword` | 1 | shaped | `crafting_table` | ` ii /  i  / s  ` | 3x fv:illasteel_ingot; 1x minecraft:stick | `weapons/desert_sword/illasteel_desert_sword.json` |
| `fv:illasteel_giant_sword` | 1 | shaped | `crafting_table` | `#ii / iii / si#` | 2x UNDEFINED(#); 6x fv:illasteel_ingot; 1x minecraft:stick | `weapons/giant_sword/illasteel_giant_sword.json` |
| `fv:illasteel_halberd` | 1 | shaped | `crafting_table` | ` ii /  i  / s  ` | 3x fv:illasteel_ingot; 1x fv:long_stick | `weapons/halberd/illasteel_halberd.json` |
| `fv:illasteel_hammer` | 1 | shaped | `crafting_table` | ` ii /  ii / s  ` | 4x fv:illasteel_ingot; 1x minecraft:stick | `weapons/hammer/illasteel_hammer.json` |
| `fv:illasteel_javelin` | 1 | shaped | `crafting_table` | `  i /  s ` | 1x fv:illasteel_ingot; 1x fv:long_stick | `weapons/javelin/illasteel_javelin.json` |
| `fv:illasteel_lance` | 1 | shaped | `crafting_table` | ` ii / isi / s  ` | 4x fv:illasteel_ingot; 2x fv:long_stick | `weapons/lance/illasteel_lance.json` |
| `fv:illasteel_pike` | 1 | shaped | `crafting_table` | `  i /  s  / s  ` | 1x fv:illasteel_ingot; 2x fv:long_stick | `weapons/pike/illasteel_pike.json` |
| `fv:illasteel_saber` | 1 | shaped | `crafting_table` | `  i /  i  / s  ` | 2x fv:illasteel_ingot; 1x minecraft:stick | `weapons/saber/illasteel_saber.json` |
| `fv:illasteel_sword` | 1 | shaped | `crafting_table` | `i / i / s` | 2x fv:illasteel_ingot; 1x stick | `weapons/illagers/illasteel_sword.json` |
| `fv:illudiamondite_battle_axe` | 1 | shaped | `crafting_table` | `iii / isi /  s ` | 5x fv:illudiamondite_ingot; 2x minecraft:stick | `weapons/battle_axe/illudiamondite_battle_axe.json` |
| `fv:illudiamondite_desert_sword` | 1 | shaped | `crafting_table` | ` ii /  i  / s  ` | 3x fv:illudiamondite_ingot; 1x minecraft:stick | `weapons/desert_sword/illudiamondite_desert_sword.json` |
| `fv:illudiamondite_giant_sword` | 1 | shaped | `crafting_table` | `#ii / iii / si#` | 2x UNDEFINED(#); 6x fv:illudiamondite_ingot; 1x minecraft:stick | `weapons/giant_sword/illudiamondite_giant_sword.json` |
| `fv:illudiamondite_halberd` | 1 | shaped | `crafting_table` | ` ii /  i  / s  ` | 3x fv:illudiamondite_ingot; 1x fv:long_stick | `weapons/halberd/illudiamondite_halberd.json` |
| `fv:illudiamondite_hammer` | 1 | shaped | `crafting_table` | ` ii /  ii / s  ` | 4x fv:illudiamondite_ingot; 1x minecraft:stick | `weapons/hammer/illudiamondite_hammer.json` |
| `fv:illudiamondite_javelin` | 1 | shaped | `crafting_table` | `  i /  s ` | 1x fv:illudiamondite_ingot; 1x fv:long_stick | `weapons/javelin/illudiamondite_javelin.json` |
| `fv:illudiamondite_lance` | 1 | shaped | `crafting_table` | ` ii / isi / s  ` | 4x fv:illudiamondite_ingot; 2x fv:long_stick | `weapons/lance/illudiamondite_lance.json` |
| `fv:illudiamondite_pike` | 1 | shaped | `crafting_table` | `  i /  s  / s  ` | 1x fv:illudiamondite_ingot; 2x fv:long_stick | `weapons/pike/illudiamondite_pike.json` |
| `fv:illudiamondite_saber` | 1 | shaped | `crafting_table` | `  i /  i  / s  ` | 2x fv:illudiamondite_ingot; 1x minecraft:stick | `weapons/saber/illudiamondite_saber.json` |
| `fv:illudiamondite_sword` | 1 | shaped | `crafting_table` | `i / i / s` | 2x fv:illudiamondite_ingot; 1x minecraft:stick | `weapons/illagers/illudiamondite_sword.json` |
| `fv:iron_battle_axe` | 1 | shaped | `crafting_table` | `iii / isi /  s ` | 5x minecraft:iron_ingot; 2x minecraft:stick | `weapons/battle_axe/iron_battle_axe.json` |
| `fv:iron_desert_sword` | 1 | shaped | `crafting_table` | ` ii /  i  / s  ` | 3x minecraft:iron_ingot; 1x minecraft:stick | `weapons/desert_sword/iron_desert_sword.json` |
| `fv:iron_giant_sword` | 1 | shaped | `crafting_table` | `#ii / iii / si#` | 2x UNDEFINED(#); 6x minecraft:iron_ingot; 1x minecraft:stick | `weapons/giant_sword/iron_giant_sword.json` |
| `fv:iron_halberd` | 1 | shaped | `crafting_table` | ` ii /  i  / s  ` | 3x minecraft:iron_ingot; 1x fv:long_stick | `weapons/halberd/iron_halberd.json` |
| `fv:iron_hammer` | 1 | shaped | `crafting_table` | ` ii /  ii / s  ` | 4x minecraft:iron_ingot; 1x minecraft:stick | `weapons/hammer/iron_hammer.json` |
| `fv:iron_javelin` | 1 | shaped | `crafting_table` | `  i /  s ` | 1x minecraft:iron_ingot; 1x fv:long_stick | `weapons/javelin/iron_javelin.json` |
| `fv:iron_lance` | 1 | shaped | `crafting_table` | ` ii / isi / s  ` | 4x minecraft:iron_ingot; 2x fv:long_stick | `weapons/lance/iron_lance.json` |
| `fv:iron_pike` | 1 | shaped | `crafting_table` | `  i /  s  / s  ` | 1x minecraft:iron_ingot; 2x fv:long_stick | `weapons/pike/iron_pike.json` |
| `fv:iron_saber` | 1 | shaped | `crafting_table` | `  i /  i  / s  ` | 2x minecraft:iron_ingot; 1x minecraft:stick | `weapons/saber/iron_saber.json` |
| `fv:league_general_badge` | 1 | shapeless | `crafting_table` | `` | 1x fv:desert_clan_medal; 1x fv:jungle_clan_medal; 1x fv:plains_clan_medal; 1x fv:savanna_clan_medal; 1x fv:snow_clan_medal; 1x fv:swamp_clan_medal; 1x fv:taiga_clan_medal | `weapons/league_items/league_general_badge.json` |
| `fv:netherite_battle_axe` | 1 | smithing_transform | `smithing_table` | `` | template: minecraft:netherite_upgrade_smithing_template; base: fv:diamond_battle_axe; addition: minecraft:netherite_ingot | `weapons/battle_axe/netherite_battle_axe.json` |
| `fv:netherite_desert_sword` | 1 | smithing_transform | `smithing_table` | `` | template: minecraft:netherite_upgrade_smithing_template; base: fv:diamond_desert_sword; addition: minecraft:netherite_ingot | `weapons/desert_sword/netherite_desert_sword.json` |
| `fv:netherite_giant_sword` | 1 | smithing_transform | `smithing_table` | `` | template: minecraft:netherite_upgrade_smithing_template; base: fv:diamond_giant_sword; addition: minecraft:netherite_ingot | `weapons/giant_sword/netherite_giant_sword.json` |
| `fv:netherite_halberd` | 1 | smithing_transform | `smithing_table` | `` | template: minecraft:netherite_upgrade_smithing_template; base: fv:diamond_halberd; addition: minecraft:netherite_ingot | `weapons/halberd/netherite_halberd.json` |
| `fv:netherite_hammer` | 1 | smithing_transform | `smithing_table` | `` | template: minecraft:netherite_upgrade_smithing_template; base: fv:diamond_hammer; addition: minecraft:netherite_ingot | `weapons/hammer/netherite_hammer.json` |
| `fv:netherite_javelin` | 1 | smithing_transform | `smithing_table` | `` | template: minecraft:netherite_upgrade_smithing_template; base: fv:diamond_javelin; addition: minecraft:netherite_ingot | `weapons/javelin/netherite_javelin.json` |
| `fv:netherite_lance` | 1 | smithing_transform | `smithing_table` | `` | template: minecraft:netherite_upgrade_smithing_template; base: fv:diamond_lance; addition: minecraft:netherite_ingot | `weapons/lance/netherite_lance.json` |
| `fv:netherite_pike` | 1 | smithing_transform | `smithing_table` | `` | template: minecraft:netherite_upgrade_smithing_template; base: fv:diamond_pike; addition: minecraft:netherite_ingot | `weapons/pike/netherite_pike.json` |
| `fv:netherite_saber` | 1 | smithing_transform | `smithing_table` | `` | template: minecraft:netherite_upgrade_smithing_template; base: fv:diamond_saber; addition: minecraft:netherite_ingot | `weapons/saber/netherite_saber.json` |
| `fv:potato_cannon` | 4 | shaped | `crafting_table` | `b  / oo` | 1x minecraft:stripped_bamboo_block; 2x planks | `weapons/potato_cannon.json` |
| `fv:regeneration_axe_lv2` | 1 | smithing_transform | `smithing_table` | `` | template: fv:imperial_forge_plate; base: fv:regeneration_axe; addition: minecraft:netherite_ingot | `weapons/boss_weapons/regeneration_axe_lv2.json` |
| `fv:regeneration_axe_lv3` | 1 | smithing_transform | `smithing_table` | `` | template: fv:imperial_overforge_plate; base: fv:regeneration_axe_lv2; addition: minecraft:netherite_ingot | `weapons/boss_weapons/regeneration_axe_lv3.json` |
| `fv:steel_battle_axe` | 1 | shaped | `crafting_table` | `iii / isi /  s ` | 5x fv:steel_ingot; 2x minecraft:stick | `weapons/battle_axe/steel_battle_axe.json` |
| `fv:steel_desert_sword` | 1 | shaped | `crafting_table` | ` ii /  i  / s  ` | 3x fv:steel_ingot; 1x minecraft:stick | `weapons/desert_sword/steel_desert_sword.json` |
| `fv:steel_giant_sword` | 1 | shaped | `crafting_table` | `#ii / iii / si#` | 2x UNDEFINED(#); 6x fv:steel_ingot; 1x minecraft:stick | `weapons/giant_sword/steel_giant_sword.json` |
| `fv:steel_halberd` | 1 | shaped | `crafting_table` | ` ii /  i  / s  ` | 3x fv:steel_ingot; 1x fv:long_stick | `weapons/halberd/steel_halberd.json` |
| `fv:steel_hammer` | 1 | shaped | `crafting_table` | ` ii /  ii / s  ` | 4x fv:steel_ingot; 1x minecraft:stick | `weapons/hammer/steel_hammer.json` |
| `fv:steel_javelin` | 1 | shaped | `crafting_table` | `  i /  s ` | 1x fv:steel_ingot; 1x fv:long_stick | `weapons/javelin/steel_javelin.json` |
| `fv:steel_lance` | 1 | shaped | `crafting_table` | ` ii / isi / s  ` | 4x fv:steel_ingot; 2x fv:long_stick | `weapons/lance/steel_lance.json` |
| `fv:steel_pike` | 1 | shaped | `crafting_table` | `  i /  s  / s  ` | 1x fv:steel_ingot; 2x fv:long_stick | `weapons/pike/steel_pike.json` |
| `fv:steel_saber` | 1 | shaped | `crafting_table` | `  i /  i  / s  ` | 2x fv:steel_ingot; 1x minecraft:stick | `weapons/saber/steel_saber.json` |
| `fv:stone_halberd` | 1 | shaped | `crafting_table` | ` ii /  i  / s  ` | 3x minecraft:cobblestone; 1x fv:long_stick | `weapons/halberd/stone_halberd.json` |
| `fv:stone_hammer` | 1 | shaped | `crafting_table` | ` ii /  ii / s  ` | 4x minecraft:cobblestone; 1x minecraft:stick | `weapons/hammer/stone_hammer.json` |
| `fv:stone_javelin` | 1 | shaped | `crafting_table` | `  i /  s ` | 1x minecraft:cobblestone; 1x fv:long_stick | `weapons/javelin/stone_javelin.json` |
| `fv:stone_pike` | 1 | shaped | `crafting_table` | `  i /  s  / s  ` | 1x minecraft:cobblestone; 2x fv:long_stick | `weapons/pike/stone_pike.json` |
| `fv:vanguard_marshals_diamorite_blade` | 1 | shaped | `crafting_table` | ` d  / dgd / dgd` | 5x fv:diamorite_ingot; 2x minecraft:gold_ingot | `weapons/boss_weapons/vanguard_marshals_diamorite_blade.json` |
| `fv:vanguard_marshals_diamorite_hilt` | 1 | shaped | `crafting_table` | `dgd / ggg /  d ` | 3x fv:diamorite_ingot; 4x minecraft:gold_ingot | `weapons/boss_weapons/vanguard_marshals_diamorite_hilt.json` |
| `fv:vanguard_marshals_diamorite_sword` | 1 | shaped | `crafting_table` | `b / h` | 1x fv:vanguard_marshals_diamorite_blade; 1x fv:vanguard_marshals_diamorite_hilt | `weapons/boss_weapons/vanguard_marshals_diamorite_sword.json` |
| `fv:velocithief_blade_lv2` | 1 | smithing_transform | `smithing_table` | `` | template: fv:imperial_forge_plate; base: fv:velocithief_blade; addition: minecraft:netherite_ingot | `weapons/boss_weapons/velocithief_blade_lv2.json` |
| `fv:velocithief_blade_lv3` | 1 | smithing_transform | `smithing_table` | `` | template: fv:imperial_overforge_plate; base: fv:velocithief_blade_lv2; addition: minecraft:netherite_ingot | `weapons/boss_weapons/velocithief_blade_lv3.json` |
| `fv:withering_spear_lv2` | 1 | smithing_transform | `smithing_table` | `` | template: fv:imperial_forge_plate; base: fv:withering_spear; addition: minecraft:netherite_ingot | `weapons/boss_weapons/withering_spear_lv2.json` |
| `fv:withering_spear_lv3` | 1 | smithing_transform | `smithing_table` | `` | template: fv:imperial_overforge_plate; base: fv:withering_spear_lv2; addition: minecraft:netherite_ingot | `weapons/boss_weapons/withering_spear_lv3.json` |
| `fv:wooden_halberd` | 1 | shaped | `crafting_table` | ` ii /  i  / s  ` | 3x planks; 1x fv:long_stick | `weapons/halberd/wooden_halberd.json` |
| `fv:wooden_javelin` | 1 | shaped | `crafting_table` | `  i /  s ` | 1x planks; 1x fv:long_stick | `weapons/javelin/wooden_javelin.json` |

## Ferramentas e utilitarios

| Resultado | Qtd | Tipo | Estacao | Padrao | Ingredientes | Arquivo |
|---|---:|---|---|---|---|---|
| `fv:bullet` | 1 | shapeless | `crafting_table` | `` | 1x minecraft:gunpowder; 1x minecraft:iron_nugget; 1x minecraft:paper | `tools/bullet.json` |
| `fv:identification_soldier_card` | 1 | shaped | `crafting_table` | ` i  / ici /  i ` | 1x minecraft:name_tag; 4x minecraft:iron_nugget | `tools/identification_soldier_card.json` |
| `fv:paper_writable` | 1 | shapeless | `crafting_table` | `` | 1x feather; 1x paper | `tools/paper_writable.json` |
| `fv:potato_explode` | 1 | shapeless | `crafting_table` | `` | 1x minecraft:gunpowder; 1x minecraft:potato | `tools/potato_explode.json` |
| `fv:team_attack_horn` | 1 | shapeless | `crafting_table` | `` | 1x fv:team_call_horn; 1x red_dye | `tools/team_attack_horn.json` |
| `fv:team_call_horn` | 1 | shapeless | `crafting_table` | `` | 1x fv:team_book_default; 1x minecraft:goat_horn | `tools/team_call_horn.json` |
| `fv:team_stand_horn` | 1 | shapeless | `crafting_table` | `` | 1x fv:team_call_horn; 1x green_dye | `tools/team_stand_horn.json` |

## Grupo de cobre

| Resultado | Qtd | Tipo | Estacao | Padrao | Ingredientes | Arquivo |
|---|---:|---|---|---|---|---|
| `fv:copper_boom` | 1 | shaped | `crafting_table` | ` cs / cgc /  c ` | 4x copper_ingot; 1x gunpowder; 1x string | `copper_group/copper_boom.json` |
| `fv:copper_shield` | 1 | shaped | `crafting_table` | `wcw / www /  w ` | 1x minecraft:copper_ingot; 6x planks | `copper_group/copper_shield.json` |
| `fv:copper_wrench` | 1 | shaped | `crafting_table` | `c c /  c  /  c ` | 4x minecraft:copper_ingot | `copper_group/copper_wrench.json` |

## Materiais

| Resultado | Qtd | Tipo | Estacao | Padrao | Ingredientes | Arquivo |
|---|---:|---|---|---|---|---|
| `fv:diamet_ingot` | 1 | shaped | `crafting_table` | `iii / idi / iii` | 1x minecraft:diamond; 8x fv:steel_ingot | `materials/diamet_ingot.json` |
| `fv:diamorite_ingot` | 1 | shaped | `crafting_table` | `iii / idi / iii` | 1x minecraft:netherite_scrap; 8x fv:diamet_ingot | `materials/diamorite_ingot.json` |
| `fv:illudiamondite_ingot` | 1 | shaped | `crafting_table` | `iii / idi / iii` | 1x minecraft:diamond; 8x fv:illasteel_ingot | `materials/illudiamondite_ingot.json` |
| `fv:imperial_forge_ingot` | 1 | shaped | `crafting_table` | `ccc / cti / iii` | 4x minecraft:netherite_scrap; 4x fv:illudiamondite_ingot; 1x fv:imperial_forge_plate | `materials/imperial_forge_ingot.json` |

## Ferramentas e armaduras de aco

| Resultado | Qtd | Tipo | Estacao | Padrao | Ingredientes | Arquivo |
|---|---:|---|---|---|---|---|
| `fv:diamet_sword` | 1 | shaped | `crafting_table` | `c / c / s` | 2x fv:diamet_ingot; 1x minecraft:stick | `vanillas/diamet_sword.json` |
| `fv:long_stick` | 1 | shapeless | `crafting_table` | `` | 1x minecraft:leather; 1x minecraft:stick | `vanillas/long_stick.json` |
| `fv:steel_axe` | 1 | shaped | `crafting_table` | `cc / cs /  s` | 3x fv:steel_ingot; 2x minecraft:stick | `vanillas/steel_axe.json` |
| `fv:steel_boots` | 1 | shaped | `crafting_table` | `c c / c c` | 4x fv:steel_ingot | `vanillas/steel_boots.json` |
| `fv:steel_chestplate` | 1 | shaped | `crafting_table` | `c c / ccc / ccc` | 8x fv:steel_ingot | `vanillas/steel_chestplate.json` |
| `fv:steel_helmet` | 1 | shaped | `crafting_table` | `ccc / c c` | 5x fv:steel_ingot | `vanillas/steel_helmet.json` |
| `fv:steel_hoe` | 1 | shaped | `crafting_table` | `cc  /  s  /  s ` | 2x fv:steel_ingot; 2x minecraft:stick | `vanillas/steel_hoe.json` |
| `fv:steel_leggings` | 1 | shaped | `crafting_table` | `ccc / c c / c c` | 7x fv:steel_ingot | `vanillas/steel_leggings.json` |
| `fv:steel_pickaxe` | 1 | shaped | `crafting_table` | `ccc /  s  /  s ` | 3x fv:steel_ingot; 2x minecraft:stick | `vanillas/steel_pickaxe.json` |
| `fv:steel_shovel` | 1 | shaped | `crafting_table` | `c / s / s` | 1x fv:steel_ingot; 2x minecraft:stick | `vanillas/steel_shovel.json` |
| `fv:steel_sword` | 1 | shaped | `crafting_table` | `c / c / s` | 2x fv:steel_ingot; 1x minecraft:stick | `vanillas/steel_sword.json` |

## Fornalha e alto-forno

| Resultado | Qtd | Tipo | Estacao | Padrao | Ingredientes | Arquivo |
|---|---:|---|---|---|---|---|
| `fv:steel_ingot` | 1 | furnace | `blast_furnace` | `` | 1x minecraft:iron_ingot | `furnaces_recipe/steel_ingot.json` |
| `minecraft:copper_nugget` | 1 | furnace | `furnace, blast_furnace` | `` | 1x fv:raw_copper_nugget | `furnaces_recipe/raw_copper_nugget.json` |
| `minecraft:gold_nugget` | 1 | furnace | `furnace, blast_furnace` | `` | 1x fv:raw_gold_nugget | `furnaces_recipe/raw_gold_nugget.json` |
| `minecraft:iron_nugget` | 1 | furnace | `furnace, blast_furnace` | `` | 1x fv:raw_iron_nugget | `furnaces_recipe/raw_iron_nugget.json` |

