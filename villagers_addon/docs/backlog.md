# Backlog — villagers_addon (Minerador de Tunel)

Atualizado em: 2026-08-03

Decisoes fechadas via grilling. Ideia miner: `docs/IDEIA_MINERADOR.md`. Ideia railer: `docs/IDEIA_RAILER.md`.
Regras de escopo: `../../docs/references/coding-guidelines.md` e `../AGENTS.md`.

**Status:** MVP em codigo (MINER-001..009). MINER-011 corrigido em `1.0.1`. Milestone 2 (MINER-012..016) em codigo em `1.0.2`. MINER-019 (tochas) em codigo em `1.0.3`. MINER-010 pendente revalidacao in-game.
**Packs:** `behavior_pack/` + `resource_pack/` (namespace `va:`, versao `1.0.3`, engine `1.21.130` + Script API `2.4.0`).

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




### Trabalho / inventario (MVP + Milestone 2)


| Item                                           | Decisao                                                                                        |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| Picareta de cava                               | entregue depois (slot 0 do inventario); sem picareta → nao cava                                |
| Tunel                                          | **3x3** no eixo (largura +/-1 perp., altura foot..+2); ore adjacente raio 1                    |
| Ore                                            | vai para inventario da entidade (slots 1+)                                                     |
| Fill (stone, deepslate, netherrack, cobble, …) | destroi **sem dropar** e **sem** inventariar                                                   |
| Inventario cheio                               | busca **copper chest** (raio 24); deposita cargo; senao volta ao origem e aguarda              |
| Origem compartilhada                           | banner `va:tunnel_start_banner` sobrescreve ponto de hire para distancia/retorno               |
| Formigueiro                                    | ~12% desvio lateral curto (2–4 blocos) enquanto mina                                           |
| Escada                                         | ~10% chance de subir/descer 2 blocos (1/Y por passo)                                           |
| Retomada                                       | hibrida: espaco de **carga** (slots 1+) + picareta (qualquer slot, normalizada) + !`stay_mode` |
| Pausar                                         | interact do dono (mao vazia) alterna `va:stay_mode`                                            |
| Demissao                                       | matar a entidade                                                                               |
| Limites                                        | max 64 blocos da origem; 1 passo / 10 ticks; stop em lava/agua/bedrock/blacklist               |




### Visual (MVP)

Base: client entity do clumper (texturas por bioma + `geometry.va_villager_miner` copiada de `geometry.villager_handle`).

### Fora do MVP (v2+)


| Item                              | Decisao                                                                         |
| --------------------------------- | ------------------------------------------------------------------------------- |
| Tunel 3x3                         | **Feito codigo 1.0.2** (MINER-012)                                              |
| Deposito                          | **Feito codigo 1.0.2** — cargo → copper chest busca auto (MINER-016)            |
| Banner "inicio de tunel"          | **Feito codigo 1.0.2** (MINER-015)                                              |
| Caminho randomico ("formigueiro") | **Feito codigo 1.0.2** (MINER-013)                                              |
| Escada ocasional                  | **Feito codigo 1.0.2** (MINER-014)                                              |
| Direcao / ordens                  | **Feito codigo 1.0.4** (MINER-017) — placeholder icon; arte final em 018 |
| Iluminacao (tochas)               | **Feito codigo 1.0.3** (MINER-019); in-game pendente                         |
| UI/item de comando (polish)       | **MINER-018** — icone proprio da flag (substitui placeholder 017) + extras |
| Branch mining dedicado            | depois                                                                          |
| **Railer** (segundo villager)     | **RAILER-001** — spec fechada (`IDEIA_RAILER.md`); nao no minerador             |
| Carta de demissao                 | opcional; MVP usa kill                                                          |


---



## 2. Milestones



### Milestone 1 — MVP jogavel

Tickets MINER-001 … MINER-010 (+ fix MINER-011).

### Milestone 2 — Tunel avancado, depositos, banner e comando

Ordem de implementacao fixada pelo produto (abaixo).

### Milestone 3 — Railer (reserva)

**RAILER-001** — `va:villager_railer`; spec fechada via grilling (ver §7 + `IDEIA_RAILER.md`).

---



## 3. Priorizacao e status


