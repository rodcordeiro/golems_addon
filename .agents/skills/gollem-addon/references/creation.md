# Criacao e spawn

## Receita do nucleo

Crafting table → `addon:golem_core`:

```text
 G
RSR
 G
```

G = gold_block, R = redstone_block, S = stone. Unlock: stone + gold_block.

Item coloca o bloco `addon:golem_core_block` (`minecraft:block_placer`).

## Estrutura manual

```text
  P
 SSS
  C
```

P = carved_pumpkin (Y+2 do core), S = stone (Y+1, X-1..X+1, mesmo Z), C = golem_core_block.

No interact do core (`addon:check_golem_structure`): se vizinho Y+2 tem tag pumpkin e o padrao stone bate, roda `function golems/spawn_stone_golem`:

1. `summon addon:stone_golem ~ ~1 ~ player_created`
2. Remove stones da fileira, pumpkin e o proprio core.

So o eixo Z do check atual e o padrao flat N/S no JSON do bloco (linha stone em X). Validar in-game (GOLEM-011).

## Spawn natural

`spawn_rules`: superficie, dificuldade easy–hard, brightness 0–12, weight 20, herd 1, density surface 2, biome tag `mountain`. Population `monster`. Evento `minecraft:entity_spawned` → grupo `wild`.

## Debug

```mcfunction
/summon addon:stone_golem
/event entity @e[type=addon:stone_golem,c=1] player_created
/give @s addon:golem_core
```
