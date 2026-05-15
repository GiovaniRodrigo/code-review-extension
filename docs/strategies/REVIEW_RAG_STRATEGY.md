# Review RAG Strategy — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir a estratégia oficial de RAG da plataforma.

O objetivo NÃO é:

```txt
anexar documentos em prompts
```

O objetivo é:

```txt
fornecer contextualização técnica organizacional incremental
```

---

# Princípio Principal

O RAG representa:

- conhecimento organizacional;
- arquitetura;
- padrões internos;
- heurísticas;
- memória técnica.

---

# Objetivos do RAG

Permitir:

- contextualização;
- redução de falsos positivos;
- inteligência organizacional;
- governança contextual;
- continuidade técnica.

---

# Fontes Oficiais do RAG

# O sistema deve suportar

| Fonte | Obrigatória |
|---|---|
| Markdown | ✅ |
| ADRs | ✅ |
| documentação técnica | ✅ |
| heurísticas | ✅ |
| arquitetura | ✅ |

---

# Fontes Futuras

| Fonte | Futuro |
|---|---|
| Confluence | ⚪ |
| Notion | ⚪ |
| Wikis corporativas | ⚪ |

---

# Objetivo

Permitir:

```txt
review baseado em conhecimento organizacional real
```

---

# Estratégia Incremental

# O sistema deve indexar

- apenas arquivos alterados;
- apenas documentos modificados;
- apenas embeddings impactados.

---

# Objetivo

Evitar:

```txt
reindexação completa constante
```

---

# Estratégia de Contexto

# O RAG deve contextualizar

| Contexto | Obrigatório |
|---|---|
| arquitetura | ✅ |
| boundaries | ✅ |
| padrões organizacionais | ✅ |
| heurísticas | ✅ |

---

# Estratégia de Runtime

# O RAG NÃO pode

- travar IDE;
- bloquear review;
- monopolizar CPU.

---

# Runtime deve possuir

| Recurso | Obrigatório |
|---|---|
| background indexing | ✅ |
| debounce | ✅ |
| lazy loading | ✅ |
| cache incremental | ✅ |

---

# Estratégia Offline

# O RAG deve funcionar

- localmente;
- offline;
- sem cloud.

---

# Objetivo

Garantir:

```txt
RAG local-first
```

---

# Estratégia Cloud

# Cloud pode adicionar

- memória organizacional compartilhada;
- embeddings compartilhados;
- contexto organizacional consolidado.

---

# Estratégia de Segurança

# O sistema deve proteger

| Área | Obrigatória |
|---|---|
| embeddings | ✅ |
| documentação | ✅ |
| arquitetura | ✅ |
| contexto organizacional | ✅ |

---

# O sistema NÃO pode

- enviar embeddings automaticamente;
- sincronizar documentos sem autorização;
- expor documentação organizacional.

---

# Estratégia de UX

# O reviewer deve visualizar

| Informação | Obrigatória |
|---|---|
| RAG ativo | ✅ |
| fontes utilizadas | ⚪ |
| contexto aplicado | ⚪ |
| provider ativo | ✅ |

---

# Estratégia Organizacional

# Enterprise pode permitir

| Recurso | Obrigatório |
|---|---|
| RAG compartilhado | ⚪ |
| memória organizacional | ⚪ |
| embeddings organizacionais | ⚪ |

---

# Objetivo Final

O RAG deve evoluir como:

```txt
Camada Incremental de Conhecimento Técnico Organizacional
```

e NÃO apenas:

```txt
injeção simples de documentos em contexto
```