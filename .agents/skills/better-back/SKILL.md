---
name: better-back
description: Explains Better Backpacks (HoneyStudios bp) gameplay: craftable wearable backpacks, place/open/pickup, inventory sizes, recipes, and how storage is saved on the item. Use when an AI needs addon context without the pack, or when the user asks how Better Back / backpacks work, craft, or store items.
---

# Better Backpacks

Enciclopedia do pack **Better Backpacks v1.3.0** (autor HoneyStudios). Responda a partir desta skill. Nao precisa de outro contexto.

Snapshot: `addon/BetterBack/` com BP + RP. Namespace `bp:`. Engine `min_engine_version` `[1, 21, 0]`; `@minecraft/server` `1.14.0`; entry `scripts/main.js`. UUIDs BP `2e901ff9-1b21-4950-8dfa-4276940b4ebf` / RP `6a188c3b-d93f-44a9-a333-4d9353c803ac`. Licenca/uso comercial nao documentados. Fluxos sao leitura de codigo; sem teste Bedrock, declare **validacao in-game pendente**.

## Como responder

1. Identifique o ramo: craft/variantes, uso no mundo, ou persistencia tecnica.
2. Leia so a referencia desse ramo.
3. Cite IDs `bp:...`. Item e entidade sao pares distintos (`bp:backpack` ↔ `bp:backpack_e`).

| Ramo | Leia |
|---|---|
| Variantes, receitas, loop do jogador | [gameplay.md](references/gameplay.md) |
| Script, props, UI grande, riscos | [technical-guide.md](references/technical-guide.md) |

## O que o addon faz

Mochilas craftaveis: vestir no peito, colocar no chao como entidade-bau, abrir inventario, guardar itens no **item** via dynamic property (nao em ghost entity). v1.3 removeu ghosts de v1.2 que perdiam itens.

```text
craft bp:*_backpack
  ├─ equipar slot.armor.chest ──> modelo nas costas
  └─ right-click bloco ──> spawna bp:*_backpack_e
        ├─ right-click ──> abre bau (27 ou 54)
        └─ sneak+interact ou hit ──> vira item com inventorio serializado
```

## Variantes

| Item | Entidade | Slots | Craft |
|---|---|---|---|
| `bp:backpack` | `bp:backpack_e` | 27 | 8 leather + chest |
| `bp:axolotl_backpack` | `bp:axolotl_backpack_e` | 27 | leather + tropical_fish + chest |
| `bp:soul_backpack` | `bp:soul_backpack_e` | 27 | leather + soul_sand + chest |
| `bp:big_backpack` | `bp:big_backpack_e` | 54 | leather + iron + 2 chests |

## Loop do jogador

1. Craft na mesa.
2. Equipar no peito para vestir (protection 2).
3. Right-click bloco para colocar. Sem sneak em cama/bau/porta: placement e desfeito e o item e reembolsado.
4. Right-click na entidade: abre UI.
5. Sneak + right-click **ou** atacar: pega de volta (inventario do jogador precisa de slot livre).

Mensagem de boas-vindas no first join resume esses passos.
