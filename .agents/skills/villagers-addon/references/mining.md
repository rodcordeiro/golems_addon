# Trabalho e tunel

## Pre-requisitos para cavar

- Dono ja contratou (`va_owner_*`).
- Picareta em qualquer slot do inventario 27 (normalizada para slot 0).
- `va:stay_mode` = false.
- Estado nao e `stopped`.
- Cargo (slots 1+) com espaco, ou fluxo de deposito.

Sem picareta: nao cava (fica waiting / idle de trabalho).

## Estados (`va_state`)

| Estado | Significado |
|---|---|
| `waiting` | Pronto / aguardando picareta ou espaco |
| `mining` | Cavando |
| `depositing` | Indo ao / usando copper chest |
| `returning` | Voltando a origem (teleport) |
| `stopped` | Parada dura (bedrock, fluido, limite, …) |

Tick: a cada `TICK_INTERVAL` = 10 ticks (`minerLoop.js`).

## Tunel 3x3

Eixo na direcao `va_dir_*`. Celulas: largura +/-1 perpendicular, altura foot..foot+2. Ore adjacente (raio 1) tambem processado.

| Tipo | Destino |
|---|---|
| Ore (`*ore*`) | Inventario; raw map iron/copper/gold → raw_*; nether gold → nugget |
| Fill (stone, deepslate, netherrack, cobble, granite, …) | Destroi sem loot / sem inventariar |
| Hard stop (bedrock, barrier, chests, portals, copper chests, …) | Para |
| Soft stop (water/lava) | Para |

## Formigueiro e escada

- Branch ~12%: desvio lateral 2–4 blocos (`BRANCH_*`).
- Stair ~10%: sobe/desce 2 passos Y (`STAIR_*`).
- Command flag limpa branch/stair remanescentes.

## Distancia e origem

- Max horizontal da origem: **64** blocos.
- Origem = hire point, ou banner do mesmo dono se presente (`resolveTunnelOrigin`).
- Eixo (`va_axis_*`) avanca com o tunel; retarget da flag redefine eixo na posicao atual.

## Deposito

Inventario cheio → busca copper chest (todas as variantes waxed/oxidized) raio **24**, Y+/-6. Deposita cargo (nao a picareta). Se nao achar: volta a origem e aguarda. Cache em `va_chest_*`.

## Tochas (MINER-019)

- Estoque nos slots de cargo; `minecraft:torch`.
- A cada **10** dig steps bem-sucedidos: tenta parede (`wall_torch`) preferida, senao chao.
- No deposito: se count < 8, restock ate 16 a partir do mesmo chest.

## Durabilidade

Cada passo de cava danifica a picareta em 1; quebra remove do slot 0.
