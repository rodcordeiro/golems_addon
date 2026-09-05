# Contratos tecnicos

Caminhos relativos a `addon/gollem_addon/`.

## Layout

```text
behavior_pack/
  blocks/golem_core.json          # addon:golem_core_block + structure check
  entities/golems/stone/
    stone_golem.json
    stone_projectile.json
    stone_impact_fx.json
  items/golem_core.json
  recipes/golem_core.json
  loot_tables/entities/stone_golem.json
  spawn_rules/golems/stone_golem.json
  functions/golems/spawn_stone_golem.mcfunction
resource_pack/
  entity/ animations/ animation_controllers/
  models/entity/stone_golem.geo.json
  particles/stone_impact.json (+ ground_break)
  render_controllers/ textures/ texts/ blocks.json
```

## Eventos da entidade

| Evento | Efeito |
|---|---|
| `minecraft:entity_spawned` | add `wild` |
| `player_created` | remove `wild`; add `player_created`, `can_tame`, `pre_tame_targets` |
| `addon:tamed` | remove `can_tame`, `pre_tame_targets`; add `tamed`, `tamed_targets` |

## Client

Controller: `initial_state: spawn` → idle apos anim / life_time. Projetil e impact_fx tem client entities. Textura golem 128×128.

## Historico util (nao reverter sem pedido)

- 1.0.18: sem projectile/shoot invalidos no mob; langs; spawn rules
- 1.0.19: sem golem_anchor; tame iron_ingot; impact FX
- 1.0.20: ranged primario; targets wild/pre-tame/tamed
- 1.0.21: swap explicito pre_tame_targets / tamed_targets + owner dmg ignore

## Regras de mudanca

1. Ler `AGENTS.md` / `README.md`.
2. Contrato BP ↔ RP (entity, models, anims, textures, lang).
3. Bump BP e RP juntos apos mudanca funcional.
4. Alinhar receita ↔ item ↔ bloco ↔ function ↔ eventos antes de fechar feature.
5. Gates: `docs/backlog.md`, `docs/gauntlet-ranged.md`, `docs/golem-012-004-testes.md`.

## Validacao

```powershell
Get-ChildItem addon/gollem_addon -Recurse -Filter *.json |
  ForEach-Object { Get-Content -Raw $_.FullName | ConvertFrom-Json | Out-Null }
Test-Path addon/gollem_addon/behavior_pack/manifest.json
Test-Path addon/gollem_addon/resource_pack/manifest.json
```

In-game: craft core → estrutura → tame → throw vs melee; spawn mountain. Sem Bedrock: **validacao in-game pendente**.
