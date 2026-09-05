# Eventos de vila

Sete eventos em `villageevent.js`. Tentativa a cada **600 ticks (~30s)**. So um ativo por vez.

## Regras de inicio

- Sem evento ativo.
- Gap minimo desde o fim do ultimo: `12000` ticks (~10 min).
- Evento fora do cooldown individual (salvo em `world` dynamic property `vf_event_cooldowns` como JSON de timestamps `Date.now()`).
- Chance **10%** por tentativa (`Math.random() > 0.10` aborta).

Cooldown no save usa `cooldown * 50` ms (ticks × 50). Duracao do evento e em ticks de jogo.

## Catalogo

| ID | Nome | Duracao | Cooldown | Desconto |
|---|---|---|---|---|
| `festival` | Village Festival | 6000 (~5 min) | 72000 | Hero amp **0** |
| `market` | Market Day | 6000 | 48000 | Hero amp **2** |
| `storm` | Storm Warning | 3000 (~2.5 min) | 36000 | nenhum |
| `harvest` | Harvest Day | 6000 | 60000 | Hero amp **1** |
| `raid_alert` | Raid Alert | 2400 (~2 min) | 24000 | nenhum |
| `full_moon` | Full Moon | 4800 (~4 min) | 48000 | nenhum |
| `wanderer_arrival` | Trader Arrived | 3000 | 36000 | Hero amp **0** |

Cada um tem **20** linhas de dialogo. Anuncio no chat (so overworld): `[ <simbolo> Nome <simbolo> ]`.

## Desconto (eventeffects)

Eventos com comercio aplicam `hero_of_the_village` a todos jogadores no overworld, `showParticles: false`, duracao = ticks do evento. Mensagem `✦ ... Discount!`. No fim: remove efeito e avisa que precos voltaram.

Quem entra no meio (`playerSpawn`): `reapplyEventEffect` com ticks restantes.

Storm / Full Moon / Raid Alert: so dialogo + anuncio, sem efeito.

## Timer na tela

Nos primeiros ~3s e nos ultimos ~3s do evento, titulo no overworld: titulo do evento + subtitle `Ends in M:SS` ou `Ending in M:SS` (atualiza a cada segundo).

## Relacao com o trader real

O evento `wanderer_arrival` e um sorteio de mundo vivo; independente do spawn real de `minecraft:wandering_trader`. O trader real tem ciclo proprio de 3 min e chat de chegada.
