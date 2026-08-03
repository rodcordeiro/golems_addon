# Gollem Addon — Stone Golems

Addon proprio de Minecraft Bedrock que adiciona um golem de pedra com comportamento hostil/defensivo, modelo, textura, animacoes, particulas, item/bloco de nucleo, receita, loot table e spawn em biomas de montanha.

**Namespace:** `addon:`  
**Versao dos packs:** `1.0.21`  
**min_engine_version:** `1.20.10`  
**Monorepo:** pasta `gollem_addon/` (ver [`../README.md`](../README.md))

## Estado

Conteudo principal implementado nos packs. Em `1.0.21`: contrato pre-tame explicito (`pre_tame_targets` → `tamed_targets` no tame) + ignore de dano do dono. Combate **ranged primario**. Validacao in-game ainda necessaria (GOLEM-010/011/023).

Docs internos:

- [`AGENTS.md`](AGENTS.md)
- [`docs/backlog.md`](docs/backlog.md)
- [`docs/gauntlet-ranged.md`](docs/gauntlet-ranged.md)
- [`docs/golem-012-004-testes.md`](docs/golem-012-004-testes.md)

## Conteudo

- Entidade `addon:stone_golem`
- Projetil `addon:stone_projectile`
- FX de impacto `addon:stone_impact_fx` (particula `addon:stone_impact`)
- Item `addon:golem_core` / bloco `addon:golem_core_block`
- Receita do nucleo, loot table, spawn natural em superficie com tag `mountain`
- Client assets (modelo, textura `128x128`, animacoes, particulas, textos)

## Estrutura

```text
behavior_pack/
  blocks/
  entities/
  items/
  loot_tables/
  recipes/
  spawn_rules/
  functions/
  manifest.json

resource_pack/
  animation_controllers/
  animations/
  entity/
  models/
  particles/
  render_controllers/
  textures/
  texts/
  manifest.json
```

## Instalacao

1. Copie `behavior_pack/` e `resource_pack/` desta pasta para os diretorios de packs do Bedrock.
2. Ative os dois packs no mundo.

```text
%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\behavior_packs
%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\resource_packs
```

## Uso rapido

```mcfunction
/summon addon:stone_golem
/give @s addon:golem_core
/event entity @e[type=addon:stone_golem,c=1] player_created
```

### Receita do Golem Core

Crafting table:

```text
 G
RSR
 G
```

- `G` = bloco de ouro
- `R` = bloco de redstone
- `S` = pedra

Resultado: `addon:golem_core` (coloca `addon:golem_core_block`).

### Criacao manual

```text
  P
 SSS
  C
```

- `P` = carved pumpkin
- `S` = stone
- `C` = Golem Core

A estrutura completa consome os blocos e invoca `addon:stone_golem` com spawn event `player_created`.

### Tame / dono (`1.0.19`)

Golem `player_created`: alimentar com **lingote de ferro** para tame. Passa a seguir o dono, reagir a dano do/pelo dono e mirar **outros jogadores** (alem de monstros).

## Comportamento (resumo)

- Vida inicial `40` / maxima `60`
- Movimento `0.25`, colisao `1.6 x 4.0`
- Ataque primario: **arremesso** de `addon:stone_projectile` (impacto com FX custom); melee so como fallback perto (~3 blocos)
- Spawn natural: grupo `wild` — hostil a jogadores
- Criado pelo jogador: `player_created` mira **monstros**; apos tame (`iron_ingot`) mira monstros **e** outros players (nunca o dono)

## Pontos de atencao

- Criacao manual, tame, throw ranged e FX de impacto precisam de aprovacao in-game — ver `docs/backlog.md` (GOLEM-010/011/023), `docs/gauntlet-ranged.md` e `docs/golem-012-004-testes.md`.
- Empacotamento CI: tags `v*` geram `stone_golems.<version>.mcaddon` a partir desta pasta.

## Validacao local

```powershell
Get-ChildItem -Recurse -Filter *.json | ForEach-Object {
  Get-Content -Raw $_.FullName | ConvertFrom-Json | Out-Null
}
```
