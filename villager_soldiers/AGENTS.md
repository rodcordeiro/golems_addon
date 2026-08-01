# Villager Soldiers — Documentacao para Agentes

Referencia tecnica do addon **Villager Soldier 2 Version 3.1.4 The Rise** (autor AnhemSteve), usado como base/referencia neste repositorio.

**Caminho:** `villager_soldiers/` (raiz do monorepo)  
**Namespace principal:** `fv:`  
**Ferramentas de origem:** Bridge `2.7.54` + Dash `0.11.7`  
**Alvo Bedrock:** `min_engine_version` `[1, 21, 130]`  
**Script API:** `@minecraft/server` `2.4.0`, `@minecraft/server-ui` `2.0.0`

Politica de alteracao deste pack (referencia de terceiros): ver `../docs/references/coding-guidelines.md` secao 2.2. Regras do monorepo: `../AGENTS.md`.

Este documento descreve como o addon funciona, quais recursos implementa e quais padroes reutilizar ao construir um addon semelhante (ex.: soldados contrataveis a partir de villagers; complemento em `villagers_addon/`).

---

## 1. Visao geral

Addon Bedrock de guerra de faccoes entre **villagers soldados** e **illagers**, com:

- Soldados que nascem em vilas ou sao contratados a partir de `minecraft:villager_v2`
- Sistema de tame (esmeralda), dono, times, ordens e promocao/demissao
- Armas melee/ranged/guns, armaduras custom, golems e armas de cerco
- Worldgen de outposts/clan bases via features + `.mcfunction`
- Logica avancada em **JavaScript Script Module** (nao so JSON data-driven)

E um addon grande e acoplado. Para usar como base, extrair apenas o subconjunto necessario (fluxo hireable soldier) em vez de copiar o pack inteiro.

### Escala aproximada

| Recurso | Contagem |
|---------|----------|
| Entity BP (`behavior_pack/entities/**/*.json`) | ~116 |
| Client entities RP | ~109 |
| Items BP | ~236 |
| Recipes | ~160 |
| Loot tables | ~129 |
| Scripts JS | ~62 |
| Attachables RP | ~99 |
| Features + feature_rules | ~21 cada |
| Spawn rules | 4 |
| Trading tables | 12 |

### Manifests e UUIDs (nao alterar se for empacotar este pack como esta)

| Pack | Header UUID | Version |
|------|-------------|---------|
| Behavior | `85cd420b-b40f-48f3-8b70-bd839b72371d` | `[1, 1, 4]` |
| Resource | `20046f92-e319-4f00-8a3c-2d13ab74f6e9` | `[1, 1, 4]` |

BP modules: `data` + `script` (entry `scripts/main.js`).  
RP module: `resources`, capability `pbr`.  
BP e RP dependem um do outro pelo UUID.

Namespaces secundarios (armas/bows): `snow:`, `flintlock_musket:`, `flintlock_pistol:`, `deadlight_rifle:`, `percussion_cap_musket:`.

---

## 2. Estrutura de pastas

```
villager_soldiers/
  behavior_pack/
    manifest.json
    package.json                 # deps Script API (dev)
    entities/
      soldiers/                  # unidades contrataveis
      worker/                    # healer, builder, clumper, free_handle
      golems/
      illagers/                  # inimigos por bioma + bosses
      weapons/                   # catapult, potato cannons (entidades)
      tools/                     # banners, mounts, merchant summons
      projectile/
    items/
    recipes/
      vanillas/, materials/, furnaces_recipe/, weapons/, golems/, tools/, copper_group/, armors/
    scripts/
      main.js                    # bootstrap
      spawn/, UI/, Items/, function/, customComponents/
    spawn_rules/
    trading/
    loot_tables/
    features/ + feature_rules/
    functions/                   # populate de structures + banner TP
    animations/ + animation_controllers/  # BP-side (weapon mode, stay)
  resource_pack/
    manifest.json
    entity/                      # espelho client das entidades
    models/entity/
    textures/ (+ item_texture.json)
    animations/ + animation_controllers/
    render_controllers/
    attachables/
    texts/                       # en_US, vi_VN, pt_BR, pt_PT
    particles/ + sounds/
```

Estruturas de mundo sao referenciadas como `mystructure:*` via features no BP; templates ficam no RP (quando presentes no pack original).

---

## 3. Como o jogador usa o addon (fluxo de gameplay)

### 3.1 Spawn natural em vilas

