# Review Category Strategy — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir a estratégia oficial de categorização dos findings.

O objetivo NÃO é:

```txt
agrupar comentários visualmente
```

O objetivo é:

```txt
permitir organização contextual e governança técnica
```

---

# Princípio Principal

Categorias representam:

- contexto técnico;
- área afetada;
- tipo de risco;
- governança;
- priorização.

---

# Objetivos das Categorias

Permitir:

- organização contextual;
- filtragem;
- analytics;
- governança contínua;
- workflows especializados.

---

# Categorias Oficiais

| Categoria | Obrigatória |
|---|---|
| Architecture | ✅ |
| Security | ✅ |
| Performance | ✅ |
| Quality | ✅ |
| Maintainability | ✅ |
| Testing | ✅ |
| Runtime | ✅ |

---

# Architecture

## Objetivo

Validar boundaries, desacoplamento e estrutura.

---

# Exemplos

- cyclic dependency;
- infra leakage;
- boundary violation;
- acoplamento excessivo.

---

# Security

## Objetivo

Identificar riscos de segurança.

---

# Exemplos

- secrets hardcoded;
- auth bypass;
- SQL injection;
- path traversal.

---

# Performance

## Objetivo

Identificar degradação operacional.

---

# Exemplos

- loops pesados;
- queries excessivas;
- processamento desnecessário;
- renderização excessiva.

---

# Quality

## Objetivo

Melhorar qualidade geral do código.

---

# Exemplos

- duplicação;
- complexidade;
- naming;
- convenções.

---

# Maintainability

## Objetivo

Preservar evolução sustentável do código.

---

# Exemplos

- God Class;
- acoplamento excessivo;
- estrutura frágil;
- baixa legibilidade.

---

# Testing

## Objetivo

Garantir qualidade do processo de validação.

---

# Exemplos

- ausência de testes;
- cenário negativo faltando;
- branch coverage insuficiente;
- mutation testing ausente.

---

# Runtime

## Objetivo

Identificar problemas operacionais da extensão.

---

# Exemplos

- duplicated registration;
- provider failure;
- reconnect failure;
- webview crash.

---

# Estratégia de IA

# A IA pode

- sugerir categoria;
- contextualizar categoria;
- sugerir risco.

---

# HITL

# Obrigatório

Toda categoria final deve ser validada por humano.

---

# Estratégia de Runtime

# Categorias NÃO podem

- travar UI;
- bloquear filtros;
- degradar performance.

---

# Runtime deve possuir

| Recurso | Obrigatório |
|---|---|
| agrupamento incremental | ✅ |
| cache | ✅ |
| lazy rendering | ✅ |
| filtros incrementais | ✅ |

---

# Estratégia de Analytics

# O sistema deve medir

| Métrica | Obrigatória |
|---|---|
| findings por categoria | ✅ |
| regressões por categoria | ⚪ |
| hotspots por categoria | ⚪ |

---

# Estratégia Offline

# Categorias devem funcionar

- localmente;
- offline;
- sem cloud.

---

# Estratégia Cloud

# Cloud pode adicionar

- categorias organizacionais;
- governança corporativa;
- analytics organizacionais.

---

# Objetivo Final

As categorias devem evoluir como:

```txt
Camada Contextual de Organização e Governança Técnica
```

e NÃO apenas:

```txt
agrupamento visual simples
```