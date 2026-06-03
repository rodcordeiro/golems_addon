# AGENTS.md

Instrucoes locais para agentes trabalhando neste repositorio. Estas regras complementam as instrucoes globais.

## Contexto do projeto

Este projeto e um addon de Minecraft Bedrock formado por:

- `behavior_pack/`: comportamento, entidades, itens, blocos, receitas, loot tables e spawn rules.
- `resource_pack/`: client entity, geometria, texturas, animacoes, render controllers, particulas e textos.
- `.github/workflows/`: validacao de JSON, checagem estrutural Bedrock e empacotamento `.mcaddon` em tags `v*`.
- `assets/`: recursos de apoio/referencia fora dos packs carregados diretamente pelo Bedrock.

Alvo atual observado nos manifests: Minecraft Bedrock `1.20.10+`, versao do pack `1.0.11`.

## Prioridades de trabalho

1. Preservar compatibilidade entre Behavior Pack e Resource Pack.
2. Manter identificadores Bedrock coerentes entre arquivos (`identifier`, texturas, geometria, animacoes, eventos e receitas).
3. Fazer mudancas pequenas e verificaveis.
4. Documentar riscos quando um comportamento nao foi validado dentro do jogo.
5. Nao tratar validacao sintatica de JSON como validacao funcional em Bedrock.

## Regras especificas

- Nao alterar UUIDs dos manifests sem necessidade explicita; isso pode quebrar mundos que ja referenciam os packs.
- Nao alterar `min_engine_version` sem registrar impacto de compatibilidade.
- Sempre que houver atualizacao funcional no addon, incrementar igualmente a versao em `behavior_pack/manifest.json` e `resource_pack/manifest.json`.
- Ao mudar entidade, revisar tambem o par client-side em `resource_pack/entity`, `models`, `animations`, `animation_controllers`, `render_controllers` e texturas.
- Ao mudar item/bloco/receita, revisar o contrato completo entre `behavior_pack/items`, `behavior_pack/blocks`, `behavior_pack/recipes`, traducoes e textura de item.
- Ao mudar spawn natural, revisar `spawn_rules` e o grupo de componentes aplicado em `minecraft:entity_spawned`.
- Ao adicionar identificadores novos, verificar duplicidade e referencias quebradas.
- Nao mover assets de `assets/` para os packs sem confirmar formato, caminho e referencia nos JSONs Bedrock.

## Riscos conhecidos

O fluxo de criacao manual do Stone Golem ainda nao deve ser descrito como validado em jogo ate ser corrigido/testado.

Pontos conhecidos:

- `behavior_pack/recipes/golem_core.json` retorna `addon:golem_core_block`, enquanto existe o item placeable `addon:golem_core`.
- `behavior_pack/blocks/golem_core.json` verifica `stone` na posicao do proprio bloco interagido.
- `behavior_pack/blocks/golem_core.json` chama `addon:spawn_stone_golem`, mas a entidade `addon:stone_golem` nao define esse evento.

Ao atuar nessa area, alinhar primeiro o contrato de receita, item, bloco, estrutura e spawn da entidade.

## Validacao local

Validar JSONs antes de concluir mudancas:

```powershell
Get-ChildItem -Recurse -Filter *.json | ForEach-Object {
  Get-Content -Raw $_.FullName | ConvertFrom-Json | Out-Null
}
```

Quando `jq` estiver disponivel, a validacao equivalente ao workflow principal e:

```bash
find . -name "*.json" -print0 | xargs -0 -n1 jq empty
```

Tambem conferir estrutura minima:

```powershell
Test-Path behavior_pack
Test-Path resource_pack
Test-Path behavior_pack/manifest.json
Test-Path resource_pack/manifest.json
```

## GitHub Actions

- `.github/workflows/validate_json.yml` valida JSONs e tenta detectar identificadores duplicados.
- `.github/workflows/validate-structure.yml` valida pastas obrigatorias e UUIDs de manifests.
- `.github/workflows/build-mcaddon.yml` gera `stone_golems.<version>.mcaddon` em tags `v*`.

Antes de alterar esses workflows, registrar a razao operacional e o impacto em release.

## Documentacao

- Atualizar `README.md` quando mudar instalacao, uso, comportamento, compatibilidade, empacotamento ou riscos conhecidos.
- Se uma funcionalidade nao foi testada no Bedrock, escrever isso explicitamente.
- Preferir ASCII nos arquivos Markdown deste projeto, mantendo consistencia com o README atual.
