# Gameplay

## Receitas (crafting_table)

### Backpack — `bp:backpack`

```text
LLL
LCL
LLL
```

L = leather, C = chest.

### Axolotl — `bp:axolotl_backpack`

```text
LAL
LCL
LLL
```

A = tropical_fish.

### Soul — `bp:soul_backpack`

```text
LSL
LCL
LLL
```

S = soul_sand.

### Big — `bp:big_backpack`

```text
LIL
LCL
LCL
```

I = iron_ingot; dois chests. Unlock: iron_ingot.

## Uso

| Acao | Como |
|---|---|
| Vestir | Equipar item em `slot.armor.chest` (attachable RP) |
| Colocar | Right-click bloco com o item; `minecraft:entity_placer` spawna a entidade |
| Abrir | Right-click na entidade (chest UI) |
| Pegar | Sneak + right-click **ou** atacar a entidade |
| Inventario cheio ao pegar | Action bar de erro; entidade permanece |

Big backpack usa nameTag com sufixo magico `\u00a7t\u00a7r\u00a7u\u00a7e\u00a7r` para acionar grid 9×6 em `ui/chest_screen.json`.

## Conteudo preservado

Ao pegar, o inventario da entidade vira JSON na dynamic property `bp:inv_v3` do ItemStack (id, count, nameTag, lore, durability, enchantments, keepOnDeath, lockMode, canPlaceOn, canDestroy). Viaja com o item em baus e entre jogadores.

Rename custom no nameTag da entidade (se diferente do display padrao) volta no item.

## Nao fazer / armadilhas de UX

- Colocar sem sneak em bloco interativo (bed, door, chest, crafting table, …) cancela o spawn e devolve o item — evita drop acidental ao dormir.
- Atacar sempre pega; nao e so sneak-interact.
- Ghosts `bp_ghost` de v1.2 sao resgatados no world load e removidos.
