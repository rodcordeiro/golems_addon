# Villagers Addon — Minerador de Tunel

Addon proprio que complementa o [Villager Soldiers](../villager_soldiers/README.md) com um villager trabalhador que faz tunel 3x3, coleta ores e deposita em copper chest.

**Namespace:** `va:`  
**Versao dos packs:** `1.0.2`  
**min_engine_version:** `1.21.130`  
**Script API:** `@minecraft/server` `2.4.0`  
**Monorepo:** pasta `villagers_addon/` (ver [`../README.md`](../README.md))

## Estado

MVP + Milestone 2 (MINER-012..016) em codigo. MINER-010 retomada corrigida em 1.0.1 — **revalidar in-game**. Milestone 2 **nao testada in-game**.

Docs:

- [`AGENTS.md`](AGENTS.md)
- [`docs/backlog.md`](docs/backlog.md) — decisoes e tickets
- [`docs/IDEIA_MINERADOR.md`](docs/IDEIA_MINERADOR.md) — contexto / ideia do minerador
- [`docs/IDEIA_RAILER.md`](docs/IDEIA_RAILER.md) — ideia do Railer (maturacao; RAILER-001)

## Dependencia

Soft-dependencia de **uso** no Villager Soldiers:

1. Ative Behavior + Resource do Soldiers (`fv:`).
2. Ative Behavior + Resource deste addon (`va:`).
3. Contrate um `fv:villager_free_handle` (fluxo do decreto do Soldiers).
4. Use `va:mining_contract` no free_handle para virar `va:villager_miner`.

Sem Soldiers, o pack carrega, mas o hire do minerador nao tem alvo.

## Conteudo

| ID | Papel |
|----|-------|
| `va:mining_contract` | Item de contratacao |
| `va:villager_miner` | Minerador de Tunel |
| `va:tunnel_start_banner` | Banner placeable de inicio de tunel (origem compartilhada) |
| `va:tunnel_start_banner_marker` | Entidade marcadora do banner |

- Receita shaped (crafting table): picareta de madeira em cima do papel → contrato (picareta consumida)

```text
P
A
```

- `P` = wooden_pickaxe
- `A` = paper
- Tunel **3x3** na direcao do olhar do jogador no hire
- Ore → inventario; stone/deepslate/netherrack/cobble → destruidos sem loot
- Inventario cheio → deposita cargo no copper chest mais proximo (raio 24); se nao achar, volta a origem e aguarda
- Banner de inicio sobrescreve o ponto de hire como origem (distancia / retorno) para miners do mesmo dono
- Formigueiro: desvios laterais ocasionais; escada ~10% (+/-2 Y)
- Picareta de trabalho entregue depois (interact); sem picareta nao cava
- Interact (dono, mao vazia) alterna `stay_mode`
- Limite 64 blocos; 1 passo a cada 10 ticks; stop em lava/agua/bedrock

Visual baseado no clumper do Soldiers (geo/texturas adaptadas para `va:`). Banner com geo `geometry.va_tp_banner` (padrao Soldiers, IDs `va:`).

## Estrutura

```text
behavior_pack/
  entities/
  items/
  recipes/
  scripts/          main, hire, minerLoop, deposit, tunnelBanner, ...
  manifest.json

resource_pack/
  entity/
  models/
  animations/
  render_controllers/
  textures/
  texts/
  manifest.json

docs/
  backlog.md
  IDEIA_MINERADOR.md
  IDEIA_RAILER.md
```

## Instalacao

1. Copie `behavior_pack/` e `resource_pack/` desta pasta para o Bedrock.
2. Copie tambem os packs do `villager_soldiers/` se for usar o hire.
3. Ative BP+RP de ambos no mundo (experimental/script conforme o cliente exigir para Script API).

## Uso rapido

```mcfunction
/give @s va:mining_contract
/give @s va:tunnel_start_banner
/summon va:villager_miner
```

Fluxo survival previsto:

1. Craft do contrato (wooden pickaxe acima do paper na mesa).
2. No Soldiers: obter free_handle via freehand decree.
3. Interact com o contrato no free_handle.
4. (Opcional) Coloque `va:tunnel_start_banner` como origem compartilhada.
5. Entregar uma picareta ao minerador.
6. Coloque copper chest perto da origem para deposito automatico.
7. Interact vazio para pausar/retomar (`stay_mode`).

## Ainda nao implementado

- MINER-017 / MINER-018 — flags/comandos de direcao / UI
- Branch mining, tochas, rails

## Pontos de atencao

- Nao edita o pack Soldiers; coexistencia por IDs separados.
- Picareta no free_handle ainda vira `fv:villager_clumper` pelo Soldiers — o caminho deste addon e o **item contrato**.
- Retorno a origem usa teleport; inventario sem UI dedicada de esvaziar.
- Comportamento Milestone 2 nao marcado como validado in-game.

## Validacao local

```powershell
Get-ChildItem -Recurse -Filter *.json | ForEach-Object {
  Get-Content -Raw $_.FullName | ConvertFrom-Json | Out-Null
}
```
