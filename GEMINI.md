# Gemini CLI / LLM Instructions - Code Review Extension

Este arquivo fornece as diretrizes e o contexto essencial para IAs trabalharem neste repositório. Siga estas regras rigorosamente.

## 1. Visão Geral do Projeto
Extensão de IDE para Code Review assistido por IA, focada em arquitetura multi-IDE, desacoplamento e controle humano (Human-in-the-Loop).

## 2. Mandatos Críticos (Mandatory)

- **Desacoplamento de IDE**: O núcleo (Core/Domain/Application) **NUNCA** deve depender de APIs de IDEs (ex: `vscode`, `jetbrains`). Toda interação com a IDE deve ser feita através do contrato `IDEAdapter`.
- **TDD Obrigatório**: O desenvolvimento de regras de negócio e Use Cases deve seguir o ciclo **Red-Green-Refactor**. Novos testes unitários são obrigatórios para qualquer mudança na lógica.
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
- **Adapter**: Para múltiplas IDEs.
- **Strategy**: Para múltiplos provedores de IA.
- **Repository**: Para abstração de persistência.
- **Command**: Para ações desacopladas.
- **Registry**: Para registro dinâmico de providers e validações.
- **Observer**: Para comunicação reativa Core -> UI.

## 5. Estrutura de Diretórios

- `apps/`: Extensões específicas (vscode, jetbrains, etc).
- `packages/`: Núcleo compartilhado (core, domain, infra, ui).
- `docs/`: Documentação técnica detalhada.
- `scripts/`: Scripts operacionais (test, lint, build) usados pelas IDEs.

## 6. Fluxo de Implementação

1. **Pesquisa/Design**: Validar impacto nas camadas e contratos.
2. **TDD (Core)**: Implementar lógica com testes antes do código.
3. **UI Integration**: Conectar à Presentation Layer via Hooks/Services.
4. **Validação HITL**: Garantir fluxo de aprovação humana.

## 7. Tecnologias Preferenciais

- **Frontend**: React (TypeScript), shadcn/ui, Vanilla CSS (evitar Tailwind).
- **Backend/Core**: TypeScript puro.
- **Testes**: Vitest/Jest.

---
*Para detalhes específicos, consulte a pasta `docs/`.*
