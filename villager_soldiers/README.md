# Villager Soldiers (referencia)

Pack de terceiros **Villager Soldier 2 Version 3.1.4 The Rise** (autor AnhemSteve), mantido neste monorepo como **referencia** e dependencia de uso do [`villagers_addon`](../villagers_addon/README.md).

**Namespace principal:** `fv:`  
**min_engine_version:** `1.21.130`  
**Script API:** `@minecraft/server` `2.4.0`, `@minecraft/server-ui` `2.0.0`

## Papel neste repositorio

- Nao e produto proprio do monorepo.
- Usado para padroes de hireable villagers, workers, golems e scripts.
- O complemento `villagers_addon` contrata a partir de `fv:villager_free_handle` sem editar este pack.

Politica de alteracao: ver [`../docs/references/coding-guidelines.md`](../docs/references/coding-guidelines.md) (secao 2.2) e [`../AGENTS.md`](../AGENTS.md).

Documentacao tecnica detalhada para agentes: [`AGENTS.md`](AGENTS.md).

## Conteudo (resumo)

Soldados contrataveis, workers (incluindo clumper), illagers, armas, golems, worldgen e Script Module. Escala grande (~100+ entities).

## Instalacao

Se for jogar com o Soldiers (ou com o Minerador de Tunel):

1. Copie `behavior_pack/` e `resource_pack/` desta pasta para o Bedrock.
2. Ative ambos no mundo.

## Licenca / uso

Licenca e uso comercial **nao** estao documentados neste repositorio. Tratar como referencia ate esclarecer direitos do autor original.

## Validacao

JSON pode ser validado localmente; o comportamento in-game do pack original nao foi revalidado neste monorepo.
