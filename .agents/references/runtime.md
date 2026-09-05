# Runtime, bootstrap e entrega

## Packs

- `addon/gollem_addon`: manifests BP/RP, Bedrock `1.20.10+`, sem Script API.
- `addon/villagers_addon`: manifests BP/RP, Bedrock `1.21.130+`; entrypoint `behavior_pack/scripts/main.js`; `@minecraft/server` `2.4.0` e `@minecraft/server-ui` `2.0.0`.
- `addon/villager_soldiers`: pack de terceiros carregado separadamente quando o fluxo de contratacao do Minerador for usado.

Instalacao local copia BP e RP do addon para as pastas `com.mojang` e ativa ambos no mundo. `addon/villagers_addon` carrega sozinho, mas contratar a partir de `fv:villager_free_handle` requer Villager Soldiers ativo.

## CI e release

- `validate_json.yml`: parseia JSON dos tres addons em `addon/` e checa identificadores duplicados do Stone Golem.
- `validate-structure.yml`: valida manifests e estrutura de `addon/gollem_addon` e `addon/villagers_addon`.
- `build-mcaddon.yml`: gera artifacts separados para Stone Golems e Villagers Addon a partir de `addon/`; cria release somente em tags `v*`.

JSON e CI estrutural nao substituem validacao funcional no Minecraft Bedrock.
