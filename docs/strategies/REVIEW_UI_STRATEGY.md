# Review UI Strategy — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir a estratégia oficial de interface do sistema.

O objetivo NÃO é:

```txt
mostrar listas de findings
```

O objetivo é:

```txt
permitir fluxo natural de comunicação técnica dentro da IDE
```

---

# Princípio Principal

A UI deve parecer:

```txt
parte natural da IDE
```

---

# Objetivos da UI

Permitir:

- navegação rápida;
- análise contextual;
- comunicação técnica;
- revalidação;
- workflow incremental.

---

# Sidebar Principal

# Deve mostrar

| Informação | Obrigatória |
|---|---|
| findings | ✅ |
| severidade | ✅ |
| status | ✅ |
| categoria | ✅ |
| provider IA | ✅ |
| sync state | ✅ |

---

# Navegação

# O reviewer deve conseguir

| Ação | Obrigatória |
|---|---|
| abrir arquivo | ✅ |
| navegar para linha | ✅ |
| alternar findings | ✅ |
| visualizar contexto | ✅ |
| abrir diff | ✅ |

---

# Agrupamentos

# O sistema deve permitir agrupamento por

| Agrupamento | Obrigatório |
|---|---|
| severidade | ✅ |
| categoria | ✅ |
| arquivo | ✅ |
| status | ✅ |

---

# Filtros

# O sistema deve permitir filtros por

| Filtro | Obrigatório |
|---|---|
| severidade | ✅ |
| categoria | ✅ |
| status | ✅ |
| origem | ✅ |

---

# Visualização de Findings

# Todo finding deve mostrar

| Informação | Obrigatória |
|---|---|
| título | ✅ |
| descrição | ✅ |
| severidade | ✅ |
| categoria | ✅ |
| confidence IA | ✅ |
| status | ✅ |

---

# Workflow HITL

# O reviewer deve conseguir

| Ação | Obrigatória |
|---|---|
| aceitar IA | ✅ |
| rejeitar IA | ✅ |
| editar finding | ✅ |
| complementar comentário | ✅ |

---

# Runtime UX

# A UI NÃO pode

- travar IDE;
- congelar editor;
- bloquear typing;
- gerar popup excessivo.

---

# Runtime deve possuir

| Recurso | Obrigatório |
|---|---|
| loading state | ✅ |
| progress state | ✅ |
| retry | ✅ |
| fallback | ✅ |
| background execution | ✅ |

---

# Webviews

# Webviews devem

| Recurso | Obrigatório |
|---|---|
| restaurar estado | ✅ |
| sobreviver reload | ✅ |
| possuir error boundary | ✅ |
| possuir reconnect | ✅ |

---

# Webviews NÃO podem

- perder findings;
- perder sessão;
- perder scroll;
- travar runtime.

---

# Estratégia Visual

# O sistema deve possuir

| Recurso | Obrigatório |
|---|---|
| status visual | ✅ |
| severidade visual | ✅ |
| indicators | ✅ |
| grouped findings | ✅ |

---

# Estratégia Offline

# A UI deve funcionar

- localmente;
- offline;
- sem cloud.

---

# Estratégia Cloud

# Cloud deve adicionar

- dashboards compartilhados;
- colaboração;
- analytics.

---

# Objetivo Final

A UI deve evoluir como:

```txt
Camada Conversacional de Review Integrada à IDE
```

e NÃO apenas:

```txt
painel estático de findings
```