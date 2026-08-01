# Backlog — villagers_addon (Minerador de Tunel)

Atualizado em: 2026-08-01

Decisoes fechadas via grilling. Ideia original: `docs/IDEIA_MINERADOR.md`.
Regras de escopo: `../../docs/references/coding-guidelines.md` e `../AGENTS.md`.

**Status:** MVP em codigo (MINER-001..009). MINER-011 corrigido em `1.0.1` (retomada cargo-only + normalizacao da picareta). MINER-010 pendente revalidacao in-game do item de retomada.
**Packs:** `behavior_pack/` + `resource_pack/` (namespace `va:`, versao `1.0.1`, engine `1.21.130` + Script API `2.4.0`).

---

## 1. Decisoes fechadas

### Identidade

| Item                    | Decisao                                                         |
| ----------------------- | --------------------------------------------------------------- |
| Namespace               | `va:`                                                           |
| Entity                  | `va:villager_miner`                                             |
| Nome (lang)             | Minerador de Tunel                                              |
| Pack                    | `villagers_addon/` independente; nao editar `villager_soldiers` |
| Soft-dependencia de uso | Villager Soldiers (precisa existir `fv:villager_free_handle`)   |

### Contratacao (Opcao A)

| Item         | Decisao                                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------------------------ |
| Item         | `va:mining_contract`                                                                                         |
| Receita      | shaped: `P`/`A` (wooden_pickaxe sobre paper) → 1 contrato (picareta consumida)                               |
| Alvo do hire | **somente** `fv:villager_free_handle` (adulto; nao baby)                                                     |
| Nao usar     | `minecraft:villager_v2` direto; nao injetar UI do `fv:paper_writable`                                        |
| No hire      | remove free_handle; spawna `va:villager_miner`; tag de **dono**; direcao = yaw do jogador → cardinal N/S/E/W |

### Trabalho / inventario (MVP)

| Item                                           | Decisao                                                                        |
| ---------------------------------------------- | ------------------------------------------------------------------------------ |
| Picareta de cava                               | entregue depois (slot 0 do inventario); sem picareta → nao cava                |
| Tunel                                          | 1x2, Y fixo no hire, ore adjacente raio 1 (sai, coleta, volta ao eixo)         |
| Ore                                            | vai para inventario da entidade (slots 1+)                                     |
| Fill (stone, deepslate, netherrack, cobble, …) | destroi **sem dropar** e **sem** inventariar                                   |
| Inventario cheio                               | volta ao **ponto de hire** e aguarda                                           |
| Retomada                                       | hibrida: espaco de **carga** (slots 1+) + picareta (qualquer slot, normalizada) + !`stay_mode` |
| Pausar                                         | interact do dono (mao vazia) alterna `va:stay_mode`                            |
| Demissao                                       | matar a entidade                                                               |
| Limites                                        | max 64 blocos do hire; 1 passo / 10 ticks; stop em lava/agua/bedrock/blacklist |

### Visual (MVP)

Base: client entity do clumper (texturas por bioma + `geometry.va_villager_miner` copiada de `geometry.villager_handle`).

### Fora do MVP (v2+)

| Item                                        | Decisao                                                                 |
| ------------------------------------------- | ----------------------------------------------------------------------- |
| Tunel 3x3                                   | secao 3x3 no eixo (substituir ou complementar strip 1x2)                |
| Deposito                                    | **fill + ores** → **bau de cobre** por **busca automatica**             |
| Banner "inicio de tunel"                    | ponto compartilhado; todos os mineradores partem / alinham a partir dele |
| Caminho randomico ("formigueiro")           | desvios laterais aleatorios no eixo; rede de galerias                   |
| Escada ocasional                            | ~10% de chance de subir ou descer **2 blocos** em escada enquanto mina  |
| Direcao / ordens                            | flags, comandos ou item de comando                                      |
| Branch mining, tochas, rails                | depois                                                                  |
| Carta de demissao                           | opcional; MVP usa kill                                                  |

---

## 2. Milestones

### Milestone 1 — MVP jogavel

Tickets MINER-001 … MINER-010 (+ fix MINER-011).

### Milestone 2 — Tunel avancado, depositos, banner e comando

Ordem de implementacao fixada pelo produto (abaixo).

---

## 3. Priorizacao e status

