# Backlog do addon

Atualizado em: 2026-06-06

## Contexto

Este backlog consolida os problemas observados no mundo de teste `./test_world` e nos prints de debug em `assets/debugging/`.

Evidencias usadas:

- `./test_world` existe e deve ser usado como mundo oficial de validacao local.
- `assets/debugging/golem_core.jpeg` mostra o core com label `item.addon:golem_core`, nao `Golem Core`.
- `assets/debugging/golem_egg.jpeg` mostra o ovo com label `item.spawn_egg.entity.addon:stone_golem.name`.
- `assets/debugging/stone_golem.jpeg` mostra o Stone Golem deformado/torto em jogo.
- `assets/redstone_rpg_gollem.png` e a Image #1 enviada pelo usuario sao referencia visual para recriar a aparencia do Stone Golem: corpo blocado robusto, proporcoes pesadas e inscricoes magicas brilhantes. O material/base do addon continua sendo pedra, nao redstone.
- `assets/stone_golem.png` e `assets/stone_golem.geo.json` sao referencia direta para atualizar o atlas visual e a geometria do Stone Golem.
- Antes do GOLEM-002, `behavior_pack/recipes/golem_core.json` retornava `addon:golem_core_block`, enquanto o item placeable existente era `addon:golem_core`.
- `behavior_pack/blocks/golem_core.json` chama `addon:spawn_stone_golem`, mas esse evento nao esta definido em `addon:stone_golem`.
- `assets/texturas minecraft/textures/item/spawn_egg.png` e `spawn_egg_overlay.png` existem como referencias vanilla para textura de ovo.
- O alinhamento entre modelos, client entities, render controllers, animacoes e arquivos de textura ainda precisa ser revisado para identificar referencias ausentes ou incompatibilidades.

## Priorizacao

| Ordem | Ticket | Epico | Prioridade | Problemas cobertos | Dependencias |
|---:|---|---|---|---|---|
| 1 | GOLEM-001 | Core e criacao manual | P0 Bloqueante | `golem_core` nao pode ser colocado no mundo | Nenhuma |
| 2 | GOLEM-002 | Core e criacao manual | P0 Bloqueante | Receita nao exibe/retorna o `golem_core` correto | GOLEM-001 |
| 3 | GOLEM-003 | Core e criacao manual | P0 Bloqueante | Receita/estrutura para criar o Stone Golem esta indefinida ou incompleta | GOLEM-001, GOLEM-002 |
| 4 | GOLEM-004 | Comportamento da entidade | P0 Bloqueante | Golem invocado nasce imovel, some e nao ataca mobs | Nenhuma |
| 5 | GOLEM-005 | Spawn natural | P1 Alto | Stone Golem nao spawna naturalmente | GOLEM-004 |
| 6 | GOLEM-006 | Nomes e UX | P1 Alto | Core aparece com chave tecnica em vez de `Golem Core` | GOLEM-001, GOLEM-002 |
| 7 | GOLEM-007 | Ovo de spawn | P1 Alto | Ovo do Stone Golem precisa de nome/textura corretos | GOLEM-006 |
| 8 | GOLEM-008 | Visual da entidade | P1 Alto | Revisar modelos/entities contra texturas e referencias visuais | GOLEM-004 |
| 9 | GOLEM-009 | Visual da entidade | P2 Medio | Aparencia do Stone Golem esta torta/deformada | GOLEM-008 |
| 10 | GOLEM-010 | Validacao | P0 Gate de release | Validar o addon end-to-end em `./test_world` | Todos os tickets funcionais e visuais |
| 11 | GOLEM-011 | Validacao | P0 Gate de release | Validar receita/estrutura survival para criar o Stone Golem | GOLEM-001, GOLEM-002, GOLEM-003 |

## Tickets

### GOLEM-001 - Corrigir colocacao do `golem_core`

Prioridade: P0 Bloqueante

Status: Concluido por validacao local em 2026-06-06; pendente apenas teste manual no Minecraft via `./test_world`.

Evidencias locais:

- `behavior_pack/items/golem_core.json` usa `minecraft:block_placer` apontando para `addon:golem_core_block`.
- `behavior_pack/blocks/golem_core.json` define o bloco `addon:golem_core_block` com geometria de bloco cheio e material instances por face.
- `resource_pack/blocks.json` e `resource_pack/textures/terrain_texture.json` registram as texturas do bloco.
- `resource_pack/textures/items/golem_core.png` existe em `32x32`; texturas do bloco existem em `128x128`.
- `./test_world` foi sincronizado com BP/RP `1.0.14`.