| Ordem | Ticket    | Status         | Notas                                                                |
| ----- | --------- | -------------- | -------------------------------------------------------------------- |
| 1     | MINER-001 | Feito          | Manifests BP/RP + script entry                                       |
| 2     | MINER-002 | Feito          | Item + receita shaped + icon/lang                                    |
| 3     | MINER-003 | Feito          | Entity BP lean + `va:stay_mode`                                      |
| 4     | MINER-004 | Feito          | Visual baseado no clumper                                            |
| 5     | MINER-005 | Feito          | `scripts/hire.js`                                                    |
| 6     | MINER-006 | Feito          | Entrega picareta (slot 0)                                            |
| 7     | MINER-007 | Feito          | `scripts/minerLoop.js` strip 1x2 (substituido por 3x3 em 012)        |
| 8     | MINER-008 | Feito          | Retorno ao hire + waiting                                            |
| 9     | MINER-009 | Feito          | Toggle stay por interact                                             |
| 10    | MINER-010 | Pendente       | Revalidar in-game apos MINER-011                                     |
| 11    | MINER-011 | Feito (codigo) | Retomada: cargo-only + `isEmptySlot` + `ensureToolInSlot0` (`1.0.1`) |




### Milestone 2 — ordem de implementacao


| Ordem | Ticket    | Status                  | Escopo                                                                     |
| ----- | --------- | ----------------------- | -------------------------------------------------------------------------- |
| 1     | MINER-012 | Feito codigo            | Tunel **3x3** — in-game pendente                                           |
| 2     | MINER-016 | Feito codigo            | Deposito copper chest (busca auto): cargo inventariavel — in-game pendente |
| 3     | MINER-015 | Feito codigo            | Banner `va:tunnel_start_banner` origem compartilhada — in-game pendente    |
| 4     | MINER-013 | Feito codigo            | Caminho randomico (formigueiro) — in-game pendente                         |
| 5     | MINER-014 | Feito codigo            | Escada ocasional 10% Y+/-2 — in-game pendente                              |
| 6     | MINER-019 | Feito codigo            | **Tochas** — in-game pendente                                                  |
| 7     | MINER-017 | Feito codigo            | `va:command_flag` + ModalForm direcao/stay — placeholder icon; in-game pendente |
| 8     | MINER-018 | Pendente                | **Icone proprio** `va:command_flag` (substitui placeholder) + polish de comando |


---



### MINER-017 — Command flag / direcao (spec fechada via grilling 2026-08-03)

**Objetivo:** mudar direcao do miner sem recontratar; quality bar = Soldiers `command_flag` + ModalForm.

| Item | Decisao |
|------|---------|
| Item | `va:command_flag` |
| Receita | shaped: stick sobre paper |
| Uso | Dono segura flag + interact no miner → ModalForm |
| Form | Dropdown N/S/E/W (default = dir atual) + toggle stay |
| Origem | Nao muda (banner/hire); so `va_dir_*` |
| Ao confirmar dir | Axis = pos atual do miner; cancela branch/stair; sem TP origem; `va_torch_dist` mantem |
| Se estava stopped | Pode ir a mining se picareta + cargo space + !stay |
| Mao vazia | Continua toggle stay (atalho) |
| Quem | So dono |
| Icone | Placeholder ok em 017; **arte final em MINER-018** |
| Dep | `@minecraft/server-ui` 2.0.0 (ModalForm `{ defaultValue }`) |
| Fora | Recall em massa, depositar agora — MINER-018 |

### MINER-018 — UI/comando polish (pendente)

| Item | Escopo |
|------|--------|
| Icone | Criar textura/icone **proprio** `va:command_flag` (nao copiar `fv:`; substituir placeholder do 017) |
| Extras (grilling depois) | Recall/depositar agora / outros comandos se produto pedir |

---

### MINER-019 — Tochas no tunel (spec fechada via grilling 2026-08-03)

**Objetivo:** iluminar o tunel conforme cava, reduzindo spawn de mobs.


