# Contexto para agentes

| Arquivo | Quando ler |
|---|---|
| `structure.md` | Para escolher o addon alvo e entender ownership |
| `runtime.md` | Para manifests, bootstrap, instalacao, CI e empacotamento |
| `domain.md` | Para vocabulario de Stone Golems, Minerador e pack de referencia |
| `conventions.md` | Antes de qualquer mudanca ou validacao |
| `patterns.md` | Ao alterar contratos BP/RP ou scripts Bedrock |
| `tech-debt.md` | Ao planejar trabalho ou avaliar riscos conhecidos |

Knowledge operacional: use `$nero` no projeto `golems_addon`, dominio `minecraft`. Nao existe guideline Nero especifico para addons Bedrock; `docs/references/coding-guidelines.md` e a regra local comprovada.

Perguntas de imports, calls e paths: use `$nero-code-graph` quando o GraphDocument cobrir o tipo de arquivo; para JSON Bedrock ou grafo vazio, use o filesystem e declare a limitacao.
