---
name: flag-bearer
description: Explains Flagbearer's Banners (dcfb) catalog: gonfalons, guidons, bannerets, standards, sashimono, colors, wearable flags vs flagpole entities, and banner table. Use when an AI needs addon context without the pack, or when the user asks what FlagBearer flags exist, how they look, or how IDs are named.
---

# Flagbearer's Banners

Enciclopedia do pack **Flagbearer's Banners** (RP header `3.0.0`, modulo `1.0.0`). Tagline: "Raise the banner to represent your Faction!". Responda a partir desta skill.

Snapshot critico: neste monorepo so existe `addon/FlagBearer/resource_pack/`. **Nao ha Behavior Pack** — itens, blocos, entities BP, recipes e scripts de obtencao **nao estao no checkout**. O que segue e o catalogo client-side (attachables, client entities, langs, models). Sem BP, o pack RP sozinho nao e jogavel. Sem teste Bedrock, declare **validacao in-game pendente**.

Namespace `dcfb:`. Engine RP `min_engine_version` `[1, 16, 0]`. UUID RP header `27dac7c9-9a4e-425d-7317-c71203b724ee`. Autor/licenca nao documentados no manifest.

## Como responder

1. Identifique o ramo: familia de bandeira, cor, wearable vs flagpole, ou limites do checkout.
2. Leia [catalog.md](references/catalog.md) para IDs; [technical-guide.md](references/technical-guide.md) para estrutura RP.
3. Padrao de ID: `dcfb:{color}_{shape}` (item wearable) e `dcfb:{color}_{shape}_flagpole` (entidade plantada / spawn egg no lang).
4. Nao invente receitas — nao ha JSON de recipe neste checkout.

## O que o addon representa

Sistema heraldico de bandeiras: **segurar** (attachable first/third person) e **plantar** (client entity estilo armor stand com poses). 16 cores dye × varias silhuetas medievais / sashimono. Tambem Banner Table, Flagpole Stick/Block e blocos de guidon swallow-tail (so nomes no lang; BP ausente).

```text
item dcfb:{color}_{familia}     ──> attachable (flagbearer hold)
entity dcfb:{color}_{familia}_flagpole ──> client entity plantada + poses
```

## Familias (16 cores cada)

| Familia (lang category) | Stem do ID | Papel |
|---|---|---|
| War Banners | `{color}_gonfalon` | Gonfalon |
| Rally Flags | `{color}_swallow_tail_guidon` | Guidon swallow-tail (+ tiles `*_flag`) |
| (pear guidon) | `{color}_pear_tail_guidon` | Guidon pear-tail |
| Knight's Banneret | `{color}_banneret` | Banneret |
| Lord's Pear-Tail Standards | `{color}_pear_tail_standard` | Standard |
| Noble's Pennon-Tail Standards | `{color}_pennon_tail_standard` | Standard |
| Retainer's Rounded-Tail Standards | `{color}_rounded_tail_standard` | Standard |
| Feudal Rectangle Sashimono | `{color}_rectangle_sashimono` | Sashimono |
| Feudal Square Sashimono | `{color}_square_sashimono` | Sashimono |

Cores: `black`, `blue`, `brown`, `cyan`, `dark_green`, `gray`, `green`, `light_blue`, `light_gray`, `magenta`, `orange`, `pink`, `purple`, `red`, `white`, `yellow`.

Extras: `dcfb:flagpole_stick`, `dcfb:flagpole_block`, `dcfb:banner_table`, tiles `dcfb:{color}_swallow_tail_guidon_flag`.

## Loop esperado (documental)

Com BP completo (ausente aqui): craft/obter bandeira → segurar como item → ou spawnar flagpole. Poses da flagpole reusam controllers de armor stand (solemn, salute, hero, …). Neste checkout so se pode afirmar arte/IDs do RP.

## Fora do recorte

Sem BP: sem manifests de comportamento, recipes, loot ou scripts. Nao afirme craft, dano, ou spawn rules. Pack de terceiros incompleto no monorepo.
