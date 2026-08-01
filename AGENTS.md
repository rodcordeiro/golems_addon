# AGENTS.md

Instrucoes locais para agentes neste repositorio. Complementam as instrucoes globais.

## O que e este repositorio

Monorepo de addons Minecraft Bedrock. Cada pasta de addon e um pack independente (Behavior Pack + Resource Pack quando existir). Nao misture namespaces, UUIDs ou assets entre addons sem pedido explicito.

## Projetos

| Pasta | Papel | Namespace | Status |
|-------|-------|-----------|--------|
| `gollem_addon/` | Addon proprio de Stone Golems | `addon:` | Ativo; packs em `behavior_pack/` e `resource_pack/` |
| `villager_soldiers/` | Addon de terceiros (AnhemSteve) — soldados/villagers | `fv:` (+ secundarios) | Referencia; nao reescrever como produto proprio |
| `villagers_addon/` | Addon proprio que complementa Villager Soldiers | a definir (`va:` sugerido) | Em ideacao; ver `docs/IDEIA_MINERADOR.md` |

Documentacao especifica por projeto:

- `gollem_addon/AGENTS.md` — contexto, riscos e validacao do Stone Golem
- `villager_soldiers/AGENTS.md` — referencia tecnica do pack de soldados
- `villagers_addon/AGENTS.md` — ponteiros do complemento
- `villagers_addon/docs/IDEIA_MINERADOR.md` — ideia do minerador strip

## Outras pastas

| Pasta | Uso |
|-------|-----|
| `assets/` | Referencias visuais/debug fora dos packs carregados pelo Bedrock |
| `test_world/` | Mundo local de validacao (foco atual: `gollem_addon`) |
| `.github/workflows/` | CI (JSON, estrutura, empacotamento `.mcaddon`) |
| `docs/references/` | Regras operacionais compartilhadas entre agentes |

## Como trabalhar

1. Identifique o addon alvo da task antes de editar.
2. Siga `docs/references/coding-guidelines.md` para o que pode / nao pode ser alterado por tipo de task.
3. Prefira mudancas pequenas, locais ao addon alvo e verificaveis.
4. Nao trate validacao sintatica de JSON como validacao funcional em Bedrock.
5. Se o comportamento nao foi testado no jogo, declare isso explicitamente.

## Prioridades

1. Isolamento entre addons (IDs, UUIDs, scripts, texturas).
2. Contrato BP ↔ RP coerente dentro do addon alvo.
3. Compatibilidade com o `min_engine_version` do addon alvo.
4. Documentar riscos e lacunas de teste in-game.
