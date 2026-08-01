# Bedrock Addons Monorepo

Repositorio com varios addons de Minecraft Bedrock. Cada pasta de produto tem Behavior Pack e Resource Pack proprios (quando aplicavel). Nao misture namespaces, UUIDs ou assets entre addons.

## Addons

| Pasta | Produto | Namespace | Engine (manifest) | Status |
|-------|---------|-----------|-------------------|--------|
| [`gollem_addon/`](gollem_addon/README.md) | Stone Golems | `addon:` | `1.20.10+` (v1.0.17) | Ativo; validacao in-game parcial |
| [`villagers_addon/`](villagers_addon/README.md) | Minerador de Tunel | `va:` | `1.21.130+` + Script API (v1.0.0) | MVP em codigo; in-game pendente |
| [`villager_soldiers/`](villager_soldiers/README.md) | Villager Soldiers (terceiros) | `fv:` | `1.21.130+` | Referencia; nao e produto proprio |

Documentacao detalhada de cada addon fica no `README.md` da pasta correspondente.

## Estrutura do repositorio

```text
gollem_addon/          Stone Golems (addon:)
villagers_addon/       Tunnel Miner (va:)
villager_soldiers/     Pack de referencia (fv:)
assets/                Arte/debug fora dos packs do jogo
test_world/            Mundo local de teste
docs/references/       Guidelines e inventarios compartilhados
.github/workflows/     CI (JSON, estrutura, build .mcaddon do golem)
```

## Instalacao (visao geral)

Cada addon se instala copiando o par `behavior_pack/` + `resource_pack/` dele para as pastas do Minecraft Bedrock e ativando os dois no mundo.

Diretorios comuns no Windows:

```text
%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\behavior_packs
%LOCALAPPDATA%\Packages\Microsoft.MinecraftUWP_8wekyb3d8bbwe\LocalState\games\com.mojang\resource_packs
```

Detalhes de uso, receitas e riscos: veja o README do addon.

### Dependencias entre packs

- `gollem_addon` — independente.
- `villagers_addon` — soft-dependencia de **uso** no Villager Soldiers (`fv:villager_free_handle` para contratar). Carrega sozinho, mas o hire do minerador exige o Soldiers ativo.
- `villager_soldiers` — pack de terceiros completo; usar como referencia ou instalar se for jogar com o complemento.

## CI e release

- `validate_json.yml` — valida JSONs nos addons.
- `validate-structure.yml` — manifests de `gollem_addon` e `villagers_addon`.
- `build-mcaddon.yml` — em push na `main` e tags `v*`: gera artifacts `stone_golems` + `villagers_addon`; GitHub Release so em tags.

## Desenvolvimento

Antes de editar, leia:

- [`AGENTS.md`](AGENTS.md) — mapa do monorepo
- [`docs/references/coding-guidelines.md`](docs/references/coding-guidelines.md) — o que pode mudar por tipo de task

Validacao sintatica de JSON (PowerShell), no escopo do addon:

```powershell
Get-ChildItem <addon> -Recurse -Filter *.json |
  Where-Object { $_.FullName -notmatch 'node_modules' } |
  ForEach-Object {
    Get-Content -Raw $_.FullName | ConvertFrom-Json | Out-Null
  }
```

JSON valido nao implica comportamento validado no Bedrock.

## Licenca / terceiros

`villager_soldiers/` e addon de terceiros (AnhemSteve). Licenca/uso comercial nao estao documentados aqui — tratar como referencia ate revisar direitos de uso.