| Item                    | Decisao                                                                                                                                                      |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Prioridade              | Apos **validacao in-game do M2 (012–016)**; **antes** de MINER-017/018                                                                                       |
| Item                    | `minecraft:torch` apenas (soul_torch fora; depois se pedir)                                                                                                  |
| Inventario              | Slots **1+** misturados com cargo; tocha e **estoque de consumo** (nao cargo)                                                                                |
| Cargo cheio / deposito  | `cargoHasSpace` e `depositCargo` **ignoram** `minecraft:torch`; ores ainda vao ao chest                                                                      |
| Entrega                 | Interact dono: prioridade **picareta → tocha → mao vazia (stay)**; tocha entrega **stack inteira**                                                           |
| Sem espaco na entrega   | Transfere o que couber; resto fica na mao do jogador                                                                                                         |
| Reabastecimento         | No fluxo de deposito (016): se contagem de tochas **< 8**, sacar ate completar **16** (ou o que o chest tiver)                                               |
| Cadencia                | +1 por **passo de cava bem-sucedido** (eixo + formigueiro + escada); colocar quando contador **>= 10**; DP `va_torch_dist`                                   |
| Posicao                 | Y = foot+1 (olho); preferir **wall_torch** em face externa solida (w=±2); fallback **torch** no chao lateral se piso solido; **alternar** L/R a cada sucesso |
| Falha de suporte        | Nao consome tocha; **nao zera** contador; tenta de novo no proximo passo                                                                                     |
| Sem tocha no inventario | Continua minerando sem iluminar (nao bloqueia strip)                                                                                                         |
| Fora                    | soul_torch; trilhos no miner (ver **RAILER-001**); branch mining dedicado                                                                                    |


**Aceite in-game:**

- [ ] Dono entrega stack de tochas → ficam no inventario do miner; ores ainda depositam; picareta intacta
- [ ] Cava 10+ passos → tocha na parede (ou chao fallback); lados alternam
- [ ] Sem suporte → nao gasta tocha; tenta depois
- [ ] Cargo cheio + chest com tochas → deposita ores, saca tochas se <8 ate 16, retoma
- [ ] Sem tochas → strip segue normalmente

---



## 4. Arquivos principais


| Area         | Path                                                                                                   |
| ------------ | ------------------------------------------------------------------------------------------------------ |
| Manifests    | `behavior_pack/manifest.json`, `resource_pack/manifest.json`                                           |
| Entity       | `behavior_pack/entities/villager_miner.json`, `tunnel_start_banner_marker.json`                        |
| Item/receita | `behavior_pack/items/mining_contract.json`, `tunnel_start_banner.json`, `command_flag.json`, `recipes/*` |
| Scripts      | `behavior_pack/scripts/{main,common,hire,minerInteract,commandFlag,minerLoop,deposit,tunnelBanner,torch}.js` |
| Client       | `resource_pack/entity/villager_miner.entity.json`, `tunnel_start_banner_marker.entity.json`            |
| Geo/texturas | `resource_pack/models/entity/va_villager_miner.geo.json`, `va_tp_banner.geo.json`, `textures/entity/*` |


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



### Milestone 2 — notas de implementacao (1.0.2)

- **MINER-012:** `mineStep3x3` + `tunnelCells3x3` (perp +/-1, Y 0..2).
- **MINER-016:** `deposit.js` — busca copper chest (todas variantes waxed/exposed), deposita slots 1+, retoma se `cargoHasSpace`.
- **MINER-015:** item `va:tunnel_start_banner` + marker `va:tunnel_start_banner_marker`; origem via `resolveTunnelOrigin`.
- **MINER-013:** branch lateral DP (`va_branch_`*), chance 12%, comprimento 2–4.
- **MINER-014:** stair DP (`va_stair_`*), chance 10%, 2 passos de +/-1 Y.

**Nenhum ticket 012–016 validado in-game nesta sessao.**

### MINER-019 — Tochas (1.0.3, codigo)

- Estoque `minecraft:torch` em slots 1+; `cargoHasSpace` / `depositCargo` / `hasCargo` ignoram tocha.
- Interact dono: picareta → stack de tocha (parcial se sem espaco) → command_flag → stay.
- Cadencia DP `va_torch_dist` (+1 / passo ok); coloca a cada 10; DP `va_torch_side` alterna L/R.
- Preferencia `wall_torch` em face w=±2; fallback torch no piso lateral; falha nao consome nem zera contador.
- No deposito: se tochas < 8, saca do copper chest ate 16 (`depositAndRestock`).
- Modulo `scripts/torch.js`; packs `1.0.3`.

**MINER-019 nao testado in-game nesta sessao.**

### MINER-017 — Command flag (1.0.4, codigo)

- Item `va:command_flag` + receita stick sobre paper.
- Dono com flag + interact → ModalForm (dropdown N/E/S/W + stay); padrao Soldiers (`system.run` + `{ defaultValue }` / `{ defaultValueIndex }`).
- Confirma: atualiza `va_dir_*`; eixo = `blockPos` atual; limpa branch/stair DPs; **nao** muda origem; **mantem** `va_torch_dist`.
- Se `stopped` + !stay + picareta + cargo space → `mining`.
- Interact: picareta → tocha → flag → stay (mao vazia).
- Placeholder PNG `textures/items/command_flag.png` — **MINER-018** substitui pela arte final.
- Dep `@minecraft/server-ui` `2.0.0`; packs `1.0.4`.

