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

- `apps/`: Extensões específicas (vscode, jetbrains, etc).
- `packages/`: Núcleo compartilhado (core, domain, infra, ui).
- `docs/`: Documentação técnica detalhada.
- `scripts/`: Scripts operacionais (test, lint, build) usados pelas IDEs.

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
