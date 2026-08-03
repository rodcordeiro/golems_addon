# AGENTS.md — villagers_addon

Addon proprio que complementa `villager_soldiers` (namespace `fv:`). Nao substitui o pack de terceiros.

## Ponteiros

- Monorepo: `../AGENTS.md` / `../README.md`
- README deste addon: `README.md`
- Regras: `../docs/references/coding-guidelines.md` (secao 2.3)
- Backlog: `docs/backlog.md`
- Ideia (miner): `docs/IDEIA_MINERADOR.md`
- Ideia (railer): `docs/IDEIA_RAILER.md`
- Referencia: `../villager_soldiers/AGENTS.md`

## Estado

- Namespace `va:`, versao packs `1.0.2`, `min_engine_version` `[1, 21, 130]`
- MVP + Milestone 2 (MINER-012..016) em codigo; **revalidar in-game** (incl. MINER-010)
- Soft-dependencia de uso: Villager Soldiers (`fv:villager_free_handle`)
- Scripts: `main`, `common`, `hire`, `minerInteract`, `minerLoop`, `deposit`, `tunnelBanner`

## Ao editar

1. Manter IDs `va:` sem colidir com `fv:` / `addon:`.
2. Nao editar arquivos dentro de `villager_soldiers/`.
3. BP + RP: incrementar versao igualmente apos mudanca funcional.
4. Scripts: mutacoes em `system.run`; checar `entity.isValid`.
5. Declarar riscos se faltar teste Bedrock.
