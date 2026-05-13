# Estrutura Alvo do Projeto

Este documento define a estrutura alvo da extensão multi-IDE de code review com IA. A estrutura deve orientar novas implementações, refatorações e movimentações graduais de código.

> A estrutura abaixo é alvo arquitetural. O código existente pode ser migrado em etapas, sem quebrar comandos, testes ou empacotamento da extensão.

---

# 1. Princípios de Organização

- `apps/*` contém integrações específicas de IDE.
- `packages/core` contém casos de uso, portas e serviços de aplicação.
- `packages/domain` contém entidades, políticas e value objects independentes de framework.
- `packages/infra` contém implementações técnicas de providers, RAG, storage, Git, sync e VPS.
- `packages/ui` contém componentes reutilizáveis de interface.
- `docs/*` contém arquitetura, padrões, workflows, requisitos e guias de IA.

---

# 2. Estrutura Alvo

```text
.
├── apps
│   ├── vscode
│   │   ├── src
│   │   │   ├── adapters
│   │   │   │   ├── ide
│   │   │   │   │   ├── VSCodeIdeAdapter.ts
│   │   │   │   │   ├── VSCodeWorkspaceAdapter.ts
│   │   │   │   │   ├── VSCodeCommandRegistryAdapter.ts
│   │   │   │   │   ├── VSCodeNotificationAdapter.ts
│   │   │   │   │   ├── VSCodeWebviewAdapter.ts
│   │   │   │   │   ├── VSCodeStorageAdapter.ts
│   │   │   │   │   ├── VSCodeProgressAdapter.ts
│   │   │   │   │   └── VSCodeFileSystemAdapter.ts
│   │   │   │   └── sync
│   │   │   │       └── VSCodeRepositorySyncSelector.ts
│   │   │   ├── bootstrap
│   │   │   │   ├── activateExtension.ts
│   │   │   │   ├── bootstrapContainer.ts
│   │   │   │   └── bootstrapProviders.ts
│   │   │   ├── command-handlers
│   │   │   │   ├── ai
│   │   │   │   │   └── analyzeCodeCommandHandler.ts
│   │   │   │   ├── rag
│   │   │   │   │   ├── setupRagCommandHandler.ts
│   │   │   │   │   ├── indexRepositoryRagCommandHandler.ts
│   │   │   │   │   ├── clearRepositoryRagCommandHandler.ts
│   │   │   │   │   └── searchRagContextCommandHandler.ts
│   │   │   │   ├── review
│   │   │   │   │   ├── publishCodeReviewCommandHandler.ts
│   │   │   │   │   └── approveFindingCommandHandler.ts
│   │   │   │   └── vps
│   │   │   │       └── syncWithVpsCommandHandler.ts
│   │   │   ├── commands
│   │   │   │   ├── ai
│   │   │   │   ├── rag
│   │   │   │   ├── review
│   │   │   │   └── vps
│   │   │   ├── dependencies
│   │   │   │   ├── buildContainer.ts
│   │   │   │   ├── registerPorts.ts
│   │   │   │   ├── registerUseCases.ts
│   │   │   │   └── registerProviders.ts
│   │   │   ├── providers
│   │   │   │   ├── DashboardProvider.ts
│   │   │   │   ├── RagStatusProvider.ts
│   │   │   │   └── ReviewPanelProvider.ts
│   │   │   ├── registers
│   │   │   │   ├── registerCommands.ts
│   │   │   │   ├── registerViews.ts
│   │   │   │   ├── registerProviders.ts
│   │   │   │   └── registerMenus.ts
│   │   │   ├── views
│   │   │   │   └── webview
│   │   │   │       ├── dashboard
│   │   │   │       ├── rag-status
│   │   │   │       └── review-panel
│   │   │   └── extension.ts
│   │   └── tests
│   │       ├── e2e
│   │       ├── integration
│   │       ├── unit
│   │       ├── mocks
│   │       ├── fixtures
│   │       ├── setup
│   │       └── utils
│   ├── jetbrains
│   ├── neovim
│   ├── vim
│   ├── sublime
│   ├── zed
│   ├── eclipse
│   ├── visualstudio
│   ├── emacs
│   └── fleet
├── packages
│   ├── core
│   │   ├── src
│   │   │   ├── application
│   │   │   │   ├── dto
│   │   │   │   │   ├── ai
│   │   │   │   │   ├── rag
│   │   │   │   │   ├── review
│   │   │   │   │   ├── sync
│   │   │   │   │   └── vps
│   │   │   │   ├── services
│   │   │   │   │   ├── ai
│   │   │   │   │   ├── rag
│   │   │   │   │   ├── review
│   │   │   │   │   ├── sync
│   │   │   │   │   └── vps
│   │   │   │   └── use-cases
│   │   │   │       ├── ai
│   │   │   │       ├── rag
│   │   │   │       ├── review
│   │   │   │       ├── sync
│   │   │   │       └── vps
│   │   │   ├── ports
│   │   │   │   ├── ai
│   │   │   │   ├── ide
│   │   │   │   ├── rag
│   │   │   │   ├── review
│   │   │   │   ├── sync
│   │   │   │   └── vps
│   │   │   ├── shared
│   │   │   │   ├── constants
│   │   │   │   ├── errors
│   │   │   │   └── result
│   │   │   └── index.ts
│   │   └── tests
│   ├── domain
│   │   ├── contracts
│   │   │   ├── ai
│   │   │   ├── rag
│   │   │   ├── review
│   │   │   ├── sync
│   │   │   └── vps
│   │   ├── src
│   │   │   ├── access
│   │   │   ├── rag
│   │   │   ├── review
│   │   │   ├── sync
│   │   │   └── shared
│   │   └── tests
│   ├── infra
│   │   ├── src
│   │   │   ├── ai
│   │   │   ├── auth
│   │   │   ├── git
│   │   │   ├── rag
│   │   │   ├── review
│   │   │   ├── storage
│   │   │   ├── sync
│   │   │   └── vps
│   │   └── tests
│   └── ui
│       └── src
│           ├── components
│           ├── dashboard
│           ├── rag
│           └── review
├── docs
│   ├── ai-integration
│   ├── architecture
│   ├── design
│   ├── patterns
│   ├── requisitos-funcionais-nao-funcionais
│   └── workflows
├── media
├── package.json
├── pnpm-workspace.yaml
└── tsconfig.base.json
```

