# Code Review Domain Strategy — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir o domínio oficial da plataforma de code review.

O objetivo NÃO é:

```txt
ser apenas uma extensão de comentários
```

O objetivo é:

```txt
ser uma plataforma de governança técnica e comunicação de revisão de código
```

---

# Princípio Principal

Code review representa:

- validação técnica;
- comunicação;
- governança;
- rastreabilidade;
- arquitetura;
- evolução organizacional.

---

# Objetivos do Domínio

Permitir:

- revisão contextual;
- workflow iterativo;
- comunicação técnica;
- revalidação;
- inteligência organizacional.

---

# Entidades Principais

# O sistema deve possuir

| Entidade | Obrigatória |
|---|---|
| Review Session | ✅ |
| Finding | ✅ |
| Comment | ✅ |
| Reviewer Decision | ✅ |
| Runtime Diagnostic | ✅ |
| Heuristic | ✅ |
| RAG Context | ✅ |

---

# Review Session

## Representa

```txt
processo iterativo completo de revisão
```

---

# Deve possuir

| Campo | Obrigatório |
|---|---|
| status | ✅ |
| findings | ✅ |
| histórico | ✅ |
| reviewer | ✅ |
| modo de review | ✅ |

---

# Finding

## Representa

```txt
não conformidade técnica contextual
```

---

# Deve possuir

| Campo | Obrigatório |
|---|---|
| severidade | ✅ |
| categoria | ✅ |
| contexto | ✅ |
| status | ✅ |
| histórico | ✅ |

---

# Comment

## Representa

```txt
comunicação técnica contextual
```

---

# Reviewer Decision

## Representa

```txt
decisão técnica rastreável
```

---

# Runtime Diagnostic

## Representa

```txt
problema operacional do runtime
```

---

# Runtime diagnostics NÃO são findings funcionais.

---

# Heuristic

## Representa

```txt
regra organizacional configurável
```

---

# RAG Context

## Representa

```txt
conhecimento técnico contextual
```

---

# Workflow Principal

```txt
Reviewer inicia review
 ↓
IA executa pré-validação
 ↓
Reviewer analisa findings
 ↓
Developer responde
 ↓
Reviewer revalida
 ↓
Review aprovado
```

---

# Objetivo

Permitir:

```txt
workflow iterativo contínuo
```

---

# Lifecycle de Review

```txt
CREATED
↓
PRE_VALIDATING
↓
IN_REVIEW
↓
WAITING_FIXES
↓
REVALIDATING
↓
APPROVED
↓
CLOSED
```

---

# Lifecycle de Finding

```txt
OPEN
↓
IN_REVIEW
↓
FIX_REQUESTED
↓
FIXED
↓
REVALIDATED
↓
APPROVED
↓
CLOSED
```

---

# Estratégia HITL

# Obrigatório

Toda decisão final deve ser humana.

---

# A IA pode

- sugerir findings;
- sugerir severidade;
- contextualizar problemas;
- sugerir melhorias.

---

# A IA NÃO pode

- aprovar review;
- fechar findings automaticamente;
- substituir reviewer.

---

# Estratégia Offline

# O domínio deve funcionar

- localmente;
- offline;
- sem cloud.

---

# Estratégia Cloud

# Cloud deve adicionar

- colaboração;
- sync;
- analytics;
- inteligência organizacional.

---

# Estratégia Organizacional

# O domínio deve permitir

| Recurso | Obrigatório |
|---|---|
| heurísticas organizacionais | ⚪ |
| políticas organizacionais | ⚪ |
| analytics organizacionais | ⚪ |

---

# Objetivo Final

O domínio deve evoluir como:

```txt
Plataforma de Governança Técnica e Comunicação de Review
```

e NÃO apenas:

```txt
sistema de comentários de Pull Request
```