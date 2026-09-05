# Unidades

Bioma visual: `mark_variant` 0 plains, 1 desert, 2 jungle, 3 savanna, 4 snow, 5 swamp, 6 taiga. Preservado no decreto quando o villager tem mark_variant.

`copy_past` e template interno, nao e unidade jogavel.

## Combatentes de linha

### `fv:villager_vanguard`

Defensor melee. Spawn de vila ou free_handle + arma melee (espada, machado, halberd, spear, pike). Gear default de spear. Pode virar cavalaria: interact com `fv:steed_saddled` (se estiver com pike, dropa a arma da mao). Camelo: interact com `fv:camel_war_saddled`.

### `fv:villager_ranged`

Arqueiro. Spawn de vila, decreto em fletcher, ou free_handle + bow/crossbow.

### `fv:villager_tanker`

Tank. Decreto em weaponsmith. Ganha XP ao matar familias `pillager` (3), `vindicator` (4), `evocation_illager` (5), `boss` (50), `mainboss` (100). A cada 100 XP sobe 1 level (max 4). No level 4, mais 100 XP dispara `fv:become_champion` → `fv:villager_champion`.

### `fv:villager_gunner`

Free_handle + item com tag `fv:guns` ou `fv:copper_boom`. Equipamento tipico: flintlock vazio (`fv:flintlock_musket_empty` em loot `gunner_gear`).

### `fv:villager_cavalry` / `fv:villager_camel`

Montados. Vanguard + `fv:steed_saddled` ou camelo saddled. Tambem summonados em functions de outpost. A entidade cavalry spawna `fv:steed` como mount.

### `fv:villager_champion`

Elite a partir do tanker no teto de level. Scale 1.1, knockback resist 0.6. Pode promover:

- Set **diamet** + `fv:vanguard_marshals_diamorite_sword` na mao + jogador com `fv:league_medal` → `fv:villager_league_swordthane`
- Set **diamorite** + `fv:diamorite_sovereign_halberd` na mao + jogador com `fv:league_general_badge` → `fv:villager_league_general`

## Workers

### `fv:villager_free_handle`

Coringa do decreto. Especializa com ferramentas (`hiring.md`). Clan leader proximo (range 16) pode convertê-lo em `fv:villager_clan_soldier` via spell.

### `fv:villager_healer`

Decreto em cleric (interact). Suporte.

### `fv:villager_builder`

Free_handle + `fv:get_back_hammer` (6 cobble + stick) ou `fv:copper_wrench` (4 copper_ingot). Trades de estruturas/cerco.

### `fv:villager_clumper`

Free_handle + picareta. Worker de ore; script `makingProduction.js` usa `fv:refine_inventory`.

## Clan e League

### `fv:villager_clan_leader`

Lider com trade por bioma (`trading/clan_leaders/{biome}_clan.json`). Surge do iron golem de vila ou structures. Converte free_handle proximo em clan_soldier.

### `fv:villager_clan_soldier`

Infantaria de clan. Origem: conversao pelo leader. `fv:league_medal` → `fv:villager_league_soldier`.

### `fv:villager_league_soldier`

Exercito League. Origem principal: medalha no clan_soldier. Medalha tambem aparece em loot `league_soldier_gear/buymedal`.

### `fv:villager_league_swordthane` / `fv:villager_league_general`

Elites League a partir do champion (gear + item de promocao). Badge de general: shapeless com as 7 `fv:{biome}_clan_medal`.

## Golems do jogador (nao sao soldados)

| ID | Como criar |
|---|---|
| `fv:iron_golem_guard` | Ritual script: abobora + 2 iron blocks |
| `fv:hay_golem` | Ritual abobora + hay; ou script do iron golem de vila |
| `fv:melon_golem` | craft `ms / m / sss` (2 melon_block + 4 stick) |
| `fv:bamboo_turret` | craft `sb / b / c` (bamboo_block, mosaic, bamboo) |
| `fv:copper_watcher`, `fv:shooter` | itens placeable / recipes de golems |
| `fv:catapult`, `fv:potato_cannon`, `fv:big_potato_cannon` | craft/placeable; disparo via scriptEvent |

## Inimigos (resumo)

Illagers por bioma, gunners, cavalry, undead, bosses (`fv:illager_generalissimo` e similares). Entram por features/structures e functions, nao por spawn_rules de soldado. Spawn natural documentado a parte: `fv:mysterious_merchant` (superficie), `fv:miner_trader` (subterraneo), `fv:mummy` (deserto noite), `fv:villager_skeleton`.
