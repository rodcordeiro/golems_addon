# AGENTS.md — villagers_addon

Addon proprio em construcao para complementar `villager_soldiers` (namespace `fv:`). Nao substitui o pack de terceiros.

## Ponteiros

- Monorepo: `../AGENTS.md`
- Regras de alteracao: `../docs/references/coding-guidelines.md` (secao 2.3)
- Ideia atual: `docs/IDEIA_MINERADOR.md`
- Referencia tecnica: `../villager_soldiers/AGENTS.md`

## Estado

Em ideacao / ainda sem Behavior Pack e Resource Pack implementados. Ao scaffoldar:

1. Escolher e registrar namespace proprio (sugerido: `va:`).
2. Nao reutilizar UUIDs de `gollem_addon` nem de `villager_soldiers`.
3. Extrair padroes do Villager Soldiers; nao copiar o pack inteiro.
4. Auditar colisao de IDs com `fv:` e `addon:` antes de merge/uso conjunto.
