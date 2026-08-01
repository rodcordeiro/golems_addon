# Villagers Addon — Minerador de Tunel

Addon proprio que complementa o [Villager Soldiers](../villager_soldiers/README.md) com um villager trabalhador que faz strip mine e coleta ores.

**Namespace:** `va:`  
**Versao dos packs:** `1.0.0`  
**min_engine_version:** `1.21.130`  
**Script API:** `@minecraft/server` `2.4.0`  
**Monorepo:** pasta `villagers_addon/` (ver [`../README.md`](../README.md))

## Estado

MVP implementado em codigo (contratar, cavar, inventario, stay). **Ainda nao validado in-game** (checklist MINER-010 no backlog).

Docs:

- [`AGENTS.md`](AGENTS.md)
- [`docs/backlog.md`](docs/backlog.md) — decisoes e tickets
- [`docs/IDEIA_MINERADOR.md`](docs/IDEIA_MINERADOR.md) — contexto / ideia

## Dependencia

Soft-dependencia de **uso** no Villager Soldiers:

1. Ative Behavior + Resource do Soldiers (`fv:`).
2. Ative Behavior + Resource deste addon (`va:`).
3. Contrate um `fv:villager_free_handle` (fluxo do decreto do Soldiers).
4. Use `va:mining_contract` no free_handle para virar `va:villager_miner`.

Sem Soldiers, o pack carrega, mas o hire do minerador nao tem alvo.

## Conteudo (MVP)

| ID | Papel |
|----|-------|
| `va:mining_contract` | Item de contratacao |
| `va:villager_miner` | Minerador de Tunel |

- Receita shaped (crafting table): picareta de madeira em cima do papel → contrato (picareta consumida)

```text
P
A
```

- `P` = wooden_pickaxe
- `A` = paper
- Strip 1x2 na direcao do olhar do jogador no hire
- Ore → inventario; stone/deepslate/netherrack/cobble → destruidos sem loot
- Inventario cheio → volta ao ponto de hire e aguarda
- Picareta de trabalho entregue depois (interact); sem picareta nao cava
- Interact (dono, mao vazia) alterna `stay_mode`
- Limite 64 blocos; 1 passo a cada 10 ticks; stop em lava/agua/bedrock

Visual baseado no clumper do Soldiers (geo/texturas adaptadas para `va:`).

## Estrutura

```text
behavior_pack/
  entities/
  items/
  recipes/
  scripts/          main.js, hire.js, minerLoop.js, ...
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
```

## Instalacao

1. Copie `behavior_pack/` e `resource_pack/` desta pasta para o Bedrock.
2. Copie tambem os packs do `villager_soldiers/` se for usar o hire.
3. Ative BP+RP de ambos no mundo (experimental/script conforme o cliente exigir para Script API).

## Uso rapido

```mcfunction
/give @s va:mining_contract
/summon va:villager_miner
```

Fluxo survival previsto:

1. Craft do contrato (wooden pickaxe acima do paper na mesa).
2. No Soldiers: obter free_handle via freehand decree.
3. Interact com o contrato no free_handle.
4. Entregar uma picareta ao minerador.
5. Esvaziar inventario quando ele voltar ao ponto de hire.
6. Interact vazio para pausar/retomar (`stay_mode`).

## Fora do MVP (v2)

- Fill depositado em bau de cobre (busca automatica)
- Flags/comandos para redirecionar a mineracao

## Pontos de atencao

- Nao edita o pack Soldiers; coexistencia por IDs separados.
- Picareta no free_handle ainda vira `fv:villager_clumper` pelo Soldiers — o caminho deste addon e o **item contrato**.
- Retorno ao hire usa teleport; inventario sem UI dedicada de esvaziar.
- Comportamento in-game nao marcado como validado.

## Validacao local

```powershell
Get-ChildItem -Recurse -Filter *.json | ForEach-Object {
  Get-Content -Raw $_.FullName | ConvertFrom-Json | Out-Null
}
```
