# Estrutura e ownership

Os packs de produto e a referencia de terceiros ficam sob `addon/`. Caminhos abaixo sao relativos a raiz do monorepo.

| Path | Papel | Namespace | Ownership |
|---|---|---|---|
| `addon/gollem_addon/` | Stone Golems; BP + RP | `addon:` | Produto proprio |
| `addon/villagers_addon/` | Minerador de Tunel; BP + RP + Script API | `va:` | Produto proprio |
| `addon/villager_soldiers/` | Soldiers e villagers usados como referencia/dependencia de uso | `fv:` e secundarios | Terceiros; nao reescrever por padrao |
| `test_world/` | Mundo local de validacao | N/A | Foco atual em Stone Golems |
| `assets/` | Arte, dumps e debug fora dos packs | N/A | Referencia; Bedrock nao carrega diretamente |
| `docs/references/` | Regras e inventarios compartilhados | N/A | Documentacao local |
| `.github/workflows/` | JSON, estrutura e build `.mcaddon` | N/A | CI/release |

Cada addon possui contexto local em `addon/<addon>/README.md` e `addon/<addon>/AGENTS.md`. Uma mudanca cross-addon exige pedido explicito e auditoria de IDs/UUIDs.