Problema: o jogador consegue obter `addon:golem_core` via `/give`, mas nao consegue colocar o item no mundo. Sem isso, o fluxo de criacao manual de golems fica bloqueado.

Escopo:

- Revisar o contrato entre `behavior_pack/items/golem_core.json` e `behavior_pack/blocks/golem_core.json`.
- Garantir que `addon:golem_core` seja um item placeable valido para `addon:golem_core_block`.
- Validar se o bloco precisa de componentes/client resources adicionais para aparecer/funcionar em MCPE.

Criterios de aceite:

- `/give @s addon:golem_core` entrega um item que pode ser colocado no mundo.
- O bloco colocado corresponde ao identificador esperado `addon:golem_core_block`.
- O item nao desaparece sem colocar o bloco.
- Validado em `./test_world`.

### GOLEM-002 - Alinhar receita do Golem Core

Prioridade: P0 Bloqueante

Status: Concluido por validacao local em 2026-06-06; pendente apenas teste manual no Minecraft via `./test_world`.

Evidencias locais:

- `behavior_pack/recipes/golem_core.json` retorna `addon:golem_core`.
- O item retornado pela receita e o mesmo item validado no GOLEM-001 como placeable para `addon:golem_core_block`.
- BP/RP foram incrementados e sincronizados para `1.0.15` antes da validacao local.

Problema: a receita atual retorna `addon:golem_core_block`, mas o item usado para placeable e `addon:golem_core`. Isso tambem explica a receita nao apresentar o core esperado no craft.

Escopo:

- Corrigir `behavior_pack/recipes/golem_core.json` para retornar o identificador definido como contrato principal.
- Confirmar se o resultado correto deve ser `addon:golem_core` ou se o projeto deve remover o item separado e usar somente bloco.
- Atualizar README se a receita mudar.

Criterios de aceite:

- Crafting table exibe o item correto do Golem Core.
- Receita retorna o mesmo item usado para colocacao no mundo.
- O item craftado pode ser colocado conforme GOLEM-001.
- Validado em `./test_world`.

### GOLEM-003 - Definir receita/estrutura do Stone Golem

Prioridade: P0 Bloqueante

Problema: nao ha uma receita clara para o Stone Golem em si. O addon tem uma receita para o core, mas o fluxo de estrutura/interacao que transforma blocos em `addon:stone_golem` esta incompleto.

Escopo:

- Definir formalmente a estrutura survival para criar o Stone Golem.
- Corrigir `behavior_pack/blocks/golem_core.json`, que hoje verifica `stone` na propria posicao do bloco interagido.
- Substituir ou implementar o evento `addon:spawn_stone_golem`, hoje chamado pelo bloco mas ausente na entidade.
- Garantir que o golem criado pelo jogador receba o evento/grupo `player_created`.

Criterios de aceite:

- README documenta a estrutura/receita de criacao do Stone Golem.
- Montar a estrutura e interagir/posicionar o core consome os blocos corretos.
- `addon:stone_golem` nasce no local correto.
- Golem criado pelo jogador usa comportamento de guardiao.
- Validado em `./test_world`.

### GOLEM-004 - Corrigir IA, persistencia e combate do Stone Golem

Prioridade: P0 Bloqueante

Problema: quando invocado, o Stone Golem nasce imovel, desaparece depois de algum tempo e nao ataca outros mobs.

Escopo:

- Revisar componentes de movimento, navegacao, alvo, ataque e despawn da entidade.
- Validar diferenca entre comportamento `wild` e `player_created`.
- Confirmar se `wild` deve atacar jogadores somente, mobs hostis, ou ambos.
- Confirmar se `player_created` deve atacar mobs hostis e ignorar o dono.

Criterios de aceite:

- `/summon addon:stone_golem` cria uma entidade que se move.
- A entidade nao desaparece indevidamente durante a janela de teste.
- A entidade adquire alvo valido e ataca conforme regra esperada.
- O comportamento `player_created` ataca mobs hostis proximos.
- Validado em `./test_world` com mobs de teste.

### GOLEM-005 - Corrigir spawn natural

Prioridade: P1 Alto

Problema: o Stone Golem nao esta spawnando naturalmente, apesar de existir spawn rule para biomas com tag `mountain`.

Escopo:

