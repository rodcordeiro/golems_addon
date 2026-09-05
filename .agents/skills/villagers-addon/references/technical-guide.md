# Contratos tecnicos

Caminhos relativos a `addon/villagers_addon/`.

## Layout

```text
behavior_pack/
  entities/  items/  recipes/
  scripts/main.js          # importa hire, minerInteract, commandFlag, tunnelBanner, minerLoop
  scripts/common.js        # IDs, FILL/ORE/CHEST sets, DP, helpers
  scripts/hire.js
  scripts/minerInteract.js
  scripts/commandFlag.js
  scripts/minerLoop.js
  scripts/deposit.js
  scripts/tunnelBanner.js
  scripts/torch.js         # puxado por minerLoop
resource_pack/
  entity/ models/ animations/ animation_controllers/
  render_controllers/ textures/ texts/
```

## Constantes chave (`common.js`)

| Const | Valor |
|---|---|
| `MINER_ID` | `va:villager_miner` |
| `CONTRACT_ID` | `va:mining_contract` |
| `FREE_HANDLE_ID` | `fv:villager_free_handle` |
| `MAX_DISTANCE` | 64 |
| `TICK_INTERVAL` | 10 |
| `CHEST_SEARCH_RADIUS` | 24 |
| `TOOL_SLOT` | 0 |
| `TORCH_PLACE_EVERY` | 10 |

Dynamic props: `va_dir_*`, `va_hire_*`, `va_axis_*`, `va_state`, `va_branch_*`, `va_stair_*`, `va_chest_*`, `va_torch_*`. Property sync: `va:stay_mode` (bool).

## Entidade BP

Family `villager`, `mob`, `va_miner`, `va_worker`. Inventory 27. Health 20. Movement 0.25. Lean AI (float, look, stroll) — trabalho e 100% script.

## Regras de mudanca

1. Ler `AGENTS.md` / `README.md` do addon.
2. Manter `va:` sem colidir com `fv:` / `addon:`.
3. BP + RP: bump versao alinhado apos mudanca funcional.
4. Mutacoes em `system.run`; checar `entity.isValid`.
5. Nao editar Soldiers.

## Validacao

```powershell
Get-ChildItem addon/villagers_addon -Recurse -Filter *.json |
  Where-Object { $_.FullName -notmatch 'node_modules|test_world' } |
  ForEach-Object { Get-Content -Raw $_.FullName | ConvertFrom-Json | Out-Null }
```

In-game: hire → picareta → tunel → deposito → banner → flag → tochas. Sem Bedrock: **validacao in-game pendente**.
