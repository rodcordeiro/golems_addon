# Gauntlet — Stone Golem ranged combat realignment

Atualizado em: 2026-08-03  
Packs alvo: `1.0.20`  
Escopo: somente `gollem_addon/`  
Referencia de qualidade: `villager_soldiers` (`iron_golem_guard`, soldados ranged) — extrair padroes, nao copiar pack.

Intent de produto (nao negociavel):

- Wild: hostil; ataque primario **ranged** (`addon:stone_projectile`); mira jogadores.
- Guard `player_created` (pre-tame): ataque primario **ranged**; mira **somente monstros** (nao aggro no criador).
- Guard **tamed**: mira monstros **e** outros jogadores (nunca o dono).
- Melee apenas como fallback de emergencia.

---

## Tickets

| ID | Status | Escopo |
| ---- | ------ | ------ |
| GOLEM-018 | Feito (codigo) | Ranged como caminho primario (prioridade + radius); melee fallback |
| GOLEM-019 | Feito (codigo) | Targeting: wild=`player`; pre-tame=`monster`; tamed=`monster` + `player` nao-owner; `must_reach: false` |
| GOLEM-020 | Feito (codigo) | Contrato BP shooter/projectile ↔ RP client + FX existentes |
| GOLEM-021 | Feito (codigo) | Controller throw: manter hooks `query.is_using_item` (sem redesenho visual) |
| GOLEM-022 | Feito (docs) | Bump 1.0.20 + README/backlog/AGENTS alinhados ao fantasy ranged |
| GOLEM-023 | Pendente (in-game) | Prova Bedrock: throw wild/guard, nao ataca dono, melee so de perto |

---

### GOLEM-018 — Ranged primario

**Problema (1.0.19):** `delayed_attack` priority 1; `ranged_attack` priority 6 — fantasy melee-first.

**Acao:**

- `ranged_attack` priority baixa (numero) = primaria; `attack_interval_min/max`, `attack_radius`, `attack_radius_min`.
- `delayed_attack` sobe de prioridade numerica = fallback quando dentro do min radius.
- Manter locomotion basica (movement.basic, jump.static, navigation, persistent, pushable, follow_range).

**Aceite codigo:** ranged priority < melee priority; shooter aponta `addon:stone_projectile`.  
**Aceite in-game:** GOLEM-023.

### GOLEM-019 — Targeting hygiene

**Problema:** `must_reach: true` (errado para ranged); targeting de guard misturava players antes do tame (aggro no criador).

**Acao:**

- Wild: `must_reach: false`, `must_see: true`, family `player`.
- `player_created` (pre-tame): so `monster` (exclui `stone_golem` / `player_golem`) — evita aggro no builder.
- `tamed`: sobrescreve target com `monster` + `player` com `is_owner != true`.
- `attack_owner: false`; `hurt_by_target` ignora self-family e owner; follow/owner_hurt_* no grupo tamed.

**Mitigacao QA ([Nyx](419e89a6-522b-457a-885a-846323048d28)):** pre-tame nao mira players; PvP guard so apos iron_ingot.

### GOLEM-020 — Contrato projetil BP↔RP

**Problema:** apos remocao de componentes invalidos no mob (1.0.18), revalidar contrato de throw.

**Acao (auditoria + ajustes minimos):**

- BP mob: `minecraft:shooter.def` = `addon:stone_projectile`.
- BP projetil: `minecraft:projectile` + impacto / `stone_impact_fx`.
- RP: `stone_projectile.entity.json` + FX/particula ja presentes (GOLEM-017).

Sem inventar novo FX.

### GOLEM-021 — Anim throw

**Acao:** nao redesenhar (GOLEM-008/009 pendentes). Manter estados `pull`/`throw` ligados a `query.is_using_item`.

**Risco:** se Bedrock nao setar `is_using_item` no ranged custom, anim de throw pode nao disparar — prova in-game.

### GOLEM-022 — Docs / versao

Bump BP+RP `1.0.19` → `1.0.20`; README comportamento; backlog status; nota em AGENTS.

### GOLEM-023 — Gate in-game (nao fecha so com JSON)

1. Wild: aproxima e **arremessa** pedra em jogador (nao so soco).
2. `player_created` pre-tame: arremessa em monstro; **nao** aggro no criador.
3. Apos tame (`iron_ingot`): arremessa em monstro e em outro jogador; **nao** ataca dono.
3. Dentro de ~3 blocos: melee fallback aceitavel.
4. Projetil visivel + impacto FX.
5. Anim pull/throw se `is_using_item` funcionar.

---

## Ordem de execucao desta gauntlet

1. GOLEM-018 + GOLEM-019 (entity BP)
2. GOLEM-020 + GOLEM-021 (contrato / controller check)
3. GOLEM-022 (version + docs)
4. Validar JSON ConvertFrom-Json
5. GOLEM-023 fica para humano / test_world
