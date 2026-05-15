# Review Comment Engine Strategy — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir a estratégia oficial do motor de comentários da plataforma.

O objetivo NÃO é:

```txt
armazenar mensagens
```

O objetivo é:

```txt
permitir comunicação técnica contextual e iterativa durante o review
```

---

# Princípio Principal

Comentários representam:

- comunicação técnica;
- rastreabilidade;
- contexto;
- colaboração;
- continuidade operacional.

---

# Objetivos do Comment Engine

Permitir:

- conversas contextualizadas;
- revalidação iterativa;
- histórico técnico;
- colaboração incremental;
- continuidade do workflow.

---

# O sistema deve permitir

| Recurso | Obrigatório |
|---|---|
| comentários por finding | ✅ |
| respostas | ✅ |
| histórico | ✅ |
| reabertura | ✅ |
| status contextual | ✅ |

---

# Objetivo

Transformar comentários em:

```txt
comunicação técnica rastreável
```

---

# Workflow Oficial

```txt
Reviewer comenta
 ↓
Developer responde
 ↓
Developer corrige
 ↓
Reviewer revalida
 ↓
Finding aprovado
```

---

# Estratégia de Contexto

# Comentários devem possuir

| Contexto | Obrigatório |
|---|---|
| finding associado | ✅ |
| severidade | ✅ |
| categoria | ✅ |
| histórico | ✅ |
| status | ✅ |

---

# Estratégia Incremental

# O sistema deve atualizar

- apenas comentários novos;
- apenas findings impactados;
- apenas contexto relacionado.

---

# Objetivo

Evitar:

```txt
reprocessamento desnecessário
```

---

# Estratégia HITL

# Obrigatório

Toda decisão final continua humana.

---

# Comentários NÃO aprovam findings automaticamente.

---

# Estratégia de Runtime

# O comment engine NÃO pode

- travar IDE;
- bloquear review;
- congelar webviews.

---

# Runtime deve possuir

| Recurso | Obrigatório |
|---|---|
| autosave | ✅ |
| restore session | ✅ |
| retry | ✅ |
| reconnect | ✅ |

---

# Estratégia de Persistência

# O sistema deve preservar

| Informação | Obrigatória |
|---|---|
| histórico | ✅ |
| respostas | ✅ |
| reaberturas | ✅ |
| contexto | ✅ |

---

# Estratégia Offline

# Comentários devem funcionar

- localmente;
- offline;
- sem cloud.

---

# Estratégia Cloud

# Cloud pode adicionar

- comentários compartilhados;
- colaboração organizacional;
- histórico compartilhado.

---

# Estratégia Organizacional

# Enterprise pode permitir

| Recurso | Obrigatório |
|---|---|
| múltiplos reviewers | ⚪ |
| workflows corporativos | ⚪ |
| auditoria organizacional | ⚪ |

---

# Estratégia de UX

# O reviewer deve visualizar

| Informação | Obrigatória |
|---|---|
| autor do comentário | ✅ |
| histórico da conversa | ✅ |
| status do finding | ✅ |
| alterações recentes | ✅ |

---

# Estratégia de Segurança

# Comentários devem proteger

| Área | Obrigatória |
|---|---|
| findings | ✅ |
| embeddings | ✅ |
| histórico | ✅ |
| contexto organizacional | ✅ |

---

# O sistema NÃO pode

- expor comentários privados;
- sincronizar automaticamente sem autorização;
- misturar contextos organizacionais.

---

# Objetivo Final

O comment engine deve evoluir como:

```txt
Camada Incremental de Comunicação Técnica Contextual
```

e NÃO apenas:

```txt
armazenamento simples de mensagens
```