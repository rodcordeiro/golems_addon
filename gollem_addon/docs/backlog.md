# Backlog — gollem_addon (Stone Golems)

Atualizado em: 2026-08-01

Regras de escopo: `../../docs/references/coding-guidelines.md` e `../AGENTS.md`.
Checklist comparativo / testes manuais: `golem-012-004-testes.md`.

**Status packs:** `1.0.18` (contrato BP/RP endurecido localmente). Gates de release in-game: GOLEM-010 / GOLEM-011.
**Namespace:** `addon:` | **min_engine_version:** `1.20.10`

---

## 1. Contexto

Problemas observados no mundo de teste `../test_world` e em `../assets/debugging/` (prints de labels/ovos/deformacao). Referencia funcional: `../villager_soldiers` (`iron_golem_guard`). Referencia visual: `../assets/redstone_rpg_gollem.png`, `../assets/stone_golem.png` / `.geo.json`.

Historico critico (ja enderecado em codigo):

- Receita retornava `golem_core_block` em vez do item placeable `golem_core`.
- Bloco verificava `stone` na propria posicao e chamava evento `addon:spawn_stone_golem` inexistente.
- Entidade sem locomocao basica / melee / look_at_target (GOLEM-004 / 1.0.17).
- `1.0.18`: remocao de componentes invalidos (`projectile`/`shoot` no mob, `on_death`), filtros `player_created` para monstros, lang/spawn egg client, spawn rules com difficulty/herd/density, item `menu_category`, recipe `unlock`, client projectile entity.

---

## 2. Milestones

### Milestone 1 - Addon 100% funcional

Fechar item, receita, criacao manual, entidade funcional, spawn, nomes, ovo, visual coerente e validacao end-to-end em `../test_world`.

Tickets: GOLEM-001 … GOLEM-013.

### Milestone 2 - Insights e melhorias do Stone Golem

Balanceamento, tame/dono, feedback visual (particula custom), polish survival — apos gate GOLEM-010.

### Milestone 3 - Sand Golem e Wood Golem

### Milestone 4 - Nether Golem

### Milestone 5 - Crystal Golem e Redstone Golem

---

## 3. Priorizacao e status

| Ordem | Ticket    | Status | Notas |
| ----: | --------- | ------ | ----- |
| 1 | GOLEM-001 | Feito (codigo) | Core placeable; gate in-game em GOLEM-011 |
| 2 | GOLEM-002 | Feito (codigo) | Receita → `addon:golem_core` |
| 3 | GOLEM-003 | Feito (codigo) | Estrutura + `function golems/spawn_stone_golem` |
| 4 | GOLEM-004 | Feito (codigo) | IA melee/locomocao `1.0.17`; aceite manual pendente |
| 5 | GOLEM-005 | Feito parcial | Spawn rules com difficulty/herd/density (`1.0.18`); falta prova natural in-game |
| 6 | GOLEM-006 | Feito (codigo) | Lang en_US/pt_BR item/bloco/entidade (`1.0.18`) |
| 7 | GOLEM-007 | Feito parcial | Spawn egg no client entity + lang; textura dedicada ainda generica/vanilla-like |
| 8 | GOLEM-008 | Pendente | Auditoria visual BP/RP vs texturas |
| 9 | GOLEM-009 | Pendente | Modelo/textura tortos vs referencia RPG |
| 10 | GOLEM-010 | Pendente | Gate end-to-end `../test_world` |
| 11 | GOLEM-011 | Pendente | Gate survival craft + estrutura |
| 12 | GOLEM-012 | Feito (docs) | Checklist em `golem-012-004-testes.md` |
| 13 | GOLEM-013 | Feito parcial | Endurecimento contrato `1.0.18` (ver abaixo) |

---

## 4. Tickets (resumo operacional)

### GOLEM-001 / 002 / 003 — Core e criacao manual

Concluidos em codigo (`1.0.14`–`1.0.16`). Aceite survival permanece em GOLEM-011.

### GOLEM-004 — IA, persistencia e combate

Concluido em implementacao (`1.0.17`). Criterios manuais em `golem-012-004-testes.md`. Nao marcar fechado sem evidencias Bedrock.

### GOLEM-005 — Spawn natural

Codigo: `spawn_rules` com `difficulty_filter`, `herd`, `density_limit` em `1.0.18`. Aceite: spawn com `doMobSpawning` em biome `mountain` + entidade funcional.

### GOLEM-006 — Nomes

Codigo: chaves lang para entity, spawn egg, item e tile em `1.0.18`. Aceite: inventario/crafting sem chave tecnica.

### GOLEM-007 — Ovo

Codigo: `spawn_egg` no client entity + lang. Pendente: textura dedicada distinta (referencia `assets/texturas minecraft/textures/item/spawn_egg*.png`).

### GOLEM-008 / 009 — Visual

Pendentes. Auditoria de referencias + ajuste geo/atlas/animacoes contra referencia RPG (manter identidade de pedra).

### GOLEM-010 / 011 — Gates de release

Pendentes. Sem checklist executado in-game, Milestone 1 nao fecha.

### GOLEM-012 — Checklist vs `iron_golem_guard`

Feito em documentacao. Decisoes alimentaram GOLEM-004/005/007/008.

### GOLEM-013 — Endurecimento de contrato BP/RP (`1.0.18`)

Feito parcial em codigo:

- Removidos `minecraft:projectile` / `minecraft:shoot` invalidos no mob; ranged fica para refino futuro.
- `player_created` mira familias monstro (sem filtro `is_owner` quebrado).
- Removido `minecraft:on_death` invalido (nao spawna mais `golem_anchor`).
- Client: `stone_projectile.entity.json`, `pre_animation`, spawn egg.
- Item `menu_category`, recipe `unlock`.
- Spawn rules: difficulty / herd / density.

Ainda aberto / documentado:

- `addon:golem_anchor` permanece no BP sem spawn no fluxo atual (candidato a remocao em Milestone 2 se confirmar zero uso).
- Particula `addon:stone_impact` existe no RP; impacto do projetil ainda usa `smoke` via `particle_on_hit` (tipos custom nem sempre aceitos nesse campo).
- Sem tame/dono explicito no golem criado pelo jogador.
- Animacao de spawn subutilizada.

---

## 5. Ordem recomendada restante

1. Executar GOLEM-010 / GOLEM-011 em `../test_world` (gates).
2. Fechar GOLEM-005 (prova de spawn natural) e GOLEM-007 (textura do ovo) se falharem no gate.
3. GOLEM-008 → GOLEM-009 (visual).
4. Milestone 2: tame/dono, particula custom via script se necessario, remocao de `golem_anchor` se ocioso.

---

## 6. Riscos

- Mudar identificadores/UUIDs quebra mundos existentes.
- Qualquer mudanca funcional exige bump igual em BP e RP.
- Validacao JSON != validacao Bedrock.
- Copiar componentes de `iron_golem_guard` sem adaptar `format_version`/families/filtros introduz regressao.
- `golem_anchor` ocioso aumenta ruido de pack sem valor de gameplay.
