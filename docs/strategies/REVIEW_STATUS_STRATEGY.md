# Review Status Strategy — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir a estratégia oficial de status de review e findings.

O objetivo NÃO é:

```txt
mostrar etiquetas visuais
```

O objetivo é:

```txt
representar o estado real do workflow técnico
```

---

# Princípio Principal

Status representam:

- progresso;
- responsabilidade;
- rastreabilidade;
- governança;
- comunicação técnica.

---

# Objetivo dos Status

Permitir:

- entendimento rápido do estado;
- workflow iterativo;
- priorização;
- revalidação;
- colaboração.

---

# Status da Review Session

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

# CREATED

## Objetivo

Sessão criada mas ainda não analisada.

---

# PRE_VALIDATING

## Objetivo

IA executando pré-validação.

---

# IN_REVIEW

## Objetivo

Reviewer analisando findings.

---

# WAITING_FIXES

## Objetivo

Aguardando correções do developer.

---

# REVALIDATING

## Objetivo

Reviewer reavaliando alterações.

---

# APPROVED

## Objetivo

Review aprovado.

---

# CLOSED

## Objetivo

Workflow encerrado.

---

# Status de Findings

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

# OPEN

## Objetivo

Finding recém criado.

---

# IN_REVIEW

## Objetivo

Finding sendo analisado.

---

# FIX_REQUESTED

## Objetivo

Correção solicitada.

---

# FIXED

## Objetivo

Developer informou correção.

---

# REVALIDATED

## Objetivo

Reviewer reavaliou correção.

---

# APPROVED

## Objetivo

Reviewer aprovou correção.

---

# CLOSED

## Objetivo

Workflow encerrado.

---

# Objetivo do Lifecycle

Permitir:

- rastreabilidade;
- histórico;
- comunicação iterativa;
- governança contínua.

---

# Estratégia de UI

# Status devem possuir

| Recurso | Obrigatório |
|---|---|
| indicador visual | ✅ |
| agrupamento | ✅ |
| filtros | ✅ |
| prioridade visual | ✅ |

---

# O reviewer deve conseguir

| Ação | Obrigatória |
|---|---|
| alterar status | ✅ |
| reabrir finding | ✅ |
| aprovar correção | ✅ |
| solicitar novo ajuste | ✅ |

---

# Estratégia de Revalidação

# O sistema deve atualizar status automaticamente quando

| Situação | Obrigatória |
|---|---|
| fix detectado | ✅ |
| novo finding | ✅ |
| regressão | ✅ |

---

# Objetivo

Evitar:

```txt
status inconsistentes
```

---

# Estratégia de Runtime

# Status NÃO podem

- travar IDE;
- perder sincronização;
- quebrar workflow.

---

# Runtime deve possuir

| Recurso | Obrigatório |
|---|---|
| autosave | ✅ |
| restore session | ✅ |
| retry | ✅ |
| offline cache | ✅ |

---

# Estratégia Offline

# Status devem funcionar

- localmente;
- offline;
- sem cloud.

---

# Estratégia Cloud

# Cloud deve adicionar

- status compartilhados;
- workflow colaborativo;
- analytics organizacionais.

---

# Objetivo Final

Os status devem evoluir como:

```txt
Camada de Governança do Workflow Técnico
```

e NÃO apenas:

```txt
labels simples de interface
```