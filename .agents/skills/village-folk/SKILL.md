---
name: village-folk
description: Explains VillageFolk (Shadowfox6303) gameplay: named villagers, moods, profession dialogue, gossip, village events with trade discounts, wandering trader lifecycle, and hostile dialogue. Use when an AI needs addon context without the pack, or when the user asks how VillageFolk names, talks, events, or moods work.
---

# VillageFolk

Enciclopedia do pack **VillageFolk** `1.5.9` (autor Shadowfox6303, changelog "Living World Expanded"). Responda a partir desta skill. Nao precisa do CHANGELOG nem de outro contexto.

Snapshot do checkout: so `addon/VillageFolk/behavior_pack/` (script-only, sem Resource Pack, entities ou recipes). Engine `min_engine_version` `[1, 26, 20]`; `@minecraft/server` `2.7.0`; entry `scripts/main.js`. UUID header `82ff53bd-7f5a-42af-ab12-9c06131e8cfd`. Licenca/uso comercial nao estao documentados. Fluxos sao leitura de codigo; sem teste Bedrock, declare **validacao in-game pendente**.

## Como responder

1. Identifique o ramo: nomes/profissoes, humor, dialogo/fofoca, eventos, trader, hostis, ou implementacao.
2. Leia so a referencia desse ramo.
3. O pack opera sobre entidades vanilla/custom com family `villager` (e wandering trader / illager / piglin / witch). Nao adiciona itens craftaveis.
4. Dialogo aparece na **action bar** do jogador (raio 4, cooldown 10s por entidade). Eventos anunciam no **chat** do overworld.

| Ramo | Leia |
|---|---|
| Nomes, nameTag, profissoes | [identities.md](references/identities.md) |
| Humor, dialogo, gossip, hostis, trader | [dialogue.md](references/dialogue.md) |
| Eventos de vila e descontos | [events.md](references/events.md) |
| Scripts, ticks, propriedades | [technical-guide.md](references/technical-guide.md) |

## O que o addon faz

Da personalidade a villagers (e afiliados): nome unico colorido por profissao, humor no nameTag, falas quando o jogador chega perto, fofoca sobre vizinhos, sete eventos de mundo vivo (alguns barateiam trades via `hero_of_the_village`), e ciclo curto do Wandering Trader com saudacao/adeus.

```text
villager / wanderer spawn
  └─ nome unico (vf_name) + label + mood no nameTag
jogador a <=4 blocos (cooldown 200 ticks)
  ├─ evento ativo ──> fala do evento
  ├─ mood scared/sad ──> fala de humor
  ├─ 25% gossip ──> fala sobre outro villager a <=32
  └─ senao ──> fala da profissao (ou trader/hostil)
a cada ~30s ──> chance de iniciar evento (overworld players)
```

## Loop do jogador

1. Entre numa vila. Villagers ganham nomes e line `Profissao  • Humor`.
2. Aproxime-se (4 blocos): action bar `Nome: fala...`.
3. Espere um evento (chat `[ Festival ]`, titulo com timer). Em festival/market/harvest/trader: efeito Hero of the Village = desconto.
4. Wandering Trader: anuncio no chat, greets, avisa e some em **3 minutos** (3600 ticks).
5. Renomear com name tag persiste (`vf_name` acompanha o texto limpo); nao reseta a cada trade.

## Catalogo rapido

| Feature | Resumo |
|---|---|
| Nomes | Pool boy+girl; unico no mundo; composto se esgotar |
| Profissoes | 13 vanilla + Nitwit; fallback Unemployed |
| Moods | Happy / Neutral / Scared / Sad |
| Dialogo | Profession, mood, gossip, event, wanderer, illager/piglin/witch |
| Eventos | Festival, Market, Storm, Harvest, Raid Alert, Full Moon, Trader Arrived |
| Desconto | Hero of the Village amp 0–2 nos eventos de comercio |

## Fora do recorte

Sem RP neste checkout. Changelog: "known issue trading ui have villager name". Pack de terceiros: leitura e extracao; correcoes/release so com pedido.