---

# 3. Regras por Área

## 3.1 Apps

Cada app deve conter somente integração específica da IDE:

- Registro de comandos
- Adapters de APIs da IDE
- Views e webviews
- Bootstrap da extensão
- Seletores específicos de UX

Apps não devem conter regra de domínio nem implementação concreta de provider compartilhável.

## 3.2 Core

O core deve conter:

- Casos de uso
- Serviços de aplicação
- DTOs
- Portas
- Erros e resultados compartilhados

O core não deve importar APIs de IDE, SDKs de IA, bibliotecas de storage concreto ou clientes HTTP específicos.

## 3.3 Domain

O domínio deve conter:

- Entidades
- Value objects
- Políticas
- Contratos de domínio
- Erros de domínio

O domínio deve ser independente de TypeScript runtime específico, VS Code, Node APIs, providers e banco de dados.

## 3.4 Infra

A infraestrutura deve conter implementações concretas:

- Providers de IA
- Embeddings
- Vector stores
- Loaders e chunkers de RAG
- Repositories
- Git providers
- Sync providers
- VPS providers

Infra deve implementar portas do core, não o contrário.

## 3.5 UI

O pacote de UI deve conter componentes reutilizáveis e independentes da IDE quando possível.

Views específicas de uma IDE podem ficar em `apps/{ide}/src/views`, mas componentes reutilizáveis devem migrar para `packages/ui`.

---

# 4. Estratégia de Migração

1. Criar novas pastas sem mover código funcional.
2. Adicionar portas no core antes de mover adapters.
3. Migrar um fluxo por vez, começando por VS Code.
4. Manter exports temporários para compatibilidade.
5. Atualizar testes junto com cada migração.
6. Remover caminhos antigos somente após cobertura e build passarem.

---

# 5. Critérios de Aceite

- Código específico de IDE fica em `apps/*`.
- Core depende apenas de portas.
- Domain não depende de infra, UI ou IDE.
- Infra implementa portas sem vazar detalhes para o core.
- Testes acompanham a camada correspondente.
- A extensão VS Code continua funcionando durante a migração.
