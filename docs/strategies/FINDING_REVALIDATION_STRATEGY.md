# Finding Revalidation Strategy — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir a estratégia oficial de revalidação incremental de findings.

O objetivo NÃO é:

```txt
reanalisar tudo sempre
```

O objetivo é:

```txt
detectar evolução real do review
```

---

# Princípio Principal

O review é:

```txt
iterativo
```

O sistema deve entender:

- o que mudou;
- o que foi corrigido;
- o que permanece;
- o que regrediu;
- o que é novo.

---

# Objetivo da Revalidação

Permitir:

- continuidade do workflow;
- redução de esforço;
- rastreabilidade;
- comunicação incremental;
- governança técnica.

---

# O sistema deve detectar

| Situação | Obrigatória |
|---|---|
| finding corrigido | ✅ |
| finding persistente | ✅ |
| finding alterado | ✅ |
| novo finding | ✅ |
| regressão | ✅ |
| conflito | ✅ |

---

# Objetivo

Evitar:

```txt
reanálise manual completa
```

---

# Workflow Oficial

```txt
Reviewer cria finding
 ↓
Developer corrige código
 ↓
Nova alteração detectada
 ↓
Sistema revalida findings
 ↓
Reviewer avalia mudanças
```

---

# Estratégia Incremental

# O sistema deve analisar

- apenas arquivos alterados;
- apenas trechos modificados;
- apenas módulos impactados;
- dependências relacionadas.

---

# Contextos Utilizados

# O sistema deve utilizar

| Fonte | Obrigatória |
|---|---|
| diff | ✅ |
| AST | ✅ |
| heurísticas | ✅ |
| histórico | ✅ |
| RAG | ⚪ |

---

# Estratégia AST

# O AST deve ajudar a identificar

| Situação | Obrigatória |
|---|---|
| refatoração estrutural | ✅ |
| mudança de método | ✅ |
| mudança de responsabilidade | ✅ |
| impacto arquitetural | ✅ |

---

# Estratégia de Similaridade

# O sistema deve detectar

| Situação | Obrigatória |
|---|---|
| finding movido | ✅ |
| finding parcialmente corrigido | ✅ |
| finding renomeado | ⚪ |
| código equivalente | ⚪ |

---

# Lifecycle de Revalidação

```txt
FIX_REQUESTED
↓
FIXED
↓
REVALIDATED
↓
APPROVED
```

---

# Findings Persistentes

# O sistema deve identificar

```txt
problema ainda existente
```

mesmo quando:

- linha mudou;
- código foi movido;
- método foi alterado.

---

# Objetivo

Evitar:

```txt
perda de rastreabilidade
```

---

# Regressões

# O sistema deve detectar

| Situação | Obrigatória |
|---|---|
| problema reintroduzido | ✅ |
| arquitetura degradada | ✅ |
| regra violada novamente | ✅ |

---

# Objetivo

Permitir:

```txt
governança contínua
```

---

# UI de Revalidação

# O reviewer deve visualizar

| Informação | Obrigatória |
|---|---|
| corrigido | ✅ |
| persistente | ✅ |
| novo | ✅ |
| regressão | ✅ |
| parcialmente corrigido | ✅ |

---

# O reviewer deve conseguir

| Ação | Obrigatória |
|---|---|
| aprovar correção | ✅ |
| reabrir finding | ✅ |
| complementar comentário | ✅ |
| solicitar novo ajuste | ✅ |

---

# Runtime

# A revalidação NÃO pode

- travar IDE;
- congelar runtime;
- bloquear editor.

---

# Runtime deve possuir

| Recurso | Obrigatório |
|---|---|
| incremental analysis | ✅ |
| debounce | ✅ |
| timeout | ✅ |
| background execution | ✅ |

---

# Estratégia Offline

# O sistema deve funcionar

- localmente;
- offline;
- sem cloud.

---

# Estratégia Cloud

# Cloud pode adicionar

- histórico consolidado;
- analytics de regressão;
- inteligência organizacional.

---

# Objetivo Final

A revalidação deve evoluir como:

```txt
Motor Incremental de Evolução Técnica do Review
```

e NÃO apenas:

```txt
reanálise simples de diff
```