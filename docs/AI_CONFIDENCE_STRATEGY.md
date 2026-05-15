# AI Confidence Strategy — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir a estratégia oficial de confidence score da IA.

O objetivo NÃO é:

```txt
dar aparência de precisão
```

O objetivo é:

```txt
ajudar o reviewer a avaliar confiabilidade da recomendação
```

---

# Princípio Principal

Confidence score NÃO representa:

```txt
verdade absoluta
```

Confidence representa:

```txt
grau de confiança contextual da IA
```

---

# Objetivo do Confidence

Ajudar reviewer a:

- priorizar análise;
- identificar riscos;
- entender incerteza;
- identificar possíveis falsos positivos.

---

# Escala Oficial

| Score | Significado |
|---|---|
| 0-30 | baixa confiança |
| 31-70 | média confiança |
| 71-100 | alta confiança |

---

# Contextos Utilizados

# O score deve considerar

| Contexto | Obrigatório |
|---|---|
| AST | ✅ |
| heurísticas | ✅ |
| RAG | ✅ |
| arquitetura | ✅ |
| histórico | ⚪ |
| contexto organizacional | ⚪ |

---

# Objetivo

Reduzir:

```txt
falsos positivos
```

---

# Fatores Positivos

# O score deve aumentar quando houver

| Fator | Obrigatório |
|---|---|
| heurística confirmada | ✅ |
| AST consistente | ✅ |
| padrão recorrente | ✅ |
| contexto RAG forte | ✅ |
| múltiplas evidências | ✅ |

---

# Fatores Negativos

# O score deve reduzir quando houver

| Fator | Obrigatório |
|---|---|
| contexto insuficiente | ✅ |
| ambiguidade | ✅ |
| baixa evidência | ✅ |
| conflito arquitetural | ✅ |

---

# UI do Confidence

# O reviewer deve visualizar

| Informação | Obrigatória |
|---|---|
| score numérico | ✅ |
| nível textual | ✅ |
| severidade contextual | ✅ |

---

# O reviewer deve conseguir

| Ação | Obrigatória |
|---|---|
| ignorar score | ✅ |
| reavaliar finding | ✅ |
| ajustar severidade | ✅ |

---

# Confidence NÃO pode

- aprovar findings automaticamente;
- fechar reviews;
- substituir decisão humana.

---

# HITL

# Obrigatório

Toda decisão final deve ser humana.

---

# Runtime

# Confidence NÃO pode

- bloquear review;
- aumentar latência excessivamente;
- travar runtime.

---

# Runtime deve possuir

| Recurso | Obrigatório |
|---|---|
| cache | ✅ |
| cálculo incremental | ✅ |
| fallback | ✅ |

---

# Estratégia Offline

# O sistema deve calcular confidence

- localmente;
- sem cloud;
- sem analytics remotos.

---

# Estratégia Cloud

# Cloud pode adicionar

- histórico organizacional;
- padrões recorrentes;
- inteligência coletiva;
- analytics avançados.

---

# Objetivo Final

O confidence deve evoluir como:

```txt
Indicador Contextual de Confiabilidade Técnica
```

e NÃO como:

```txt
métrica absoluta de verdade
```