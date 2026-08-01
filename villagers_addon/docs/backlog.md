# Backlog — villagers_addon (Minerador de Tunel)

Atualizado em: 2026-08-01

Decisoes fechadas via grilling. Ideia original: `docs/IDEIA_MINERADOR.md`.
Regras de escopo: `../../docs/references/coding-guidelines.md` e `../AGENTS.md`.

**Status:** MVP implementado em codigo (MINER-001..009). **Validacao in-game pendente** (MINER-010).
**Packs:** `behavior_pack/` + `resource_pack/` (namespace `va:`, versao `1.0.0`, engine `1.21.130` + Script API `2.4.0`).

---

## 1. Decisoes fechadas

### Identidade

| Item | Decisao |
|------|---------|
| Namespace | `va:` |
| Entity | `va:villager_miner` |
| Nome (lang) | Minerador de Tunel |
| Pack | `villagers_addon/` independente; nao editar `villager_soldiers` |
| Soft-dependencia de uso | Villager Soldiers (precisa existir `fv:villager_free_handle`) |

### Contratacao (Opcao A)

| Item | Decisao |
|------|---------|
| Item | `va:mining_contract` |
| Receita | shaped: `P`/`A` (wooden_pickaxe sobre paper) → 1 contrato (picareta consumida) |
| Alvo do hire | **somente** `fv:villager_free_handle` (adulto; nao baby) |
| Nao usar | `minecraft:villager_v2` direto; nao injetar UI do `fv:paper_writable` |
| No hire | remove free_handle; spawna `va:villager_miner`; tag de **dono**; direcao = yaw do jogador → cardinal N/S/E/W |

### Trabalho / inventario (MVP)

| Item | Decisao |
|------|---------|
| Picareta de cava | entregue depois (slot 0 do inventario); sem picareta → nao cava |
| Tunel | 1x2, Y fixo no hire, ore adjacente raio 1 (sai, coleta, volta ao eixo) |
| Ore | vai para inventario da entidade (slots 1+) |
| Fill (stone, deepslate, netherrack, cobble, …) | destroi **sem dropar** e **sem** inventariar |
| Inventario cheio | volta ao **ponto de hire** e aguarda |
| Retomada | hibrida: se houver espaco + picareta + nao `stay_mode` → retoma |
| Pausar | interact do dono (mao vazia) alterna `va:stay_mode` |
| Demissao | matar a entidade |
| Limites | max 64 blocos do hire; 1 passo / 10 ticks; stop em lava/agua/bedrock/blacklist |

### Visual (MVP)

Base: client entity do clumper (texturas por bioma + `geometry.va_villager_miner` copiada de `geometry.villager_handle`).

### Fora do MVP (v2+)

| Item | Decisao |
|------|---------|
| Fill | depositar em **bau de cobre** por **busca automatica** |
| Direcao / ordens | flags, comandos ou item de comando |
| Branch mining, tochas, rails, tunel 2x2/3x3 | depois |
| Carta de demissao | opcional; MVP usa kill |

---

## 2. Milestones

### Milestone 1 — MVP jogavel

Tickets MINER-001 … MINER-010.

### Milestone 2 — Depositos e comando

MINER-011 … (apos validacao MVP).

---

## 3. Priorizacao e status

| Ordem | Ticket | Status | Notas |
| ----: | ------ | ------ | ----- |
| 1 | MINER-001 | Feito | Manifests BP/RP + script entry |
| 2 | MINER-002 | Feito | Item + receita + icon/lang |
| 3 | MINER-003 | Feito | Entity BP lean + `va:stay_mode` |
| 4 | MINER-004 | Feito | Visual baseado no clumper |
| 5 | MINER-005 | Feito | `scripts/hire.js` |
| 6 | MINER-006 | Feito | Entrega picareta (slot 0) |
| 7 | MINER-007 | Feito | `scripts/minerLoop.js` strip 1x2 |
| 8 | MINER-008 | Feito | Retorno ao hire + waiting |
| 9 | MINER-009 | Feito | Toggle stay por interact |
| 10 | MINER-010 | Pendente | Validacao in-game Bedrock |

### Milestone 2 (rascunho)

| Ordem | Ticket | Escopo |
| ----: | ------ | ------ |
| 11 | MINER-011 | Fill → copper chest (busca auto) |
| 12 | MINER-012 | Flags/comandos de direcao |
| 13 | MINER-013 | UI/item de comando |

---

## 4. Arquivos principais

| Area | Path |
|------|------|
| Manifests | `behavior_pack/manifest.json`, `resource_pack/manifest.json` |
| Entity | `behavior_pack/entities/villager_miner.json` |
| Item/receita | `behavior_pack/items/mining_contract.json`, `recipes/mining_contract.json` |
| Scripts | `behavior_pack/scripts/{main,common,hire,minerInteract,minerLoop}.js` |
| Client | `resource_pack/entity/villager_miner.entity.json` |
| Geo/texturas | `resource_pack/models/entity/va_villager_miner.geo.json`, `textures/entity/villager_miner/*` |

---

## 5. Checklist MINER-010 (in-game)

- [ ] Soldiers + villagers_addon ativos no mundo
- [ ] Craft `paper` + `wooden_pickaxe` → `va:mining_contract`
- [ ] Freehand decree → `fv:villager_free_handle`
- [ ] Contrato no free_handle → `va:villager_miner` com dono/direcao
- [ ] Entregar picareta → inicia strip
- [ ] Ore no inventario; fill nao aparece
- [ ] Inventario cheio → volta ao hire e espera
- [ ] Esvaziar + picareta + !stay → retoma
- [ ] Interact vazio pausa/retoma stay
- [ ] Stop em lava/bedrock; limite 64
- [ ] Visual renderiza (texturas bioma / geo)

**Nao marcar MVP como validado sem evidencias acima.**

---

## 6. Riscos conhecidos (codigo atual)

- Soft-dependencia de `fv:villager_free_handle`.
- Abrir inventario do miner: sneak+interact pode depender do cliente; esvaziar manual ainda nao tem UI dedicada — usar comandos/`replaceitem` se necessario ate polish.
- `mark_variant` copiado do free_handle pode falhar conforme API; fallback plains.
- Retorno ao hire usa `teleport` (nao pathfinding no eixo).
- Performance: um tick a cada 10 para todos os miners em overworld/nether/end.
- Comportamento in-game **nao validado**.

---

## 7. Proximo passo

Executar MINER-010 no Bedrock/`test_world` (ou mundo com ambos os packs). So entao abrir Milestone 2.