- Revisar `behavior_pack/spawn_rules/golems/stone_golem.json`.
- Validar se a entidade esta apta para spawn natural no Bedrock/MCPE.
- Confirmar condicoes de dificuldade, luz, superficie, distancia do jogador e populacao.
- Ajustar peso/condicoes se o spawn estiver raro demais para validacao.

Criterios de aceite:

- Com `doMobSpawning true`, dificuldade adequada e biome de montanha, o Stone Golem spawna naturalmente em `./test_world`.
- As condicoes de spawn ficam documentadas no README.
- Se a chance for intencionalmente baixa, existe um modo documentado de validacao.

### GOLEM-006 - Corrigir nomes exibidos do core, bloco e entidade

Prioridade: P1 Alto

Problema: o core aparece como `item.addon:golem_core` no inventario/crafting, nao como `Golem Core`.

Escopo:

- Corrigir entradas em `resource_pack/texts/en_US.lang` e `pt_BR.lang`.
- Incluir nomes para item, bloco, entidade e eventuais aliases necessarios pelo Bedrock.
- Garantir que o nome apareca corretamente no inventario criativo, hotbar e crafting.

Criterios de aceite:

- `addon:golem_core` aparece como `Golem Core`.
- `addon:golem_core_block`, se visivel, tambem tem nome humano.
- `addon:stone_golem` tem nome humano quando exibido pelo jogo.
- Validado nos idiomas `en_US` e `pt_BR` em `./test_world`.

### GOLEM-007 - Criar ovo do Stone Golem com textura adequada

Prioridade: P1 Alto

Problema: o ovo aparece com chave tecnica `item.spawn_egg.entity.addon:stone_golem.name` e precisa de textura/nome adequados.

Escopo:

- Usar `assets/texturas minecraft/textures/item/spawn_egg.png` e `spawn_egg_overlay.png` como referencia visual.
- Definir textura de ovo do `addon:stone_golem` no Resource Pack.
- Adicionar nome localizado para o ovo.
- Validar que o ovo spawna `addon:stone_golem`.

Criterios de aceite:

- Ovo aparece no inventario criativo com nome humano, por exemplo `Stone Golem Spawn Egg`.
- Ovo usa textura adequada e distinta.
- Usar o ovo no mundo spawna `addon:stone_golem`.
- Validado em `./test_world`.

### GOLEM-008 - Revisar modelos e entities contra arquivos de textura

Prioridade: P1 Alto

Problema: o contrato visual pode estar incompleto entre textura, geometria, client entity, render controller, animation controller e arquivos de entidade. Antes de redesenhar ou ajustar visualmente o Stone Golem, e necessario verificar se algo esta faltando ou apontando para textura/modelo errado.

Escopo:

- Conferir `resource_pack/entity/stone_golem.entity.json` contra `resource_pack/textures/entity_texture.json`, `resource_pack/render_controllers/golem.render.json`, `resource_pack/models/entity/stone_golem.geo.json`, `resource_pack/animations/stone_golem.animation.json` e `resource_pack/animation_controllers/stone_golem.controller.json`.
- Conferir se `texture_width`, `texture_height`, UVs, bones e nomes de geometria batem com `resource_pack/textures/entity/stone_golem.png`.
- Conferir se item/core/ovo referenciam texturas existentes em `resource_pack/textures/item_texture.json` e `resource_pack/textures/items/`.
- Levantar referencias quebradas, assets ausentes, nomes divergentes e incompatibilidades entre BP/RP.

Criterios de aceite:

- Existe uma lista objetiva de inconsistencias encontradas entre modelos/entities/texturas.
- Referencias quebradas ou ausentes sao corrigidas ou viram tickets derivados.
- O ajuste visual do GOLEM-009 parte de um contrato BP/RP coerente.
- Validado por inspecao de arquivos e, quando aplicavel, em `./test_world`.

### GOLEM-009 - Revisar aparencia/modelo/animacao do Stone Golem

Prioridade: P2 Medio

Problema: o Stone Golem esta visualmente torto/deformado, conforme `assets/debugging/stone_golem.jpeg`, e ainda nao segue a direcao estetica desejada. A referencia desejada e a Image #1 / `assets/redstone_rpg_gollem.png`: um golem de campanha RPG com corpo de blocos massivos, postura pesada, olho/brilho interno e inscricoes magicas luminosas. Apesar da referencia ser um golem de redstone, o addon atual deve continuar tratando a entidade como golem de pedra, aproximando a silhueta e os detalhes magicos sem mudar o conceito base.

