# GEMINI.md - Code Review Extension

## 1. Mandatos Críticos
- **IDE Decoupling**: Core NUNCA depende de APIs de IDE. Use `IDEAdapter`.
- **TDD Rigoroso**: Red-Green-Refactor. Testes em `tests/` (fora de `src/`).
- **HITL**: Aprovação humana obrigatória para toda sugestão de código.
- **AI Strategy**: Provedores via `AIProvider`. Sem acoplamento.
- **Single Bootstrap**: Ativação centralizada em `activateExtension.ts`.

## 2. Arquitetura (docs/architecture/)
1. **IDE Adapter**: Adaptações específicas.
2. **Presentation**: UI (React/Vanilla).
3. **Application**: Use Cases, RAG, Services.
4. **Domain**: Regras puras.
5. **Infrastructure**: Git, AI, Storage.

## 3. Qualidade
- **Patterns**: Adapter, Strategy, Repository, Command, DI.
- **Coverage**: Statements/Branches > 75%, Functions > 70%.
- **Mutation**: Stryker Score > 60%.
- **Zero Workarounds**: Sem hacks ou bypasses.

## 4. Reasoning & Low-Cost (Mandatório)
Referência: `docs/REVIEW_SYSTEM_REASONING_ENGINE.md`

- **Mínimo Reasoning**: Sem exploração arquitetural. Siga os contratos.
- **Máxima Reutilização**: Use o que já existe no Core/Infra.
- **Mínima Alteração**: Alterações cirúrgicas em poucos arquivos.
- **Regra Suprema**: IMPLEMENTAR O MENOR CÓDIGO POSSÍVEL COM O MENOR NÚMERO DE ALTERAÇÕES E ESTABILIDADE TOTAL.
