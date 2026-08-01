# AGENTS.md — gollem_addon

Addon proprio de Stone Golems neste monorepo. Regras gerais e escopo de task: `../AGENTS.md` e `../docs/references/coding-guidelines.md`.

## Contexto

- Namespace: `addon:`
- Alvo observado nos manifests: Bedrock `1.20.10+`
- Layout: `behavior_pack/` + `resource_pack/`
- Mundo de teste do monorepo: `../test_world/`
- Referencias de arte/debug: `../assets/`

Conteudo principal: `addon:stone_golem`, projetil, anchor, item/bloco de nucleo, receita, loot, spawn em biomas de montanha, client assets.

## Ao editar este addon

1. Manter contrato BP ↔ RP (entity, models, animations, controllers, texturas, lang).
2. Incrementar versao BP e RP juntos apos mudanca funcional.
3. Nao alterar UUIDs nem `min_engine_version` sem pedido/registro de impacto.
4. Nao misturar IDs/assets com `villager_soldiers` (`fv:`) ou `villagers_addon`.
5. Validar JSON no escopo desta pasta; declarar se falta teste in-game.

## Riscos conhecidos

O fluxo de criacao manual do Stone Golem nao deve ser descrito como validado em jogo ate evidencias no Bedrock/`test_world`.

Ao atuar nessa area, alinhar primeiro o contrato receita ↔ item ↔ bloco ↔ estrutura ↔ spawn/evento da entidade.

Detalhes de backlog e testes: `docs/backlog.md`, `docs/golem-012-004-testes.md`.

## Validacao local (esta pasta)

```powershell
Get-ChildItem -Recurse -Filter *.json | ForEach-Object {
  Get-Content -Raw $_.FullName | ConvertFrom-Json | Out-Null
}

Test-Path behavior_pack/manifest.json
Test-Path resource_pack/manifest.json
```
