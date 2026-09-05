# Contratos tecnicos

Caminhos relativos a `addon/SystemDynamicLights/behavior_pack/`.

## Layout

```text
behavior_pack/
  manifest.json
  pack_icon.png
  scripts/main.js
  functions/
    light15.mcfunction
    light13.mcfunction
    light11.mcfunction
    light9.mcfunction
    light6.mcfunction
    sea_pickle.mcfunction
    no_light.mcfunction
```

Nao ha Resource Pack, items JSON, entities, recipes nem lang neste checkout.

## Manifest

| Campo | Valor |
|---|---|
| Nome | System Dynamic Lights Addon V3.2.3 Behavior Pack |
| UUID header | `4af7083a-0b1e-423b-8ba9-8bd56397eafa` |
| Modulo data | `58ed8864-4cc1-4312-bc48-e5bd24df45ec` |
| Modulo script | `d8a774f2-ee0b-4019-9ba1-3d326a4e571e` |
| Engine | `[1, 20, 30]` |
| `@minecraft/server` | `1.15.0` |
| capabilities | `script_eval` |
| Dep RP | UUID `9662b34a-9a6c-47dc-b1ce-7541c8bbda91` versao `[1, 0, 0]` — ausente |

`script_eval` esta declarado; o JS usa `runCommand` / `runCommandAsync`, nao `eval`.

## Como a luz e colocada

Cada function de nivel:

1. `fill` no pe do executor: `light_block` com `block_light_level` N no lugar de `air` (e `water` no `sea_pickle`).
2. `fill` numa caixa ~4 apaga `light_block` do mesmo nivel fora da celula atual (o rastro "segue" a entidade).
3. `fill` na mesma caixa apaga `light_block` dos outros niveis, para nao misturar.

`no_light` so apaga niveis 15/13/11/9/6 na caixa ~4, sem colocar bloco novo.

Jogador: `execute as @s positioned ~~1~1 run function <fn>` (offset Y+1 Z+1).  
Mob em fogo: `positioned ~~1~`.  
Item no chao: `positioned ~~~`.

## Loop (`system.runInterval`)

Sem delay explicito — intervalo default 1 tick.

1. Todos os players: lore no inventario; helmet; senao offhand; senao mainhand.
2. `overworld.getEntities()`: item entities + blaze/fogo/magma/glow_squid.

Nether/End: jogadores ainda recebem luz (loop de players e global). Mobs e drops so sao varridos no overworld. Cleanup de drop usa `world.getDimension("overworld")` mesmo se o item estava noutra dimensao.

## Tags

| Tag | Quem | Significado |
|---|---|---|
| `helmet_light` | player | Capacete lantern_* ativo |
| `light_offhand` | player | Offhand luminosa |
| `light_mainhand` | player | Mainhand luminosa |
| `onFire` | mob | Blaze/fogo/magma/glow_squid brilhando |

Offhand e mainhand sao mutuamente exclusivas. Helmet desliga as duas fontes de mao.

## Eventos

| Evento | Acao |
|---|---|
| `itemUse` | Sem bloco a 8 e offhand vazia: `replaceitem` offhand com o stack `LIGHT_ALL` e limpa mainhand |
| `entitySpawn` | Se tem component `item`, entra em `groundItems` |
| `entityRemove` | Se era drop: jogador perto (2 blocos) com o mesmo item no inventario → `no_light` no player se ele nao tem tags de mao; senao `no_light` na posicao do drop (overworld, Y+1) |
| `entityDie` | Blaze/fogo/magma/glow_squid → `no_light` em `~~1~` |

## Portar ou estender

Para um item novo brilhar no consumidor: o `typeId` precisa conter um stem ja listado, ou o stem entra em `LIGHT_GROUPS` / especiais em `main.js`. Offhand swap exige o stem em `LIGHT_ALL` como `minecraft:<stem>`. Capacete novo: substring em `HELMET_LIGHT` e o item no RP.

Nao copie UUIDs. Functions `fill` de `light_block` sao o mecanismo; Script API so escolhe a function.

## Riscos observados no codigo

- Matching por `includes` e amplo (`magma`, `candle`, `catalyst`).
- `lantern_chainmain_helmet` parece typo de chainmail.
- Loop de entidades no overworld a cada tick; `runCommandAsync` em massa.
- `fill` substitui so `air`/`water` — nao acende dentro de outros blocos.
- Drops fora do overworld podem deixar `light_block` sem cleanup correto.
- RP ausente: helmets e identidade visual incompletos neste monorepo.

## Validacao

```powershell
Get-Content -Raw addon/SystemDynamicLights/behavior_pack/manifest.json | ConvertFrom-Json | Out-Null
```

In-game: segurar tocha/lantern/glowstone; lore; andar e ver luz seguir; use para offhand; drop no chao; blaze; sea_pickle na agua. Sem Bedrock: **validacao in-game pendente**.
