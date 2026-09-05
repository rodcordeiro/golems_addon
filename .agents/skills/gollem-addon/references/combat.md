# Combate e dono

## Ciclo de grupos

| Fase | Evento / grupo | Mira |
|---|---|---|
| Wild | `minecraft:entity_spawned` → `wild` | Players (max 32); family inclui `monster` |
| Player-created | `player_created` → `player_created` + `can_tame` + `pre_tame_targets` | Monstros (exclui stone_golem / player_golem), max 35 |
| Tamed | `addon:tamed` via `iron_ingot` → `tamed` + `tamed_targets` | Monstros + players que nao sao owner |

`player_created` remove `wild`. Tame remove `can_tame` + `pre_tame_targets`.

## Tamed

- `follow_owner` (start 10 / stop 4 / max 48, teleport)
- `owner_hurt_by_target` / `owner_hurt_target`
- `damage_sensor`: dano do owner nao aplica (`deals_damage: false`)
- `hurt_by_target` ignora owner e families golem

## Ranged primario (1.0.20+)

- `behavior.ranged_attack` priority 2; `must_reach: false` nos target behaviors
- `shooter` → `addon:stone_projectile`
- Radius 28 / min 3; interval 2.0–4.0s
- Melee: `delayed_attack` priority 5 (fallback perto)

Projetil: damage 12 + knockback; power 1.6; gravity 0.05; on hit smoke + spawn `addon:stone_impact_fx` (particula `addon:stone_impact`).

## Loot

Tabela `loot_tables/entities/stone_golem.json`: redstone_dust (60), glowstone_dust (30), diamond (1).

## Home

`home` restriction_radius 60; follow_range 64; knockback_resistance 1.0; persistent.
