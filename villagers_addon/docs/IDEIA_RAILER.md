# Villagers Addon — Ideia: Railer (Assentador de Trilhos)

Documento de produto/tecnico para um **segundo villager trabalhador** que pavimenta tuneis ja abertos com trilhos. Complementa o Minerador de Tunel; nao substitui nem mistura o papel de cava.

**Pasta:** `villagers_addon/`  
**Referencia de padroes:** `villager_soldiers/` (hire/stay/banner UX) + minerador `va:villager_miner` (origem, banner, deposito).  
**Namespace:** `va:`  
**Entity:** `va:villager_railer`  
**Nome (lang):** Assentador de Trilhos / Rail Layer  
**Ticket:** `RAILER-001` em `docs/backlog.md`  
**Status:** spec de maturacao **fechada via grilling** (2026-08-03) — **nao implementar** ate priorizacao apos M2 in-game + MINER-019.  
**Regras de task:** `../docs/references/coding-guidelines.md` e `../AGENTS.md`.

> Contrato operacional resumido tambem em **`docs/backlog.md`** (RAILER-001). Trilhos **nao** entram no minerador.

---

## 1. Objetivo

Criar um villager **railer** contratavel que:

1. percorre tuneis **ja abertos** (pelo minerador ou pelo jogador);
2. coloca trilhos no piso ao longo de uma **linha tronco** no eixo;
3. consome `rail` e `powered_rail` fornecidos pelo jogador (e/ou copper chest);
4. coexiste com `va:villager_miner` e Villager Soldiers sem colidir IDs nem fundir funcoes.

Nao e um segundo minerador. Nao cava strip 3x3. Nao conecta automaticamente a rede de formigueiro no primeiro corte.

---

## 2. Por que um segundo villager

Trilhos sao **logistica/transporte**. No miner misturariam estoque (ore/tocha/rail), cadencia e topologia (formigueiro/escada). Separar deixa o miner em cava/coleta/deposito/luz e o railer em pavimentacao.

| | Tunnel Miner | Railer |
|--|--------------|--------|
| ID | `va:villager_miner` | `va:villager_railer` |
| Papel | Cava, coleta ore | Assenta trilhos |
| Insumo | Picareta + tochas | `rail` + `powered_rail` |
| Origem | Hire + banner inicio | **Mesmo** banner/hire |
| Ticket | MINER-* | **RAILER-001** |

---

## 3. Decisoes fechadas (grilling)

### 3.1 Contratacao

| Item | Decisao |
|------|---------|
| Alvo | Somente `fv:villager_free_handle` (adulto; soft-dep Soldiers, igual miner) |
| Item | `va:railer_contract` |
| Receita | shaped: `rail` sobre `paper` → 1 contrato |
| No hire | Remove free_handle; spawna `va:villager_railer`; owner tag; direcao = yaw → cardinal |
| Nao usar | `va:mining_contract`; promocao miner→railer; villager_v2 direto |

### 3.2 Origem e eixo

| Item | Decisao |
|------|---------|
| Direcao | Yaw do jogador no hire (N/S/E/W) |
| Origem | `va:tunnel_start_banner` do **mesmo dono**, se existir; senao ponto de hire |
| Banner proprio | Nao (fase 1) |
| Descoberta de tunel | Nao; so avanca no eixo a partir da origem |

### 3.3 Pavimentacao (fase 1)

| Item | Decisao |
|------|---------|
| Posicao | Piso **central** do corredor (1 rail por passo no eixo) |
| Cadencia | 1 colocacao (ou skip) por passo avancado |
| Rail normal | `minecraft:rail` quando o passo nao e multiplo de powered |
| Powered | A cada **8** blocos de progresso no eixo: preferir `minecraft:powered_rail` |
| Redstone no chao | **Nao** na fase 1 (powered sem dust) |
| Sem `powered_rail` na hora do ciclo | **Para**; volta a origem / waiting ate reabastecer powered — **nao** continua so com rail comum |
| Celula ja com rail/powered | **Pula** sem consumir; **conta** no ciclo de 8; **nunca** substitui trilho existente por powered |
| Frente solida / sem piso elegivel | Volta a origem; retoma so com interact do dono ou sair de `stay_mode` |
| Y / escada | Pode mudar Y±1 se houver **geometria real** (piso solido + celula de rail = ar); senao = frente solida (volta origem) |
| Formigueiro (branches laterais) | **Fora** da fase 1 |
| Limite | `MAX_DISTANCE` **64** horizontal desde a origem |
| Ao atingir 64 | Volta a origem; waiting |

### 3.4 Inventario e interact

| Item | Decisao |
|------|---------|
| Tool slot | Nenhum (sem picareta) |
| Estoque | `rail` e `powered_rail` em qualquer slot |
| Interact (dono) | Prioridade: **rail/powered stack inteira** → inventario; **mao vazia** → toggle stay |
| Sem espaco | Transfere o que couber; resto na mao |
| Deposito de “ore” | N/A — railer nao mina; rails nao sao cargo de minerio |
| Reabastecimento (copper chest na origem) | Se `rail` &lt; **16**, sacar ate **32**; se `powered_rail` &lt; **4**, sacar ate **8** (ou o que o chest tiver) |
| Retomada apos falta de material | Apos reabastecer (chest ou entrega) + !stay; se parou por frente solida, exige interact / !stay |

### 3.5 Controles e demissao

- Owner tag (mesmo padrao `va_owner_*`).
- `va:stay_mode` (client_sync), analogo ao miner.
- Demissao fase 1: **kill**; carta depois se o miner ganhar.

### 3.6 Fora da fase 1 / Milestone 2 do Railer

**Fase 1 nao inclui** (permanece backlog ate RAILER M2):

