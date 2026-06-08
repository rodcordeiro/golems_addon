# Criterios de teste - GOLEM-012 e GOLEM-004

Este roteiro valida as mudancas de comparacao contra `iron_golem_guard` e a correcao inicial de IA, movimento e combate do `addon:stone_golem`.

Use o mundo local `./test_world` com o Behavior Pack e o Resource Pack atualizados para a mesma versao.

## Preparacao comum

Comandos iniciais:

```mcfunction
/gamerule doMobSpawning true
/difficulty normal
/time set midnight
/weather clear
/kill @e[type=addon:stone_golem]
/kill @e[type=zombie]
/kill @e[type=skeleton]
```

Confirmacao de pack:

- Verifique se BP e RP estao ativos no mundo.
- Se o Minecraft mostrar cache antigo, remova e reative os packs antes de testar.
- O teste funcional esperado para esta rodada e comportamento em jogo; JSON valido sozinho nao aprova a task.

## GOLEM-012 - Checklist comparativo contra `iron_golem_guard`

Objetivo: confirmar que as diferencas criticas da referencia funcional foram decididas e aplicadas ou encaminhadas corretamente.

### Cenario 1 - Decisoes aplicadas no BP

Acoes:

1. Abra `behavior_pack/entities/golems/stone/stone_golem.json`.
2. Confirme que existem componentes de locomocao basica:
   - `minecraft:movement.basic`
   - `minecraft:jump.static`
3. Confirme que existem componentes de combate e alvo:
   - `minecraft:attack`
   - `minecraft:behavior.delayed_attack`
   - `minecraft:behavior.move_towards_target`
   - `minecraft:behavior.hurt_by_target`
   - `minecraft:follow_range`
4. Confirme que existem componentes de persistencia/fisica:
   - `minecraft:persistent`
   - `minecraft:pushable`

Resultado esperado:

- Todos os componentes acima existem no Stone Golem.
- O golem continua mantendo o projetil antigo (`minecraft:shooter`, `minecraft:shoot`) para validacao posterior, mas o melee passa a ser o caminho primario de aceite de GOLEM-004.

Falha se:

- Algum componente obrigatorio acima estiver ausente.
- A entidade perder `is_spawnable` ou `is_summonable`.

### Cenario 2 - Decisoes aplicadas no RP

Acoes:

1. Abra `resource_pack/entity/stone_golem.entity.json`.
2. Confirme que `animations` contem `look_at_target`.
3. Confirme que `scripts.animate` executa `look_at_target`.

Resultado esperado:

- A entidade client-side tem instrucao para olhar para o alvo usando `animation.humanoid.look_at_target.default`.

Falha se:

- O `look_at_target` nao estiver registrado.
- O controller principal `controller.animation.stone_golem` for removido.

### Cenario 3 - Itens encaminhados para outras tasks

Acoes:

1. Verifique o backlog em `docs/backlog.md`.
2. Confirme que spawn natural permanece em `GOLEM-005`.
3. Confirme que ovo de spawn permanece em `GOLEM-007`.
4. Confirme que ajustes visuais/modelo permanecem em `GOLEM-008`/`GOLEM-009`.

Resultado esperado:

- GOLEM-012 esta concluido como decisao/checklist.
- Pendencias fora de movimento/combate continuam rastreadas nas tasks adequadas.

Falha se:

- GOLEM-012 declarar como concluido algo que ainda depende de teste em jogo, como spawn natural ou visual final.

## GOLEM-004 - IA, movimento, persistencia e combate

Objetivo: validar que o Stone Golem nasce, se move, gira para alvo, nao fica congelado e reage/ataca mobs.

### Cenario 1 - Summon basico e movimento livre

Comandos:

```mcfunction
/kill @e[type=addon:stone_golem]
/summon addon:stone_golem ~ ~ ~
/execute as @e[type=addon:stone_golem] at @s run say STONE_GOLEM_FOUND
```

Acoes:

1. Afaste-se alguns blocos do golem.
2. Observe por 60 segundos.
3. Verifique se ele faz movimento de idle/walk ou random stroll.

Resultado esperado:

- O comando encontra a entidade.
- O golem nao fica congelado permanentemente virado para o sul.
- O golem consegue girar e/ou caminhar.
- O golem nao desaparece durante a janela de 60 segundos.

Falha se:

- O golem nasce e permanece imovel na mesma orientacao durante todo o teste.
- O golem desaparece sem morte/kill.

### Cenario 2 - Reacao a mob hostil

Comandos:

```mcfunction
/kill @e[type=addon:stone_golem]
/kill @e[type=zombie]
/summon addon:stone_golem ~ ~ ~ player_created
/summon zombie ~5 ~ ~
```

Acoes:

1. Observe se o golem identifica o zombie.
2. Observe se ele gira para o alvo.
3. Observe se ele anda em direcao ao alvo.
4. Aguarde ate ocorrer ataque ou ate 90 segundos.

Resultado esperado:

- O golem adquire o zombie como alvo.
- O golem se desloca em direcao ao zombie.
- O golem causa dano corpo-a-corpo ao zombie.
- O golem reage se for atacado pelo zombie.

Falha se:

- O zombie ataca o golem e o golem nao reage.
- O golem nunca gira ou caminha na direcao do alvo.
- O zombie permanece vivo sem sofrer dano apos 90 segundos em alcance.

### Cenario 3 - Golem criado pelo jogador ataca mobs

Comandos:

```mcfunction
/kill @e[type=addon:stone_golem]
/kill @e[type=skeleton]
/summon addon:stone_golem ~ ~ ~ player_created
/summon skeleton ~6 ~ ~
```

Acoes:

1. Observe se o golem persegue o skeleton.
2. Verifique se o golem consegue atacar mesmo recebendo flechas.
3. Aguarde ate 90 segundos.

Resultado esperado:

- O grupo `player_created` ataca mob hostil proximo.
- O golem nao fica passivo enquanto recebe dano.

Falha se:

- O skeleton ataca livremente e o golem permanece parado.

### Cenario 4 - Persistencia curta

Comandos:

```mcfunction
/kill @e[type=addon:stone_golem]
/summon addon:stone_golem ~ ~ ~ player_created
```

Acoes:

1. Afaste-se cerca de 40 blocos sem descarregar o chunk intencionalmente.
2. Aguarde 3 minutos.
3. Volte ate o ponto do summon.
4. Execute:

```mcfunction
/execute as @e[type=addon:stone_golem] at @s run say STONE_GOLEM_STILL_ALIVE
```

Resultado esperado:

- A entidade continua no mundo se nao foi morta.

Falha se:

- A entidade desaparece sem comando, morte ou unload claro do mundo.

## Resultado da validacao

Considere GOLEM-004 aprovado em jogo somente se todos os cenarios GOLEM-004 passarem.

Se algum cenario falhar, registre:

- versao BP/RP usada;
- comando executado;
- mob usado;
- distancia inicial;
- tempo observado;
- print ou descricao objetiva do comportamento.
