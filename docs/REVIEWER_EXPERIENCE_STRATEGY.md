# Reviewer Experience Strategy — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir a estratégia oficial de experiência do reviewer.

O objetivo NÃO é apenas:

```txt
mostrar findings
```

O objetivo é:

```txt
permitir fluxo natural e eficiente de revisão técnica
```

---

# Princípio Principal

O reviewer deve conseguir:

```txt
realizar review sem sair da IDE
```

---

# Objetivo da Experiência

O processo de review deve ser:

- rápido;
- contextual;
- iterativo;
- não intrusivo;
- rastreável;
- assistido por IA;
- configurável.

---

# Objetivo do Reviewer

O reviewer deve conseguir:

| Objetivo | Obrigatório |
|---|---|
| revisar rapidamente | ✅ |
| navegar facilmente | ✅ |
| responder rapidamente | ✅ |
| contextualizar decisões | ✅ |
| manter histórico | ✅ |
| continuar programando | ✅ |

---

# Fluxo Principal

```txt
Abrir IDE
 ↓
Abrir extensão
 ↓
Selecionar modo de review
 ↓
Executar pré-validação IA
 ↓
Analisar findings
 ↓
Aceitar/rejeitar/editar
 ↓
Adicionar comentários
 ↓
Sincronizar review
```

---

# Navegação

# O reviewer deve conseguir

| Recurso | Obrigatório |
|---|---|
| abrir arquivo | ✅ |
| navegar para linha | ✅ |
| visualizar diff | ✅ |
| alternar findings | ✅ |
| agrupar findings | ✅ |
| filtrar findings | ✅ |

---

# Contextualização

# Todo finding deve mostrar

| Informação | Obrigatória |
|---|---|
| severidade | ✅ |
| categoria | ✅ |
| contexto | ✅ |
| origem | ✅ |
| confidence IA | ✅ |
| reviewer responsável | ⚪ |

---

# Workflow HITL

# O reviewer deve conseguir

| Ação | Obrigatória |
|---|---|
| aceitar IA | ✅ |
| rejeitar IA | ✅ |
| editar IA | ✅ |
| complementar comentário | ✅ |
| criar finding manual | ✅ |

---

# A IA NÃO pode

- aprovar automaticamente;
- fechar findings automaticamente;
- substituir reviewer.

---

# Runtime UX

# O sistema NÃO pode

- travar IDE;
- congelar editor;
- gerar popup excessivo;
- bloquear digitação.

---

# Runtime deve possuir

| Recurso | Obrigatório |
|---|---|
| loading states | ✅ |
| progress states | ✅ |
| retry | ✅ |
| fallback | ✅ |
| background execution | ✅ |

---

# Painel Principal

# Deve mostrar

| Informação | Obrigatória |
|---|---|
| findings | ✅ |
| status | ✅ |
| severidade | ✅ |
| reviewer decisions | ✅ |
| provider IA | ✅ |
| sync state | ✅ |

---

# Agrupamentos

# O reviewer deve conseguir agrupar por

| Agrupamento | Obrigatório |
|---|---|
| severidade | ✅ |
| categoria | ✅ |
| arquivo | ✅ |
| status | ✅ |

---

# Filtros

# O reviewer deve conseguir filtrar por

| Filtro | Obrigatório |
|---|---|
| severidade | ✅ |
| categoria | ✅ |
| status | ✅ |
| origem | ✅ |

---

# Revalidação

# O sistema deve identificar

| Situação | Obrigatória |
|---|---|
| finding corrigido | ✅ |
| finding persistente | ✅ |
| novo finding | ✅ |
| regressão | ✅ |

---

# Objetivo

Evitar:

```txt
reanálise manual completa
```

---

# UX de Runtime

# O reviewer NÃO deve ver

```txt
Cannot register
already registered
UnhandledPromiseRejection
```

---

# Dependências opcionais

## NÃO podem

- quebrar runtime;
- interromper review;
- impedir análise local.

---

# UX Offline

# O reviewer deve conseguir

- revisar offline;
- usar IA local;
- usar RAG local;
- revisar sem cloud.

---

# UX Cloud

# Cloud deve adicionar

| Recurso | Obrigatório |
|---|---|
| colaboração | ✅ |
| sync | ✅ |
| histórico | ✅ |
| analytics | ⚪ |

---

# Objetivo Final

A experiência deve evoluir como:

```txt
Fluxo Natural de Revisão Técnica Integrado à IDE
```

e NÃO como:

```txt
plugin externo desconectado do workflow do reviewer
```