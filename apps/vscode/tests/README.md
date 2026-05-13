# Testes da extensão VS Code

## Objetivo

Esta pasta contém testes unitários, de integração e de arquitetura para os arquivos enviados em `src/`.

## Stack sugerida

- Vitest
- TypeScript
- Mocks locais para `vscode`, `@code-review/core`, `@code-review/infra` e `@code-review/domain`

## Comandos sugeridos

```bash
npm install -D vitest @vitest/coverage-v8 typescript
npx vitest run --config vitest.config.ts
npx vitest run --coverage --config vitest.config.ts
```

## Observação importante

O teste `tests/architecture/source-structure.test.ts` deve falhar na estrutura atual porque alguns arquivos estão fora das pastas esperadas pelos imports.

Correções esperadas:

```text
src/ReviewViewProvider.ts                  -> src/views/ReviewViewProvider.ts
src/VSCodeAdapter.ts                       -> src/adapters/VSCodeAdapter.ts
src/providers/createAIProvider.TS          -> src/providers/createAIProvider.ts
src/command-handlers/SetOpenAIKeyCommand.ts -> src/commands/SetOpenAIKeyCommand.ts
```

Também há indício de conteúdo incorreto em:

```text
src/dependencies/createExtensionDependencies.ts
src/command-handlers/ClearSessionCommandHandler.ts
```

Esses arquivos parecem conter classes de outras responsabilidades.
