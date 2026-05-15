# Review Comment Strategy — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir a estratégia oficial de comentários da plataforma.

O objetivo NÃO é:

```txt
adicionar texto no review
```

O objetivo é:

```txt
permitir comunicação técnica contextual e rastreável
```

---

# Princípio Principal

Comentários representam:

- comunicação técnica;
- validação;
- contextualização;
- rastreabilidade;
- colaboração.

---

# Objetivo dos Comentários

Permitir:

- discussão técnica;
- justificativas;
- respostas;
- histórico;
- revalidação.

---

# Comentários NÃO são

```txt
mensagens descartáveis
```

---

# Objetivo

Transformar comentários em:

```txt
histórico técnico organizacional
```

---

# Comentários Devem Permitir

| Recurso | Obrigatório |
|---|---|
| resposta | ✅ |
| edição | ✅ |
| histórico | ✅ |
| contexto técnico | ✅ |
| reviewer tracking | ✅ |

---

# Contexto do Comentário

# Todo comentário deve possuir

| Contexto | Obrigatório |
|---|---|
| reviewer | ✅ |
| timestamp | ✅ |
| finding relacionado | ✅ |
| severidade | ⚪ |
| categoria | ⚪ |

---

# Workflow Conversacional

```txt
Reviewer comenta
 ↓
Developer responde
 ↓
Developer corrige
 ↓
Reviewer revalida
```

---

# Objetivo

Permitir:

```txt
review iterativo
```

---

# Estratégia de Resposta

# O sistema deve permitir

| Ação | Obrigatória |
|---|---|
| responder comentário | ✅ |
| complementar comentário | ✅ |
| justificar decisão | ✅ |
| reabrir discussão | ✅ |

---

# Estratégia de Histórico

# O sistema deve preservar

| Histórico | Obrigatório |
|---|---|
| criação | ✅ |
| respostas | ✅ |
| edições | ✅ |
| reaberturas | ✅ |

---

# Objetivo

Permitir:

```txt
rastreabilidade organizacional
```

---

# Comentários IA

# A IA pode

- sugerir comentários;
- contextualizar problemas;
- sugerir melhorias.

---

# A IA NÃO pode

- substituir reviewer;
- responder automaticamente;
- aprovar automaticamente.

---

# HITL

# Obrigatório

Toda decisão final deve ser humana.

---

# Estratégia de UI

# O sistema deve permitir

| Recurso | Obrigatório |
|---|---|
| agrupamento | ✅ |
| threading | ✅ |
| contexto visual | ✅ |
| navegação rápida | ✅ |

---

# Estratégia Offline

# Comentários devem funcionar

- localmente;
- offline;
- sem cloud.

---

# Estratégia Cloud

# Cloud deve adicionar

- comentários compartilhados;
- histórico compartilhado;
- colaboração organizacional.

---

# Runtime

# Comentários NÃO podem

- travar IDE;
- perder estado;
- bloquear review.

---

# Runtime deve possuir

| Recurso | Obrigatório |
|---|---|
| autosave | ✅ |
| restore | ✅ |
| retry | ✅ |
| offline cache | ✅ |

---

# Objetivo Final

Os comentários devem evoluir como:

```txt
Camada Conversacional de Comunicação Técnica
```

e NÃO apenas:

```txt
texto simples de review
```