1. Vanilla spawna `minecraft:villager_v2` com evento `minecraft:spawn_from_village`.
2. Script `scripts/spawn/SpawnSoldier.js` escuta `world.afterEvents.dataDrivenEntityTrigger`.
3. Spawna perto um de: `fv:villager_vanguard` ou `fv:villager_ranged` (posicao segura: air + chao, evita bed/carpet/slab).

Paralelo com iron golem:

1. `minecraft:iron_golem` com evento `minecraft:from_village`.
2. `SpawnSoldierFromGolem.js` spawna `fv:hay_golem` ou `fv:villager_clan_leader`.

### 3.2 Contratacao a partir de villager (Freehand Decree)

Item central: `fv:freehand_decree`.

**Como obter o decreto:**

1. Craft/obter `fv:paper_writable`.
2. Usar o item → UI (`PaperWritable.js`) oferece escolher Freehand Decree ou Discharge Letter.

**Conversao (duas vias de script + custom component):**

| Acao | Profissao (type_family) | Resultado |
|------|-------------------------|-----------|
| Interact com decreto | `fletcher` | `fv:villager_ranged` |
| Interact com decreto | `weaponsmith` | `fv:villager_tanker` |
| Interact com decreto | `cleric` | `fv:villager_healer` |
| Interact com decreto | outras (nao nitwit/unskilled) | `fv:villager_free_handle` |
| Hit com decreto | `nitwit` / `unskilled` | `fv:villager_free_handle` |
| Hit com decreto | `weaponsmith` / `fletcher` | tanker / ranged (custom component) |
| Hit com decreto | `cleric` | `fv:villager_healer` |

Biome e preservado via `minecraft:mark_variant` → spawnEvent `fv:plains|desert|jungle|savanna|snow|swamp|taiga` (indice 0–6).  
Babies sao ignorados. O villager original e removido e a nova entidade e spawnada no mesmo lugar.

Arquivos: `scripts/function/villagerFreeHandle.js` + `scripts/customComponents/freeHandleDecree.js` (`fv:freehand_hit_event`).

### 3.3 Tame, dono e comando

1. **Tame:** alimentar com `emerald` (`minecraft:tameable`, probabilidade 0.4) → evento `tamed` → `minecraft:is_tamed` + property `fv:tamed: true`.
2. **Dono:** usar `fv:identification_soldier_card` no soldado tamed (`identificationOwner.js`) → tag `owner_{name}_{id}` e rename.
3. **Modos:** segurar `fv:command_flag` e interagir → ModalForm (`soldierAction.js`) seta:
   - `fv:stay_mode` (ficar parado; overlay `stay_statue` no client)
   - `fv:kill_player_mode` (alvo PvP; overlay `target` no client)
4. **Times:** `fv:team_book_*` (14 cores) + horns:
   - `fv:team_call_horn` — recall/teleporte
   - `fv:team_attack_horn` — ordem de ataque
   - `fv:team_stand_horn` — stand
5. **Promocao:** `fv:league_medal` (interact) → transforma em `fv:villager_league_soldier` (e variantes elite).
6. **Demissao:** `fv:discharge_letter` → evento `become_villager` (volta a villager vanilla via transformation).

### 3.4 Fluxo resumido

```
minecraft:villager_v2
  ├─ village event ──script──> fv:villager_vanguard | fv:villager_ranged
  └─ freehand_decree ──script──> ranged | tanker | healer | free_handle
        └─ emerald tame ──> is_tamed
              ├─ identification_soldier_card ──> owner tag
              ├─ command_flag / team books / horns ──> ordens
              ├─ league_medal ──> league soldier
              └─ discharge_letter ──> villager
```

---

## 4. Entidades de soldados e workers

### 4.1 Soldados (`entities/soldiers/`)

| Identifier | Papel |
|------------|-------|
| `fv:villager_vanguard` | Defensor melee (spear default); spawn de vila |
| `fv:villager_ranged` | Arqueiro; spawn de vila / fletcher |
| `fv:villager_tanker` | Tank pesado; weaponsmith |
| `fv:villager_gunner` | Soldado com arma de fogo |
| `fv:villager_cavalry` | Montado (cavalo) |
| `fv:villager_camel` | Montado (camelo) |
| `fv:villager_champion` | Elite; promocao para swordthane com gear diamet + medal |
| `fv:villager_clan_soldier` | Infantaria de clan por bioma |
| `fv:villager_clan_leader` | Lider de clan (trade + combate) |
| `fv:villager_league_soldier` | Exercito da League |
| `fv:villager_league_swordthane` | Elite melee League |
| `fv:villager_league_general` | Comandante League |
| `fv:copy_past` | Template utilitario |

