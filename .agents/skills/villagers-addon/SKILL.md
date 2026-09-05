---
name: villagers-addon
description: Explains the own Tunnel Miner pack (va:): hiring from Villager Soldiers free_handle, 3x3 tunneling, copper-chest deposit, torches, tunnel banner, and command flag. Use when an AI needs addon context without the pack, or when the user asks how villagers_addon / Minerador de Tunel works, crafts, or should be changed.
---

# Villagers Addon — Minerador de Tunel

Enciclopedia do produto proprio **Villagers Addon** `1.0.4` (namespace `va:`). Complementa Villager Soldiers (`fv:`); nao o substitui. Responda a partir desta skill.

Path: `addon/villagers_addon/` (BP + RP + Script API). Engine `[1, 21, 130]`; `@minecraft/server` `2.4.0` + `@minecraft/server-ui` `2.0.0`; entry `scripts/main.js`. UUIDs BP `a4e9e8e4-…` / RP `3193f76f-…`. Soft-dependencia de **uso**: precisa existir `fv:villager_free_handle`. M2 / tochas / flag em codigo; **validacao in-game pendente** (MINER-010 e demais).

## Como responder

1. Identifique o ramo: hire, trabalho/tunel, deposito/tochas, banner/flag, ou contratos tecnicos.
2. Leia so a referencia desse ramo.
3. Nao misture IDs com `fv:` / `addon:`. Nao edite `addon/villager_soldiers/` por padrao.
4. Railer (`RAILER-001`) e ideia futura — fora do minerador ate pedido.

| Ramo | Leia |
|---|---|
| Contrato, free_handle, hire | [hiring.md](references/hiring.md) |
| Tunel 3x3, ores, estados, limites | [mining.md](references/mining.md) |
| Interact, banner, command flag | [commands.md](references/commands.md) |
| Scripts, props, validacao | [technical-guide.md](references/technical-guide.md) |

## O que o addon faz

Contrata um free_handle do Soldiers com `va:mining_contract` e spawna `va:villager_miner`, que cava tunel 3x3, guarda ores, deposita em copper chest, coloca tochas e aceita ordem de direcao via `va:command_flag`.

```text
fv:villager_free_handle + va:mining_contract
  └─ remove handle → spawna va:villager_miner (dono + direcao yaw)
dono entrega picareta → mining
  ├─ 3x3 + ores laterais ocasionais + escada ~10%
  ├─ ore → inventario; fill → destroi sem loot
  ├─ cargo cheio → copper chest (raio 24) ou volta a origem
  └─ tocha a cada ~10 passos (restock no deposito)
va:tunnel_start_banner → origem compartilhada do dono
va:command_flag → ModalForm N/E/S/W + stay
```

## Catalogo rapido

| ID | Papel |
|---|---|
| `va:mining_contract` | Hire (craft: wooden_pickaxe sobre paper) |
| `va:villager_miner` | Trabalhador |
| `va:tunnel_start_banner` / `_marker` | Origem compartilhada |
| `va:command_flag` | Direcao + stay (craft: stick sobre paper) |

## Loop do jogador

1. Ative Soldiers + este addon.
2. Craft contrato; obtenha free_handle no Soldiers; interact com contrato.
3. (Opcional) Coloque banner de inicio; copper chest perto da origem.
4. Entregue picareta; opcionalmente tochas.
5. Interact vazio = toggle stay; flag = retarget sem recontratar.
6. Demissao = matar a entidade.

## Fora do recorte

MINER-018 (icone final da flag), branch mining dedicado, Railer. Picareta no free_handle ainda vira clumper pelo Soldiers — hire deste pack e so o **contrato**.
