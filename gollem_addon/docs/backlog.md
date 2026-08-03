# Backlog — gollem_addon (Stone Golems)

Atualizado em: 2026-08-03

Regras de escopo: `../../docs/references/coding-guidelines.md` e `../AGENTS.md`.
Checklist comparativo / testes manuais: `golem-012-004-testes.md`.
Gauntlet combate ranged: `gauntlet-ranged.md`.

**Status packs:** `1.0.20`  
**Namespace:** `addon:` | **min_engine_version:** `1.20.10`  
**Gates de release in-game:** GOLEM-010 / GOLEM-011 / GOLEM-023 (ainda abertos).

---

## 1. Contexto

Problemas observados no mundo de teste `../test_world` e em `../assets/debugging/`. Referencia funcional: `../villager_soldiers` (`iron_golem_guard`, soldados ranged). Referencia visual: `../assets/redstone_rpg_gollem.png`, `../assets/stone_golem.png` / `.geo.json`.

Historico critico enderecado em codigo ate `1.0.19`/`1.0.20`:

- Receita/item/bloco/estrutura de criacao manual alinhados.
- IA melee/locomocao (`1.0.17`) — depois realinhada para ranged-primary em `1.0.20`.
- Contrato BP/RP endurecido (`1.0.18`): langs, spawn egg client, spawn rules, remocao de componentes invalidos.
- Pendentes conscientes fechados em codigo (`1.0.19`): remocao de `golem_anchor`, tame/dono, anim spawn no controller, impacto com `addon:stone_impact`.
- Fantasy de combate realinhado (`1.0.20`): ranged primario; pre-tame so monstros; tamed = monstros + outros players; `must_reach: false`.

---

## 2. Milestones

### Milestone 1 - Addon 100% funcional

Item, receita, criacao manual, entidade, spawn, nomes, ovo, visual coerente + validacao end-to-end em `../test_world`.

### Milestone 2 - Insights e melhorias

Balanceamento, polish survival, visual RPG (GOLEM-008/009), textura dedicada do ovo.

### Milestone 3+ - Sand / Wood / Nether / Crystal / Redstone Golem

A detalhar apos Milestone 1.

---

## 3. Priorizacao e status

| Ordem | Ticket    | Status | Notas |
| ----: | --------- | ------ | ----- |
| 1 | GOLEM-001 | Feito (codigo) | Core placeable; gate in-game em GOLEM-011 |
| 2 | GOLEM-002 | Feito (codigo) | Receita → `addon:golem_core` |
| 3 | GOLEM-003 | Feito (codigo) | Estrutura + `function golems/spawn_stone_golem` |
| 4 | GOLEM-004 | Feito (codigo) | Locomocao; combate depois realinhado em GOLEM-018 |
| 5 | GOLEM-005 | Feito parcial | Spawn rules prontas; falta prova natural in-game |
| 6 | GOLEM-006 | Feito (codigo) | Lang en_US/pt_BR |
| 7 | GOLEM-007 | Feito parcial | Spawn egg client + lang; textura dedicada pendente |
| 8 | GOLEM-008 | Pendente | Auditoria visual BP/RP |
| 9 | GOLEM-009 | Pendente | Modelo/textura vs referencia RPG |
| 10 | GOLEM-010 | Pendente | Gate end-to-end `../test_world` |
| 11 | GOLEM-011 | Pendente | Gate survival craft + estrutura |
| 12 | GOLEM-012 | Feito (docs) | Checklist vs `iron_golem_guard` |
| 13 | GOLEM-013 | Feito (codigo) | Endurecimento contrato `1.0.18` |
| 14 | GOLEM-014 | Feito (codigo) | Removido `addon:golem_anchor` ocioso (`1.0.19`) |
| 15 | GOLEM-015 | Feito (codigo) | Tame/dono via `iron_ingot` em `player_created` (`1.0.19`) |
| 16 | GOLEM-016 | Feito (codigo) | Anim `spawn` como estado inicial do controller (`1.0.19`) |
| 17 | GOLEM-017 | Feito (codigo) | Impacto: FX `addon:stone_impact_fx` + particula `addon:stone_impact` (`1.0.19`) |
| 18 | GOLEM-018 | Feito (codigo) | Ranged primario; melee fallback (`1.0.20`) |
| 19 | GOLEM-019 | Feito (codigo) | Wild=player; pre-tame=monster; tamed=+outros players (`1.0.20`) |
| 20 | GOLEM-020 | Feito (codigo) | Contrato shooter/projectile BP↔RP auditado (`1.0.20`) |
| 21 | GOLEM-021 | Feito (codigo) | Hooks throw `is_using_item` mantidos (`1.0.20`) |
| 22 | GOLEM-022 | Feito (docs) | Bump/docs fantasy ranged (`1.0.20`) |
| 23 | GOLEM-023 | Pendente | Gate in-game combate ranged |

---

## 4. Tickets conscientes fechados em 1.0.19

### GOLEM-014 — Remover `golem_anchor`

