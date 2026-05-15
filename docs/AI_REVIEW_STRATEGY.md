# AI Review Strategy — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir como a IA deve funcionar dentro da plataforma.

A IA deve atuar como:

```txt
Assistente técnico de code review
```

e NÃO como:

```txt
revisor autônomo
```

---

# Regra Principal

## HITL é obrigatório

Toda recomendação da IA deve passar por validação humana.

A IA:

- sugere;
- auxilia;
- contextualiza;
- identifica riscos;
- acelera análise.

O reviewer humano:

- decide;
- aprova;
- rejeita;
- contextualiza;
- reavalia.

---

# Objetivo da IA

A IA deve:

- acelerar review;
- identificar não conformidades;
- identificar riscos;
- identificar violações arquiteturais;
- identificar problemas de qualidade;
- identificar problemas de segurança;
- identificar anti-patterns;
- contextualizar decisões técnicas.

---

# Objetivo NÃO permitido

A IA NÃO deve:

- aprovar PR automaticamente;
- substituir reviewer;
- ignorar contexto organizacional;
- tomar decisão final;
- alterar código automaticamente sem aprovação;
- impor correções.

---

# Estratégia Geral

A IA deve funcionar em múltiplas camadas.

---

# Camada 1 — Pré-Validação

## Objetivo

Executar análise inicial do código.

---

# A IA deve analisar

- diff;
- branch;
- PR;
- arquivo aberto;
- contexto do workspace.

---

# A IA deve sugerir

- findings;
- melhorias;
- riscos;
- inconsistências;
- violações.

---

# Resultado esperado

```txt
Pré-validação assistida
```

---

# Camada 2 — Contextualização

## Objetivo

Entender contexto organizacional.

---

# Fontes de contexto

| Fonte | Obrigatória |
|---|---|
| Código | ✅ |
| RAG | ✅ |
| ADRs | ✅ |
| Arquitetura | ✅ |
| Convenções | ✅ |
| Heurísticas | ✅ |
| Histórico | ⚪ |
| Reviews anteriores | ⚪ |

---

# Contexto esperado

A IA deve entender:

- arquitetura;
- padrões internos;
- convenções da equipe;
- boundaries;
- dependências;
- contexto funcional.

---

# Camada 3 — Análise Arquitetural

## Objetivo

Identificar problemas estruturais.

---

# A IA deve identificar

| Problema | Obrigatório |
|---|---|
| acoplamento excessivo | ✅ |
| cyclic dependency | ✅ |
| violation de layer | ✅ |
| God Class | ✅ |
| dead code | ✅ |
| complexidade excessiva | ✅ |
| anti-patterns | ✅ |
| quebra de arquitetura | ✅ |

---

# Camada 4 — Análise de Qualidade

## Objetivo

Analisar qualidade técnica.

---

# A IA deve analisar

| Área | Obrigatória |
|---|---|
| legibilidade | ✅ |
| manutenibilidade | ✅ |
| testes | ✅ |
| cobertura | ✅ |
| mutation | ✅ |
| naming | ✅ |
| organização | ✅ |
| duplicação | ✅ |

---

# Camada 5 — Segurança

## Objetivo

Identificar riscos de segurança.

---

# A IA deve identificar

| Problema | Obrigatório |
|---|---|
| secrets hardcoded | ✅ |
| SQL injection | ✅ |
| command injection | ✅ |
| path traversal | ✅ |
| unsafe eval | ✅ |
| insecure deserialization | ✅ |
| auth bypass | ✅ |
| exposure de credenciais | ✅ |

---

# Camada 6 — Performance

## Objetivo

Identificar problemas de performance.

---

# A IA deve identificar

| Problema | Obrigatório |
|---|---|
| loops desnecessários | ✅ |
| queries pesadas | ✅ |
| chamadas redundantes | ✅ |
| memory leak | ✅ |
| render excessivo | ✅ |
| complexidade algorítmica | ✅ |

---

# Estratégia de Findings

# Cada finding deve possuir

| Campo | Obrigatório |
|---|---|
| título | ✅ |
| descrição | ✅ |
| severidade | ✅ |
| linha | ✅ |
| arquivo | ✅ |
| categoria | ✅ |
| sugestão | ✅ |
| confidence score | ✅ |
| contexto IA | ✅ |
| status | ✅ |

---

# Severidades

| Severidade | Descrição |
|---|---|
| INFO | melhoria opcional |
| WARNING | risco moderado |
| CRITICAL | problema grave |
| ARCHITECTURE | violação arquitetural |
| SECURITY | risco de segurança |
| PERFORMANCE | risco de performance |

---

# Confidence Score

## Objetivo

A IA deve indicar confiança da análise.

---

# Exemplo

| Score | Significado |
|---|---|
| 0-30 | baixa confiança |
| 31-70 | média confiança |
| 71-100 | alta confiança |

---

# O reviewer deve conseguir

- aceitar;
- rejeitar;
- editar;
- reduzir severidade;
- aumentar severidade;
- complementar comentário.

---

# Estratégia Multi-Provider

## O sistema deve suportar

| Tipo | Obrigatório |
|---|---|
| Ollama | ✅ |
| OpenAI | ✅ |
| Cloud provider próprio | ✅ |
| API customizada | ✅ |
| IA local | ✅ |

---

# Estratégia Offline

## Obrigatório

O sistema deve funcionar totalmente offline.

---

# Deve permitir

- IA local;
- embeddings locais;
- RAG local;
- review local;
- sem cloud obrigatória.

---

# Estratégia Cloud

## Objetivo

Adicionar inteligência organizacional.

---

# Cloud deve permitir

- IA especializada;
- sincronização;
- histórico;
- sessões compartilhadas;
- analytics;
- heurísticas compartilhadas;
- memória organizacional.

---

# Estratégia RAG

## Objetivo

Contextualizar review.

---

# O RAG deve suportar

| Fonte | Obrigatória |
|---|---|
| markdown | ✅ |
| ADRs | ✅ |
| arquitetura | ✅ |
| style guides | ✅ |
| convenções | ✅ |
| documentação | ✅ |

---

# Estratégia AST

## Objetivo

Análise estrutural real.

---

# AST deve permitir

- identificar classes;
- identificar dependências;
- identificar imports;
- identificar arquitetura;
- identificar violações;
- identificar boundaries.

---

# Runtime da IA

## O sistema NÃO pode

- bloquear IDE;
- travar editor;
- congelar webview;
- quebrar runtime.

---

# Runtime deve possuir

| Recurso | Obrigatório |
|---|---|
| cancelamento | ✅ |
| timeout | ✅ |
| retry | ✅ |
| fallback | ✅ |
| loading state | ✅ |
| progress state | ✅ |

---

# Objetivo Final

A IA deve evoluir como:

```txt
Assistente Inteligente de Code Review Integrado à IDE
```

com:

- IA contextual;
- análise arquitetural;
- análise organizacional;
- heurísticas;
- RAG;
- AST;
- workflow colaborativo;
- HITL obrigatório.