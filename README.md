# Golems Addon

Addon de Minecraft Bedrock que adiciona um golem de pedra com comportamento hostil/defensivo, modelo, textura, animacoes, particulas, item/bloco de nucleo, receita, loot table e regra de spawn em biomas de montanha.

## Estado do projeto

Este repositorio contem um Behavior Pack e um Resource Pack para Minecraft Bedrock `1.20.10+`.

O conteudo principal esta implementado nos arquivos do addon, mas o fluxo de criacao manual do golem ainda precisa de validacao em jogo. Em especial, ha indicios de que o evento acionado pelo bloco de nucleo nao instancia a entidade corretamente no estado atual. Veja a secao "Pontos de atencao".

## Conteudo

- Entidade `addon:stone_golem`.
- Projetil `addon:stone_projectile`.
- Entidade auxiliar `addon:golem_anchor`.
- Item `addon:golem_core`.
- Bloco `addon:golem_core_block`.
- Receita `addon:golem_core_recipe`.
- Loot table para o golem de pedra.
- Spawn natural em superficie de biomas com tag `mountain`.
- Modelo, textura, render controller, animation controller, animacoes e particulas.
- Texturas otimizadas para MCPE: entidade `128x128`, item `32x32` e particula `16x16`.

## Estrutura

```text
behavior_pack/
  blocks/                 Definicao do bloco de nucleo
  entities/               Entidades do addon
  items/                  Definicao do item de nucleo
  loot_tables/            Drops do golem
  recipes/                Receita do nucleo
  spawn_rules/            Regras de spawn natural
  manifest.json           Manifest do Behavior Pack

resource_pack/
  animation_controllers/  Controlador de animacao client-side
  animations/             Animacoes do golem
  entity/                 Client entity
  models/                 Geometria do golem
  particles/              Particulas de impacto/solo
  render_controllers/     Render controller
  textures/               Texturas de entidade, item e particula
  texts/                  Traducoes
  manifest.json           Manifest do Resource Pack
```

## Instalacao local

1. Copie `behavior_pack/` para o diretorio de behavior packs do Minecraft Bedrock.
2. Copie `resource_pack/` para o diretorio de resource packs do Minecraft Bedrock.
3. Ative os dois packs no mundo.
4. Crie ou abra um mundo com suporte a addons.

Diretorios comuns no Windows:

```text
%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\behavior_packs
%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\resource_packs
```

## Uso

Para testar a entidade diretamente:

```mcfunction
/summon addon:stone_golem
```

Para obter o item de nucleo:

```mcfunction
/give @s addon:golem_core
```

Para checar se a entidade esta carregada apos o summon:

```mcfunction
/execute as @e[type=addon:stone_golem] at @s run say STONE_GOLEM_FOUND
```

Para testar o comportamento de guardiao criado pelo jogador:

```mcfunction
/event entity @e[type=addon:stone_golem,c=1] player_created
```

A receita configurada usa a crafting table:

```text
 G
RSR
 G
```

Onde:

- `G` = bloco de ouro
- `R` = bloco de redstone
- `S` = pedra

Resultado: `addon:golem_core`, o item usado para colocar `addon:golem_core_block` no mundo.

## Comportamento do Stone Golem

O golem tem:

- vida inicial `40` e maxima `60`;
- movimento `0.25`;
- caixa de colisao `1.6 x 4.0`;
- resistencia total a knockback;
- ataque a distancia com `addon:stone_projectile`;
- raio de ataque de `25` blocos;
- restricao de casa em raio de `60` blocos;
- loot com redstone dust, glowstone dust ou diamond.

Quando nasce naturalmente, o golem entra no grupo `wild` e mira jogadores. O grupo `player_created` esta desenhado para mirar monstros e jogadores que nao sejam o dono, mas o fluxo de criacao pelo jogador ainda precisa ser fechado.

## Pontos de atencao

- `behavior_pack/blocks/golem_core.json` verifica `stone` na posicao do proprio bloco interagido, o que conflita com a expectativa de o bloco atual ser `addon:golem_core_block`.
- O bloco executa `event entity @s addon:spawn_stone_golem`, mas a entidade `addon:stone_golem` nao define um evento `addon:spawn_stone_golem`.
- A textura atual `resource_pack/textures/entity/stone_golem.png` foi recriada como atlas `128x128`, alinhada ao `texture_width` e `texture_height` declarados no modelo.
- As texturas do item `golem_core` e da particula `stone` foram reduzidas para formatos leves e transparentes, mais adequados para MCPE.
- Ha workflows de validacao e empacotamento em `.github/workflows`, mas nao ha
  script local dedicado neste repositorio.

## Desenvolvimento

Antes de alterar comportamento, valide os JSONs alterados e teste em um mundo Bedrock com os dois packs ativos.

Comando util no PowerShell:

```powershell
Get-ChildItem -Recurse -Filter *.json | ForEach-Object {
  Get-Content -Raw $_.FullName | ConvertFrom-Json | Out-Null
}
```

Para empacotar manualmente, compacte `behavior_pack/` e `resource_pack/` separadamente ou copie as pastas diretamente para o diretorio `com.mojang`.

## Validacao de spawn natural

Para induzir um teste em mundo descartavel:

```mcfunction
/gamerule doMobSpawning true
/difficulty normal
/time set midnight
/weather clear
/locate biome minecraft:stony_peaks
/tp @s <x> <y> <z>
/kill @e[type=addon:stone_golem]
```

Depois aguarde em superficie de montanha escura, sem ficar colado no ponto esperado de spawn, e cheque:

```mcfunction
/execute as @e[type=addon:stone_golem] at @s run say STONE_GOLEM_FOUND
```

## Roadmap sugerido

1. Corrigir e validar o fluxo de criacao manual do golem.
2. Alinhar receita, item e bloco para um unico contrato de obtencao/colocacao.
3. Adicionar nomes traduzidos para bloco e entidade.
4. Criar um script de empacotamento `.mcaddon`.
5. Validar spawn natural e balanceamento de dano/drop em jogo.
