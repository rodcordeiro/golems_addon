# Contratos tecnicos

Caminhos relativos a `addon/VillageFolk/behavior_pack/`.

## Layout

```text
behavior_pack/
  manifest.json
  pack_icon.png
  CHANGELOG.md
  scripts/
    main.js              # bootstrap, loops, spawn/die, dialogo
    names.js             # pools de nomes
    professions.js       # cores/labels + stripColor
    moods.js             # detectMood + mood dialogue
    dialogue.js          # falas por profissao
    gossip.js / gossipdialogue.js
    villageevent.js / eventeffects.js
    wanderingtrader.js
    hostiles.js / hostilesdialogue.js
```

Script-only: sem modulo `data`, sem RP, sem functions `.mcfunction`.

## Manifest

| Campo | Valor |
|---|---|
| Nome | VillageFolk |
| Autor | Shadowfox6303 |
| Versao | `[1, 5, 9]` |
| UUID header | `82ff53bd-7f5a-42af-ab12-9c06131e8cfd` |
| UUID script | `3f685852-b946-4704-afc0-dacaccd643ee` |
| Engine | `[1, 26, 20]` |
| `@minecraft/server` | `2.7.0` |

## Constantes (main.js)

| Constante | Valor | Significado |
|---|---|---|
| `TALK_RADIUS` | 4 | Dialogo action bar |
| `TALK_COOLDOWN` | 200 | Ticks entre falas da mesma entidade |
| `WANDERER_DESPAWN` | 3600 | 3 min |
| `WANDERER_WARN` | 3000 | Aviso ~2.5 min |

## Intervalos

| Ticks | Trabalho |
|---|---|
| 10 | `checkDialogue` |
| 20 | Despawn/announce trader; titulo timer de evento |
| 100 | Refresh nameTags villagers/wanderers |
| 200 | Limpa mapas de traders sumidos (so checa overworld) |
| 600 | Tenta iniciar/atualizar eventos |

## Estado

| Chave | Onde | Conteudo |
|---|---|---|
| `vf_name` | entity dynamic property | Nome limpo persistente |
| `vf_event_cooldowns` | world dynamic property | JSON `{ eventId: Date.now() }` |
| `talkCooldowns` / `villagerMoods` / `wandererSpawnTick` | Maps em memoria | Perdem no reload (exceto cooldowns de evento) |

`loadEventState` roda em `system.run` apos o mundo estar pronto. Evento **ativo** nao e persistido — so cooldowns; reload cancela evento em andamento.

## Deteccao de entidades

- Villagers: `getEntities({ families: ["villager"] })` — inclui addons custom com essa family.
- Wanderer: `type: "minecraft:wandering_trader"`.
- Hostis: families illager + piglin + type witch, dedupe por `id`.

## Portar / estender

- Novo dialogo de profissao: chave em `professions` alinhada a family Bedrock + linhas em `dialogue.js`.
- Novo evento: entrada em `villageEvents` + opcional em `eventEffects`.
- Novo gossip: templates em `gossipdialogue.js` / pesos.
- Nao copie UUIDs. Consumidor proprio deve usar IDs/properties proprias se for reimplementar.

## Riscos

- Cleanup de `wandererSpawnTick` so varre overworld — traders no nether/end podem ficar orfaos no Map.
- `detectMood` faz `getEntities` raio 20 por villager a cada refresh de name (100 ticks) — custo sobe com populacao.
- Evento ativo some no reload; cooldown permanece.
- Matching de hostil por family `witch` no `matches` pode falhar se a entity so tiver type sem family; o scan usa `type: witch` na coleta.
- Issue: UI de trade mostra nameTag composto.

## Validacao

```powershell
Get-Content -Raw addon/VillageFolk/behavior_pack/manifest.json | ConvertFrom-Json | Out-Null
```

In-game: spawn villager → nome+mood; chegar perto → action bar; chuva/noite/threat → mood; esperar evento → chat + (se comercio) Hero; trader → chat + despawn 3 min; name tag rename persiste. Sem Bedrock: **validacao in-game pendente**.
