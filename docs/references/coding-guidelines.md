# Coding Guidelines — Bedrock Addons (monorepo)

Regras de alteracao para agentes. Leia o `AGENTS.md` da raiz e o `AGENTS.md` (ou docs) do addon alvo antes de editar.

ASCII preferido em Markdown deste repositorio.

---

## 1. Escopo por task

Antes de qualquer mudanca, declare mentalmente (e no plano, se houver):

1. Qual addon e o alvo?
2. A task e de produto, referencia, docs ou CI?
3. Quais pastas ficam fora do escopo?

| Tipo de task | Pode alterar | Nao alterar (salvo pedido explicito) |
|--------------|--------------|--------------------------------------|
| Feature / bugfix em `gollem_addon` | `gollem_addon/**`, docs do golem, packs em `test_world` se a task pedir sync | `villager_soldiers/**`, `villagers_addon/**` de produto |
| Estudo / extracao de padrao de `villager_soldiers` | Docs/notas no addon consumidor; leitura do pack | Manifests/UUIDs/IDs do pack de terceiros; rewrite em massa |
| Feature / ideacao em `villagers_addon` | `villagers_addon/**` | Copiar o pack inteiro de `villager_soldiers`; colidir com `fv:` ou `addon:` sem auditoria |
| Docs / agents | `AGENTS.md` raiz, `docs/**`, `*/AGENTS.md`, README do escopo | Codigo de packs sem necessidade |
| CI / release | `.github/workflows/**` com razao registrada | UUIDs de packs; versao sem mudanca funcional correspondente |
| Assets de referencia | `assets/**` (entrada de arte/debug) | Mover para packs sem confirmar caminho/formato/JSON |

Regra geral: uma task = um addon alvo. Mudanca cross-addon so com pedido explicito e checklist de colisao de IDs/UUIDs.

---

## 2. Politica por projeto

### 2.1 `gollem_addon/` (produto proprio)

Pode:

- Entidades, itens, blocos, receitas, loot, spawn rules, functions
- Client entity, models, animations, render controllers, textures, texts
- Incrementar versao BP/RP juntos apos mudanca funcional
- Atualizar `gollem_addon/docs/*` e sync com `test_world` quando a task for validacao

Nao pode sem pedido explicito:

- Alterar UUIDs dos manifests
- Subir `min_engine_version` sem registrar impacto
- Importar IDs `fv:` ou scripts do Villager Soldiers sem desenho de dependencia

Riscos conhecidos (alinhar contrato antes de afirmar "funciona"):

- Fluxo de criacao manual do Stone Golem: validar receita ↔ item ↔ bloco ↔ estrutura ↔ evento/summon
- Validacao JSON != validacao in-game; usar `test_world/` quando a task exigir evidencia

### 2.2 `villager_soldiers/` (terceiros / referencia)

Pode:

- Ler e citar padroes em docs do monorepo ou de `villagers_addon`
- Correcoes pontuais se o usuario pedir (typo path, nota local)
- Atualizar o proprio `AGENTS.md` se a documentacao de referencia estiver desatualizada

Nao pode por padrao:

- Refatorar o pack como se fosse produto proprio
- Alterar UUIDs / versoes / namespaces `fv:` para "alinhar" ao monorepo
- Apagar ou reorganizar em massa pastas do pack
- Empacotar/release deste pack sem pedido explicito (licenca/uso comercial nao documentados)

Ao portar ideias: extrair o minimo necessario para `villagers_addon` ou `gollem_addon`, com IDs proprios.

### 2.3 `villagers_addon/` (complemento em construcao)

Pode:

- Docs de produto/tecnico (`docs/**`)
- Scaffold de BP/RP quando a task for implementar
- Scripts e entidades novas desde que nao colidam com `fv:` nem quebrem o fluxo do Villager Soldiers

Nao pode por padrao:

- Substituir ou patchar entidades `fv:*` dentro de `villager_soldiers/`
- Reusar UUIDs de outro addon do monorepo
- Assumir que coexistencia com Villager Soldiers foi testada sem evidencia

Namespace: definir e registrar antes do primeiro manifest (candidatos: `va:` independente, ou outro alinhado ao produto — nao misturar com `addon:` do golem sem decisao).

### 2.4 `assets/`, `test_world/`, CI

| Area | Pode | Nao pode |
|------|------|----------|
| `assets/` | Guardar referencias, debug, geo/textura fonte | Assumir que Bedrock carrega essa pasta |
| `test_world/` | Copiar packs do addon sob teste; ajustar world_*_packs.json | Commits grandes de mundo sem pedido; misturar packs de addons nao envolvidos na task |
| `.github/workflows/` | Ajustar validacao/empacote com impacto documentado | Mudar sem registrar razao operacional e efeito em release |

