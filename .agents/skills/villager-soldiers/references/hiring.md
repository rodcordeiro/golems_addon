# Contratar, tame e dono

## Decreto

Craft `fv:paper_writable`: shapeless, `minecraft:feather` + `minecraft:paper`. Use o item. A UI (`PaperWritable.js`) oferece **Freehand Decree** (`fv:freehand_decree`) ou **Discharge Letter** (`fv:discharge_letter`).

O decreto converte um `minecraft:villager_v2` adulto. Babies sao ignorados. O villager original e removido e a nova entidade nasce no mesmo lugar. Bioma passa de `minecraft:mark_variant` (0–6) para spawnEvent `fv:plains|desert|jungle|savanna|snow|swamp|taiga`.

Ha tres caminhos de codigo (interact, hurt, custom component `fv:freehand_hit_event`). Filtros diferem. Ao explicar gameplay, use a tabela abaixo; ao afirmar um caminho concreto, confira o handler.

### Interact com decreto

| Profissao (`type_family`) | Resultado |
|---|---|
| `fletcher` | `fv:villager_ranged` |
| `weaponsmith` | `fv:villager_tanker` |
| `cleric` | `fv:villager_healer` (spawnEvent fixo `minecraft:entity_spawned`) |
| demais, exceto nitwit/unskilled | `fv:villager_free_handle` |

Nitwit/unskilled nao convertem por interact — o script deixa o hit tratar.

### Hit com decreto

| Alvo | Resultado documentado |
|---|---|
| nitwit / unskilled | `fv:villager_free_handle` |
| weaponsmith / fletcher (custom onHit) | tanker / ranged |
| demais no custom onHit | `fv:villager_free_handle` |

Nao assuma que cleric vira healer em todos os caminhos — isso esta no interact, nao no custom onHit.

O decreto e consumido (stack diminui ou some).

## Spawn sem decreto

Quando um `minecraft:villager_v2` dispara `minecraft:spawn_from_village`, o script spawna perto um `fv:villager_vanguard` ou `fv:villager_ranged` (chao seguro; evita bed/carpet/slab).

Quando um `minecraft:iron_golem` dispara `minecraft:from_village`, o script spawna `fv:hay_golem` ou `fv:villager_clan_leader`.

Esses soldados de vila ainda precisam de tame + cartao para serem "seus".

## Tame

Soldados usam `minecraft:tameable` com **esmeralda**. Probabilidade documentada **0.4**. Sucesso dispara evento `tamed` → `minecraft:is_tamed` e property `fv:tamed: true`. Overlay client: `query.is_tamed` → cor de tamed.

Tame faz o soldado seguir/defender o jogador. Nao grava dono nominativo.

## Tornar soldado proprio

Craft `fv:identification_soldier_card`:

```text
 i
ici
 i
```

- `i` = `minecraft:iron_nugget`
- `c` = `minecraft:name_tag`

Segure o cartao e interaja com o soldado **tamed**. O script `identificationOwner.js` aplica tag `owner_{name}_{id}` e renomeia para `<nome> soldier`. Entidades tambem checam o item e setam `fv:dadinhdanh`.

Sem cartao, o soldado esta tame mas nao "registrado" como seu. Use o cartao depois do tame.

## Especializar o free_handle

`fv:villager_free_handle` e o coringa. Interact com ferramenta transforma (consome o papel de "hire"):

| Item na mao | Vira |
|---|---|
| tag `minecraft:is_sword`, `minecraft:is_axe`, `fv:is_halberd`, `minecraft:is_spear` ou `fv:is_pike` | `fv:villager_vanguard` |
| bow, crossbow (vanilla ou IDs handlecannon) | `fv:villager_ranged` |
| tag `fv:guns` ou `fv:copper_boom` | `fv:villager_gunner` |
| `fv:get_back_hammer` ou `fv:copper_wrench` | `fv:villager_builder` |
| tag `minecraft:is_pickaxe` | `fv:villager_clumper` |
| `fv:discharge_letter` | villager vanilla |

A transformacao dropa inventario/equipamento do free_handle.

## O que nao e contratacao

- Equipar arma num soldado ja existente nao recontrata; e so gear.
- `fv:command_flag` nao contrata; so abre modos.
- Promocao League e outra etapa (`management.md`).
