# Review Severity Strategy — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir a estratégia oficial de severidade dos findings.

O objetivo NÃO é:

```txt
colorir comentários
```

O objetivo é:

```txt
priorizar riscos técnicos e arquiteturais
```

---

# Princípio Principal

Severidade representa:

- impacto;
- risco;
- urgência;
- criticidade;
- governança técnica.

---

# Objetivo da Severidade

Ajudar reviewer a:

- priorizar análise;
- identificar riscos graves;
- identificar bloqueadores;
- organizar workflow;
- acelerar review.

---

# Severidades Oficiais

| Severidade | Objetivo |
|---|---|
| INFO | melhoria opcional |
| WARNING | atenção recomendada |
| CRITICAL | risco grave |
| BLOCKER | impede aprovação |
| ARCHITECTURE | risco arquitetural |
| SECURITY | risco de segurança |

---

# INFO

## Objetivo

Melhorias não obrigatórias.

---

# Exemplos

- naming;
- legibilidade;
- simplificação;
- sugestão de organização.

---

# WARNING

## Objetivo

Riscos moderados.

---

# Exemplos

- duplicação;
- complexidade moderada;
- performance questionável;
- convenção inconsistente.

---

# CRITICAL

## Objetivo

Problemas graves.

---

# Exemplos

- bug provável;
- quebra de fluxo;
- risco de runtime;
- regressão importante.

---

# BLOCKER

## Objetivo

Impedir merge/aprovação.

---

# Exemplos

- falha crítica;
- corrupção de dados;
- crash;
- violação grave de arquitetura.

---

# ARCHITECTURE

## Objetivo

Governança arquitetural.

---

# Exemplos

- layer violation;
- cyclic dependency;
- infra leakage;
- boundary violation.

---

# SECURITY

## Objetivo

Risco de segurança.

---

# Exemplos

- SQL injection;
- secrets hardcoded;
- auth bypass;
- path traversal.

---

# Estratégia de Priorização

# Findings devem ser ordenados por

| Critério | Obrigatório |
|---|---|
| severidade | ✅ |
| impacto | ✅ |
| confiança IA | ⚪ |
| arquitetura | ⚪ |

---

# Objetivo

Permitir:

```txt
review orientado a risco
```

---

# Estratégia de IA

# A IA pode

- sugerir severidade;
- contextualizar risco;
- sugerir impacto.

---

# A IA NÃO pode

- impor severidade final;
- bloquear workflow automaticamente.

---

# HITL

# Obrigatório

Toda severidade final deve ser validada por humano.

---

# O reviewer deve conseguir

| Ação | Obrigatória |
|---|---|
| aumentar severidade | ✅ |
| reduzir severidade | ✅ |
| ignorar severidade IA | ✅ |

---

# Estratégia de UI

# Severidade deve possuir

| Recurso | Obrigatório |
|---|---|
| indicador visual | ✅ |
| agrupamento | ✅ |
| filtros | ✅ |
| prioridade visual | ✅ |

---

# Estratégia de Runtime

# Runtime findings NÃO devem

- misturar com findings funcionais;
- poluir review principal.

---

# Runtime diagnostics devem possuir

| Severidade | Obrigatória |
|---|---|
| INFO | ✅ |
| WARNING | ✅ |
| ERROR | ✅ |

---

# Estratégia de Analytics

# O sistema deve medir

| Métrica | Obrigatória |
|---|---|
| findings por severidade | ✅ |
| severidade recorrente | ✅ |
| hotspots críticos | ⚪ |

---

# Estratégia Offline

# Severidades devem funcionar

- localmente;
- offline;
- sem cloud.

---

# Estratégia Cloud

# Cloud pode adicionar

- padrões organizacionais;
- heurísticas compartilhadas;
- analytics de risco.

---

# Objetivo Final

A severidade deve evoluir como:

```txt
Camada Contextual de Priorização Técnica
```

e NÃO apenas:

```txt
classificação visual simples
```