# Villagers Addon — Ideia: Minerador Strip

Documento de produto/tecnico para um addon (ou modulo) de villagers trabalhadores, comecando por um **minerador de strip mine + coleta de ore**.

**Pasta:** `villagers_addon/`  
**Referencia de padroes:** `villager_soldiers/` (Villager Soldiers 3.1.4) — ver `AGENTS.md` la.  
**Namespace sugerido:** `va:` (pack independente) — evitar colidir com `addon:` (`gollem_addon`) e `fv:` (Villager Soldiers). Confirmar antes do primeiro manifest.  
**Status:** ideia / nao implementado.  
**Regras de task:** `../docs/references/coding-guidelines.md` (raiz do monorepo) e `../AGENTS.md`.

---

## 1. Objetivo

Criar um villager minerador contratavel que:

1. cava um corredor de strip mine em linha reta;
2. prioriza e guarda minérios no inventario;
3. descarta ou ignora pedra/deepslate para nao lotar slots;
4. coexiste com o Villager Soldiers (clumper / rock tortoise) sem colidir IDs.

Nao substituir o `fv:villager_clumper`. Sao produtos diferentes.

---

## 2. Contexto da referencia (Villager Soldiers)

O pack de referencia tem workers contrataveis via `fv:freehand_decree` -> `fv:villager_free_handle`, depois ferramenta:

| Ferramenta na mao | Resultado |
|-------------------|-----------|
| Picareta (`minecraft:is_pickaxe`) | `fv:villager_clumper` |
| Espada/machado/spear/etc. | soldado melee |
| Arco/crossbow | ranged |
| Hammer/wrench | `fv:villager_builder` |

O **clumper** nao cava blocos do mundo. Ele:

- caça entidades `fv:ore_clump` (geradas pelo `fv:rock_tortois`);
- guarda minérios crus;
- vai a um blast furnace e dispara `fv:refine_inventory` (script troca raw -> lingotes).

O rock tortoise **nao e craftavel por ritual**; vem de trade do builder (cobble + `fv:heart_of_stone`) ou spawn egg.

Usar Soldiers como **inspiracao de UX** (hire por item, stay mode, discharge), nao como implementacao de mineracao real.

---

## 3. Proposta: Strip Miner

### 3.1 Conceito

Minerador NPC que faz strip mining classico em Y fixo:

- avanca sempre na mesma direcao;
- mantem tunel 1x2 (MVP) para o corpo passar;
- a cada passo, checa laterais/teto/chao (raio 1) por ore;
- se achar ore, coleta e volta ao eixo;
- stone-like quebra e nao guarda (drop no chao ou sem loot);
- ores vao para o inventario da entidade.

### 3.2 Contraste com o clumper

| | Clumper (`fv:`) | Strip Miner (novo) |
|--|-----------------|-------------------|
| Fonte de minério | `ore_clump` + rock tortoise | Blocos do mundo |
| Cava pedra? | Nao | Sim (script) |
| Refino | Blast furnace + script | Opcional depois; MVP so coleta |
| Dependencia do outro pack | Alta (economia FV) | Nenhuma |
| Namespace | `fv:` | `addon:` / proprio |

### 3.3 Gameplay previsto (MVP)

1. Jogador contrata minerador (ver secao 4).
2. Define direcao (olhar do player no hire, ou item/flag).
3. Minerador cava strip ate: lava/agua, bedrock, inventário cheio, picareta quebrada, `stay_mode`, ou limite de distancia.
4. Jogador esvazia inventario / troca picareta / retoma.

### 3.4 Fora do MVP (fase 2+)

- Branch mining (corredores paralelos a cada 3 blocos).
- Torch placement / rail.
- Entrega automatica em bau / hopper.
- Multiplos tamanhos de tunel (2x2, 3x3).
- UI ModalForm (estilo `command_flag` do Soldiers).

---

## 4. Contratação (rascunho)

Preferir fluxo **proprio**, para nao patchar `fv:villager_free_handle` (colisao se os dois packs estiverem ativos).

### Opcao A (recomendada) — item dedicado

- Item `addon:mining_contract` (ou similar).
- Interact em `minecraft:villager_v2` -> remove villager, spawna `addon:villager_miner`.
- Picareta pode ser entregue depois (sneak + give), ou consumida no hire.

### Opcao B — espelhar free handle proprio

