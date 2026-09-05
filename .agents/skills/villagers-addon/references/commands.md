# Comandos e interact

Prioridade no miner (dono): **picareta → tocha → command_flag → mao vazia (stay)**.

Nao-dono: mensagem "Este minerador nao e seu."

## Entrega de ferramenta / tocha

- Picareta na mainhand → 1 unidade vai ao inventario do miner (durability copiada).
- Tocha → `tryAddTorches` no cargo.
- Mao vazia → toggle `va:stay_mode` (pausar / retomar se cargo+picareta ok).

## Command flag — `va:command_flag`

Craft:

```text
S
P
```

S = stick, P = paper.

Interact do dono com flag na mao: ModalForm (`@minecraft/server-ui`):

- Dropdown direcao: North / East / South / West
- Toggle Stay

Aplica `va_dir_*`, yaw, limpa branch/stair, redefine eixo na posicao atual, ajusta stay/state. Icone final = MINER-018 (placeholder ate la).

## Tunnel start banner

| ID | Papel |
|---|---|
| `va:tunnel_start_banner` | Item placeable |
| `va:tunnel_start_banner_marker` | Entidade marcadora |

Colocado no mundo: sobrescreve ponto de hire como origem (distancia / retorno) para miners do **mesmo dono** (busca ~96; bind ~8 no place). Visual: geo `geometry.va_tp_banner` (padrao Soldiers, IDs `va:`).

## Demissao

Matar a entidade. Sem carta de demissao no MVP.