### 4.2 Workers (`entities/worker/`)

| Identifier | Papel |
|------------|-------|
| `fv:villager_free_handle` | Conversao generica (nitwit/unskilled/outros) |
| `fv:villager_healer` | Cleric convertido |
| `fv:villager_builder` | Construtor; trades de estruturas/catapult |
| `fv:villager_clumper` | Worker de mineracao/ore |

### 4.3 Padrao de entity BP (contrato reutilizavel)

Properties tipicas (client_sync):

- `fv:tamed`, `fv:stay_mode`, `fv:kill_player_mode`
- opcionais: `fv:level`, `fv:dadinhdanh`, `fv:cavalry_random_skin`

Component groups tipicos:

- **Combate:** `minecraft:melee_attack`, `axe_attack`, `spear_attack` (`use_kinetic_weapon`), `pike_attack`, `halberd_attack`, `ranged_attack` — cada um seta `minecraft:variant` (1–6) para o client escolher animacao
- **Biome:** `desert_villager` … `taiga_villager` — seta `mark_variant` 0–6 + equipment loot
- **Vila:** `defender` (`minecraft:dweller` role defender)
- **Tame:** `tame` → `tamed` (follow_owner, owner_hurt_*)
- **Transform:** `become_villager`, `become_league_soldier`, `become_cavalry`, etc.

Eventos chave:

- `minecraft:entity_spawned` / `minecraft:spawn_from_village` / `minecraft:entity_transformed`
- `tamed`, `sword`/`axe`/`spear`/`pike`/`halberd`
- Interact filters em `minecraft:interact` para `fv:discharge_letter`, `fv:league_medal`, banners

`format_version` das entities: `"1.21.130"`.

### 4.4 Outros catalogs (resumo)

- **Golems:** `fv:iron_golem_guard`, `fv:hay_golem`, `fv:melon_golem`, `fv:bamboo_turret`, `fv:copper_watcher`, `fv:shooter`, `fv:rock_tortois` — craft ritual via script (abobora + blocos) ou items placeable
- **Illagers:** dezenas de variantes por bioma + bosses (`fv:illager_generalissimo`, generals, gunners, cavalry, undead)
- **Weapons entities:** `fv:catapult`, `fv:potato_cannon`, `fv:big_potato_cannon`
- **Projectiles:** arrows, bullets, javelins, cannon balls, bombs
- **NPC especiais:** `fv:mysterious_merchant`, `fv:miner_trader`

---

## 5. Resource Pack — contrato client

### 5.1 Geometrias base

| Geometry | Uso |
|----------|-----|
| `geometry.villager_handle` | Corpo villager com acessorios/cape |
| `geometry.repillager` | Corpo proporcao pillager (mais leve) |
| `geometry.fv_villager_armors` | Overlay de armadura por bioma |
| `geometry.tamed_color` / `wrist_belt` / `stay_statue` / `target` | Estados hireable |
| `geometry.soldier_horse` / `soldier_camel` | Cavalaria |
| `geometry.64_item_size` | Armas em attachables |

### 5.2 Biome via `mark_variant` (ordem fixa)

Indice 0–6 deve bater entre BP e RP:

`plains`, `desert`, `jungle`, `savanna`, `snow`, `swamp`, `taiga`

Controller: `controller.render.vanilla.biome` em `render_controllers/vanilla.json`.

### 5.3 Combate via `query.variant`

| variant | Animacao |
|---------|----------|
| 1 | melee hand |
| 2 | sword/axe |
| 3 | melee spear |
| 4 | halberd |
| 5 | spear (vindicator controller) |
| 6 | bow |

Root compartilhado: `controller.animation.fv_pillager.root`.

### 5.4 Hireable overlays (client)

```
query.is_tamed                         → controller.render.tamed_color
query.is_sitting                       → wrist_belt
query.property('fv:stay_mode')         → stay_statue
query.property('fv:kill_player_mode')  → target marker
```

Soldados: `enable_attachables: true`; muitos usam `hide_armor: true` e armadura custom via attachables ou geo overlay.

### 5.5 Textos

Padroes em `texts/*.lang`:

