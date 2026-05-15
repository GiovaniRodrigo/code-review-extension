# Review Modes Strategy — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir os modos oficiais de code review da plataforma.

O objetivo NÃO é apenas:

```txt
analisar Pull Requests
```

O objetivo é:

```txt
permitir múltiplos fluxos reais de revisão técnica
```

---

# Princípio Principal

O reviewer deve conseguir revisar código:

- no momento da implementação;
- antes do commit;
- antes do PR;
- durante o PR;
- após correções;
- incrementalmente.

---

# Modos Oficiais

# 1. Pull Request Review

## Objetivo

Executar review completo baseado em Pull Request.

---

# O sistema deve permitir

| Recurso | Obrigatório |
|---|---|
| visualizar arquivos alterados | ✅ |
| visualizar diff | ✅ |
| findings por arquivo | ✅ |
| sincronização com VCS | ✅ |
| comentários por linha | ✅ |

---

# Objetivo

Permitir:

```txt
workflow tradicional de review
```

integrado à IDE.

---

# 2. Branch Diff Review

## Objetivo

Comparar branches diretamente.

---

# O sistema deve permitir

| Recurso | Obrigatório |
|---|---|
| comparar branches | ✅ |
| identificar alterações | ✅ |
| findings contextuais | ✅ |
| review incremental | ✅ |

---

# Objetivo

Permitir:

```txt
review antes do Pull Request
```

---

# 3. Open File Review

## Objetivo

Executar review apenas do arquivo aberto.

---

# O sistema deve permitir

| Recurso | Obrigatório |
|---|---|
| análise rápida | ✅ |
| findings locais | ✅ |
| heurísticas locais | ✅ |
| IA contextual | ✅ |

---

# Objetivo

Permitir:

```txt
micro-review durante desenvolvimento
```

---

# 4. Workspace Review

## Objetivo

Executar review contextual do workspace.

---

# O sistema deve permitir

| Recurso | Obrigatório |
|---|---|
| análise multi-arquivo | ✅ |
| análise arquitetural | ✅ |
| análise estrutural | ✅ |
| análise contextual | ✅ |

---

# Objetivo

Permitir:

```txt
review arquitetural e sistêmico
```

---

# 5. Incremental Review

## Objetivo

Executar review apenas das alterações novas.

---

# O sistema deve detectar

| Situação | Obrigatória |
|---|---|
| alterações novas | ✅ |
| findings persistentes | ✅ |
| findings corrigidos | ✅ |
| regressões | ✅ |

---

# Objetivo

Evitar:

```txt
reanálise completa desnecessária
```

---

# Estratégia de IA

# Todos os modos devem suportar

| Recurso | Obrigatório |
|---|---|
| pré-validação IA | ✅ |
| confidence score | ✅ |
| contextualização | ✅ |
| heurísticas | ✅ |
| RAG | ✅ |

---

# HITL

# Obrigatório

A IA nunca aprova automaticamente.

Toda decisão final deve ser humana.

---

# Estratégia de Findings

# Todos os modos devem permitir

| Recurso | Obrigatório |
|---|---|
| findings manuais | ✅ |
| findings IA | ✅ |
| comentários | ✅ |
| reabertura | ✅ |
| revalidação | ✅ |

---

# Estratégia Offline

# Todos os modos devem funcionar

- sem cloud;
- sem sync remoto;
- com IA local;
- com RAG local.

---

# Estratégia Cloud

# Cloud deve adicionar

| Recurso | Obrigatório |
|---|---|
| sync | ✅ |
| colaboração | ✅ |
| histórico | ✅ |
| analytics | ⚪ |

---

# Runtime

# Nenhum modo pode

- travar IDE;
- congelar editor;
- bloquear typing;
- quebrar runtime.

---

# Runtime deve possuir

| Recurso | Obrigatório |
|---|---|
| loading state | ✅ |
| retry | ✅ |
| timeout | ✅ |
| cancelamento | ✅ |

---

# Objetivo Final

Os modos de review devem evoluir como:

```txt
Fluxos Contextuais de Revisão Técnica
```

e NÃO apenas:

```txt
integração simples com Pull Request
```