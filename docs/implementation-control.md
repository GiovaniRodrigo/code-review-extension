# Controle de Implementação (Traceability Matrix)

Este documento mapeia as fases do **Roadmap** aos **Requisitos Funcionais (RF)** e **Não Funcionais (RNF)**, servindo como guia para acompanhamento do progresso do projeto.

## Legenda de Status
- ⚪ Pendente
- 🟡 Em Desenvolvimento
- 🟢 Concluído
- 🔵 Validado (HITL/Testes)

---

## Fase 1: Fundamentos
Foco na infraestrutura básica e entrega de valor inicial (diagnósticos e comentários).

| Item do Roadmap | Requisitos Vinculados | Status | Notas |
| :--- | :--- | :---: | :--- |
| **Arquitetura Base** | RF-001, RF-007, RF-012, RF-015, RF-016, RF-018, RNF-001, RNF-002, RNF-003, RNF-004, RNF-020, RNF-029 | 🔵 | Core, Domain, Infra, UI e VS Code Adapter separados por contratos e cobertos por testes. |
| **Descobertas Estruturadas** | RF-003, RF-004, RF-005, RF-028, RNF-016 | 🔵 | Geração de findings estruturados via providers Mock, OpenAI e Ollama, preservando HITL. |
| **Comentários Inline** | RF-006, RF-019 | 🔵 | Findings aprovados geram diagnostics inline no VS Code. |
| **Motor de Severidade** | RF-021 | 🔵 | `SeverityEngine` classifica findings como Info, Warning ou Error. |
| **Gestão de Sessão** | RF-001, RF-002 | 🔵 | Sessões persistidas em arquivo e restauradas por branch via API Git do VS Code. |
| **Dashboard Básico** | RF-013 | 🔵 | Sidebar Findings exibe diagnosticos, severidade, status e acoes HITL. |

---

## Fase 2: Inteligência Estática
Aumento da precisão da análise através de parsing de código e regras customizáveis.

| Item do Roadmap | Requisitos Vinculados | Status | Notas |
| :--- | :--- | :---: | :--- |
| **Parser de AST** | RF-014, RNF-005 | 🔵 | `AstBuilder` gera resumo estrutural serializavel para TypeScript/JavaScript com metricas iniciais e cobertura de testes. |
| **Motor de Regras** | RF-020, RF-026, RNF-030 | 🔵 | `StaticRuleEngine` executa regras configuraveis sobre o AST com cobertura de testes. |
| **Score de Risco** | RF-005 (Extensão), RF-021 (Refinamento) | 🔵 | `RiskScorer` calcula score e nivel de risco com base em findings estaticos e metricas do AST. |

---

## Fase 3: Contexto e Memória
Evolução para entendimento semântico e histórico do projeto.

| Item do Roadmap | Requisitos Vinculados | Status | Notas |
| :--- | :--- | :---: | :--- |
| **Heatmap** | RF-013 (Extensão) | 🔵 | `HeatmapService` implementado para agregar riscos por arquivo com base no historico. |
| **Inteligência Org.** | RF-017, RF-024 | 🔵 | `ContextEngine` implementado para incluir feedback HITL (aprovacoes/rejeicoes) no prompt da IA. |
| **Memória de IA** | RF-024, RF-025, RNF-026, RNF-027, RNF-028 | 🟡 | Contratos `EmbeddingProvider` e `VectorStore` definidos; implementacao RAG pendente. |

---

## Fase 4: Enterprise e Ecossistema
Escalabilidade, multi-cloud e integração com fluxos de trabalho corporativos.

| Item do Roadmap | Requisitos Vinculados | Status | Notas |
| :--- | :--- | :---: | :--- |
| **IA Multi-provedor** | RF-008, RF-009, RF-010, RF-011, RF-027, RF-029, RNF-022, RNF-023 | 🟡 | Suporte configuravel a Mock, OpenAI e Ollama; fallback automatico e provider integrado a IDE ainda pendentes. |
| **Publicação de PRs** | RF-006 (Extensão) | ⚪ | Integração direta com GitHub/GitLab. |
| **Workflow & Auditoria** | RF-022, RNF-017 | ⚪ | Logs e rastreabilidade para conformidade. |
| **Streaming & Perf.** | RF-023, RNF-006, RNF-007, RNF-008, RNF-025 | ⚪ | Otimização para modo Premium Cloud. |

---

## Requisitos Transversais (Garantia de Qualidade)
Estes requisitos devem ser validados em todas as fases.

| Categoria | Requisitos |
| :--- | :--- |
| **Qualidade de Código** | RNF-001, RNF-005, RNF-018, RNF-019, RNF-020 |
| **UX / Acessibilidade** | RNF-013, RNF-014, RNF-015 |
| **Segurança** | RNF-010, RNF-011 |
| **Infraestrutura** | RNF-009, RNF-012, RNF-021 |
