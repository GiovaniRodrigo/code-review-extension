# Developer Guide - AI Code Review Platform

Bem-vindo ao guia de desenvolvimento da plataforma AI Code Review. Este é um monorepo TypeScript focado em Clean Architecture e extensibilidade multi-IDE.

## 🏗️ Estrutura do Monorepo

O projeto está dividido em pacotes (`packages/`) e aplicações de IDE (`apps/`):

- **`packages/domain`**: Entidades, Value Objects e Regras de Negócio puras. Sem dependências externas.
- **`packages/core`**: Casos de Uso, Portas (Interfaces) e Orquestração (RAG, Analyzers, etc).
- **`packages/infra`**: Implementações concretas de Portas (OpenAI, Ollama, Git, SQLite, etc).
- **`packages/ui`**: Componentes compartilhados em React.
- **`packages/testing`**: Utilitários e infraestrutura de testes.
- **`apps/vscode`**: Implementação da extensão para VS Code (Referência técnica).
- **`apps/*`**: Placeholders para outras IDEs (JetBrains, Vim, etc).

## 🛠️ Tecnologias Principais

- **Linguagem**: TypeScript
- **Build System**: [Turborepo](https://turbo.build/) + [esbuild](https://esbuild.github.io/)
- **Testes**: [Vitest](https://vitest.dev/) (Unit/Integration) + [Mocha](https://mochajs.org/) (E2E)
- **Qualidade**: [ESLint](https://eslint.org/), [Stryker](https://stryker-mutator.io/) (Mutation Testing), [Dependency Cruiser](https://dependency-cruiser.js.org/)

## 🚀 Como Iniciar

### Pré-requisitos
- Node.js (v20+)
- npm ou pnpm

### Configuração Inicial
```bash
# Instalar dependências
npm install

# Build completo do monorepo
npm run build

# Executar todos os testes de qualidade
npm run test:all
```

## 📜 Scripts Disponíveis (Raiz)

- `npm run build`: Compila todos os pacotes e o VS Code via Turbo.
- `npm test`: Executa todos os testes unitários e de integração.
- `npm run test:e2e`: Executa os testes de ponta a ponta na extensão VS Code.
- `npm run test:coverage`: Gera relatório global de cobertura.
- `npm run test:mutation`: Executa testes de mutação via Stryker.
- `npm run lint`: Valida regras de código e arquitetura (Dependency Cruiser).
- `npm run package:vscode`: Gera o arquivo `.vsix` para distribuição.

## 🏛️ Princípios Arquiteturais

1. **Desacoplamento de IDE**: O Core/Domain nunca importa `@types/vscode`. Toda interação com a IDE deve ser feita via `IDEAdapter`.
2. **TDD (Red-Green-Refactor)**: Obrigatório para todas as camadas.
3. **Caminhos Negativos**: Implemente testes para falhas (offline, storage corrompido) para garantir resiliência.
4. **Ports and Adapters**: O Core define a interface (`Port`), o pacote `infra` ou `apps` fornece a implementação (`Adapter`).

## 🖇️ Fluxo de Ativação (Bootstrap)

Toda nova IDE deve seguir o padrão estabelecido no VS Code:
- Localização: `apps/*/src/bootstrap/activateExtension.ts`
- Fluxo: Injeção de dependência via container -> Registro de comandos -> Registro de Views -> Ready.

## 🧪 Qualidade Mínima (Quality Gates)

- **Statements**: 75%+
- **Branches**: 75%+
- **Functions**: 70%+
- **Mutation Score**: 60%+
- **Lint & Architecture**: Sem violações.

---
Para detalhes técnicos específicos, consulte `docs/README_TECHNICAL.md`.
