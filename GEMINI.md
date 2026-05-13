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

## 3. Arquitetura e Camadas

O projeto segue uma arquitetura em camadas (`docs/architecture/`):
1. **IDE Adapter Layer**: Adaptações específicas para cada IDE.
2. **Presentation Layer**: UI em React (shadcn/ui + Material Design 3).
3. **Application Layer**: Orquestração de Use Cases.
4. **Domain Layer**: Entidades e regras de negócio puras.
5. **Infrastructure Layer**: Implementações técnicas (Git, Storage, AI Providers).

## 4. Padrões de Design (Design Patterns)

Referência: `docs/patterns/design-patterns.md`
- **Adapter**: Desacopla o core das APIs das IDEs.
- **Strategy**: Intercambialidade de provedores de IA.
- **Repository**: Abstração da persistência de dados.
- **Command**: Ações do usuário como objetos (histórico/rollback).
- **Observer**: Comunicação reativa Core -> UI via eventos.
- **Facade**: Interface unificada para subsistemas complexos.
- **Registry**: Registro dinâmico de providers e comandos.
- **Dependency Injection**: Desacoplamento de implementações concretas.
- **Plugin Architecture**: Expansão modular e plugável.
- **Pipeline**: Fluxos de processamento em etapas independentes.

## 5. Princípios de Design

- **SOLID**: Obrigatório em toda implementação.
- **Single Responsibility (SRP)**: Um arquivo/classe = uma responsabilidade única.
- **Don't Repeat Yourself (DRY)**: Evitar duplicação de lógica de negócio.
- **KISS (Keep It Simple, Stupid)**: Priorizar a simplicidade na implementação.

## 6. Estrutura de Diretórios

```text
/
├── apps/                   # Extensões específicas por IDE
│   ├── jetbrains/          # Plugin para IntelliJ/WebStorm (Kotlin)
│   ├── vscode/             # Extensão para VS Code (TypeScript)
│   │   ├── src/            # Código-fonte da extensão
│   │   └── tests/          # Testes E2E, Integração e Unitários (VS Code)
│   ├── vim/                # Suporte para Vim/Neovim
│   └── sublime/            # Suporte para Sublime Text
├── packages/               # Núcleo compartilhado (Monorepo)
│   ├── core/               # Casos de uso e lógica de orquestração
│   ├── domain/             # Entidades, contratos e regras de negócio
│   ├── infra/              # Provedores (IA, Git, Storage) e serviços externos
│   └── ui/                 # Componentes de interface (React)
├── docs/                   # Documentação técnica e arquitetural
│   ├── ai-integration/     # Estratégia e contratos de IA
│   ├── architecture/       # Princípios e estrutura das camadas
│   ├── design/             # UI/UX e componentes
│   └── qualidade-software/ # Processos de QA e checklists
└── GEMINI.md               # Este arquivo (Instruções para LLMs)
```

## 7. Fluxo de Implementação

1. **Pesquisa/Design**: Validar impacto nas camadas e contratos.
2. **TDD (Red)**: Escrever o teste unitário que falha na pasta `tests/`.
3. **Implementação (Green)**: Escrever o código mínimo em `src/` para o teste passar.
4. **Refatoração (Refactor)**: Melhorar o código mantendo os testes passando.
5. **Integração UI/IDE**: Conectar componentes seguindo o mesmo ciclo de validação.

## 8. Tecnologias Preferenciais

- **Frontend**: React (TypeScript), shadcn/ui, Vanilla CSS (evitar Tailwind).
- **Backend/Core**: TypeScript puro.
- **Testes**: Vitest/Jest.

---
*Para detalhes específicos, consulte a pasta `docs/`.*

## 9. Regras de Implementação Low-Cost (Mandatório)

Este projeto prioriza o mínimo custo operacional e a máxima previsibilidade. Todas as IAs devem atuar como **IMPLEMENTADORES DETERMINÍSTICOS**.

### 9.1 Mandatos de Eficiência
- **Mínimo Reasoning**: Não explore alternativas arquiteturais. Siga rigorosamente os contratos existentes.
- **Máxima Reutilização**: **PROIBIDO** criar novas abstrações, helpers, factories ou wrappers se já existirem interfaces ou implementações compatíveis.
- **Mínima Alteração**: Prefira alterar 1 arquivo de forma cirúrgica do que reorganizar múltiplos arquivos.
- **Custo de Token**: Evite explicações verbais longas. Foque na implementação técnica direta.

### 9.2 Estratégia de Desenvolvimento
1. **Reutilizar**: Verificar se o que precisa ser feito já existe ou pode ser estendido.
2. **Implementar Mínimo**: Escrever o menor código possível que atenda ao requisito.
3. **Testar**: Criar testes cirúrgicos que garantam apenas o Happy Path e Error Path.
4. **Validar Coverage**: Subir cobertura com o mínimo de cenários redundantes.

### 9.3 Restrições de Tecnologia
- **Dependências**: Apenas libs permitidas (Vitest, Stryker, ts-morph, zod, pino). **PROIBIDO** adicionar novas bibliotecas sem aprovação.
- **Performance**: Evite carregar o projeto inteiro em memória ou realizar scans de AST globais desnecessários.
- **Imports**: Prefira imports diretos. Evite index.ts gigantes ou barrel exports complexos.

### 9.4 Regra Suprema
**IMPLEMENTAR O MENOR CÓDIGO POSSÍVEL COM O MENOR NÚMERO DE ALTERAÇÕES, UTILIZANDO A ARQUITETURA EXISTENTE E SEM COMPLEXIDADE ADICIONAL.**
