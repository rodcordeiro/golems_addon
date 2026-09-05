# QA — MINER-017 (command flag) — clean-context

**Data:** 2026-08-03  
**Packs:** `1.0.4` BP/RP  
**Bar:** `villager_soldiers` `soldierAction.js` (ModalForm v2 + `system.run` + `isValid`)  
**Validador:** Nyx (contexto limpo)  
**Escopo:** validacao estatica; **sem teste in-game**

## Veredito

**PASS_COM_RESSALVAS** — contrato MINER-017 coberto em codigo; sem bug bloqueante estatico.  
Nao marcar “validado” sem checklist in-game.

| Ticket | Resultado |
|--------|-----------|
| MINER-017 | PASS_COM_RESSALVAS |
| MINER-019 (spot prioridade) | OK com flag |
| Railer em codigo | Ausente (so docs/assets) — OK |

## Blocking

Nenhum bloqueio de aceite em codigo para “feito codigo”.  
Bloqueio de produto: checklist in-game (form, retarget de eixo, torch_dist, prioridade vs tocha).

## Gaps vs Soldiers (nao bloqueantes)

- Dois handlers `playerInteractWithEntity` (`minerInteract` + `commandFlag`) vs um unico no Soldiers — exige early-return na flag.
- Strings hardcoded no form (Soldiers usa `{ translate }`).
- Sem `minecraft:interact` JSON na entity (fluxo 100% Script API, alinhado a picareta/stay).

## Riscos

| Severidade | Item |
|------------|------|
| Alto (produto) | In-game nao testado |
| Medio | Remover early-return da flag pode toggle stay no mesmo interact |
| Baixo | Backlog ja alinhado a ordem N/E/S/W na implementacao |

## Proximo passo

Checklist in-game packs **1.0.4** (017 + regressao 019); depois **MINER-018** (icone final).
