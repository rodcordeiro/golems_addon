---
name: system-dynamic-lights
description: Explains System Dynamic Lights (SystemTv) gameplay: which held, offhand, helmet, dropped or mob items emit light, light levels, offhand swap, and how the pack places light_block. Use when an AI needs addon context without the pack, or when the user asks how System Dynamic Lights works, why an item glows, or how to add a light source.
---

# System Dynamic Lights

Enciclopedia do pack **System Dynamic Lights Addon V3.2.3** (autor SystemTv, Twitter `@SystemTv_`). Responda a partir desta skill. Nao precisa de README nem de outro contexto.

Snapshot do checkout: so `addon/SystemDynamicLights/behavior_pack/`. Header BP `1.0.0`, `min_engine_version` `[1, 20, 30]`, Script API `@minecraft/server` `1.15.0`, entry `scripts/main.js`. O manifest declara dependencia de um Resource Pack UUID `9662b34a-9a6c-47dc-b1ce-7541c8bbda91` que **nao esta neste checkout**. Licenca/uso comercial nao estao documentados. Fluxos sao leitura de codigo; sem teste Bedrock, declare **validacao in-game pendente**.

## Como responder

1. Identifique o ramo: o que brilha, como o jogador usa, niveis, ou implementacao.
2. Leia so a referencia desse ramo.
3. Matching de item e por **substring** no `typeId` (`id.includes(key)`), nao igualdade exata — IDs custom que contenham o stem tambem acendem.
4. Offhand swap e a excecao: exige `minecraft:<stem>` exato da lista `LIGHT_ALL`.

| Ramo | Leia |
|---|---|
| Catalogo de itens, niveis, helmets, mobs | [items.md](references/items.md) |
| Script, functions, tags, limites | [technical-guide.md](references/technical-guide.md) |

## O que o addon faz

Itens luminosos na mao, offhand, capacete ou no chao colocam `minecraft:light_block` ao redor da entidade. O bloco some quando o item sai. Nao ha craft, entidade ou namespace proprio de produto: o pack so observa IDs vanilla (e stems) e corre functions.

```text
jogador
  ├─ capacete lantern_*     ──> luz 15 (vence mao/offhand)
  ├─ offhand item luminoso  ──> luz do item (se nao houver luz de mao)
  ├─ mainhand item luminoso ──> luz do item (se nao houver luz de offhand)
  └─ use sem bloco a 8      ──> move item LIGHT_ALL para offhand
item dropado (overworld)    ──> luz no chao
blaze / fogo / magma_cube / glow_squid ──> luz no mob
```

## Loop do jogador

1. Pegue um item da tabela (tocha, lantern, glowstone, etc.).
2. Lore aparece uma vez: `Lightning: N Blocks` + tag `[System Dynamic Lights]`.
3. Segure na mao ou offhand. Luz segue o jogador.
4. Sem bloco no olhar (raio 8), **use** o item para mandar para a offhand — exceto os marcados `noOffhand`.
5. Capacete `lantern_*_helmet` (IDs do RP ausente) emite 15 e substitui a luz da mao.

## Niveis

| Nivel | Function | Exemplos |
|---|---|---|
| 15 | `light15` | glowstone, lava_bucket, lantern, beacon, shroomlight, campfire, end_rod, conduit |
| 13 | `light13` | torch, soul_lantern, soul_campfire, candle, copper_lantern |
| 13 agua | `sea_pickle` | sea_pickle; tambem glow_squid |
| 11 | `light11` | soul_torch, crying_obsidian; blaze e entidade em fogo |
| 9 | `light9` | redstone_torch, fire_charge, totem, nether_star; magma_cube |
| 6 | `light6` | blaze_rod, glow_berries, glowstone_dust, enchanted_book |

`lit_pumpkin` e `froglight` sao nivel 15 mas `noOffhand`. `ender_eye`, `glow_berries`, `experience_bottle`, `enchanted_book` sao nivel 6 `noOffhand`.

Prioridade no jogador: **helmet > offhand > mainhand** (tags `helmet_light`, `light_offhand`, `light_mainhand`; so uma fonte ativa).

## Fora do recorte

Nao ha receitas, soldados, comandos de gestao nem Resource Pack neste checkout. Helmets `lantern_*` e arte/lang dependem do RP faltante. Pack de terceiros: leitura e extracao de padrao; correcoes e release so com pedido.
