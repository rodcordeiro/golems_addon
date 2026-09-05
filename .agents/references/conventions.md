# Convencoes de mudanca e validacao

1. Fixe addon alvo e tipo da task antes de editar.
2. Preserve namespaces: `addon:`, `va:` e `fv:` nao sao intercambiaveis.
3. Mantenha o contrato BP/RP: identifiers, models, animacoes, controllers, texturas e lang devem resolver dentro do mesmo addon.
4. Nao altere UUIDs ou `min_engine_version` sem solicitacao explicita, compatibilidade e rollback documentados.
5. Apos mudanca funcional, incremente BP e RP juntos e alinhe dependencias cruzadas.
6. Em Script API, adie mutacoes de callbacks read-only com `system.run(...)` e valide `entity.isValid`.
7. Item vanilla usa `minecraft:<stem>`; confirme o stem em `docs/references/minecraft-textures.md`.
8. Nao mova assets de referencia para packs sem confirmar formato, path e referencias JSON.
9. Valide JSON e estrutura no escopo. Registre separadamente qualquer ausencia de teste Bedrock.

O detalhamento normativo por tipo de task permanece em `docs/references/coding-guidelines.md`.