- `entity.fv:<id>.name`
- `item.spawn_egg.entity.fv:<id>.name`
- `item.fv:<id>=...`
- `action.interact.hire`, `becomeleague`, `cavalry`, `gunpower.load`, etc.

Idiomas: `en_US`, `vi_VN`, `pt_BR`, `pt_PT`.

---

## 6. Scripts — como foi criado e como funciona

### 6.1 Bootstrapping

- `manifest.json` declara module `script` com `entry: "scripts/main.js"`.
- `package.json` lista `@minecraft/server` e `@minecraft/server-ui` para tipagem/IDE (node_modules presente).
- `main.js` apenas **importa side-effect modules** e roda um `system.runInterval` (10 ticks) que marca entidades com HP <= 50% com tag `lowHP`.

Padrao de autoria observado:

1. Cada feature vira um arquivo JS que se registra no import.
2. Custom item behaviors usam `system.beforeEvents.startup` → `itemComponentRegistry.registerCustomComponent`.
3. Eventos de mundo usam `world.afterEvents.*`.
4. Mutacoes a partir de callbacks read-only sao adiadas com `system.run(...)`.
5. Comentarios misturam vietnamita/ingles; ha arquivos de debug (`test.js`, `kiemtra.js`) nao importados ou comentados.
6. UI usa `@minecraft/server-ui` (`ModalFormData`, `ActionFormData`) — API v2 com `{ defaultValue }` nos toggles.

### 6.2 Mapa de scripts (por pasta)

| Pasta / arquivo | Responsabilidade |
|-----------------|------------------|
| `spawn/SpawnSoldier.js` | Defensores de vila a partir de villager |
| `spawn/SpawnSoldierFromGolem.js` | Hay golem / clan leader a partir de iron golem |
| `function/villagerFreeHandle.js` | Conversao por interact/hit com decreto |
| `customComponents/freeHandleDecree.js` | Hit component `fv:freehand_hit_event` |
| `Items/PaperWritable.js` | UI decreto / discharge letter |
| `UI/soldierAction.js` | UI stay / kill player mode |
| `UI/ironGolemGuradAction.js` | UI do iron golem guard |
| `function/identificationOwner.js` | Card de dono |
| `function/teamSelecTable.js` | Team books (14 cores) |
| `Items/Team*Horn.js` | Ordens de esquadra |
| `function/ironGolemGuardCraft.js` | Ritual abobora + 2 iron blocks |
| `function/hayGolemCraft.js` | Ritual abobora + hay |
| `function/shootCannon.js` / `shootBigCannon.js` / `shootCatapult.js` | Cerco via `scriptEventReceive` |
| `Items/Flintlock*.js`, `PercussionCapMusket.js`, `DeadlightRifle.js`, `GoldenReaper.js` | Guns (use/reload) |
| `customComponents/{spear,pike,lance,saber,hammer,javelin,...}.js` | Armas especiais |
| `function/villagerTankerLevelUp.js` | XP/level do tanker em kill |
| `function/makingProduction.js` | Miner refine (`fv:refine_inventory`) |
| `function/playerTagNoDamage.js`, `plusArmorsFunction.js`, `tagArmorFunction.js` | Regras de dano/time/armadura |
| `function/checkday.js` | Logica dia/noite em spawn |
| `function/parachute.js` | Item paraquedas |

### 6.3 Padroes Script API a copiar

```js
// Custom component (item)
system.beforeEvents.startup.subscribe((e) => {
  e.itemComponentRegistry.registerCustomComponent("fv:meu_comp", { onUse(ev) { ... } });
});

// Conversao segura (snapshot + system.run)
const pos = { ...target.location };
const dim = target.dimension;
const biomeEvent = getBiomeEventFromMarkVariant(target);
system.run(() => {
  if (target.isValid) target.remove();
  dim.spawnEntity("fv:soldado", pos, { spawnEvent: biomeEvent });
});

// Hook em evento data-driven vanilla
world.afterEvents.dataDrivenEntityTrigger.subscribe(({ eventId, entity }) => {
  if (eventId === "minecraft:spawn_from_village" && entity.typeId === "minecraft:villager_v2") { ... }
});
```

**Risco:** ha caminhos duplicados para o mesmo decreto (interact script + hurt script + custom component onHit). Ao portar, unificar em um unico fluxo.

---

## 7. Itens importantes (gestao militar)

