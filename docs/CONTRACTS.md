# Contracts First Architecture

## Princípio

Toda comunicação entre módulos deve ocorrer por contratos centralizados em `src/contracts`.

## Objetivo

Garantir baixo acoplamento, extensibilidade, testes por mocks e troca segura entre implementações Community e Premium.

## Contratos criados

- `AIProvider`
- `GraphProvider`
- `Analyzer`
- `ReviewStorage`
- `WorkflowAction`
- `DiagnosticProvider`
- `ReviewContext`
- `SuggestedReviewComment`
- `EditionRuntime`
- `EmbeddingProvider`
- `ContextRetriever`
- `ReviewPlugin`

## Regra obrigatória

Camadas de aplicação devem depender de interfaces, nunca de implementações concretas.

```ts
constructor(private readonly ai: AIProvider) {}
```

## Benefícios

- IA plugável;
- Graph local ou remoto;
- Analyzer extensível;
- Workflow customizável;
- Community/Premium sem duplicação do core.
