# Divida tecnica e riscos

## Gaps ativos

- Stone Golems: criacao survival, spawn natural, tame/dono, ranged e FX ainda possuem gates in-game abertos no backlog.
- Minerador de Tunel: retomada, Milestone 2, tochas e command flag estao implementados, mas aguardam validacao in-game; o icone final da flag permanece pendente.
- Villager Soldiers: licenca e uso comercial nao estao documentados; tratar como referencia.
- CI valida sintaxe/estrutura, mas nao executa o Bedrock nem cobre integralmente referencias semanticas BP/RP.
- O code graph Nero gerado em 2026-08-26 retornou zero nos/arestas para este checkout; nao usar esse resultado como prova de ausencia de dependencias em JSON/JavaScript Bedrock.

## Prioridade operacional

1. Fechar gates in-game existentes antes de afirmar release funcional.
2. Corrigir drift entre README/backlog/manifests quando detectado, sem alterar regra de negocio por inferencia.
3. Melhorar validacao semantica BP/RP apenas em task propria; nao ampliar uma feature local para CI/infra.