Escopo:

- Revisar geometria em `resource_pack/models/entity/stone_golem.geo.json`.
- Revisar textura `resource_pack/textures/entity/stone_golem.png`.
- Revisar animation controller e animacoes que possam rotacionar/deformar bones.
- Usar a Image #1 / `assets/redstone_rpg_gollem.png` como referencia de arte para proporcoes, volumes, blocos segmentados, postura e inscricoes magicas.
- Usar `assets/stone_golem.png` e `assets/stone_golem.geo.json` como referencia direta de atlas, UVs, coordenadas de eixo e partes do golem.
- Adaptar a referencia para pedra: manter paleta mineral/pedregosa, mas incluir fendas, runas ou inscricoes magicas brilhantes inspiradas no golem de redstone.
- Separar problema de rig/modelo de problema de IA parada.

Criterios de aceite:

- Golem aparece alinhado em pe.
- Textura fica coerente com a geometria.
- Visual fica claramente inspirado na referencia, mantendo identidade de Stone Golem.
- Textura inclui inscricoes magicas visiveis e bem encaixadas nos blocos do corpo.
- Animacoes nao deformam a entidade de forma inesperada.
- Comparacao visual aprovada contra o print de debug.
- Comparacao visual aprovada contra a Image #1 / `assets/redstone_rpg_gollem.png`, considerando as adaptacoes para pedra.
- Validado em `./test_world`.

### GOLEM-010 - Checklist de validacao em `./test_world`

Prioridade: P0 Gate de release

Problema: validacao sintatica de JSON nao garante funcionamento no Bedrock/MCPE.

Escopo:

- Criar e executar checklist manual em `./test_world`.
- Cobrir comandos, crafting, colocacao, criacao manual, ovo, IA, combate, persistencia, spawn natural, nomes e aparencia.
- Registrar explicitamente o que foi validado em jogo e o que ficou apenas validado por JSON.

Criterios de aceite:

- Checklist executado apos as correcoes.
- Evidencia de validacao registrada no README, em docs ou em snapshot de memoria.
- Qualquer limitacao restante fica documentada antes de release.

### GOLEM-011 - Validar receita survival do Stone Golem

Prioridade: P0 Gate de release

Problema: mesmo apos corrigir item, receita, estrutura e evento de criacao, e necessario validar no Minecraft/MCPE se o jogador consegue obter o core em survival e transformar a estrutura em `addon:stone_golem` sem comandos administrativos.

Escopo:

- Validar crafting do `addon:golem_core` em crafting table no modo sobrevivencia.
- Validar colocacao do core no mundo sem comandos.
- Validar montagem da estrutura documentada para criar o Stone Golem.
- Validar que interagir com a estrutura consome os blocos corretos e instancia `addon:stone_golem`.
- Validar que o golem criado por survival recebe comportamento de `player_created`.

Criterios de aceite:

- Jogador em survival consegue craftar o core.
- Jogador em survival consegue colocar o core.
- Estrutura survival documentada cria `addon:stone_golem`.
- Blocos da estrutura sao consumidos ou transformados conforme contrato documentado.
- O golem criado pela estrutura usa comportamento de guardiao.
- Validado em `./test_world`.

## Ordem recomendada de execucao

1. Resolver GOLEM-001 e GOLEM-002 para fechar o contrato de item/bloco/receita.
2. Resolver GOLEM-003 para entregar a criacao manual do Stone Golem.
3. Resolver GOLEM-004 para tornar a entidade funcional.
4. Resolver GOLEM-005 para fechar spawn natural.
5. Resolver GOLEM-006 e GOLEM-007 para corrigir nomes e ovo.
6. Resolver GOLEM-008 para auditar modelos/entities/texturas.
7. Resolver GOLEM-009 para ajustar o visual.
8. Executar GOLEM-011 para validar a receita/estrutura survival.
9. Executar GOLEM-010 como gate end-to-end antes de considerar a versao pronta.

## Riscos

- Mudar contratos de identificador pode quebrar mundos que ja referenciam itens/blocos antigos.
- Se houver alteracao funcional no addon, a versao deve ser incrementada igualmente em `behavior_pack/manifest.json` e `resource_pack/manifest.json`.
- Validacao por JSON e insuficiente para eventos de bloco, spawn natural, IA, combate e rendering.
Sepa
