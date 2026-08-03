# Villagers Addon — Minerador de Tunel

Addon proprio que complementa o [Villager Soldiers](../villager_soldiers/README.md) com um villager trabalhador que faz tunel 3x3, coleta ores e deposita em copper chest.

**Namespace:** `va:`  
**Versao dos packs:** `1.0.4`  
**min_engine_version:** `1.21.130`  
**Script API:** `@minecraft/server` `2.4.0` + `@minecraft/server-ui` `2.0.0`  
**Monorepo:** pasta `villagers_addon/` (ver [`../README.md`](../README.md))

## Estado

MVP + Milestone 2 (MINER-012..016) + MINER-019 (tochas) + MINER-017 (command flag) em codigo. MINER-010 retomada corrigida em 1.0.1 — **revalidar in-game**. M2 / tochas / flag **nao testadas in-game**. Icone final da flag = MINER-018.

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
| `va:command_flag` | Bandeira de comando (direcao + stay via ModalForm) |

- Receita shaped (crafting table): picareta de madeira em cima do papel → contrato (picareta consumida)

```text
P
A
```

- `P` = wooden_pickaxe
- `A` = paper
- Receita flag: stick sobre paper → `va:command_flag`
- Tunel **3x3** na direcao do olhar do jogador no hire
- Ore → inventario; stone/deepslate/netherrack/cobble → destruidos sem loot
- Inventario cheio → deposita cargo no copper chest mais proximo (raio 24); se nao achar, volta a origem e aguarda
- Banner de inicio sobrescreve o ponto de hire como origem (distancia / retorno) para miners do mesmo dono
- Formigueiro: desvios laterais ocasionais; escada ~10% (+/-2 Y)
- Tochas (`minecraft:torch`): estoque nos slots 1+; coloca a cada ~10 passos (parede preferida); restock no deposito
- Command flag: dono abre ModalForm (N/E/S/W + stay); retarget eixo na posicao atual
- Picareta de trabalho entregue depois (interact); sem picareta nao cava
- Interact dono: picareta → tocha → command_flag → mao vazia (stay)
- Limite 64 blocos; 1 passo a cada 10 ticks; stop em lava/agua/bedrock

Visual baseado no clumper do Soldiers (geo/texturas adaptadas para `va:`). Banner com geo `geometry.va_tp_banner` (padrao Soldiers, IDs `va:`).

## Estrutura

```text
behavior_pack/
  entities/
  items/
  recipes/
  scripts/          main, hire, minerInteract, commandFlag, minerLoop, deposit, tunnelBanner, torch, ...
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
/give @s va:command_flag
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
8. Craft `va:command_flag` (stick sobre paper) para mudar direcao sem recontratar.

## Ainda nao implementado

- MINER-018 — icone proprio da flag + polish de comando
- Branch mining dedicado; **RAILER-001**

## Pontos de atencao

- Nao edita o pack Soldiers; coexistencia por IDs separados.
- Picareta no free_handle ainda vira `fv:villager_clumper` pelo Soldiers — o caminho deste addon e o **item contrato**.
- Retorno a origem usa teleport; inventario sem UI dedicada de esvaziar.
- Comportamento Milestone 2 / 017 / 019 nao marcado como validado in-game.

## Validacao local

```powershell
Get-ChildItem -Recurse -Filter *.json | ForEach-Object {
  Get-Content -Raw $_.FullName | ConvertFrom-Json | Out-Null
}
```