**MINER-017 nao testado in-game nesta sessao.** QA estatico (clean-context): `docs/miner-017-qa.md` — **PASS_COM_RESSALVAS**.

---



## 6. Riscos conhecidos (codigo atual)

- Soft-dependencia de `fv:villager_free_handle`.
- Abrir inventario do miner: sneak+interact pode depender do cliente; esvaziar manual ainda nao tem UI dedicada.
- `mark_variant` copiado do free_handle pode falhar conforme API; fallback plains.
- Retorno a origem usa `teleport` (nao pathfinding no eixo).
- Performance: um tick a cada 10 para todos os miners; scan de chest O(r^2) so no deposito.
- Binding do banner: dono = jogador mais proximo no spawn (raio 8); sem jogador fica ownerless e serve de fallback.
- Copper chest inventory API / variantes podem divergir entre builds Bedrock.
- Retomada apos esvaziar ores: corrigida em codigo (`1.0.1`); **ainda precisa de reteste in-game**.
- Milestone 2 (3x3, deposito, banner, formigueiro, escada): **nao testado in-game**.
- MINER-019 (tochas / wall_torch facing / restock): **nao testado in-game**.
- MINER-017 (command flag / ModalForm / retarget eixo): **nao testado in-game**; icone e placeholder ate 018.

---



## 7. Proximo passo

1. Retestar in-game MINER-010 (retomada) com packs `1.0.4`.
2. Validar in-game MINER-012..016, **MINER-019** e **MINER-017** (checklists).
3. **MINER-018** — icone proprio da flag (substituir placeholder) + polish de comando.
4. Mais tarde: branch mining dedicado; **RAILER-001**.



### Milestone 3 (reserva) — Railer

Ticket **RAILER-001** | Status: **Spec fechada (grilling)** — backlog; nao implementar agora.

**Ideia completa:** `docs/IDEIA_RAILER.md`

**Premissa:** trilhos **nao** no miner. Entity `va:villager_railer` (Assentador de Trilhos).

| Item | Decisao fechada |
|------|-----------------|
| Hire | `fv:villager_free_handle` + `va:railer_contract` (rail sobre paper) |
| Origem | Banner dono / hire; direcao = yaw; sem banner proprio |
| Linha | Eixo tronco; 1/passo; powered a cada **8**; sem redstone no chao |
| Sem powered na hora | Para → origem / wait restock (nao segue so com rail) |
| Trilho existente | Skip; conta no ciclo 8; **nunca** replace por powered |
| Frente solida | Origem; retoma interact / !stay |
| Y | ±1 so com geometria valida; senao = frente solida |
| Estoque | rail &lt;16→32; powered &lt;4→8 via copper chest |
| Limite | 64 horizontal |
| Fora fase 1 | Formigueiro/rede; minecart spawn; detector/unload |

**RAILER-M2** (fase 2 do railer — apos RAILER-001 fase 1):

| Item | Decisao |
|------|---------|
| Escopo | Em cada `powered_rail`, **sumonar** `minecraft:lever` ao lado e **ativar** |
| Custo | Alavanca **nao** vem do jogador/chest — spawn por script (`setBlock`) |
| Insumo jogador | Continua so rail / powered_rail |
| Motivo | Powered rail precisa de sinal; evita redstone dust no chao |

Ver detalhe em `IDEIA_RAILER.md` §3.6.

**Quando priorizar:** apos M2 miner in-game + MINER-019; implementar RAILER-001 fase 1 pela spec; RAILER-M2 depois.

### Checklist Milestone 2 (in-game)

- [ ] Tunel 3x3 coerente no eixo
- [ ] Ore adjacente coletado; fill destruido sem inventariar
- [ ] Cargo cheio → copper chest proximo; retoma apos depositar
- [ ] Sem chest → volta a origem (banner ou hire) e espera
- [ ] Banner placeable; miners do dono usam como origem (MAX_DISTANCE / retorno)
- [ ] Desvios laterais ocasionais (formigueiro)
- [ ] Escadas ocasionais +/-2 Y
- [ ] Hard/soft stops e limite 64 preservados
- [ ] Command flag: dono abre form; muda N/E/S/W; eixo na posicao atual; stay; nao-dono erro
- [ ] Flag: branch/stair cancelados; torch_dist preservado; origem intacta
- [ ] Tochas: entrega, cadencia ~10, parede/chao, restock no deposito, strip sem tocha
