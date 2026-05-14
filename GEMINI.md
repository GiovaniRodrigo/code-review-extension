# Gemini CLI / LLM Instructions - Code Review Extension

Este arquivo fornece as diretrizes e o contexto essencial para IAs trabalharem neste repositório. Siga estas regras rigorosamente.

## 1. Visão Geral do Projeto
Extensão de IDE para Code Review assistido por IA, focada em arquitetura multi-IDE, desacoplamento e controle humano (Human-in-the-Loop).

## 2. Mandatos Críticos (Mandatory)

- **Desacoplamento de IDE**: O núcleo (Core/Domain/Application) **NUNCA** deve depender de APIs de IDEs (ex: `vscode`, `jetbrains`). Toda interação com a IDE deve ser feita através do contrato `IDEAdapter`.
- **TDD Onipresente**: O desenvolvimento de **TODAS** as camadas (Domain, Application, Infrastructure e UI) deve seguir rigorosamente o ciclo **Red-Green-Refactor**. É terminantemente proibido escrever código de implementação antes do teste unitário correspondente.
- **Localização de Testes**: Todos os testes devem residir em pastas chamadas `tests/` dentro de seus respectivos pacotes (ex: `packages/core/tests/`), nunca misturados ao código-fonte em `src/`.
- **Human-in-the-Loop (HITL)**: Toda sugestão gerada por IA deve ser tratada como `pending` e **EXIGIR** aprovação humana explícita antes de qualquer ação. **PROIBIDO** aplicar correções de código automaticamente.
- **Strategy para IA**: Provedores de IA (OpenAI, Ollama, Cloud) devem ser intercambiáveis via `AIProvider`. Nunca acople lógica a um provedor específico.
- **Bootstrap Único**: Toda IDE deve seguir um fluxo de ativação determinístico e único, centralizado em `src/bootstrap/activateExtension.ts`.

## 3. Arquitetura e Camadas

O projeto segue uma arquitetura em camadas (`docs/architecture/`):
1. **IDE Adapter Layer**: Adaptações específicas para cada IDE (localizadas em `apps/*/src/adapters`).
2. **Presentation Layer**: UI em React (`packages/ui`) ou Vanilla JS para Webviews (`apps/vscode/src/ui`).
3. **Application Layer**: Orquestração de Use Cases, RAG Engine e Serviços (localizados em `packages/core/src/application`).
4. **Domain Layer**: Entidades e regras de negócio puras (`packages/domain`).
5. **Infrastructure Layer**: Implementações técnicas (Git, Storage, AI Providers) em `packages/infra`.

## 4. Padrões de Design (Design Patterns)

Referência: `docs/patterns/design-patterns.md`
- **Adapter**: Desacopla o core das APIs das IDEs.
- **Strategy**: Intercambialidade de provedores de IA.
- **Repository**: Abstração da persistência de dados.
- **Command**: Ações do usuário como objetos (em `apps/*/src/commands`).
- **Dependency Injection**: Desacoplamento via container (`apps/vscode/src/dependencies`).
- **Registry**: Registro centralizado de comandos e views no bootstrap.

## 5. Princípios de Design

- **SOLID**: Obrigatório em toda implementação.
- **Single Responsibility (SRP)**: Um arquivo/classe = uma responsabilidade única.
- **KISS (Keep It Simple, Stupid)**: Priorizar a simplicidade.
- **Zero Workarounds**: Não usar exclusões temporárias ou hacks de cobertura.

## 6. Estrutura de Diretórios

```text
/
├── apps/                   # Extensões específicas por IDE
│   ├── vscode/             # Extensão para VS Code (Referência)
│   │   ├── src/
│   │   │   ├── adapters/   # Adapters de IDE
│   │   │   ├── bootstrap/  # Fluxo de ativação unificado
│   │   │   ├── commands/   # Comandos da IDE (delegam para Use Cases)
│   │   │   ├── dependencies/# Injeção de Dependência
│   │   │   ├── providers/  # Webview View Providers
│   │   │   └── ui/         # Assets de UI (html, css, js)
│   │   └── tests/          # e2e, integration, architecture, ui
│   ├── jetbrains/          # Plugins seguindo a mesma estrutura...
│   └── (outras IDEs)/      # vim, neovim, eclipse, emacs, zed, etc.
├── packages/               # Núcleo compartilhado (Monorepo)
│   ├── core/               # Orquestração, Use Cases e RAG
│   ├── domain/             # Regras de negócio e Entidades
│   ├── infra/              # Provedores concretos (IA, Git, Storage)
│   └── ui/                 # Componentes React compartilhados
└── GEMINI.md               # Este arquivo
```

## 7. Fluxo de Implementação

1. **Pesquisa/Design**: Validar impacto nas camadas e contratos.
2. **TDD (Red)**: Escrever o teste unitário/integração que falha.
3. **Implementação (Green)**: Escrever o código mínimo.
4. **Refatoração (Refactor)**: Melhorar o código.
5. **Caminhos Negativos**: Implementar obrigatoriamente testes para falhas (IA offline, storage corrompido, etc).
6. **Validação E2E**: Garantir que o fluxo completo na IDE funciona.

## 8. Qualidade e Build

- **Build Pipeline**: Centralizado na raiz via `turbo build`.
- **Cobertura Mínima**: Statements: 75%, Branches: 75%, Functions: 70%.
- **Mutation Testing**: Obrigatório via Stryker. Score mínimo: 60%.
- **Resiliência**: Cenários negativos não devem derrubar o Extension Host.

## 9. Regras de Implementação Low-Cost (Mandatório)

Este projeto prioriza o mínimo custo operacional e a máxima previsibilidade.

### 9.1 Mandatos de Eficiência
- **Mínimo Reasoning**: Não explore alternativas arquiteturais. Siga rigorosamente os contratos.
- **Máxima Reutilização**: Proibido criar novas abstrações se já existirem compatíveis.
- **Mínima Alteração**: Prefira alterações cirúrgicas.

### 9.2 Estratégia de Desenvolvimento
1. **Reutilizar**: Verificar o que já existe no Core/Infra.
2. **Implementar Mínimo**: Menor código possível com menor número de alterações.
3. **Estabilizar**: Garantir que todos os testes (Unit, Integration, E2E) passam.

### 9.3 Restrições de Tecnologia
- **Dependências**: Apenas libs permitidas (Vitest, Stryker, ts-morph, zod, pino, jsdom).
- **Performance**: Evite scans globais desnecessários.
- **Imports**: Prefira imports diretos.

### 9.4 Regra Suprema
**IMPLEMENTAR O MENOR CÓDIGO POSSÍVEL COM O MENOR NÚMERO DE ALTERAÇÕES, UTILIZANDO A ARQUITETURA EXISTENTE E GARANTINDO ESTABILIDADE TOTAL.**
