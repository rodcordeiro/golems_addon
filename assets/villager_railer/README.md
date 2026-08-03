# Villager Railer — assets de conceito

## UV correto

A entity usa **`geometry.villager_handle`** (igual `fv:villager_clumper` / miner), atlas **64×64**.

**Nao** abrir a PNG em editores de skin de jogador (Steve/Alex). O layout Steve (Head/Hat/Body/R.Arm/…) e outro mapa UV — o preview fica “quebrado”.

## Biomas

Pack: `villagers_addon/resource_pack/textures/entity/villager_railer/{plains,desert,jungle,savanna,snow,swamp,taiga}.png`

DNA railer (vs clumper / miner): bone de couro + oculos de aco, avental couro, gema/alavanca redstone, hash de trilho nos bracos, caneleiras de aco.

## Arquivos

| Arquivo | Uso |
|---------|-----|
| `villager_railer_concept.pen` | Board Pencil |
| `ref_clumper_*.png` | Referencia Soldiers |
| `railer_{biome}.png` | Copias de trabalho |
| `villager_railer_*_preview.png` | Preview frontal |
| `villager_railer_preview_strip.png` | Todos os biomas |
| `_make_railer_tex.py` | Regenera os 7 biomas |
