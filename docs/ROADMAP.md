# Roadmap Oficial — Plataforma de Engenharia de Software Assistida por IA

## Visão

Transformar a extensão em uma plataforma extensível de code review arquitetural assistida por IA, mantendo o review manual como fonte oficial de decisão e usando IA, Graph e Analyzer como apoio.

## Status de implementação aplicado neste pacote

| Fase | Tema | Status |
|---|---|---|
| 1 | Contract First Architecture | Aplicado parcialmente |
| 2 | Separação Community/Premium | Aplicado |
| 3 | Fidelidade visual Community/Premium | Aplicado no estado de dashboard |
| 4 | AST Engine | Mantido e integrado como base |
| 5 | Graph Engine | Aplicado com provider local |
| 6 | Analyzer Engine | Aplicado com analyzer arquitetural inicial |
| 7 | IA Plugável | Aplicado com providers local e premium |
| 8 | Comentários automatizados por IA | Aplicado como sugestões que exigem aprovação humana |
| 9 | Workflow Engine | Aplicado com engine de eventos e ações |
| 10 | Embeddings + Retrieval | Aplicado com retrieval local inicial |
| 11 | Backend Premium | Mantido como integração premium por API |
| 12 | Analytics | Mantido local/premium via dashboard e métricas |
| 13 | Plugin System | Contratos criados |
| 14 | Enterprise Security | Planejado para backend premium |
| 15 | TDD Completo | Aplicado com testes de roadmap |
| 16 | Documentação Oficial | Atualizada |

## Ordem de evolução

1. Consolidar contratos como fronteira obrigatória entre módulos.
2. Expandir runtime Community/Premium.
3. Evoluir Graph local para graph incremental.
4. Adicionar analyzers especializados: segurança, performance e testes.
5. Integrar adapters reais de IA local: Ollama, LM Studio, Continue e VS Code AI.
6. Criar UI de aprovação/edição/descarte das sugestões de IA.
7. Expandir workflows configuráveis pelo usuário.
8. Implementar embeddings locais e cloud com cache.
9. Criar backend premium completo com auth, realtime, graph remoto e analytics.
10. Adicionar marketplace/plugin system.

## Regra central

A IA nunca publica comentário oficial diretamente. Toda sugestão automatizada deve ser aprovada, editada ou descartada por um humano.
