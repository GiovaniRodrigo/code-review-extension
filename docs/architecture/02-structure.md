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
│       └── src/
│           ├── extension.ts
│           ├── bootstrap/
│           │   └── ExtensionBootstrap.ts
│           ├── contracts/
│           │   ├── ICommand.ts
│           │   ├── ICommandHandler.ts
│           │   └── IExtensionDependencies.ts
│           ├── dependencies/
│           │   └── createExtensionDependencies.ts
│           ├── commands/
│           │   ├── registerCommands.ts
│           │   ├── AnalyzeCommand.ts
│           │   ├── ClearSessionCommand.ts
│           │   └── SetOpenAIKeyCommand.ts
│           ├── command-handlers/
│           │   ├── AnalyzeCommandHandler.ts
│           │   ├── ClearSessionCommandHandler.ts
│           │   └── SetOpenAIKeyCommandHandler.ts
│           ├── providers/
│           │   └── createAIProvider.ts
│           ├── services/
│           │   └── restoreCurrentBranchSession.ts
│           ├── adapters/
│           │   └── VSCodeAdapter.ts
│           └── views/
│               └── ReviewViewProvider.ts
├── packages/
│   ├── core/
│   │   ├── application/
│   │   └── domain/
│   ├── infrastructure/
│   ├── ui/
│   └── ide-contracts/
└── docs/
```