**Problema:** entidade auxiliar existia no BP sem spawn no fluxo (evento de morte invalido ja tinha sido removido).

**Acao:** deletar `behavior_pack/entities/golem_anchor.json`. Impacto visual de morte fica para Milestone 2 se desejado.

**Aceite codigo:** nenhum JSON referencia `addon:golem_anchor`.  
**Aceite in-game:** GOLEM-010.

### GOLEM-015 — Tame / dono

**Problema:** golem `player_created` defendia monstros, mas sem dono explicito (follow / retaliacao).

**Acao:**
- Grupo `can_tame`: `minecraft:tameable` com `iron_ingot` → evento `addon:tamed`.
- Grupo `tamed`: `is_tamed`, `follow_owner`, `owner_hurt_by_target`, `owner_hurt_target`.
- Evento `player_created` adiciona `player_created` + `can_tame`.
- `hurt_by_target` ignora `is_owner`.

**Uso:** criar golem (estrutura/`player_created`) → alimentar com lingote de ferro.

**Risco:** comportamento de owner depende do Bedrock; validar in-game (GOLEM-010).

### GOLEM-016 — Animacao de spawn

**Problema:** `animation.stone_golem.spawn` registrada no client entity, mas controller iniciava em `idle`.

**Acao:** controller `initial_state: spawn`, transicao para `idle` com `query.all_animations_finished || query.life_time > 1.25`.

### GOLEM-017 — Particula `stone_impact`

**Problema:** hit do projetil usava so `smoke` vanilla; `addon:stone_impact` existia sem acoplamento.

**Acao:**
- Entidade curta `addon:stone_impact_fx` spawnada no `on_hit` via `spawn_chance`.
- Client entity + controller emitem particula `addon:stone_impact`.
- `smoke` permanece como fallback leve no `particle_on_hit` (tipos custom nem sempre aceitos nesse campo).

**Risco:** `spawn_chance` em projetil e o path de FX precisam de prova in-game.

---

## 5. Gauntlet ranged (`1.0.20`)

Detalhe operacional: `gauntlet-ranged.md`.

### GOLEM-018 — Ranged primario

`ranged_attack` priority 2 (`attack_interval_min/max` 2–4s, radius 28, min 3); `delayed_attack` priority 5 como fallback; `shooter` → `addon:stone_projectile`.

### GOLEM-019 — Targeting

- Wild: players; `must_reach: false`.
- `player_created` (pre-tame): so monsters (exclui familias golem) — evita aggro no builder.
- `tamed`: monsters + players com `is_owner != true` (sobrescreve target); `attack_owner: false`.
- `hurt_by_target` continua ignorando self-family e owner.

Mitigacao do WARN do gauntlet: PvP guard so apos tame.

### GOLEM-020 / GOLEM-021

Contrato projetil + FX existentes ok; controller pull/throw permanece em `query.is_using_item` (sem redesenho GOLEM-008/009).

---

## 6. Ainda pendente (nao fechavel so com JSON)

| Ticket | O que falta |
| ------ | ----------- |
| GOLEM-005 | Prova de spawn natural em biome `mountain` |
| GOLEM-007 | Textura dedicada do ovo |
| GOLEM-008 / 009 | Auditoria e redesenho visual |
| GOLEM-010 | Checklist end-to-end em `../test_world` |
| GOLEM-011 | Survival: craft core + estrutura → golem |
| GOLEM-023 | Prova combate ranged wild/guard + nao atacar dono |

Checklist minimo sugerido para GOLEM-010 / GOLEM-023 apos `1.0.20`:

1. Summon wild — move, mira jogador, **arremessa** pedra (nao so melee).
2. `player_created` pre-tame — arremessa em monstro; **nao** aggro no criador.
3. Apos tame (`iron_ingot`) — arremessa em monstro e em outro jogador; **nao** ataca dono; segue/retalia.
4. Dentro de ~3 blocos: melee fallback aceitavel.
5. Estrutura survival cria golem.
6. Projetil ao acertar mostra burst `stone_impact` (e smoke).
7. Spawn anim toca ao nascer (~1.2s); pull/throw se `is_using_item` disparar.
8. Nomes/lang sem chave tecnica; `golem_anchor` ausente.

---

## 7. Ordem recomendada restante

1. Executar GOLEM-023 + GOLEM-010 / GOLEM-011 (gates).
2. Ajustar GOLEM-015/016/017/018/019 se o teste in-game falhar.
3. GOLEM-005 prova natural; GOLEM-007 textura do ovo.
4. GOLEM-008 → GOLEM-009 (visual).

---

## 8. Riscos

- Mudar identificadores/UUIDs quebra mundos existentes.
- Mudanca funcional exige bump igual BP/RP (agora `1.0.20`).
- Validacao JSON != validacao Bedrock.
- Tame/dono, FX de impacto e ranged throw sao contratos data-driven — evidencias in-game obrigatorias antes de release.
- Anim de throw depende de `query.is_using_item` no ranged custom (pode nao disparar).
