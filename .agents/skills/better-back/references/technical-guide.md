# Contratos tecnicos

Caminhos relativos a `addon/BetterBack/`.

## Layout

```text
behavior_pack/
  manifest.json
  items/  recipes/  entities/  scripts/main.js
resource_pack/
  attachables/  entity/  models/entity/  animations/
  textures/  texts/  ui/chest_screen.json
```

## Constantes

| Chave | Valor |
|---|---|
| `INV_PROP` | `bp:inv_v3` no item e backup na entidade |
| `LEGACY_INV_PROP` | `bp:inv` (v1.1) |
| `LOADED_TAG` | entidade ja inicializada |
| `GHOST_TAG` | ghost legado v1.2 |
| `RELOADING_TAG` | merge pos-reload em andamento |
| Family | `bp_backpack` |

## Fluxos de script

1. **Snapshot** a cada 20 ticks: entidades `bp_backpack` loaded → `INV_PROP` na entidade.
2. **Place** (`playerInteractWithBlock`): le props do item antes do placer; apos 2 ticks acha entidade nova, carrega inventario; se bloco interativo sem sneak, remove e refund.
3. **Pickup**: serializa → cria ItemStack → `addItem` → so entao `remove` entidade.
4. **Reload** (`entitySpawn` cause != Born/Spawned): `mergeFromBackup` restaura enchantments se id+count batem; so preenche slots vazios se o inventario inteiro veio vazio.
5. **Legacy**: `loadLegacyInventory` / `rescueLegacyGhosts` no worldLoad.

## Entidade

Inventario `container` size 27 ou 54; health 999; `damage_sensor` deals_damage false; family `bp_backpack` + `inanimate`; nao spawnable, summonable.

## UI

`resource_pack/ui/chest_screen.json` sobrescreve namespace `chest` com painel 9×6 para big backpack quando o titulo carrega o sufixo magico.

## Validacao

```powershell
Get-Content -Raw addon/BetterBack/behavior_pack/manifest.json | ConvertFrom-Json | Out-Null
Get-Content -Raw addon/BetterBack/resource_pack/manifest.json | ConvertFrom-Json | Out-Null
```

In-game: craft → vestir → colocar → encher com livro encantado → pegar → recolocar → enchantments intactos; bed sem sneak nao deixa mochila. Sem Bedrock: **validacao in-game pendente**.