- Rede de formigueiro / “conectar todos”.
- Detector rail, hopper minecart, unload automatico, estacao.
- Spawn de minecart por interact (jogador coloca manual).
- Banner exclusivo do railer.

#### RAILER-M2 — Alavancas em powered rails (reserva)

| Item | Decisao |
|------|---------|
| Quando | Ao colocar (ou ao processar) cada `powered_rail` na linha |
| O que | Colocar **alavanca** (`minecraft:lever`) ao **lado** do powered rail (parede/piso adjacente elegivel) e **ativar** (estado ligado) |
| Custo | Alavancas sao **sumonadas** pelo railer — **nao** consomem inventario do jogador nem do chest |
| Insumo do jogador | Continua so `rail` / `powered_rail`; lever nao e entregue nem restock |
| Posicao | Preferir face lateral solida adjacente ao trilho; se nao houver suporte, tentar outra face; se impossivel, powered fica sem lever (log/risco) |
| Objetivo | Alimentar o powered rail sem redstone dust no chao (substitui a nota de “powered cosmetico” da fase 1) |

Detalhe de facing/estado da alavanca e ordem de colocacao: grilling fino na implementacao do RAILER-M2.

---

## 4. Gameplay previsto

1. Miner (ou jogador) abre tunel 3x3; opcional banner inicio.
2. Craft `va:railer_contract` (rail + paper); hire em free_handle.
3. Entrega stacks de `rail` e `powered_rail` (e/ou deixa no copper chest).
4. Railer pavimenta eixo desde a origem; a cada 8 blocos exige powered.
5. Se o miner ainda nao abriu a frente: railer volta a origem e espera ordem.
6. Jogador usa minecart na linha quando quiser (manual).

---

## 5. Requisitos tecnicos (quando implementar)

### Behavior Pack

- Entity `va:villager_railer`: inventario, movement, `stay_mode`, owner.
- Item + recipe `va:railer_contract`.
- Scripts (modulos dedicados, import em `main.js`): hire railer, loop de pavimentacao, restock chest, reuso de `resolveTunnelOrigin` / owner helpers.
- Throttle alinhado ao miner (ex. `TICK_INTERVAL` 10) ou grilling de perf.

### Resource Pack

- Client entity distinto do miner (mesmo geo base ok; visual/lang claros).
- Icon do contrato; `en_US` + `pt_BR`.

### Seguranca

- Nao quebrar chests, banners, spawners, bedrock, tochas do miner.
- So coloca rail em celula elegivel (ar + piso solido); nunca overwrite de trilho existente.
- Limite 64; stop lava/agua.

### Elegibilidade (resumo)

| Condicao | Acao |
|----------|------|
| Piso solido + celula ar; passo normal | Coloca `rail`, consome 1 |
| Piso solido + celula ar; passo powered (mod 8) + tem powered | Coloca `powered_rail`, consome 1 |
| Passo powered sem powered no inventario | Return origin / wait restock |
| Celula ja e rail/powered | Skip; incrementa ciclo; nao replace |
| Frente solida ou Y±1 invalido | Return origin; wait interact/!stay |
| Distancia &gt; 64 | Return origin; waiting |

---

## 6. Coexistencia

1. IDs so `va:*` novos.
2. Nao editar `villager_soldiers/**`.
3. Miner **nunca** coloca trilhos.
4. Railer **nunca** cava fill/ore.
5. Tochas do miner nas paredes nao sao removidas.
6. Mesmo banner de inicio serve miner e railer do dono.

---

## 7. Aceite in-game (quando implementar)

- [ ] Contrato craft + hire free_handle → `va:villager_railer` com dono/direcao
- [ ] Banner do dono como origem; senão hire
- [ ] Entrega rail/powered; stay mao vazia
- [ ] Linha tronco com rail; powered a cada 8; para se faltar powered
- [ ] Nao substitui trilho existente; conta no ciclo 8
- [ ] Frente fechada → origem; retoma com interact/!stay
- [ ] Y±1 so com geometria valida
- [ ] Chest restock nos limiares; limite 64
- [ ] Declarar gaps ate teste Bedrock

---

## 8. Riscos

- Expectativa “conectar tudo” vs eixo tronco — documentar no README quando shippar.
- Powered obrigatorio a cada 8 aumenta microgestao de estoque (aceitavel por decisao de produto).
- Escada Y±1 pode divergir do degrau real do miner se a secao 3x3 nao deixar piso claro.
- Varios railers no mesmo eixo — sem regra de exclusao ainda (assumir 1 por dono/origem no MVP).
- Fase 1: powered **sem** alavanca pode nao acelerar cart de verdade — resolvido em **RAILER-M2** (lever sumonada + ativada).
- RAILER-M2: facing da alavanca / bloco de suporte no 3x3 pode falhar em corredores abertos; precisa fallback.

---

## 9. Proximos passos

1. Manter RAILER-001 em espera ate M2 validado + MINER-019.
2. Quando priorizar: implementar conforme esta spec (sem reabrir grilling salvo conflito in-game).
3. Fase 2 / **RAILER-M2**: alavanca sumonada + ativada ao lado de cada powered rail; depois formigueiro, minecart na origem, multi-railer (grilling).

---

## 10. Referencias

- `docs/backlog.md` — RAILER-001
- `docs/IDEIA_MINERADOR.md` — minerador
- MINER-015 banner; MINER-016 chest; MINER-019 tochas (nao misturar)
- `villager_soldiers/AGENTS.md`
- `behavior_pack/scripts/{hire,tunnelBanner,deposit,minerLoop}.js`

---

*Spec amadurecida via grilling 2026-08-03. Comportamento ainda nao implementado.*
