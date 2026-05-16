# Style Guide & Implementation Rules — Multi-IDE AI Code Review

Este documento define as regras absolutas de codificação, arquitetura e testes para o projeto. Ele substitui qualquer convenção genérica e baseia-se estritamente na documentação oficial (`docs/`) do projeto.

## 1. Princípios Arquiteturais (Clean Architecture & DDD)
- **Desacoplamento de IDE:** O `core` e o `domain` NUNCA devem importar APIs específicas de IDE (ex: `vscode`). A comunicação deve ser feita exclusivamente através de Ports (interfaces).
- **Separação de Camadas:**
  - `apps/*`: Adapters específicos de cada IDE (ex: `apps/vscode`).
  - `packages/domain`: Entidades puras, Value Objects, Políticas. Sem infra, sem frameworks, sem libs externas pesadas.
  - `packages/core`: Casos de uso (Application), Serviços, DTOs e Ports.
  - `packages/infra`: Implementações concretas de Ports (Providers, Repositories, Git, APIs, Banco de dados).
  - `packages/ui`: Componentes visuais reutilizáveis (Design System baseado em shadcn/ui).
- **Dependências:** Evite dependências cíclicas rigorosamente (validadas por `dependency-cruiser` e `madge`).

## 2. Regras de Implementação de Baixo Custo (LLM)
- **Determinismo e Simplicidade:** Implemente a solução mais simples, direta e de menor custo computacional. A IA atua como um "Implementador Determinístico", não como um arquiteto exploratório.
- **Reutilização Máxima:** Reutilize código, interfaces, mocks, analyzers e providers existentes. NUNCA crie novas abstrações, wrappers, factories ou decorators desnecessários.
- **Alteração Cirúrgica:** Prefira alterar 1 arquivo do que reorganizar 10. Modifique o mínimo possível para atingir o objetivo preservando a arquitetura.
- **Estruturas Simples:** Prefira pequenas funções e pequenas classes. Evite heranças profundas.
- **Imports:** Prefira imports diretos e explícitos (`import { X } from './X'`). Evite `index.ts` gigantes ou barrel exports complexos.

## 3. Qualidade e Testes (Quality Gates)
- **TDD Estrito:** Teste falha -> Implementação mínima -> Teste passa.
- **Testes Focados:** Cubra apenas o *happy path*, *error path* e retornos principais. Evite mocks complexos, fixtures gigantes e testes irrelevantes (smoke tests vazios).
- **Níveis de Cobertura & Mutação:** O projeto possui gates restritos. Nenhuma alteração pode reduzir a cobertura global (mínimo de ~75-80%). Meta de Mutation Testing (Stryker): Core >= 80%, Infra >= 70%.
- **Validação de CI:** Sempre assegure que `npm run quality` (que inclui Lint, Static Analysis, Cobertura e Mutação) passe integralmente.

## 4. Integração de IA e RAG
- **HITL (Human-in-the-Loop):** Toda recomendação de IA apenas sugere (findings, severidade, etc). Nenhuma alteração, commit ou aprovação final no código é feita sem ação explícita e validação humana.
- **Respostas de IA:** Exija e retorne ESTRITAMENTE JSON válido quando solicitado pelo contrato. Sem blocos de markdown em respostas estritas.
- **Contexto Mínimo:** Envie apenas o contexto estritamente necessário (trecho alterado + algumas linhas ao redor, resumo de AST em vez da AST completa).
- **Resiliência e Runtime:** Providers de IA e buscas no RAG devem rodar em background (não travar a IDE), ter fallback, timeout, cancelamento (AbortController) e retry automático.

## 5. Design de Findings & Code Review
- Um `Finding` representa uma não conformidade e deve ter no mínimo: `file`, `line`, `severity`, e `message`. Não adicione metadados excessivos ou tracing complexo num finding comum.
- O modo padrão de execução deve ser rápido (`fast`), realizando *Micro-Reviews Contextuais* localmente usando Analyzers e AST antes de acionar a IA pesada.
- Siga estritamente o ciclo de vida definido para os findings: `OPEN` -> `IN_REVIEW` -> `FIX_REQUESTED` -> `FIXED` -> `REVALIDATED` -> `APPROVED` -> `CLOSED`.

## 6. Convenções de Código
- **Linguagem:** TypeScript para toda a lógica e React/TSX para UI.
- **Nomenclatura:**
  - `PascalCase` para Classes, Interfaces, Enums e Tipos.
  - `camelCase` para instâncias, variáveis e funções.
  - Utilize sufixos declarativos para arquitetura, como `Port`, `UseCase`, `Service`, `Repository`, `Adapter`, `Analyzer`.
- **Commits:** Utilize Conventional Commits orientados à funcionalidade/módulo: `feat(rag): ...`, `test(core): ...`, `fix(runtime): ...`. Commits devem ser pequenos e isolados.
