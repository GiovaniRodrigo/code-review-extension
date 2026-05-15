# Review Lifecycle Strategy — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir o lifecycle oficial de reviews da plataforma.

O review NÃO deve funcionar como:

```txt
comentário estático
```

O review deve funcionar como:

```txt
processo iterativo de comunicação técnica
```

---

# Princípio Principal

Code review é:

- comunicação;
- validação;
- revalidação;
- rastreabilidade;
- colaboração.

---

# Workflow Principal

```txt
Reviewer inicia review
 ↓
IA executa pré-validação
 ↓
Reviewer analisa findings
 ↓
Reviewer adiciona comentários
 ↓
Review sincronizado
 ↓
Developer responde/corrige
 ↓
Reviewer revalida
 ↓
Review aprovado
```

---

# Estados da Review Session

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

# Estados do Finding

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

# Objetivo do Lifecycle

Permitir:

- rastreabilidade;
- histórico;
- revalidação incremental;
- comunicação técnica;
- workflow organizacional.

---

# Reviewer Workflow

# O reviewer deve conseguir

| Ação | Obrigatória |
|---|---|
| aceitar finding | ✅ |
| rejeitar finding | ✅ |
| editar finding | ✅ |
| complementar finding | ✅ |
| reabrir finding | ✅ |
| aprovar correção | ✅ |

---

# Developer Workflow

# O desenvolvedor deve conseguir

| Ação | Obrigatória |
|---|---|
| responder comentário | ✅ |
| justificar decisão | ✅ |
| marcar como corrigido | ✅ |
| subir nova alteração | ✅ |
| solicitar revalidação | ✅ |

---

# Revalidação Incremental

# O sistema deve detectar

| Situação | Obrigatória |
|---|---|
| finding corrigido | ✅ |
| finding persistente | ✅ |
| novo finding | ✅ |
| regressão | ✅ |
| conflito | ✅ |

---

# Objetivo

Evitar:

```txt
reanálise completa manual
```

---

# Histórico

# Toda sessão deve manter

| Histórico | Obrigatório |
|---|---|
| findings | ✅ |
| comentários | ✅ |
| decisões | ✅ |
| respostas | ✅ |
| reaberturas | ✅ |

---

# Objetivo do Histórico

Permitir:

- auditoria;
- rastreabilidade;
- analytics;
- inteligência organizacional.

---

# Workflow HITL

# Obrigatório

Toda decisão final deve ser humana.

---

# A IA pode

- sugerir findings;
- contextualizar;
- identificar riscos;
- sugerir melhorias.

---

# A IA NÃO pode

- aprovar review;
- fechar findings automaticamente;
- substituir reviewer.

---

# Workflow Offline

# O sistema deve funcionar

- sem cloud;
- sem internet;
- sem sync remoto.

---

# Workflow Cloud

# Cloud deve permitir

| Recurso | Obrigatório |
|---|---|
| sessões compartilhadas | ✅ |
| sync | ✅ |
| colaboração | ✅ |
| analytics | ⚪ |

---

# Runtime

# O lifecycle NÃO pode

- travar IDE;
- perder sessão;
- perder findings;
- perder histórico.

---

# Runtime deve possuir

| Recurso | Obrigatório |
|---|---|
| autosave | ✅ |
| restore session | ✅ |
| retry | ✅ |
| reconnect | ✅ |

---

# Objetivo Final

O lifecycle deve evoluir como:

```txt
Workflow Iterativo de Comunicação Técnica
```

e NÃO como:

```txt
processo estático de comentários
```