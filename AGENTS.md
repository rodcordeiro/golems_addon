# AGENTS.md

Instrucoes locais para agentes neste repositorio. Complementam as instrucoes globais.

## O que e este repositorio

Monorepo de addons Minecraft Bedrock. Cada pasta de addon e um pack independente (Behavior Pack + Resource Pack quando existir). Nao misture namespaces, UUIDs ou assets entre addons sem pedido explicito.

## Projetos

| Pasta | Papel | Namespace | Status |
|-------|-------|-----------|--------|
| `gollem_addon/` | Addon proprio de Stone Golems | `addon:` | Ativo; packs em `behavior_pack/` e `resource_pack/` |
| `villager_soldiers/` | Addon de terceiros (AnhemSteve) — soldados/villagers | `fv:` (+ secundarios) | Referencia; nao reescrever como produto proprio |
| `villagers_addon/` | Addon proprio que complementa Villager Soldiers | `va:` | MVP + Milestone 2 (012-016) em codigo `1.0.2`; validacao in-game pendente (`docs/backlog.md`) |

Documentacao especifica por projeto:

- `gollem_addon/README.md` / `gollem_addon/AGENTS.md`
- `villager_soldiers/README.md` / `villager_soldiers/AGENTS.md`
- `villagers_addon/README.md` / `villagers_addon/AGENTS.md`
- `villagers_addon/docs/backlog.md` — decisoes e tickets do Minerador de Tunel
- `villagers_addon/docs/IDEIA_MINERADOR.md` — ideia / contexto
- `README.md` (raiz) — mapa do monorepo

Referencias compartilhadas (`docs/references/`):

- `coding-guidelines.md` — o que pode / nao pode alterar por tipo de task
- `minecraft-textures.md` — mapa de texturas/itens vanilla (`assets/texturas minecraft`); usar ao criar itens, receitas, loot, `item_texture.json` ou arte derivada
- `minecraft-textures-catalog.md` — listas completas (itens, blocos, entities, ...)
- `minecraft-textures-inventory.json` — inventario machine-readable; regenerar com `_gen_minecraft_textures_docs.py`

## Outras pastas

| Pasta | Uso |
|-------|-----|
| `assets/` | Referencias visuais/debug fora dos packs carregados pelo Bedrock |
| `assets/texturas minecraft/` | Dump Java de texturas/models vanilla; ver `docs/references/minecraft-textures.md` (nao e RP Bedrock) |
| `test_world/` | Mundo local de validacao (foco atual: `gollem_addon`) |
| `.github/workflows/` | CI (JSON, estrutura, empacotamento `.mcaddon`) |
| `docs/references/` | Regras e inventarios compartilhados entre agentes |

## Como trabalhar

1. Identifique o addon alvo da task antes de editar.
2. Siga `docs/references/coding-guidelines.md` para o que pode / nao pode ser alterado por tipo de task.
3. Para IDs/texturas vanilla (itens, blocos, entities), consulte `docs/references/minecraft-textures.md` antes de inventar nomes; item vanilla = `minecraft:<stem>` sem copiar PNG para o pack.
4. Prefira mudancas pequenas, locais ao addon alvo e verificaveis.
5. Nao trate validacao sintatica de JSON como validacao funcional em Bedrock.
6. Se o comportamento nao foi testado no jogo, declare isso explicitamente.

## Prioridades

1. Isolamento entre addons (IDs, UUIDs, scripts, texturas).
2. Contrato BP ↔ RP coerente dentro do addon alvo.
3. Compatibilidade com o `min_engine_version` do addon alvo.
4. Documentar riscos e lacunas de teste in-game.