| Item | Funcao |
|------|--------|
| `fv:paper_writable` | UI → cria decreto ou discharge |
| `fv:freehand_decree` | Converte villager → soldado/worker |
| `fv:discharge_letter` | Demove soldado → villager |
| `fv:identification_soldier_card` | Bind owner |
| `fv:command_flag` | Abre UI de modos |
| `fv:league_medal` | Promove para League |
| `fv:league_general_badge` | Badge de general |
| `fv:{biome}_clan_medal` | Medalhas de clan |
| `fv:team_book_<cor>` | Atribui time |
| `fv:team_call_horn` / `attack` / `stand` | Ordens |
| `fv:melee_banner_tp` / `ranged` / `clumper` | Teleporte/rally por tipo |

Categorias amplas de items:

- **Materiais:** `fv:steel_ingot`, `fv:diamet_ingot`, `fv:illasteel_ingot`, `fv:illudiamondite_ingot`, `fv:diamorite_ingot`, `fv:imperial_forge_ingot`, `fv:heart_of_stone`
- **Armas:** saber, pike, halberd, hammer, lance, javelin, battle_axe, desert_sword, giant_sword, boss weapons — escada wooden→netherite + ligas custom
- **Guns:** flintlock musket/pistol, percussion cap musket, deadlight rifle, golden reaper + `fv:bullet` / `fv:cartridge`
- **Armaduras:** steel, illasteel, illudiamondite, diamet, diamorite, imperial commander/warlord, tanker sets
- **Golems placeable:** melon, bamboo turret, copper watcher, shooter, catapult, potato cannons
- **Mounts:** `fv:baby_steed`, `fv:steed_saddled`, camel war baby/saddled

Nao ha arquivos dedicados de spawn egg para todos; alguns summons usam `spawn_egg` vanilla com `set_actor_id` em trades.

---

## 8. Receitas

~160 JSONs em `behavior_pack/recipes/`:

| Pasta | Conteudo |
|-------|----------|
| `vanillas/` | Steel tools/armor, `fv:long_stick`, diamet sword basico |
| `materials/` | Ligas (ex.: diamorite = 8 diamet + netherite_scrap) |
| `furnaces_recipe/` | Smelting steel / nuggets |
| `weapons/` | Families por tipo (~102 arquivos); `league_items/`, `illagers/`, `boss_weapons/` |
| `golems/` | Melon golem, bamboo turret, etc. |
| `tools/` | Horns, ID card, bullet, paper_writable |
| `copper_group/` | Shield, boom, wrench |
| `armors/` | Sets custom |

Escada tipica de material de arma:

`wood/stone/copper/iron/steel/diamond/netherite` + `diamet` / `illasteel` / `illudiamondite` / `diamorite`.

Ao adicionar arma nova: criar item BP + recipe + attachable RP + textura em `item_texture.json` + lang + (se mob usar) loot/equipment table.

---

## 9. Spawn, worldgen, trading, loot

### Spawn rules (naturais)

| Entity | Onde |
|--------|------|
| `fv:mysterious_merchant` | Overworld surface, luz 7–15, raro |
| `fv:miner_trader` | Underground em stone-like |
| `fv:mummy` | Desert night |
| `fv:villager_skeleton` | Monster biomes / soulsand valley |

Soldados e illagers de faccao entram principalmente por **script de vila** e **features/structures**, nao por spawn_rules.

### Features

IDs `fv:illager_*_boss/outpost`, `fv:villager_league_*`, `fv:mainboss`, etc.  
Feature rules: surface, filtro de bioma, `scatter_chance` baixo.  
Populate: `behavior_pack/functions/*.mcfunction` summona tropas dentro da structure.

### Trading

- Clan leaders: `trading/clan_leaders/{biome}_clan.json`
- Mysterious merchant: `good/better/best`
- Miner trader, builder trade (catapult structure, spawn eggs)

### Loot

- `loot_tables/entities/` — gear por bioma/role (clan, league, cavalry, illagers)
- `loot_tables/chest/` — baus de structures
- `loot_tables/lucky_chest/` — chests sortidos

---

## 10. Blueprint minimo: "soldado contratavel"

Para um agente criar um addon enxuto inspirado neste:

### Behavior Pack

1. Entity `addon:meu_soldado` com properties `tamed`, `stay_mode` (client_sync).
2. Component groups: combate + `tame`/`tamed` (emerald) + biome opcional.
3. Item `addon:hire_contract` + script que:
   - escuta interact em `minecraft:villager_v2`
   - remove villager e spawna soldado com spawnEvent de bioma
