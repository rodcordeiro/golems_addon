# Gollem Addon — Stone Golems

Addon proprio de Minecraft Bedrock que adiciona um golem de pedra com comportamento hostil/defensivo, modelo, textura, animacoes, particulas, item/bloco de nucleo, receita, loot table e spawn em biomas de montanha.

**Namespace:** `addon:`  
**Versao dos packs:** `1.0.19`  
**min_engine_version:** `1.20.10`  
**Monorepo:** pasta `gollem_addon/` (ver [`../README.md`](../README.md))

## Estado

Conteudo principal implementado nos packs. Em `1.0.19`: tame/dono, anim de spawn no controller, impacto com `addon:stone_impact`, remocao de `golem_anchor`. Validacao final in-game em `../test_world/` ainda necessaria (GOLEM-010/011).

Docs internos:

- [`AGENTS.md`](AGENTS.md)
- [`docs/backlog.md`](docs/backlog.md)
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

Golem `player_created`: alimentar com **lingote de ferro** para tame. Passa a seguir o dono e a reagir a quem o fere / a quem o dono fere.

## Comportamento (resumo)

- Vida inicial `40` / maxima `60`
- Movimento `0.25`, colisao `1.6 x 4.0`
- Ataque melee defensivo como caminho principal; projetil preservado (impacto com FX custom)
- Spawn natural: grupo `wild` (mira jogadores)
- Criado pelo jogador: grupo `player_created` (mira monstros); tame opcional com iron ingot

## Pontos de atencao

- Criacao manual, tame e FX de impacto precisam de aprovacao in-game — ver `docs/backlog.md` (GOLEM-010/011) e `docs/golem-012-004-testes.md`.
- Empacotamento CI: tags `v*` geram `stone_golems.<version>.mcaddon` a partir desta pasta.

## Validacao local

```powershell
Get-ChildItem -Recurse -Filter *.json | ForEach-Object {
  Get-Content -Raw $_.FullName | ConvertFrom-Json | Out-Null
}
```
