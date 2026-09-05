# Padroes locais

## Isolamento por addon

Packs independentes preservam namespace, UUIDs, versoes e assets. Referencias de outro addon devem ser reimplementadas com IDs proprios quando o usuario autorizar a feature.

## Contrato BP/RP

Uma entidade nova ou alterada deve ser rastreada do Behavior Pack ao client entity, geometry, animations, animation controllers, render controllers, textures e lang aplicaveis. Itens/blocos devem manter recipes, atlas e textos coerentes.

## Validacao em camadas

1. Parse JSON no addon alvo.
2. Verifique manifests e referencias BP/RP.
3. Execute checks equivalentes aos workflows quando aplicavel.
4. Valide comportamento no Bedrock/test world para fechar gates funcionais.

## Scripts do Minerador

`main.js` registra os fluxos de hire, interact e loop. Mutacoes acionadas por eventos devem respeitar o contexto read-only; estado persistente usa tags/dynamic properties e deve manter ownership e retomada coerentes.