4. Item `addon:discharge` + evento `become_villager` (ou script inverso).
5. Opcional: `command_flag` + ModalForm para stay mode.
6. Script module no manifest + deps `@minecraft/server` / `@minecraft/server-ui`.

### Resource Pack

1. Client entity espelhando o ID.
2. Geometry base (villager ou custom) + texture(s).
3. Se multi-bioma: 7 texturas + `controller.render` por `mark_variant`.
4. Overlay tamed/stay se usar as mesmas properties.
5. Animacao: humanoid vanilla ou root proprio; `query.variant` se multi-arma.
6. Lang + `item_texture.json`.

### Nao copiar de inicio

- Illager faction war completa
- Guns/siege/golems
- Team books 14 cores + horns
- Worldgen de outposts
- Escada inteira de materiais custom

---

## 11. Checklist de coerencia BP ↔ RP

Ao portar ou estender:

- [ ] Mesmo `identifier` em entity BP e client entity RP
- [ ] `mark_variant` 0–6 alinhado com array de texturas
- [ ] `variant` de combate alinhado com controllers de animacao
- [ ] Properties `client_sync` usadas em `query.property` no RP
- [ ] Items referenciados em interact/tame existem e tem textura/lang
- [ ] Custom components registrados no script e declarados no item JSON (`minecraft:custom_components`)
- [ ] UUIDs BP/RP cruzados nos manifests
- [ ] `min_engine_version` e format_version das entities compativeis (aqui 1.21.130)
- [ ] Scripts: mutacoes dentro de `system.run`; checar `entity.isValid`

---

## 12. Riscos e limitacoes conhecidas

- Addon de terceiros (AnhemSteve); licenca/uso comercial nao documentados neste repo — tratar como referencia.
- Comentarios e UI strings parcialmente em vietnamita; typos em chaves lang (`buttom.*`, `cancle`).
- Duplicacao de logica de conversao (tres caminhos para freehand decree).
- `SpawnSoldierFromGolem.js` comentario diz villager mas filtra `minecraft:iron_golem`.
- Escala grande: validar JSON nao implica validar comportamento in-game.
- Dependencia forte de Script API 2.4.0 — APIs antigas (`worldInitialize`) ja foram migradas para `system.beforeEvents.startup` em varios arquivos.
- Capabilities `pbr` no RP; ambientes sem PBR podem ignorar texture sets.
- Integracao com `golems_addon` principal (`addon:` namespace): audit de colisao de UUIDs/IDs obrigatoria antes de merge.

---

## 13. Validacao sugerida

```powershell
# Na pasta villager_soldiers
Get-ChildItem -Recurse -Filter *.json |
  Where-Object { $_.FullName -notmatch 'node_modules' } |
  ForEach-Object {
    Get-Content -Raw $_.FullName | ConvertFrom-Json | Out-Null
  }
```

Testes manuais prioritarios in-game:

1. Spawn perto de vila → aparecem vanguard/ranged.
2. Paper writable → freehand decree → converter fletcher/weaponsmith/cleric/nitwit.
3. Emerald tame → ID card → command flag UI.
4. League medal / discharge letter.
5. Client: textura de bioma + overlays tamed/stay.

---

## 14. Arquivos ancora (leitura prioritaria)

| Arquivo | Por que |
|---------|---------|
| `behavior_pack/manifest.json` | UUIDs, script entry, deps |
| `behavior_pack/scripts/main.js` | Mapa de features carregadas |
| `behavior_pack/scripts/spawn/SpawnSoldier.js` | Spawn natural |
| `behavior_pack/scripts/function/villagerFreeHandle.js` | Contratacao |
| `behavior_pack/scripts/customComponents/freeHandleDecree.js` | Hit-to-hire |
| `behavior_pack/scripts/Items/PaperWritable.js` | Craft UI de decretos |
| `behavior_pack/scripts/UI/soldierAction.js` | Modos do soldado |
| `behavior_pack/entities/soldiers/villager_vanguard.json` | Template completo de soldado |
| `resource_pack/entity/soldiers/` | Contrato visual |
| `resource_pack/render_controllers/vanilla.json` | Biome/variant switching |
| `resource_pack/texts/en_US.lang` | Nomes e interact strings |

---

*Documento gerado para agentes trabalharem sobre este pack como base. Comportamento in-game do pack original nao foi revalidado nesta sessao; trate fluxos complexos (guns, worldgen, bosses) como nao verificados ate teste no Bedrock.*
