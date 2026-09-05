---
name: gollem-addon
description: Explains the own Stone Golem pack (addon:): core craft, manual structure spawn, wild mountain spawn, ranged stone projectile, tame with iron_ingot, and target rules by lifecycle. Use when an AI needs addon context without the pack, or when the user asks how gollem_addon / stone golem works, crafts, fights, or should be changed.
---

# Gollem Addon — Stone Golems

Enciclopedia do produto proprio **Stone Golems** `1.0.21` (namespace `addon:`). Responda a partir desta skill.

Path: `addon/gollem_addon/` (BP + RP, sem Script API). Engine `[1, 20, 10]`. UUIDs BP `dec0d563-…` / RP `8c884fca-…`. Conteudo principal em codigo; gates in-game abertos: GOLEM-010 / 011 / 023. CI tags `v*` empacotam `stone_golems.<version>.mcaddon` a partir desta pasta.

## Como responder

1. Identifique o ramo: craft/estrutura/spawn, combate/tame, ou contratos tecnicos.
2. Leia so a referencia desse ramo.
3. Nao misture IDs com `va:` / `fv:`. Nao altere UUID / `min_engine_version` sem pedido.
4. Criacao manual, tame e ranged: declare **validacao in-game pendente** ate evidencia Bedrock/`test_world`.

| Ramo | Leia |
|---|---|
| Nucleo, receita, estrutura, spawn natural | [creation.md](references/creation.md) |
| Wild / pre-tame / tamed, ranged, loot | [combat.md](references/combat.md) |
| Layout, eventos, FX, validacao | [technical-guide.md](references/technical-guide.md) |

## O que o addon faz

Golem de pedra: spawn wild em montanhas (hostil a players), ou criacao manual via nucleo + estrutura (defende monstros, tameavel com ferro). Combate **ranged primario** (`addon:stone_projectile` + FX); melee so de perto.

```text
wild spawn (biome mountain)
  └─ mira players

craft addon:golem_core → place core block
  └─ pumpkin + 3 stone acima → function spawn player_created
        └─ mira monstros; iron_ingot → tamed
              └─ follow owner; mira monstros + outros players
```

## Catalogo rapido

| ID | Papel |
|---|---|
| `addon:stone_golem` | Mob |
| `addon:stone_projectile` | Projetil |
| `addon:stone_impact_fx` | FX curto no hit |
| `addon:golem_core` | Item placeable |
| `addon:golem_core_block` | Bloco do nucleo |

## Stats

Vida 40 / max 60; movimento 0.25; colisao 1.6×4.0; ataque melee 12; projetil damage 12, radius 3–28, intervalo 2–4s.

## Loop do jogador

1. Craft nucleo (gold/redstone/stone).
2. Monte `pumpkin` / `SSS` / `C`; interact no core (ou confie no `on_interact` check).
3. Alimente com `iron_ingot` para tame.
4. Alternativa debug: `/summon addon:stone_golem` (wild) ou evento `player_created`.

## Fora do recorte

Sand / Wood / Nether / Crystal / Redstone Golem = Milestone 3+. GOLEM-008/009 polish visual pendente. `golem_anchor` removido em 1.0.19.