| Ordem | Ticket    | Status   | Notas |
| ----- | --------- | -------- | ----- |
| 1     | MINER-001 | Feito    | Manifests BP/RP + script entry |
| 2     | MINER-002 | Feito    | Item + receita shaped + icon/lang |
| 3     | MINER-003 | Feito    | Entity BP lean + `va:stay_mode` |
| 4     | MINER-004 | Feito    | Visual baseado no clumper |
| 5     | MINER-005 | Feito    | `scripts/hire.js` |
| 6     | MINER-006 | Feito    | Entrega picareta (slot 0) |
| 7     | MINER-007 | Feito    | `scripts/minerLoop.js` strip 1x2 |
| 8     | MINER-008 | Feito    | Retorno ao hire + waiting |
| 9     | MINER-009 | Feito    | Toggle stay por interact |
| 10    | MINER-010 | Pendente | Revalidar in-game apos MINER-011 |
| 11    | MINER-011 | Feito (codigo) | Retomada: cargo-only + `isEmptySlot` + `ensureToolInSlot0` (`1.0.1`) |

### Milestone 2 — ordem de implementacao

| Ordem | Ticket    | Escopo |
| ----- | --------- | ------ |
| 1     | MINER-012 | Tunel **3x3** |
| 2     | MINER-016 | Deposito em copper chest (busca auto): **fill + ores** |
| 3     | MINER-015 | Banner **`va:` inicio de tunel** — origem compartilhada dos mineradores |
| 4     | MINER-013 | Caminho **randomico** (formigueiro / galerias laterais) |
| 5     | MINER-014 | Escada ocasional: **10%** subir ou descer **2 blocos** enquanto mina |
| 6     | MINER-017 | Flags/comandos de direcao |
| 7     | MINER-018 | UI/item de comando |

---

## 4. Arquivos principais

| Area         | Path |
| ------------ | ---- |
| Manifests    | `behavior_pack/manifest.json`, `resource_pack/manifest.json` |
| Entity       | `behavior_pack/entities/villager_miner.json` |
| Item/receita | `behavior_pack/items/mining_contract.json`, `recipes/mining_contract.json` |
| Scripts      | `behavior_pack/scripts/{main,common,hire,minerInteract,minerLoop}.js` |
| Client       | `resource_pack/entity/villager_miner.entity.json` |
| Geo/texturas | `resource_pack/models/entity/va_villager_miner.geo.json`, `textures/entity/villager_miner/*` |

---

## 5. Checklist MINER-010 (in-game)

- [x] Soldiers + villagers_addon ativos no mundo
- [x] Craft `paper` + `wooden_pickaxe` → `va:mining_contract`
- [x] Freehand decree → `fv:villager_free_handle`
- [x] Contrato no free_handle → `va:villager_miner` com dono/direcao
- [x] Entregar picareta → inicia strip
- [x] Ore no inventario; fill nao aparece
- [x] Inventario cheio → volta ao hire e espera
- [ ] Esvaziar + picareta + !stay → retoma — **falhou em 1.0.0; corrigido em codigo 1.0.1 — retestar**
- [x] Interact vazio pausa/retoma stay
- [x] Stop em lava/bedrock; limite 64
- [x] Visual renderiza (texturas bioma / geo)

**Nao marcar MVP como validado sem evidencias acima.**

### MINER-011 — Fix retomada (1.0.1)

**Sintoma (1.0.0):** apos inventario cheio e retorno ao hire, esvaziar ores nao retomava o strip.

**Causa raiz:**
1. Slots vazios podem voltar como `minecraft:air` / amount 0 (nao so `undefined`), e o check de espaco falhava.
2. Abrir o inventario do miner pode deslocar a picareta do slot 0; `hasPickaxe` so olhava o slot 0.
3. Espaco parcial em stacks de ore nao contava como capacidade de carga.

**Correcao:**
- `isEmptySlot` + `cargoHasSpace` / `tryAddOre` ignoram slot 0 e tratam air/pickaxe/partial.
- `ensureToolInSlot0` + `findPickaxeSlot` normalizam a ferramenta antes de waiting/mining.
- Versao dos packs: `1.0.1`.

---

## 6. Riscos conhecidos (codigo atual)

- Soft-dependencia de `fv:villager_free_handle`.
- Abrir inventario do miner: sneak+interact pode depender do cliente; esvaziar manual ainda nao tem UI dedicada.
- `mark_variant` copiado do free_handle pode falhar conforme API; fallback plains.
- Retorno ao hire usa `teleport` (nao pathfinding no eixo).
- Performance: um tick a cada 10 para todos os miners em overworld/nether/end.
- Retomada apos esvaziar ores: corrigida em codigo (`1.0.1`); **ainda precisa de reteste in-game**.
- Comportamento in-game parcialmente validado (checklist §5).

---

## 7. Proximo passo

1. Retestar in-game o item “Esvaziar + picareta + !stay → retoma” (MINER-010) com packs `1.0.1`.
2. Se ok, marcar MVP validado.
3. Implementar Milestone 2 na ordem: **012 → 016 (fill+ores) → 015 → 013 → 014 → 017 → 018**.
