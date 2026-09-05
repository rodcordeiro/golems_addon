# AGENTS.md

Monorepo de addons Minecraft Bedrock. Os produtos proprios usam Behavior Pack + Resource Pack sob `addon/`; `addon/villager_soldiers/` e referencia de terceiros. Entradas: manifests de cada pack e, em `addon/villagers_addon`, `behavior_pack/scripts/main.js`.

## Como usar este contexto

| Necessidade | Leia |
| --- | --- |
| Mapa do monorepo e ownership | `.agents/references/structure.md` |
| Bootstrap, packs e release | `.agents/references/runtime.md` |
| Termos e limites de produto | `.agents/references/domain.md` |
| Regras de mudanca e validacao | `.agents/references/conventions.md` |
| Padroes BP/RP e Script API | `.agents/references/patterns.md` |
| Riscos e gaps conhecidos | `.agents/references/tech-debt.md` |
| Indice completo | `.agents/references/index.md` |
| Knowledge operacional | `$nero`, projeto `golems_addon`, dominio `minecraft` |
| Estrutura de codigo | `$nero-code-graph`; confirmar cobertura do extrator antes de confiar |

## Regras rapidas

1. Uma task de produto deve ter um unico addon alvo; nao misture namespaces, UUIDs ou assets.
2. Leia o `AGENTS.md` e o `README.md` do addon alvo antes de editar.
3. Para itens, blocos, receitas ou arte vanilla, consulte `docs/references/minecraft-textures.md`.
4. Mudanca funcional exige versoes BP/RP alinhadas; UUID e `min_engine_version` so mudam com pedido e impacto registrado.
5. Valide JSON e estrutura no addon alvo. Sem teste no Bedrock, declare a validacao in-game pendente.

## Validacao minima

```powershell
Get-ChildItem addon/<addon> -Recurse -Filter *.json |
  Where-Object { $_.FullName -notmatch 'node_modules|test_world' } |
  ForEach-Object { Get-Content -Raw $_.FullName | ConvertFrom-Json | Out-Null }
```

Detalhes normativos locais: `docs/references/coding-guidelines.md`.
