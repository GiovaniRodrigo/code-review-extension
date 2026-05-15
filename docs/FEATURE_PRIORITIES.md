# Feature Priorities — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir prioridades de evolução do produto após estabilização arquitetural.

As prioridades devem focar em:

- valor real para reviewers;
- produtividade;
- workflow de review;
- integração IDE-first;
- IA assistiva;
- comunicação técnica;
- sincronização;
- colaboração.

---

# Estratégia de Priorização

As prioridades são classificadas em:

| Prioridade | Significado |
|---|---|
| P0 | Crítico para MVP |
| P1 | Muito importante |
| P2 | Evolução relevante |
| P3 | Futuro / opcional |

---

# P0 — Core Product

## Objetivo

Entregar o fluxo principal de code review.

---

# Features P0

| Feature | Status |
|---|---|
| Review Session | 🔵 |
| Findings na IDE | 🔵 |
| Navegação por findings | 🔵 |
| Pré-validação IA | 🔵 |
| HITL obrigatório | 🟢 |
| Aprovar/Rejeitar finding | 🔵 |
| Comentário manual | 🔵 |
| Branch diff review | 🔵 |
| PR review | 🔵 |
| Open file review | 🔵 |
| Workspace review | 🔵 |
| Sync com VCS | 🔵 |
| Runtime diagnostics | 🟡 |
| Offline-first | 🟢 |
| Multi-provider IA | 🟢 |

---

# Objetivo do MVP

O reviewer deve conseguir:

```txt
Executar review completo sem sair da IDE
```

---

# P1 — Conversational Review

## Objetivo

Transformar review em comunicação iterativa.

---

# Features P1

| Feature | Status |
|---|---|
| Resposta a findings | ⚪ |
| Lifecycle de findings | 🔵 |
| Histórico de review | ⚪ |
| Revalidação incremental | ⚪ |
| Status por finding | 🔵 |
| Reviewer assignment | ⚪ |
| Discussão por finding | ⚪ |
| Sync incremental | ⚪ |
| Notificações | ⚪ |
| Histórico de respostas | ⚪ |

---

# Workflow esperado

```txt
Reviewer comenta
 ↓
Dev responde
 ↓
Dev corrige
 ↓
Reviewer revalida
 ↓
Reviewer aprova
```

---

# P1 — AI Intelligence

## Objetivo

Transformar IA em copiloto de review.

---

# Features

| Feature | Status |
|---|---|
| AI findings | 🔵 |
| AI confidence score | ⚪ |
| AI architecture analysis | ⚪ |
| AI security review | ⚪ |
| AI performance review | ⚪ |
| AI anti-pattern detection | ⚪ |
| AI rule validation | ⚪ |
| AI contextual analysis | ⚪ |
| AI reviewer suggestions | ⚪ |

---

# P1 — RAG Intelligence

## Objetivo

Contextualizar reviews organizacionalmente.

---

# Features

| Feature | Status |
|---|---|
| Markdown RAG | 🔵 |
| ADR RAG | ⚪ |
| Architecture RAG | ⚪ |
| Team convention RAG | ⚪ |
| Semantic repository RAG | ⚪ |
| Incremental indexing | ⚪ |
| Smart chunking | ⚪ |
| Graph RAG | ⚪ |

---

# P1 — Runtime UX

## Objetivo

Melhorar experiência do reviewer.

---

# Features

| Feature | Status |
|---|---|
| Skeleton loading | ⚪ |
| Error boundaries | ⚪ |
| Retry automático | ⚪ |
| Runtime health panel | ⚪ |
| Provider status | ⚪ |
| RAG indexing progress | ⚪ |
| AI execution progress | ⚪ |
| Empty states | ⚪ |
| Visual severity indicators | 🔵 |

---

# P2 — Team Collaboration

## Objetivo

Adicionar colaboração organizacional.

---

# Features

| Feature | Status |
|---|---|
| Shared sessions | ⚪ |
| Team review workflow | ⚪ |
| Team dashboards | ⚪ |
| Shared history | ⚪ |
| Shared heuristics | ⚪ |
| Team comments | ⚪ |
| Multi-reviewer support | ⚪ |
| Review analytics | ⚪ |

---

# P2 — Heuristics Engine

## Objetivo

Permitir regras organizacionais.

---

# Features

| Feature | Status |
|---|---|
| Custom heuristics | ⚪ |
| Team heuristics | ⚪ |
| Architecture rules | ⚪ |
| Security rules | ⚪ |
| Performance rules | ⚪ |
| Prompt templates | ⚪ |
| Rule marketplace | ⚪ |

---

# P2 — AST Intelligence

## Objetivo

Entender estrutura real do código.

---

# Features

| Feature | Status |
|---|---|
| AST parsing | 🔵 |
| Dependency analysis | ⚪ |
| Architecture violations | ⚪ |
| Cyclic dependency detection | ⚪ |
| Complexity analysis | ⚪ |
| Dead code detection | ⚪ |
| SOLID analysis | ⚪ |
| Design pattern detection | ⚪ |

---

# P3 — Enterprise Platform

## Objetivo

Preparar SaaS enterprise.

---

# Features

| Feature | Status |
|---|---|
| Multi-tenant | ⚪ |
| Team billing | ⚪ |
| Usage quotas | ⚪ |
| License management | ⚪ |
| Cloud sessions | ⚪ |
| Enterprise auth | ⚪ |
| VPS sync | ⚪ |
| Audit logs | ⚪ |
| Governance panel | ⚪ |

---

# Critérios de Priorização

Toda feature deve ser priorizada considerando:

| Critério | Obrigatório |
|---|---|
| Valor para reviewer | ✅ |
| Workflow IDE-first | ✅ |
| Runtime leve | ✅ |
| HITL preservado | ✅ |
| Offline-first | ✅ |
| Configurabilidade | ✅ |
| Integração VCS | ✅ |
| Runtime estável | ✅ |

---

# Features NÃO prioritárias agora

## NÃO priorizar

- gamificação;
- AI totalmente autônoma;
- auto-approval;
- social features;
- marketplace complexo;
- dashboards avançados;
- mobile app;
- plugin browser.

---

# Objetivo Final

O produto deve evoluir para:

```txt
Plataforma Conversacional de Code Review com IA integrada à IDE
```

com:

- IA assistiva;
- workflow iterativo;
- colaboração;
- contexto organizacional;
- sincronização;
- rastreabilidade;
- governança;
- runtime enterprise.