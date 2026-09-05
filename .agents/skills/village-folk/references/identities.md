# Nomes e profissoes

## NameTag do villager

Formato de duas linhas:

```text
§<cor_profissao><Nome>
§7<Label>  <simbolo> §<cor_mood><Mood>
```

Exemplo: nome verde `Aldric`, segunda linha `Farmer  ✦ Happy`.

## Persistencia do nome

Dynamic property `vf_name` na entidade.

| Situacao | Acao |
|---|---|
| Sem `vf_name` | Sorteia nome unico, grava, monta nameTag |
| nameTag limpo diferente de `vf_name` | Assume rename (name tag do jogador); atualiza `vf_name` e remonta |
| Mesmo nome | So atualiza cor/label/mood no nameTag |

`stripColor` remove `§` codes e pega so a primeira linha. Nomes usados sao coletados em overworld, nether e the_end (villagers + wanderers). Se o pool acabar: composto `NomeA NomeB`.

Pool: `boyNames` + `girlNames` em `names.js` (classicos, fantasy, medieval, modernos). Lista unica exportada como `villagerNames`.

## Profissoes

Detectadas por `entity.matches({ families: [key] })`. Changelog 1.2.0: funciona com villagers custom que usem as mesmas families.

| Family | Label | Cor (§) |
|---|---|---|
| farmer | Farmer | a (verde) |
| fisherman | Fisherman | b (aqua) |
| shepherd | Shepherd | d (rosa) |
| fletcher | Fletcher | e (amarelo) |
| librarian | Librarian | 9 (azul) |
| cartographer | Cartographer | 3 (dark aqua) |
| cleric | Cleric | 5 (roxo) |
| armorer | Armorer | 7 (cinza) |
| weaponsmith | Weaponsmith | c (vermelho) |
| toolsmith | Toolsmith | 6 (ouro) |
| butcher | Butcher | 4 (dark red) |
| leatherworker | Leatherworker | 8 (dark gray) |
| mason | Mason | f (branco) |
| nitwit | Nitwit | 2 (dark green) |
| *(nenhuma)* | Unemployed | 7 |

## Wandering Trader

Tipo `minecraft:wandering_trader`. Nome de pool proprio (`wandererNames`, ~30). NameTag:

```text
§b§l<Nome>
§3Wandering Trader  <mood>
```

Mesma regra de `vf_name` / rename.

## Atualizacao

Intervalo de 100 ticks (~5s) renomeia todos villagers/wanderers nas tres dimensoes (mood e label atualizados). Spawn (`entitySpawn`) aplica imediatamente.
