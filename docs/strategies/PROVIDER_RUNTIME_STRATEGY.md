# Provider Runtime Strategy — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir a estratégia oficial de runtime dos providers.

O objetivo NÃO é apenas:

```txt
executar chamadas externas
```

O objetivo é:

```txt
garantir resiliência, fallback e estabilidade do workflow de review
```

---

# Princípio Principal

Providers são:

```txt
dependências opcionais
```

---

# O sistema NÃO pode

- depender de provider específico;
- quebrar runtime quando provider falhar;
- impedir review manual;
- impedir review offline.

---

# Objetivo do Runtime

Garantir:

- resiliência;
- estabilidade;
- fallback;
- recuperação;
- continuidade do review.

---

# Tipos de Provider

# O sistema deve suportar

| Tipo | Obrigatório |
|---|---|
| AI Providers | ✅ |
| Embedding Providers | ✅ |
| Sync Providers | ✅ |
| AST Providers | ✅ |

---

# Estratégia de Timeout

# Todo provider deve possuir

| Recurso | Obrigatório |
|---|---|
| timeout | ✅ |
| retry | ✅ |
| cancelamento | ✅ |
| fallback | ✅ |

---

# Objetivo

Evitar:

```txt
travamento da IDE
```

---

# Estratégia de Retry

# Retry deve ser

| Estratégia | Obrigatória |
|---|---|
| limitada | ✅ |
| incremental | ✅ |
| cancelável | ✅ |

---

# O sistema NÃO pode

- executar retry infinito;
- bloquear workflow;
- monopolizar CPU.

---

# Estratégia de Fallback

# O sistema deve permitir

```txt
graceful degradation
```

---

# Exemplo

```txt
OpenAI falha
 ↓
Fallback para Ollama
 ↓
Fallback para review manual
```

---

# Objetivo

Garantir:

```txt
continuidade do workflow
```

---

# Estratégia Offline

# O sistema deve funcionar

- sem cloud;
- sem internet;
- sem provider remoto.

---

# Providers Offline

# O sistema deve suportar

| Provider | Obrigatório |
|---|---|
| Ollama | ✅ |
| embeddings locais | ✅ |
| heurísticas locais | ✅ |

---

# Runtime Diagnostics

# O sistema deve detectar

| Problema | Obrigatório |
|---|---|
| provider offline | ✅ |
| timeout | ✅ |
| fallback ativado | ✅ |
| retry excessivo | ✅ |

---

# Runtime Diagnostics NÃO devem

- virar findings;
- bloquear reviewer;
- gerar popup excessivo.

---

# Runtime UX

# O reviewer deve visualizar

| Informação | Obrigatória |
|---|---|
| provider ativo | ✅ |
| status do provider | ✅ |
| loading state | ✅ |
| retry state | ✅ |

---

# O reviewer NÃO deve ver

```txt
stacktrace técnico
UnhandledPromiseRejection
```

---

# Estratégia de Cache

# O runtime deve utilizar

| Estratégia | Obrigatória |
|---|---|
| cache de embeddings | ✅ |
| cache de findings | ✅ |
| cache incremental | ✅ |

---

# Objetivo

Evitar:

```txt
reanálises desnecessárias
```

---

# Estratégia de Execução

# Operações pesadas devem

- rodar em background;
- ser canceláveis;
- possuir progress state;
- possuir timeout.

---

# Estratégia de Segurança

# Providers NÃO podem

- expor credenciais;
- vazar embeddings;
- vazar contexto organizacional;
- armazenar código sem autorização.

---

# Estratégia Multi-Provider

# O usuário deve conseguir

| Ação | Obrigatória |
|---|---|
| trocar provider | ✅ |
| priorizar provider | ✅ |
| desativar provider | ✅ |
| configurar fallback | ✅ |

---

# Estratégia Cloud

# Cloud pode adicionar

- IA especializada;
- inteligência organizacional;
- sync compartilhado;
- analytics.

---

# Objetivo Final

O runtime deve evoluir como:

```txt
Camada Resiliente de Execução Multi-Provider
```

e NÃO apenas:

```txt
integração simples com APIs externas
```