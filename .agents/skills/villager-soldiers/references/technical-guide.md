# Contratos tecnicos

Use esta pagina so para implementar, diagnosticar ou portar. Gameplay fica nas outras referencias. Caminhos relativos a raiz do pack (`addon/villager_soldiers/` neste monorepo).

## Identidade

BP UUID `85cd420b-b40f-48f3-8b70-bd839b72371d`, RP `20046f92-e319-4f00-8a3c-2d13ab74f6e9`, versao `[1, 1, 4]`. Script entry `scripts/main.js`. RP capability `pbr`. Consumidores no monorepo: `addon/villagers_addon/` (hire em `fv:villager_free_handle`) e `addon/gollem_addon/`. Soldiers e referencia de terceiros: extrair padrao; correcoes e release so com pedido.

## Ancoras

| Recurso | Arquivo |
|---|---|
| Bootstrap | `behavior_pack/scripts/main.js` (imports com efeito colateral; intervalo 10 ticks marca `lowHP`) |
| Vila | `scripts/spawn/SpawnSoldier.js` |
| Golem de vila | `scripts/spawn/SpawnSoldierFromGolem.js` |
| Decreto interact/hurt | `scripts/function/villagerFreeHandle.js` |
| Decreto onHit | `scripts/customComponents/freeHandleDecree.js` |
| Paper UI | `scripts/Items/PaperWritable.js` |
| Flag UI | `scripts/UI/soldierAction.js` |
| Dono | `scripts/function/identificationOwner.js` |
| Times / horns | `scripts/function/teamSelecTable.js`, `Items/Team*Horn.js` |
| Tanker XP | `scripts/function/villagerTankerLevelUp.js` |
| Template soldado | `behavior_pack/entities/soldiers/villager_vanguard.json` |
| Free handle | `behavior_pack/entities/worker/villager_free_handle.json` |
| Bioma/variant | `resource_pack/render_controllers/vanilla.json` |

`main.js` so registra listeners via import. Arquivo JS novo precisa estar alcancavel pelo bootstrap.

## Contrato BP/RP

- Mesmo identifier em entity BP e client entity RP.
- `mark_variant` 0–6 alinhado a texturas plains…taiga.
- Properties usadas no client (`fv:tamed`, `fv:stay_mode`, `fv:kill_player_mode`) precisam de `client_sync`.
- Overlays: `query.is_tamed` → tamed_color; `query.is_sitting` → wrist_belt; stay_mode → stay_statue; kill_player_mode → target.
- Geometrias: `geometry.villager_handle`, `geometry.repillager`, `geometry.fv_villager_armors`; cavalaria `soldier_horse` / `soldier_camel`.
- Soldados: `enable_attachables: true`; muitos `hide_armor: true`.
- Lang: `en_US`, `vi_VN`, `pt_BR`, `pt_PT`. Preserve chaves existentes, inclusive typos (`buttom.*`, `cancle`).
- Custom component no item JSON e registro em `system.beforeEvents.startup`.

## Script

Mutacoes a partir de callback read-only: snapshot + `system.run`; revalidar `entity.isValid`. O original remove o villager antes do spawn — se o spawn falhar, a entidade some.

Decreto tem tres caminhos. Ao portar, um unico fluxo de conversao.

## Portar um soldado contratavel

Minimo no consumidor, IDs proprios: entidade com tame/stay, um item de conversao, discharge, client entity + geo/textura/lang. Flag/UI e bioma sao opcionais. Nao copie faccao illager, guns nem worldgen no primeiro corte.

O Minerador (`va:`) depende de `fv:villager_free_handle` instalado; isso nao autoriza patchar Soldiers.

## Validacao

```powershell
Get-ChildItem behavior_pack,resource_pack -Recurse -Filter *.json |
  Where-Object { $_.FullName -notmatch 'node_modules|test_world' } |
  ForEach-Object {
    Get-Content -Raw -Encoding utf8 -LiteralPath $_.FullName |
      ConvertFrom-Json -ErrorAction Stop | Out-Null
  }
```

In-game: vila spawna vanguard/ranged; decreto em fletcher/weaponsmith/cleric/nitwit; tame; cartao; flag; promocao/demissao; bioma e overlays. Sem Bedrock: **validacao in-game pendente**.