- Decreto proprio -> `addon:villager_worker` -> picareta -> miner.
- Mais alinhado ao Soldiers, mais arquivos.

### Controles compartilhados (inspirados no FV)

- Tame / owner tag (opcional no MVP).
- `stay_mode` pausa a cava.
- Item de demissao -> volta a villager (opcional).

---

## 5. Requisitos tecnicos

### Behavior Pack

- Entity `addon:villager_miner` com inventario, health, movement, properties `stay_mode` (client_sync).
- Script module (`@minecraft/server`) obrigatorio: loop que:
  - le bloco a frente / adjacentes;
  - `setBlock` / break com regras de loot;
  - move a entidade;
  - respeita blacklist e throttle.
- Item(s) de contrato / controle.

### Resource Pack

- Client entity + textura (pode reusar visual villager/worker simples no inicio).
- Lang + icon.

### Regras de seguranca (obrigatorias no MVP)

- Blacklist: bedrock, barriers, spawners, chests, portals, command blocks, etc.
- Stop em lava/agua (ou desviar — MVP = stop).
- Limite de blocos por sessao / distancia maxima do ponto de hire.
- Throttle: 1 bloco a cada N ticks (evitar lag com varios miners).

### Classificacao de blocos (rascunho)

| Classe | Exemplos | Destino |
|--------|----------|---------|
| Ore | iron/copper/gold/coal/diamond/lapis/redstone/emerald ores (+ deepslate) | Inventario |
| Fill | stone, deepslate, netherrack, cobble | Nao guardar |
| Hard stop | bedrock, reinforced deepslate, etc. | Parar |
| Soft stop | water, lava | Parar |

---

## 6. Coexistencia com Villager Soldiers

**Sim, devem coexistir.**

Regras:

1. Nao reutilizar identifiers `fv:*`.
2. Nao editar entities/scripts do pack em `villager_soldiers` para “ligar” o hire — so referenciar.
3. Nao escutar o mesmo interact ambiguo (picareta no mesmo villager) sem item dedicado; evita disputa de evento.
4. UUIDs de manifest proprios.
5. Soldiers opcional: mundo pode ter so o strip miner, so o FV, ou os dois.

Integracao profunda (free handle FV virar strip miner) so faz sentido se houver **fork/merge** do pack, nao como dependencia frouxa.

---

## 7. Escopo minimo de implementacao

Checklist de aceite (MVP):

- [ ] Entity + client entity + lang
- [ ] Contratação via item dedicado em villager vanilla
- [ ] Loop script: tunel 1x2 reto, direcao fixa
- [ ] Ore -> inventario; stone-like nao enche inventario
- [ ] `stay_mode` pausa
- [ ] Stop em lava/agua/bedrock/inventario cheio
- [ ] Durabilidade da picareta (se equipada) ou custo equivalente
- [ ] Documentar que nao foi testado in-game ate validacao Bedrock
- [ ] Convive com Villager Soldiers sem conflito de ID

---

## 8. Riscos

- Performance de `getBlock`/`setBlock` em massa.
- Griefing em multiplayer (limites e permissao de dono).
- Pathfinding fraco em tunel: preferir avanco no eixo, nao IA de caverna.
- Script API e `min_engine_version` precisam subir se o pack base ainda for 1.20.x sem scripts.
- Expectativa do jogador: “minerador” pode ser confundido com clumper se os nomes forem parecidos — nomear claramente (ex. Strip Miner / Tunnel Miner).

---

## 9. Proximos passos sugeridos

1. Fechar namespace e nome da entity (`addon:villager_miner`?).
2. Confirmar se este pack vive dentro de `golems_addon` ou como `villagers_addon` independente.
3. Spec curto do script (pseudoalgoritmo do passo de cava).
4. Implementar MVP e validar in-game.

---

## 10. Referencias

- `villager_soldiers/AGENTS.md` — mapa do pack de referencia
- `villager_soldiers/behavior_pack/entities/worker/villager_free_handle.json` — hire por ferramenta
- `villager_soldiers/behavior_pack/entities/worker/villager_clumper.json` — worker de “mineraçao” falsa
- `villager_soldiers/behavior_pack/scripts/function/makingProduction.js` — refine inventory

---

*Ideia registrada a partir das discussoes sobre strip mine + coexistencia com Villager Soldiers. Comportamento ainda nao implementado.*
