# Review Session Domain — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir o domínio central do sistema.

O centro do produto NÃO é:

```txt
IA
```

O centro do produto é:

```txt
Review Session
```

Toda funcionalidade deve orbitar ao redor da sessão de review.

---

# Objetivo da Review Session

A sessão de review representa:

- comunicação técnica;
- rastreabilidade;
- lifecycle do review;
- histórico;
- findings;
- contexto;
- sincronização;
- colaboração.

---

# Conceito Principal

Uma sessão representa:

```txt
processo iterativo de validação técnica
```

entre:

- reviewer;
- desenvolvedor;
- IA assistiva.

---

# Estrutura Conceitual

# Uma Review Session deve conter

| Área | Obrigatória |
|---|---|
| Reviewer | ✅ |
| Target de review | ✅ |
| Findings | ✅ |
| Comentários | ✅ |
| Histórico | ✅ |
| Status | ✅ |
| Sync state | ✅ |
| Provider IA | ✅ |
| RAG Context | ✅ |
| Heurísticas | ✅ |

---

# Targets de Review

## O sistema deve suportar

| Tipo | Obrigatório |
|---|---|
| Pull Request | ✅ |
| Branch Diff | ✅ |
| Commit | ⚪ |
| Open File | ✅ |
| Workspace | ✅ |

---

# Estados da Sessão

## Lifecycle

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

# Objetivo do Lifecycle

Permitir:

- rastreabilidade;
- workflow iterativo;
- comunicação;
- sincronização;
- histórico de decisões.

---

# Findings

# Um finding representa

```txt
não conformidade técnica
```

---

# Um finding deve possuir

| Campo | Obrigatório |
|---|---|
| id | ✅ |
| título | ✅ |
| descrição | ✅ |
| severidade | ✅ |
| arquivo | ✅ |
| linha | ✅ |
| categoria | ✅ |
| status | ✅ |
| origem | ✅ |
| reviewer | ✅ |
| comentários | ✅ |
| histórico | ✅ |

---

# Origem do Finding

## O finding pode vir de

| Origem | Obrigatória |
|---|---|
| IA | ✅ |
| Reviewer | ✅ |
| Heurística | ✅ |
| AST Analysis | ⚪ |
| Runtime Diagnostics | ⚪ |

---

# Lifecycle do Finding

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

# Objetivo do Finding Lifecycle

Permitir:

- comunicação iterativa;
- rastreabilidade;
- histórico;
- reabertura;
- revalidação incremental.

---

# Comentários

# Comentários representam

```txt
comunicação técnica contextual
```

---

# Comentários devem permitir

| Ação | Obrigatória |
|---|---|
| responder | ✅ |
| editar | ✅ |
| mencionar usuário | ⚪ |
| anexar contexto | ⚪ |
| anexar diff | ⚪ |

---

# Reviewer Decision

## O reviewer deve conseguir

| Ação | Obrigatória |
|---|---|
| aceitar finding | ✅ |
| rejeitar finding | ✅ |
| editar finding | ✅ |
| complementar finding | ✅ |
| reabrir finding | ✅ |
| aprovar correção | ✅ |

---

# IA dentro da Sessão

# A IA NÃO é dona da sessão

A IA apenas auxilia.

---

# A IA pode

- gerar findings;
- sugerir severidade;
- sugerir correções;
- contextualizar;
- identificar riscos.

---

# A IA NÃO pode

- aprovar automaticamente;
- fechar findings;
- tomar decisão final.

---

# Sincronização

# O sistema deve suportar

| Tipo | Obrigatório |
|---|---|
| sync local | ✅ |
| sync cloud | ⚪ |
| sync incremental | ✅ |
| sync por branch | ✅ |
| sync por PR | ✅ |

---

# Revalidação Incremental

## O sistema deve detectar

- findings persistentes;
- findings corrigidos;
- findings alterados;
- novos findings;
- conflitos.

---

# Objetivo

Evitar:

```txt
reanálise completa manual
```

---

# Heurísticas

# A sessão deve permitir

| Tipo | Obrigatório |
|---|---|
| heurísticas locais | ✅ |
| heurísticas organizacionais | ⚪ |
| heurísticas arquiteturais | ⚪ |
| heurísticas de segurança | ⚪ |

---

# Runtime

## O sistema NÃO pode

- travar IDE;
- congelar webview;
- bloquear editor;
- gerar duplicated registration;
- perder sessão.

---

# Runtime deve possuir

| Recurso | Obrigatório |
|---|---|
| autosave | ✅ |
| restore session | ✅ |
| retry | ✅ |
| fallback | ✅ |
| loading state | ✅ |

---

# Offline Mode

## Obrigatório

A sessão deve funcionar:

- localmente;
- offline;
- sem cloud;
- sem sync remoto.

---

# Cloud Mode

## Deve permitir

- compartilhamento;
- colaboração;
- histórico;
- analytics;
- dashboards;
- workflows organizacionais.

---

# Objetivo Final

A Review Session deve evoluir como:

```txt
Entidade Central de Comunicação Técnica de Code Review
```

e NÃO apenas:

```txt
lista de findings
```