# QA — Milestone 2 (MINER-012..016) — clean-context

**Data:** 2026-08-03  
**Packs:** `1.0.2` BP/RP sync + cross-deps OK  
**Bar:** padroes `villager_soldiers` (banner placeable + script hygiene)  
**Escopo:** validacao estatica de codigo/assets; **sem teste in-game**

## Veredito por ticket

| Ticket | Resultado |
|--------|-----------|
| MINER-012 | PASS (codigo) |
| MINER-016 | PASS-WITH-GAPS |
| MINER-015 | PASS-WITH-GAPS |
| MINER-013 | PASS (codigo) |
| MINER-014 | PASS (codigo) |

**Milestone 2 overall:** PASS-WITH-GAPS — nao marcar “validado” sem in-game.

## Blocking

Nenhum bloqueio de aceite em codigo para “feito codigo”.  
Bloqueio de produto: checklist in-game do backlog ainda aberto.

## Gaps vs Soldiers (nao bloqueantes)

- Item icon: corrigido apos QA para **16×16** em `textures/items/tunnel_start_banner.png` (atlas de entidade permanece 128×128).
- Sem receita/trade para o banner (OK via `/give`; Soldiers entrega por trade).
- Sem spawn egg (`is_spawnable: false` — alinhado a Soldiers).
- Binding de dono do banner: jogador mais proximo raio 8 no spawn.

## Evidencias-chave

- `tunnelCells3x3` / `mineStep3x3` — 3x3 + ore raio 1; fill `setType(air)` sem inventariar
- `COPPER_CHESTS` (8 variantes) + `depositCargoToChest` slots ≠ `TOOL_SLOT`
- `resolveTunnelOrigin` / BP↔RP `va:tunnel_start_banner(_marker)`
- `BRANCH_*` 12% len 2–4; `STAIR_*` 10% 2 passos ±1 Y
- `git status`: zero diffs sob `villager_soldiers/`
- JSON parse OK nos artefatos M2 inspecionados
