# Contratos tecnicos (RP only)

Caminhos relativos a `addon/FlagBearer/resource_pack/`.

## Layout

```text
resource_pack/
  manifest.json
  blocks.json                 # so dcfb:banner_table
  texts/en_US.lang
  attachables/                # wearable hold
    gonfalon_banner/{gonfalon_equipment,gonfalon_entity}
    guidons/{swallow_tail_*,pear_tail_*}
    knight_bannerets/
    standards/{pear_tail,pennon_tail,rounded_tail}
    sashimono/
  entity/                     # client entities flagpole + banner_table
  models/entity/heraldic_flags/  # geos flagbearer + flagpole
  models/blocks/
  animations/ (+ attachables/)
  textures/entity + textures/items
```

Cada familia tem attachable de **equipment** (item na mao) e attachable/entity de **flagpole**. Geos: `geometry.*_flagbearer` vs `geometry.*_flagpole`.

## Attachable wearable

Exemplo `dcfb:red_gonfalon`: material `entity_alphatest`, geo `geometry.gonfalon_flagbearer`, animacoes `first_person_hold` / `third_person_hold` via `c.is_first_person`.

## Client entity flagpole

Exemplo `dcfb:red_rounded_tail_standard_flagpole`: geo flagpole, `controller.render.armor_stand`, poses (default, solemn, salute, hero, cancan, …) + wiggle — mesmo padrao de armor stand. `enable_attachables: true`, spawn_egg no description.

## Manifest

| Campo | Valor |
|---|---|
| Name | Flagbearer's Banners |
| Header version | `[3, 0, 0]` |
| Module version | `[1, 0, 0]` |
| UUID header | `27dac7c9-9a4e-425d-7317-c71203b724ee` |
| Engine | `[1, 16, 0]` |
| Type | resources only |

Sem dependencia UUID de BP no manifest — o BP esperado nao esta neste repo.

## Limites

- Sem BP: IDs de item/entity/bloco nao tem definicao de comportamento aqui.
- Nao ha recipes, loot, scripts.
- `blocks.json` incompleto vs tiles listados no lang.
- Validacao JSON do RP e possivel; gameplay in-game exige o Behavior Pack original.

## Validacao

```powershell
Get-Content -Raw addon/FlagBearer/resource_pack/manifest.json | ConvertFrom-Json | Out-Null
```

Ao afirmar obtencao/craft: diga que o BP esta ausente neste checkout.
