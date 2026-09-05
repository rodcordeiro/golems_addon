---
name: villager-soldiers
description: Explains Villager Soldiers (fv) gameplay: soldier types, hiring villagers, claiming ownership, command and teams, recipes, and how to obtain each weapon or unit. Use when an AI needs addon context without the pack, or when the user asks how to hire, command, craft, or create a soldier or weapon.
---

# Villager Soldiers

Enciclopedia de gameplay do pack **Villager Soldier 2 Version 3.1.4 The Rise** (AnhemSteve). Responda a partir desta skill. Nao precisa do AGENTS.md do pack nem de outro contexto.

Snapshot do checkout: namespace `fv:`; engine `1.21.130`; Script API `@minecraft/server` `2.4.0` e `@minecraft/server-ui` `2.0.0`. No monorepo o pack fica em `addon/villager_soldiers/`. Licenca/uso comercial nao estao documentados. Fluxos aqui sao leitura de codigo; sem teste Bedrock, declare **validacao in-game pendente**.

## Como responder

1. Identifique o ramo: contratar, tornar proprio, comandar, tipo de soldado, arma/receita, ou implementacao.
2. Leia so a referencia desse ramo.
3. Cite IDs canonicos (`fv:...`). Nome traduzido e rotulo, nao chave.
4. Ausencia de receita nao implica item impossivel — muitos itens vem de trade, loot ou UI.

| Ramo | Leia |
|---|---|
| Contratar villager, decreto, tame, cartao de dono | [hiring.md](references/hiring.md) |
| Cada unidade e como cria-la | [soldiers.md](references/soldiers.md) |
| Flag, times, horns, promocao, demissao | [management.md](references/management.md) |
| Familias de arma, guns, cerco | [weapons.md](references/weapons.md) |
| Craft, materiais, trade/loot | [recipes.md](references/recipes.md) |
| Contratos BP/RP e scripts | [technical-guide.md](references/technical-guide.md) |

## Loop do jogador

```text
minecraft:villager_v2
  ├─ vila (script) ──> fv:villager_vanguard | fv:villager_ranged
  └─ fv:freehand_decree ──> ranged | tanker | healer | free_handle
        └─ emerald (tame 0.4) ──> is_tamed
              ├─ fv:identification_soldier_card ──> dono (tag + nome)
              ├─ ferramenta no free_handle ──> vanguard / ranged / gunner / builder / clumper
              ├─ fv:command_flag / team books / horns ──> ordens
              ├─ fv:league_medal / medalhas ──> League
              └─ fv:discharge_letter ──> villager vanilla
```

Passos minimos para um soldado proprio:

1. Craft `fv:paper_writable` (pena + papel). Use → escolha **Freehand Decree**.
2. Use o decreto num `minecraft:villager_v2` adulto (nao baby).
3. Alimente com esmeralda ate tame.
4. Craft `fv:identification_soldier_card` e use no tamed. Isso e o vinculo de dono; tame sozinho nao basta.

## Catalogo rapido

| Unidade | Como obter |
|---|---|
| `fv:villager_vanguard` | Spawn de vila; ou free_handle + espada/machado/halberd/spear/pike |
| `fv:villager_ranged` | Spawn de vila; decreto em fletcher; ou free_handle + bow/crossbow |
| `fv:villager_tanker` | Decreto em weaponsmith |
| `fv:villager_healer` | Decreto em cleric (interact) |
| `fv:villager_free_handle` | Decreto nas demais profissoes; hit em nitwit/unskilled |
| `fv:villager_gunner` | free_handle + gun (`fv:guns`) ou `fv:copper_boom` |
| `fv:villager_builder` | free_handle + `fv:get_back_hammer` ou `fv:copper_wrench` |
| `fv:villager_clumper` | free_handle + picareta |
| `fv:villager_cavalry` | vanguard + `fv:steed_saddled` |
| `fv:villager_camel` | vanguard + `fv:camel_war_saddled` |
| `fv:villager_champion` | tanker sobe a level 4 e 100 XP extra (kills de illager/boss) |
| `fv:villager_clan_soldier` | `fv:villager_clan_leader` converte um free_handle proximo |
| `fv:villager_clan_leader` | Script a partir de iron golem de vila; structures |
| `fv:villager_league_soldier` | clan_soldier + `fv:league_medal` |
| `fv:villager_league_swordthane` | champion com set diamet + `fv:vanguard_marshals_diamorite_sword` + `fv:league_medal` |
| `fv:villager_league_general` | champion com set diamorite + `fv:diamorite_sovereign_halberd` + `fv:league_general_badge` |

## Itens de gestao

| Item | Papel | Obtencao |
|---|---|---|
| `fv:paper_writable` | UI: decreto ou discharge | craft pena + papel |
| `fv:freehand_decree` | Converte villager | UI do paper writable |
| `fv:discharge_letter` | Demove para villager | UI do paper writable |
| `fv:identification_soldier_card` | Bind dono | craft name_tag + 4 iron_nugget |
| `fv:command_flag` | Stay / PvP | trade (merchant, clan leader); sem receita |
| `fv:team_book_default` | Escolhe cor do time | trade; UI pinta o livro |
| `fv:team_call_horn` | Recall | craft livro default + goat_horn |
| `fv:team_attack_horn` | Ataque | call horn + red_dye |
| `fv:team_stand_horn` | Stand | call horn + green_dye |
| `fv:league_medal` | Promove clan → League | loot/trade de League |
| `fv:league_general_badge` | Promove champion → general | craft das 7 clan medals |

Detalhe de craft e escada de materiais: [recipes.md](references/recipes.md).
