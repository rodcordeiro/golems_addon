# Dialogo, humor, gossip e hostis

## Quando fala

Jogador a distancia `<= 4` da entidade. Cooldown por entidade: `200` ticks (~10s). Intervalo de checagem: 10 ticks. Mensagem: action bar `§eNome§7: §flinha`.

Entidades consideradas: family `villager`, `minecraft:wandering_trader`, family `illager`, family `piglin`, type `minecraft:witch`.

## Prioridade da fala (villager)

1. **Evento ativo** — linha do evento (20 por evento).
2. Mood **scared** ou **sad** — linha de humor (15 cada).
3. **Gossip** (25% se passou nos anteriores) — fala sobre outro villager a `<= 32` blocos com nameTag; senao cai na profissao.
4. **Profissao** — ~25 linhas por label em `dialogue.js`.

Happy/neutral nao forcam mood dialogue; so scared/sad.

## Moods

| Mood | Simbolo (approx) | Quando (`detectMood`) |
|---|---|---|
| scared | §c⚠ | Mob threat a `<= 20` (families zombie, skeleton, creeper, illager, pillager, ravager, witch, phantom, drowned) **ou** tempo 13000–23000 (noite) |
| sad | §9~ | Chuva ou trovao (`world.isRaining` / `isThundering`) |
| happy | §e✦ | Tempo 1000–11000 (dia) |
| neutral | §7• | Amanhecer/entardecer e demais casos |

Ordem de deteccao: threat → weather → time → neutral. Threat vence weather/time.

## Gossip

Chance `0.25` quando nao ha evento e mood nao e scared/sad. Alvo: outro villager no raio 32 com nameTag.

Pesos: positive 40%, negative 30%, neutral 20%, profession 10%. Templates substituem `{name}` e `{profession}`. Tipo `profession` usa linhas por label do alvo (farmer, fisherman, …); se label desconhecido, usa neutral.

## Wandering Trader — dialogo

Prioridade perto do jogador:

1. Se restam `<= 60s` no ciclo de despawn: `I only have Ns left here, trade fast!`
2. Evento ativo: dialogo do evento.
3. Mood nao neutral: 5 linhas do mood do trader.
4. Senao: pool geral de viagem (~20 linhas).

Anuncios action bar perto (raio 24): greet (~2–4s apos spawn), warning (~150s), farewell (~3s antes de sumir). Chat overworld no spawn: `[ Nome has arrived! They won't stay long! ]`.

Despawn forcado em **3600 ticks (3 min)** apos o pack registrar o spawn tick. Nao e o despawn vanilla.

## Hostis

`illager` / `piglin` / `witch` — dialogo proprio (~25 linhas cada em `hostilesdialogue.js`). Display name na action bar: Illager / Piglin / Witch (nao usam nameTag colorido de villager).

## Issue conhecida

CHANGELOG: UI de trade ainda mostra o nameTag do villager (com cor/mood).
