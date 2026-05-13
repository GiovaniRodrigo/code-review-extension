# Estrutura e Camadas

## 1. Arquitetura Geral

O sistema é dividido em camadas para garantir a separação de interesses:

```text
┌──────────────────────────────────────────────┐
│ IDE Adapter Layer (VS Code / JetBrains / etc)│
└─────────────────────┬────────────────────────┘
                      ▼
┌──────────────────────────────────────────────┐
│ Presentation Layer (UI / Webviews)           │
└─────────────────────┬────────────────────────┘
                      ▼
┌──────────────────────────────────────────────┐
│ Application Layer (Use Cases)                │
└─────────────────────┬────────────────────────┘
                      ▼
┌──────────────────────────────────────────────┐
│ Domain Layer (Entities / Rules)              │
└─────────────────────┬────────────────────────┘
                      ▼
┌──────────────────────────────────────────────┐
│ Infrastructure Layer (Git / AI / Storage)    │
└──────────────────────────────────────────────┘
```

## 2. Responsabilidades das Camadas

### 2.1 IDE Adapter Layer
Integração específica com a IDE (comandos, menus, eventos). Nenhuma regra de negócio.

### 2.2 Presentation Layer
Interface visual e componentes de UI (Dashboard, Diagnósticos).

### 2.3 Application Layer
Orquestração de casos de uso (Iniciar revisão, Executar validação).

### 2.4 Domain Layer
Regras centrais e entidades (ReviewSession, Diagnostic, Comment). Independente de frameworks.

### 2.5 Infrastructure Layer
Implementações técnicas (Git CLI, APIs de IA, Armazenamento local).

## 3. Organização de Pastas
```text
project/
├── apps/
│   └── vscode/
│       ├── src/
│       │   ├── extension.ts
│       │   ├── bootstrap/
│       │   │   └── ExtensionBootstrap.ts
│       │   ├── contracts/
│       │   │   ├── ICommand.ts
│       │   │   ├── ICommandHandler.ts
│       │   │   └── IExtensionDependencies.ts
│       │   ├── dependencies/
│       │   │   └── createExtensionDependencies.ts
│       │   ├── commands/
│       │   │   ├── registerCommands.ts
│       │   │   ├── AnalyzeCommand.ts
│       │   │   ├── ClearSessionCommand.ts
│       │   │   └── SetOpenAIKeyCommand.ts
│       │   ├── command-handlers/
│       │   │   ├── AnalyzeCommandHandler.ts
│       │   │   ├── ClearSessionCommandHandler.ts
│       │   │   └── SetOpenAIKeyCommandHandler.ts
│       │   ├── providers/
│       │   │   └── createAIProvider.ts
│       │   ├── services/
│       │   │   └── restoreCurrentBranchSession.ts
│       │   ├── adapters/
│       │   │   └── VSCodeAdapter.ts
│       │   └── views/
│       │       └── ReviewViewProvider.ts
│       │
│       ├── tests/
│       │   ├── unit/
│       │   │   ├── commands/
│       │   │   │   ├── AnalyzeCommand.test.ts
│       │   │   │   ├── ClearSessionCommand.test.ts
│       │   │   │   └── SetOpenAIKeyCommand.test.ts
│       │   │   ├── command-handlers/
│       │   │   │   ├── AnalyzeCommandHandler.test.ts
│       │   │   │   ├── ClearSessionCommandHandler.test.ts
│       │   │   │   └── SetOpenAIKeyCommandHandler.test.ts
│       │   │   ├── services/
│       │   │   │   └── restoreCurrentBranchSession.test.ts
│       │   │   ├── providers/
│       │   │   │   └── createAIProvider.test.ts
│       │   │   ├── adapters/
│       │   │   │   └── VSCodeAdapter.test.ts
│       │   │   └── bootstrap/
│       │   │       └── ExtensionBootstrap.test.ts
│       │   │
│       │   ├── integration/
│       │   │   ├── command-registration.test.ts
│       │   │   ├── dependency-container.test.ts
│       │   │   ├── ai-provider.integration.test.ts
│       │   │   └── vscode-api.integration.test.ts
│       │   │
│       │   ├── e2e/
│       │   │   ├── extension-activation.e2e.test.ts
│       │   │   ├── review-flow.e2e.test.ts
│       │   │   ├── ai-analysis.e2e.test.ts
│       │   │   └── session-management.e2e.test.ts
│       │   │
│       │   ├── mocks/
│       │   │   ├── vscode.mock.ts
│       │   │   ├── ai-provider.mock.ts
│       │   │   └── session.mock.ts
│       │   │
│       │   ├── fixtures/
│       │   │   ├── sample-diff.ts
│       │   │   ├── sample-review.ts
│       │   │   └── sample-session.ts
│       │   │
│       │   ├── setup/
│       │   │   ├── setupTests.ts
│       │   │   ├── setupIntegration.ts
│       │   │   └── setupE2E.ts
│       │   │
│       │   └── utils/
│       │       ├── createMockContext.ts
│       │       ├── createFakeWorkspace.ts
│       │       └── testHelpers.ts
│       │
│       ├── jest.config.ts
│       ├── jest.integration.config.ts
│       ├── jest.e2e.config.ts
│       └── tsconfig.test.json
│
├── packages/
│   ├── core/
│   │   ├── application/
│   │   ├── domain/
│   │   └── tests/
│   │       ├── unit/
│   │       ├── integration/
│   │       └── fixtures/
│   │
│   ├── infrastructure/
│   │   └── tests/
│   │       ├── unit/
│   │       ├── integration/
│   │       └── mocks/
│   │
│   ├── ui/
│   │   └── tests/
│   │       ├── components/
│   │       ├── views/
│   │       ├── accessibility/
│   │       └── snapshots/
│   │
│   └── ide-contracts/
│       └── tests/
│           ├── contracts/
│           └── compatibility/
│
├── docs/
│   ├── testing/
│   │   ├── testing-strategy.md
│   │   ├── unit-tests.md
│   │   ├── integration-tests.md
│   │   ├── e2e-tests.md
│   │   ├── mocks-and-fixtures.md
│   │   ├── quality-gates.md
│   │   └── coverage.md
│
├── scripts/
│   ├── test.sh
│   ├── test-unit.sh
│   ├── test-integration.sh
│   ├── test-e2e.sh
│   ├── test-watch.sh
│   └── coverage.sh
│
└── coverage/
```
