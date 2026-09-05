# Spec - Contrato de contexto e onboarding para agentes

Status: pronta para implementacao

## Problem Statement

Agentes que iniciam trabalho neste monorepo precisam descobrir rapidamente qual addon esta no escopo, quais arquivos constituem seu contrato Bedrock e quais validacoes realmente comprovam a mudanca. O contexto anteriormente concentrado no `AGENTS.md` raiz misturava mapa do repositorio, regras detalhadas, riscos e estado de produto, aumentando o custo de leitura e o risco de aplicar regras de um pack em outro.

Isso e especialmente perigoso porque o monorepo contem dois produtos proprios e um addon de terceiros, com namespaces, UUIDs, versoes, assets e responsabilidades diferentes. Uma validacao JSON bem-sucedida tambem pode ser confundida com prova funcional no Minecraft Bedrock.

## Solution

Adotar um contrato de contexto para agentes com o `AGENTS.md` raiz enxuto, usado como indice operacional, e referencias de responsabilidade unica sob `.agents/references`.

Um agente recem-iniciado deve conseguir, usando somente esse ponto de entrada:

- identificar o addon alvo e seu ownership;
- carregar apenas as referencias necessarias para a tarefa;
- preservar isolamento de namespace, UUID, versao e assets;
- distinguir produto proprio de referencia de terceiros;
- selecionar validacao estatica, estrutural e in-game proporcional ao risco;
- consultar knowledge operacional pelo projeto Nero correto;
- reconhecer quando o code graph nao cobre os arquivos do checkout.

## User Stories

1. Como agente de implementacao, quero identificar o addon alvo antes de editar, para nao ampliar o escopo acidentalmente.
2. Como mantenedor, quero que cada task de produto tenha um unico addon alvo, para preservar isolamento entre packs.
3. Como agente, quero distinguir Stone Golems, Minerador de Tunel e Villager Soldiers, para aplicar regras compativeis com o ownership.
4. Como mantenedor, quero que Villager Soldiers seja explicitamente tratado como software de terceiros, para evitar reescrita ou publicacao indevida.
5. Como agente, quero conhecer os namespaces `addon:`, `va:` e `fv:`, para evitar colisoes de identifiers.
6. Como agente, quero localizar rapidamente os manifests e entrypoints de cada produto, para iniciar a analise na fronteira correta.
7. Como agente, quero saber quando ler estrutura, runtime, dominio, convencoes, padroes e divida tecnica, para reduzir carga de contexto.
8. Como mantenedor, quero detalhes operacionais fora do `AGENTS.md` raiz, para manter o ponto de entrada curto e estavel.
9. Como agente, quero encontrar as regras normativas locais de coding, para nao depender de convencoes inferidas.
10. Como agente, quero consultar o inventario de texturas vanilla antes de criar IDs ou assets, para nao inventar stems invalidos.
11. Como mantenedor, quero que alteracoes funcionais mantenham versoes BP e RP alinhadas, para preservar o contrato de instalacao.
12. Como mantenedor, quero impedir alteracoes nao autorizadas de UUID e `min_engine_version`, para reduzir incompatibilidade com mundos existentes.
13. Como agente, quero mapear alteracoes de entidades atraves do contrato BP/RP, para evitar entidades invisiveis ou referencias quebradas.
14. Como agente, quero mapear itens e blocos atraves de recipes, atlas e textos, para manter o conteudo utilizavel no jogo.
15. Como agente de Script API, quero saber que callbacks read-only exigem mutacoes adiadas, para evitar falhas de runtime.
16. Como agente de Script API, quero validar `entity.isValid` antes de mutar entidades, para reduzir erros com referencias expiradas.
17. Como QA, quero separar parse JSON, validacao estrutural e teste Bedrock, para nao promover evidencia estatica a validacao funcional.
18. Como QA, quero que toda ausencia de teste in-game seja declarada, para manter o status do backlog honesto.
19. Como mantenedor, quero conhecer os gates in-game ainda abertos do Stone Golem, para priorizar validacao antes de release.
20. Como mantenedor, quero conhecer as validacoes pendentes do Minerador, para nao descrever features como comprovadas em jogo.
21. Como agente, quero saber que assets fora dos packs sao apenas referencia, para nao assumir que o Bedrock os carrega.
22. Como agente, quero entender a soft-dependencia do Minerador em `fv:villager_free_handle`, para preservar carregamento independente e fluxo de contratacao.
23. Como responsavel por release, quero localizar os workflows de JSON, estrutura e empacotamento, para validar mudancas sem alterar CI fora de escopo.
24. Como responsavel por release, quero saber que artifacts sao separados por produto, para evitar pacotes misturados.
25. Como agente, quero consultar o projeto `golems_addon` e o dominio `minecraft` no Nero, para reutilizar knowledge operacional confirmado.
26. Como agente, quero usar code graph somente quando o GraphDocument cobrir o checkout, para nao tratar grafo vazio como ausencia de dependencias.
27. Como agente, quero recorrer ao filesystem para JSON e JavaScript Bedrock quando o extrator estrutural nao oferecer evidencia, para manter conclusoes auditaveis.
28. Como revisor, quero que caminhos citados no contexto existam, para evitar roteamento quebrado.
29. Como revisor, quero que mudancas no contexto passem por `git diff --check`, para evitar defeitos basicos de Markdown.
30. Como novo colaborador, quero cumprir a seam de onboarding sem conhecimento tribal externo, para comecar trabalho seguro a partir do repositorio.

