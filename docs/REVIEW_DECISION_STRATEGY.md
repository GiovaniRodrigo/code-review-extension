# Review Decision Strategy — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir a estratégia oficial de decisões de review.

O objetivo NÃO é:

```txt
marcar comentários como resolvidos
```

O objetivo é:

```txt
formalizar decisões técnicas rastreáveis
```

---

# Princípio Principal

Toda decisão representa:

- validação técnica;
- comunicação;
- responsabilidade;
- governança;
- histórico organizacional.

---

# Objetivo das Decisões

Permitir:

- rastreabilidade;
- workflow iterativo;
- revalidação;
- histórico;
- auditoria técnica.

---

# HITL

# Obrigatório

Toda decisão final deve ser humana.

---

# A IA pode

- sugerir severidade;
- sugerir findings;
- sugerir contexto;
- sugerir risco.

---

# A IA NÃO pode

- aprovar review automaticamente;
- fechar findings automaticamente;
- substituir reviewer.

---

# Tipos de Decisão

# O reviewer deve conseguir

| Decisão | Obrigatória |
|---|---|
| aceitar finding | ✅ |
| rejeitar finding | ✅ |
| solicitar ajuste | ✅ |
| aprovar correção | ✅ |
| reabrir finding | ✅ |
| complementar finding | ✅ |

---

# Lifecycle

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

- continuidade do workflow;
- rastreabilidade;
- histórico técnico;
- governança.

---

# Contexto da Decisão

# Toda decisão deve possuir

| Contexto | Obrigatório |
|---|---|
| reviewer | ✅ |
| timestamp | ✅ |
| finding relacionado | ✅ |
| comentário | ✅ |
| severidade | ✅ |

---

# Histórico

# Toda decisão deve ser preservada

---

# O sistema deve manter

| Histórico | Obrigatório |
|---|---|
| decisões | ✅ |
| alterações | ✅ |
| reaberturas | ✅ |
| aprovações | ✅ |

---

# Objetivo

Permitir:

```txt
memória técnica organizacional
```

---

# Estratégia de Revalidação

# O sistema deve permitir

| Ação | Obrigatória |
|---|---|
| reabrir finding | ✅ |
| aprovar nova correção | ✅ |
| complementar comentário | ✅ |

---

# Objetivo

Evitar:

```txt
review estático
```

---

# Estratégia Offline

# O sistema deve funcionar

- localmente;
- offline;
- sem cloud.

---

# Estratégia Cloud

# Cloud deve adicionar

- decisões compartilhadas;
- workflows colaborativos;
- analytics organizacionais.

---

# Runtime

# Decisões NÃO podem

- travar IDE;
- bloquear review;
- perder estado.

---

# Runtime deve possuir

| Recurso | Obrigatório |
|---|---|
| autosave | ✅ |
| restore session | ✅ |
| retry | ✅ |
| offline cache | ✅ |

---

# Objetivo Final

As decisões devem evoluir como:

```txt
Entidades Rastreáveis de Governança Técnica
```

e NÃO apenas:

```txt
status simples de comentário
```