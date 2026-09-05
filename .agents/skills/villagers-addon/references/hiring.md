# Contratacao

## Soft-dependencia

Hire so funciona se Villager Soldiers estiver ativo e existir adulto `fv:villager_free_handle`. Sem Soldiers o pack carrega, mas nao ha alvo.

Fluxo Soldiers (fora deste pack): freehand decree → free_handle. Nao usar `minecraft:villager_v2` direto nem UI do `fv:paper_writable`.

## Item e receita

`va:mining_contract` — crafting_table:

```text
P
A
```

P = wooden_pickaxe (consumida), A = paper. Unlock: paper + wooden_pickaxe.

## Hire (`hire.js`)

1. Dono interact no free_handle adulto com contrato na mainhand.
2. Consome 1 contrato; remove free_handle; spawna `va:villager_miner` na mesma posicao.
3. Tag `va_owner_{player.id}`; nameTag `Minerador de Tunel`; copia `mark_variant` do handle.
4. `va:stay_mode` = false; estado inicial `waiting`.
5. Direcao cardinal do **yaw do jogador** → `va_dir_x` / `va_dir_z`.
6. Hire point e eixo inicial = bloco do spawn (`va_hire_*`, `va_axis_*`).

Mensagem: entregar picareta para iniciar.

## Nao confundir

Picareta entregue ao free_handle continua sendo caminho do Soldiers (`fv:villager_clumper`). O caminho deste addon e exclusivamente o contrato.
