# Dominio do monorepo

## Stone Golems

Produto em `addon/gollem_addon/`. O contrato inclui `addon:stone_golem`, projetil e FX, Golem Core, criacao manual, spawn natural, tame/dono e combate ranged primario. Gates in-game permanecem no backlog local.

## Minerador de Tunel

Produto em `addon/villagers_addon/`. `va:villager_miner` e contratado com `va:mining_contract`, abre tunel 3x3, coleta ores, deposita em copper chest e aceita origem/comandos/tochas. O codigo esta em `1.0.4`; validacoes in-game listadas no backlog continuam pendentes.

## Villager Soldiers

Referencia de terceiros em `addon/villager_soldiers/`. O Minerador tem soft-dependencia de uso em `fv:villager_free_handle`; isso nao autoriza modificar, copiar em massa ou publicar o pack de terceiros.

## Termos de contrato

- BP: Behavior Pack, comportamento server/data-driven.
- RP: Resource Pack, client entity, modelos, animacoes, controllers, texturas e textos.
- Validacao estatica: sintaxe/estrutura; nao comprova comportamento in-game.
- Addon alvo: unica pasta de produto autorizada para uma task de produto.
