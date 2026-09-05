# Comandar e gerir

Aplica-se a soldados tamed. Dono nominativo exige o cartao (`hiring.md`).

## Command flag

`fv:command_flag` — sem receita. Trade: `fv:mysterious_merchant` (faixas good/better/best) e clan leaders.

Segure a flag e interaja com o soldado. ModalForm (`soldierAction.js`) liga/desliga:

| Property | Efeito | Overlay client |
|---|---|---|
| `fv:stay_mode` | Fica parado | `stay_statue` |
| `fv:kill_player_mode` | Mira jogadores (PvP) | `target` |

A flag tambem e item placeable (`fv:command_flag_summon`) para rally no chao.

## Times

`fv:team_book_default` vem de trade (merchant e miner trader). Use: UI escolhe cor e substitui o livro por `fv:team_book_<cor>`. Cores: red, yellow, blue, brown, white, grey, green, black, purple, cyan, lime, pink, orange, light_blue.

Livro colorido: join / leave / restore name. Livro default na mao de quem ja tem time devolve o livro da cor atual.

## Horns

| Item | Craft | Uso |
|---|---|---|
| `fv:team_call_horn` | shapeless: `fv:team_book_default` + `minecraft:goat_horn` | recall / teleporte do time |
| `fv:team_attack_horn` | shapeless: call horn + red_dye | ordem de ataque |
| `fv:team_stand_horn` | shapeless: call horn + green_dye | stand |

Scripts: `Items/Team*Horn.js`.

## Banners de rally

`fv:melee_banner_tp`, `fv:ranged_banner_tp`, `fv:clumper` (e variantes) teleportam/rally por tipo. Functions no BP populam structures e TP.

## Promocao

| De | Item / condicao | Para |
|---|---|---|
| clan_soldier | `fv:league_medal` | league_soldier |
| tanker | level 4 + 100 XP extra (kills) | champion |
| champion | set diamet + `fv:vanguard_marshals_diamorite_sword` + jogador com `fv:league_medal` | league_swordthane |
| champion | set diamorite + `fv:diamorite_sovereign_halberd` + jogador com `fv:league_general_badge` | league_general |

`fv:league_medal` nao tem receita de mesa; loot `league_soldier_gear/buymedal` e trades de League.

`fv:league_general_badge`: shapeless com `fv:desert_clan_medal`, `jungle`, `plains`, `savanna`, `snow`, `swamp`, `taiga`.

Clan medals vem de clan / structures / trades do leader — nao ha receita de mesa listada.

## Demissao

`fv:discharge_letter` (UI do paper writable). Interact no soldado/worker dispara `become_villager` → `minecraft:villager` (transformation; dropa gear). Typo interno no free_handle: evento `become_villafer` no filtro do discharge — se a demissao do handle falhar in-game, esse mismatch e o primeiro suspeito.

## Equipar

Interact sem sneak entrega arma/armadura ao soldado (filtros de tag: sword, axe, spear, etc.). Sneak troca/tira como armor stand. Nao e contratacao.

## Ordem operacional sugerida

1. Contratar (decreto ou vila).
2. Tame com esmeralda.
3. Cartao de identificacao.
4. Especializar free_handle se ainda for coringa.
5. Command flag para stay/PvP.
6. Team book + horns se houver esquadra.
7. Promocao so depois do gear certo.