Nota: workflows validam/empacotam `gollem_addon/` por padrao. So adicionar job de estrutura para `villagers_addon` depois que BP/RP e manifests existirem.

---

## 3. Regras Bedrock (qualquer addon proprio)

Aplicam-se a `gollem_addon` e, quando existir implementacao, a `villagers_addon`.

### 3.1 Manifests e versao

- Nao alterar UUIDs sem necessidade explicita (quebra mundos que ja referenciam o pack).
- Nao alterar `min_engine_version` sem registrar impacto de compatibilidade.
- Atualizacao funcional => incrementar igualmente `behavior_pack/manifest.json` e `resource_pack/manifest.json` (e dependencias cruzadas de versao, se existirem).

### 3.2 Contratos BP ↔ RP

| Mudanca | Revisar tambem |
|---------|----------------|
| Entidade | `resource_pack/entity`, models, animations, animation_controllers, render_controllers, texturas, lang |
| Item / bloco / receita | items, blocks, recipes, texts, item_texture / terrain_texture |
| Spawn natural | `spawn_rules` + component group em `minecraft:entity_spawned` |
| Novo identifier | Duplicidade no monorepo e referencias quebradas |
| Property `client_sync` | `query.property` / controllers no RP |
| Script / custom component | Registro no script + declaracao no item/entity JSON |

### 3.3 Assets e packs

- Nao mover de `assets/` para packs sem confirmar formato, caminho e referencia nos JSONs.
- Preferir mudancas pequenas e verificaveis.
- Preservar isolamento: um identifier nao deve aparecer em dois addons com significados diferentes.

### 3.4 Scripts (quando o addon tiver Script API)

- Mutacoes a partir de callbacks read-only: adiar com `system.run(...)`.
- Checar `entity.isValid` antes de operar.
- Unificar um unico fluxo por acao do jogador (evitar tres caminhos para o mesmo item).

---

## 4. Validacao minima por task

Escopo a pasta do addon alvo (excluir `node_modules` se existir).

PowerShell:

```powershell
Get-ChildItem -Recurse -Filter *.json |
  Where-Object { $_.FullName -notmatch 'node_modules|test_world' } |
  ForEach-Object {
    Get-Content -Raw $_.FullName | ConvertFrom-Json | Out-Null
  }
```

Estrutura minima do addon alvo:

```powershell
Test-Path <addon>/behavior_pack/manifest.json
# se houver RP:
Test-Path <addon>/resource_pack/manifest.json
```

Checklist rapido antes de fechar:

- [ ] So pastas do escopo da task foram tocadas
- [ ] Identifiers novos nao colidem com `addon:` / `fv:` / futuros IDs do addon alvo
- [ ] BP e RP (e lang/texturas) coerentes
- [ ] Versoes BP/RP alinhadas se houve mudanca funcional
- [ ] Riscos in-game declarados se nao houve teste no Bedrock

---

## 5. Documentacao

- Atualizar README do escopo afetado quando mudar instalacao, uso, comportamento, compatibilidade, empacotamento ou riscos.
- Funcionalidade nao testada no Bedrock: escrever isso explicitamente.
- Decisoes duraveis de arquitetura entre addons: registrar em `docs/` (ou ADR curto) em vez de so no chat.
- Preferir ASCII nos Markdown do repositorio.

---

## 6. GitHub Actions

Workflows em `.github/workflows/`:

- `validate_json.yml` — JSON + tentativa de IDs duplicados
- `validate-structure.yml` — pastas obrigatorias e UUIDs
- `build-mcaddon.yml` — gera artefato em tags `v*`

Antes de alterar workflows: registrar razao operacional e impacto em release. Confirmar qual addon o pipeline empacota apos o layout multi-pasta.

---

## 7. Matriz rapida "posso fazer X nesta task?"

| Pedido | Resposta padrao |
|--------|-----------------|
| Corrigir Stone Golem | Sim, so em `gollem_addon/` (+ test_world se pedido) |
| Copiar soldado `fv:` para o golem pack | Nao; extrair padrao e reimplementar com IDs proprios se for o caso |
| Implementar minerador | Sim, em `villagers_addon/`; consultar `villager_soldiers` so como referencia |
| "Melhorar" Villager Soldiers inteiro | Nao, salvo task explicita e escopo fechado |
| Mudar UUID de qualquer pack | Nao, salvo pedido explicito |
| Bump so de um manifest | Nao; BP e RP juntos apos mudanca funcional |
| Commit / push / tag | So se o usuario pedir |
