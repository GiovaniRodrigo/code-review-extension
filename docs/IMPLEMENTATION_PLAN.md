# Roadmap de Implementação — Extensão Multi-IDE de Code Review com IA

---

# Legenda

| Status | Significado |
|---|---|
| ⚪ TODO | Ainda não iniciado |
| 🔵 DEV | Em desenvolvimento |
| 🟡 HML | Em homologação |
| 🟢 DONE | Finalizado e Validado |

---

# Controle Geral de Implementação

| ID | Status | Módulo | Progresso | Responsável | Dependência |
|---|---|---|---:|---|---|
| EP-01 | 🟢 DONE | Fundação Arquitetural | 100% | - | - |
| EP-02 | 🟢 DONE | Integração Multi-IDE | 100% | - | EP-01 |
| EP-03 | 🟢 DONE | Core de Code Review | 100% | - | EP-01 |
| EP-04 | 🟢 DONE | Providers de IA | 100% | - | EP-03 |
| EP-05 | 🟢 DONE | Sistema RAG | 100% | - | EP-04 |
| EP-06 | 🟢 DONE | AST Builder | 100% | - | EP-03 |
| EP-07 | 🟢 DONE | Analyzers | 100% | - | EP-06 |
| EP-08 | 🟢 DONE | Persistência Local | 100% | - | EP-03 |
| EP-09 | 🔵 DEV | VPS / Git Sync | 20% | - | EP-03 |
| EP-10 | 🟢 DONE | UI/UX | 100% | - | EP-02 |
| EP-11 | 🟢 DONE | Testes | 100% | - | TODOS |
| EP-12 | 🟢 DONE | Documentação | 100% | - | TODOS |

---

# EP-01 — Fundação Arquitetural

| ID | Status | Task | Tipo | Prioridade | Progresso |
|---|---|---|---|---|---:|
| ARC-001 | 🟢 DONE | Definir estrutura do monorepo | Arquitetura | Alta | 100% |
| ARC-002 | 🟢 DONE | Criar pacotes core, domain, infra | Arquitetura | Alta | 100% |
| ARC-003 | 🟢 DONE | Configurar TurboRepo | Build | Média | 100% |
| ARC-004 | 🟢 DONE | Definir contratos base (IDEAdapter) | Design | Alta | 100% |

---

# EP-02 — Integração Multi-IDE

| ID | Status | Task | Tipo | Prioridade | Progresso |
|---|---|---|---|---|---:|
| IDE-001 | 🟢 DONE | Implementar Adapter VS Code | IDE | Alta | 100% |
| IDE-002 | 🟢 DONE | Criar placeholder JetBrains | IDE | Média | 100% |
| IDE-003 | 🟢 DONE | Criar placeholder Neovim | IDE | Baixa | 100% |
| IDE-004 | 🟢 DONE | Validar bootstrap multi-IDE | IDE | Alta | 100% |

---

# EP-03 — Core de Code Review

| ID | Status | Task | Tipo | Prioridade | Progresso |
|---|---|---|---|---|---:|
| REV-001 | 🟢 DONE | Criar Use Cases de análise | Core | Alta | 100% |
| REV-002 | 🟢 DONE | Implementar motor de severidade | Core | Média | 100% |
| REV-003 | 🟢 DONE | Sistema de persistência de sessão | Core | Alta | 100% |
| REV-004 | 🟢 DONE | Fluxo Human-in-the-Loop (HITL) | Core | Alta | 100% |

---

# EP-04 — Providers de IA

| ID | Status | Task | Tipo | Prioridade | Progresso |
|---|---|---|---|---|---:|
| AI-001 | 🟢 DONE | Implementar Mock AI | Provider | Baixa | 100% |
| AI-002 | 🟢 DONE | Implementar Ollama Provider | Provider | Alta | 100% |
| AI-003 | 🟢 DONE | Implementar OpenAI Provider | Provider | Alta | 100% |
| AI-004 | 🟢 DONE | Criar AIProviderFactory | Provider | Média | 100% |

---

# EP-05 — Sistema RAG

| ID | Status | Task | Tipo | Prioridade | Progresso |
|---|---|---|---|---|---:|
| RAG-001 | 🟢 DONE | Implementar Chunker semântico | Core | Alta | 100% |
| RAG-002 | 🟢 DONE | Criar Vector Store local | Infra | Alta | 100% |
| RAG-003 | 🟢 DONE | Indexador de repositório | Core | Alta | 100% |
| RAG-004 | 🟢 DONE | Busca contextual (Retrieval) | Core | Alta | 100% |

---

# EP-06 — AST Builder

| ID | Status | Task | Tipo | Prioridade | Progresso |
|---|---|---|---|---|---:|
| AST-001 | 🟢 DONE | Criar AstBuilderPort | Core | Alta | 100% |
| AST-002 | 🟢 DONE | Implementar TypeScript AST | Infra | Alta | 100% |
| AST-003 | 🟢 DONE | Implementar parser de imports | Infra | Alta | 100% |
| AST-004 | 🟢 DONE | Criar dependency graph | Infra | Alta | 100% |
| AST-005 | 🟢 DONE | Integrar AST ao RAG | Core | Alta | 100% |
| AST-006 | 🟢 DONE | Integrar AST aos analyzers | Core | Alta | 100% |

---

# EP-11 — Testes

| ID | Status | Task | Tipo | Prioridade | Progresso |
|---|---|---|---|---|---:|
| TST-001 | 🟢 DONE | Setup de Vitest no monorepo | DevOps | Alta | 100% |
| TST-002 | 🟢 DONE | Testes unitários do Core | Teste | Alta | 100% |
| TST-003 | 🟢 DONE | Testes de integração VS Code | Teste | Alta | 100% |
| TST-004 | 🟢 DONE | Configurar Mutation Testing | Teste | Baixa | 100% |
