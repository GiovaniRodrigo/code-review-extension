# Workflow State Machine — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir oficialmente a máquina de estados do workflow.

---

# Review Lifecycle

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

# Finding Lifecycle

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

# Estados Obrigatórios

| Estado | Obrigatório |
|---|---|
| CREATED | ✅ |
| PRE_VALIDATING | ✅ |
| IN_REVIEW | ✅ |
| WAITING_FIXES | ✅ |
| REVALIDATING | ✅ |
| APPROVED | ✅ |
| CLOSED | ✅ |

---

# Regras Obrigatórias

# O sistema NÃO pode

- aprovar automaticamente;
- fechar automaticamente;
- alterar estado final sem humano.

---

# Estratégia HITL

# Obrigatório

Toda transição crítica deve possuir validação humana.

---

# Objetivo Final

A state machine deve evoluir como:

```txt
modelo oficial do workflow técnico incremental
```