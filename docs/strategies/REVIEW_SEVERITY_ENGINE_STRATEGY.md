# Review Severity Engine Strategy — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir a estratégia oficial do motor de severidade da plataforma.

O objetivo NÃO é:

```txt
atribuir níveis fixos aos findings
```

O objetivo é:

```txt
priorizar riscos técnicos contextualizados para o reviewer
```

---

# Princípio Principal

Severidade representa:

- risco;
- impacto;
- urgência;
- criticidade;
- prioridade técnica.

---

# Objetivos do Severity Engine

Permitir:

- priorização inteligente;
- foco incremental;
- redução de ruído;
- governança contínua;
- review orientado a risco.

---

# Severidades Oficiais

| Severidade | Obrigatória |
|---|---|
| Critical | ✅ |
| High | ✅ |
| Medium | ✅ |
| Low | ✅ |
| Info | ✅ |

---

# Critical

## Representa

```txt
risco imediato relevante
```

---

# Exemplos

- falha de segurança;
- quebra arquitetural crítica;
- corrupção de fluxo;
- regressão grave.

---

# High

## Representa

```txt
impacto técnico relevante
```

---

# Exemplos

- boundary violation;
- alto acoplamento;
- risco operacional;
- falha estrutural.

---

# Medium

## Representa

```txt
risco moderado ou dívida crescente
```

---

# Exemplos

- maintainability;
- complexidade crescente;
- duplicação relevante.

---

# Low

## Representa

```txt
melhoria recomendada
```

---

# Exemplos

- convenções;
- organização;
- refinamentos.

---

# Info

## Representa

```txt
contexto complementar
```

---

# Exemplos

- observações;
- sugestões;
- contexto adicional.

---

# Estratégia de Contexto

# Severidade deve considerar

| Contexto | Obrigatório |
|---|---|
| arquitetura | ✅ |
| impacto | ✅ |
| risco | ✅ |
| histórico | ⚪ |
| regressão | ✅ |

---

# Estratégia de IA

# A IA pode

- sugerir severidade;
- contextualizar risco;
- priorizar findings.

---

# HITL

# Obrigatório

Toda severidade final continua humana.

---

# Estratégia Incremental

# O sistema deve atualizar

- apenas findings alterados;
- apenas severidades impactadas;
- apenas contexto relevante.

---

# Objetivo

Evitar:

```txt
reclassificação completa constante
```

---

# Estratégia de Runtime

# O severity engine NÃO pode

- travar IDE;
- bloquear review;
- degradar performance.

---

# Runtime deve possuir

| Recurso | Obrigatório |
|---|---|
| cache | ✅ |
| debounce | ✅ |
| lazy updates | ✅ |
| background processing | ✅ |

---

# Estratégia de UX

# O reviewer deve visualizar

| Informação | Obrigatória |
|---|---|
| severidade visual | ✅ |
| priorização contextual | ✅ |
| findings críticos primeiro | ✅ |
| agrupamento por risco | ✅ |

---

# Estratégia Offline

# Severidades devem funcionar

- localmente;
- offline;
- sem cloud.

---

# Estratégia Cloud

# Cloud pode adicionar

- inteligência organizacional;
- priorização organizacional;
- analytics de risco.

---

# Objetivo Final

O severity engine deve evoluir como:

```txt
Motor Incremental de Priorização Técnica Contextual
```

e NÃO apenas:

```txt
atribuição simples de níveis fixos
```