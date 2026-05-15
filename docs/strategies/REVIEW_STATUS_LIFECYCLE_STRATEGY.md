# Review Status Lifecycle Strategy — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir a estratégia oficial de lifecycle de status da plataforma.

O objetivo NÃO é:

```txt
alterar labels visuais
```

O objetivo é:

```txt
representar o estado real do workflow técnico iterativo
```

---

# Princípio Principal

Status representam:

- continuidade;
- evolução;
- rastreabilidade;
- colaboração;
- governança operacional.

---

# Objetivos do Lifecycle

Permitir:

- representar workflow real;
- preservar histórico;
- rastrear evolução;
- suportar colaboração;
- suportar revalidação.

---

# Lifecycle Oficial da Review

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

## Representa

```txt
review inicial criada
```

---

# PRE_VALIDATING

## Representa

```txt
pré-validação IA em execução
```

---

# IN_REVIEW

## Representa

```txt
review ativa em análise humana
```

---

# WAITING_FIXES

## Representa

```txt
aguardando correções do developer
```

---

# REVALIDATING

## Representa

```txt
revalidação incremental em andamento
```

---

# APPROVED

## Representa

```txt
review validada pelo reviewer
```

---

# CLOSED

## Representa

```txt
workflow finalizado
```

---

# Lifecycle Oficial do Finding

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

# Objetivo

Permitir:

```txt
rastreamento real da evolução técnica
```

---

# Estratégia de Histórico

# O sistema deve preservar

| Informação | Obrigatória |
|---|---|
| mudanças de status | ✅ |
| reaberturas | ✅ |
| regressões | ✅ |
| aprovações | ✅ |

---

# Estratégia Incremental

# O sistema deve atualizar

- apenas status alterados;
- apenas findings impactados;
- apenas contexto relevante.

---

# Objetivo

Evitar:

```txt
reescrita completa de estado
```

---

# Estratégia HITL

# Obrigatório

Toda aprovação final continua humana.

---

# Estratégia de Runtime

# Lifecycle NÃO pode

- travar IDE;
- bloquear workflow;
- degradar runtime.

---

# Runtime deve possuir

| Recurso | Obrigatório |
|---|---|
| autosave | ✅ |
| restore state | ✅ |
| retry | ✅ |
| reconnect | ✅ |

---

# Estratégia Offline

# Lifecycle deve funcionar

- localmente;
- offline;
- sem cloud.

---

# Estratégia Cloud

# Cloud pode adicionar

- workflows organizacionais;
- colaboração compartilhada;
- histórico organizacional.

---

# Estratégia de UX

# O reviewer deve visualizar

| Informação | Obrigatória |
|---|---|
| status atual | ✅ |
| histórico do status | ✅ |
| regressões | ✅ |
| reaberturas | ✅ |

---

# Objetivo Final

O lifecycle deve evoluir como:

```txt
Camada Incremental de Evolução e Governança do Workflow Técnico
```

e NÃO apenas:

```txt
alteração visual de estados
```