# Review Findings Strategy — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir a estratégia oficial de findings do sistema.

Findings NÃO devem funcionar apenas como:

```txt
comentários soltos
```

Findings devem funcionar como:

```txt
entidades rastreáveis de comunicação técnica
```

---

# Objetivo dos Findings

Os findings devem permitir:

- comunicação técnica;
- rastreabilidade;
- workflow iterativo;
- revalidação;
- sincronização;
- contexto arquitetural;
- histórico técnico.

---

# Conceito Principal

Um finding representa:

```txt
não conformidade técnica contextual
```

---

# Origens do Finding

# O finding pode ser criado por

| Origem | Obrigatória |
|---|---|
| IA | ✅ |
| Reviewer | ✅ |
| Heurísticas | ✅ |
| AST Analysis | ⚪ |
| Runtime Diagnostics | ⚪ |

---

# A IA NÃO é dona do finding

A IA apenas:

- sugere;
- contextualiza;
- recomenda.

O reviewer humano decide.

---

# Estrutura do Finding

# Todo finding deve possuir

| Campo | Obrigatório |
|---|---|
| id | ✅ |
| título | ✅ |
| descrição | ✅ |
| categoria | ✅ |
| severidade | ✅ |
| status | ✅ |
| reviewer | ✅ |
| origem | ✅ |
| arquivo | ✅ |
| linha | ✅ |
| contexto | ✅ |
| histórico | ✅ |

---

# Categorias

| Categoria | Descrição |
|---|---|
| ARCHITECTURE | violação arquitetural |
| SECURITY | risco de segurança |
| PERFORMANCE | problema de performance |
| QUALITY | problema de qualidade |
| STRUCTURE | problema estrutural |
| CONVENTION | convenção violada |
| RUNTIME | problema de runtime |

---

# Severidades

| Severidade | Descrição |
|---|---|
| INFO | melhoria opcional |
| WARNING | risco moderado |
| CRITICAL | problema grave |
| BLOCKER | impeditivo |
| ARCHITECTURE | problema arquitetural |
| SECURITY | risco de segurança |

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

# Objetivo do Lifecycle

Permitir:

- comunicação iterativa;
- reabertura;
- revalidação;
- rastreabilidade;
- histórico.

---

# Comentários

# Comentários representam

```txt
discussão técnica contextual
```

---

# Comentários devem permitir

| Recurso | Obrigatório |
|---|---|
| resposta | ✅ |
| edição | ✅ |
| histórico | ✅ |
| contexto técnico | ✅ |
| reviewer tracking | ✅ |

---

# Reviewer Decision

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

# Revalidação Incremental

# O sistema deve detectar

| Situação | Obrigatória |
|---|---|
| finding corrigido | ✅ |
| finding persistente | ✅ |
| finding alterado | ✅ |
| novo finding | ✅ |
| conflito de review | ✅ |

---

# Objetivo

Evitar:

```txt
reanálise manual completa
```

---

# Findings IA

# Findings IA devem possuir

| Campo | Obrigatório |
|---|---|
| confidence score | ✅ |
| contexto IA | ✅ |
| provider IA | ✅ |
| heurísticas utilizadas | ⚪ |
| contexto RAG | ⚪ |

---

# Confidence Score

## Objetivo

Ajudar reviewer a decidir.

---

# Exemplo

| Score | Significado |
|---|---|
| 0-30 | baixa confiança |
| 31-70 | média confiança |
| 71-100 | alta confiança |

---

# Findings de Arquitetura

# Devem identificar

| Problema | Obrigatório |
|---|---|
| layer violation | ✅ |
| cyclic dependency | ✅ |
| acoplamento excessivo | ✅ |
| boundary violation | ✅ |
| infra leakage | ✅ |

---

# Findings de Runtime

# Devem identificar

| Problema | Obrigatório |
|---|---|
| duplicated registration | ✅ |
| runtime diagnostics | ✅ |
| provider failure | ✅ |
| sync failure | ✅ |

---

# Runtime Findings NÃO devem

- poluir review técnico;
- aparecer junto de findings funcionais;
- interromper reviewer.

---

# UI dos Findings

# A UI deve permitir

| Recurso | Obrigatório |
|---|---|
| agrupamento | ✅ |
| filtros | ✅ |
| navegação por linha | ✅ |
| highlight no editor | ✅ |
| status visual | ✅ |
| severidade visual | ✅ |

---

# Agrupamentos

# Deve permitir

| Agrupamento | Obrigatório |
|---|---|
| severidade | ✅ |
| categoria | ✅ |
| arquivo | ✅ |
| reviewer | ⚪ |
| status | ✅ |

---

# Navegação

# O reviewer deve conseguir

- abrir arquivo;
- navegar até linha;
- visualizar contexto;
- responder rapidamente.

---

# Histórico

# Todo finding deve manter

| Histórico | Obrigatório |
|---|---|
| criação | ✅ |
| alterações | ✅ |
| respostas | ✅ |
| reaberturas | ✅ |
| aprovações | ✅ |

---

# Objetivo Final

Os findings devem evoluir como:

```txt
Entidades de Comunicação Técnica Rastreável
```

e NÃO apenas:

```txt
comentários simples de review
```