## Implementation Decisions

- O contexto raiz sera um indice operacional: identidade minima, tabela de roteamento, regras rapidas e validacao minima.
- Detalhes serao divididos em referencias de responsabilidade unica para indice, estrutura, runtime, dominio, convencoes, padroes e divida tecnica.
- O monorepo continuara sendo a fronteira de documentacao; cada addon mantera README e contexto proprio para detalhes locais.
- Stone Golems e Villagers Addon serao tratados como produtos proprios independentes.
- Villager Soldiers sera tratado como referencia de terceiros e soft-dependencia de uso, nao como produto proprio.
- Uma task de produto tera um unico addon alvo por padrao. Mudanca cross-addon exigira solicitacao explicita e auditoria de IDs e UUIDs.
- O contrato BP/RP sera documentado como unidade de mudanca, incluindo identifiers, assets client-side, recipes, atlas e textos aplicaveis.
- Mudancas funcionais exigirao versoes BP/RP alinhadas; UUID e engine minima nao mudarao sem decisao explicita de compatibilidade e rollback.
- As convencoes Bedrock especificas do checkout permanecerao na documentacao local, pois nao existe guideline Nero especializado para addons Bedrock.
- O Nero armazenara contexto operacional no projeto `golems_addon`, dominio `minecraft`; arestas AST nao serao copiadas para knowledge links.
- O code graph sera uma fonte opcional. Resultado vazio do extrator TypeScript nao sera aceito como prova estrutural para JSON ou JavaScript Bedrock.
- Nenhum codigo de produto, teste, manifest, migration ou workflow sera alterado como parte desta especificacao.

## Testing Decisions

- A seam principal sera um teste de onboarding no nivel do repositorio: um agente recem-iniciado deve identificar addon alvo, ownership, referencias aplicaveis, limites de mudanca e plano de validacao usando somente o contexto para agentes.
- O teste observara o comportamento externo do contrato documental, nao frases ou organizacao interna especifica alem dos pontos de entrada publicos.
- Os caminhos roteados pelo indice devem existir.
- O contexto raiz deve permanecer suficiente para escolher a proxima referencia sem duplicar seu conteudo.
- Cenarios minimos da seam:
  - feature no Stone Golem;
  - feature no Minerador de Tunel;
  - estudo do Villager Soldiers sem reescreve-lo;
  - criacao de item ou textura vanilla;
  - mudanca Script API;
  - conclusao sem teste in-game;
  - consulta estrutural com code graph vazio.
- A validacao mecanica incluira `git diff --check` e verificacao de existencia dos paths citados.
- O prior art inclui os contextos locais dos addons, coding guidelines compartilhadas, workflows existentes de JSON e estrutura e backlogs com gates in-game.
- Testes in-game nao fazem parte da validacao desta documentacao, mas o contrato deve rotear corretamente para eles quando a task de produto exigir.

## Out of Scope

- Implementar ou corrigir comportamento dos addons.
- Alterar testes existentes.
- Alterar manifests, UUIDs, versoes ou `min_engine_version`.
- Alterar CI/CD, workflows ou empacotamento.
- Validar features dentro do Minecraft Bedrock.
- Reestruturar ou publicar Villager Soldiers.
- Implementar um novo extrator no `nero-code-graph`.
- Criar guidelines Nero genericos para o dominio Minecraft.
- Resolver tickets de produto presentes nos backlogs.

## Further Notes

- O checkout revisado possui Stone Golems em packs `1.0.21` e Villagers Addon em packs `1.0.4`.
- Em 2026-09-04 os packs passaram a viver sob `addon/` (`addon/gollem_addon`, `addon/villagers_addon`, `addon/villager_soldiers`). Caminhos citados no contexto de agentes devem usar esse prefixo.
- O snapshot Nero de 2026-08-26 registra o estado operacional e a limitacao observada do code graph.
- O extrator `typescript-ast` retornou zero nos e zero arestas neste checkout; consultas estruturais sobre conteudo Bedrock devem continuar usando filesystem ate existir cobertura comprovada.
- A spec privilegia uma unica seam de teste no nivel do contrato de onboarding, conforme confirmado pelo usuario.
