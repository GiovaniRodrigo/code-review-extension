# AI Provider Strategy — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir a estratégia oficial de providers de IA da plataforma.

O objetivo NÃO é:

```txt
conectar modelos de IA
```

O objetivo é:

```txt
permitir assistência contextual desacoplada e configurável ao reviewer
```

---

# Princípio Principal

A IA deve funcionar como:

```txt
assistente técnico contextual do reviewer
```

---

# HITL

# Obrigatório

Toda decisão final continua humana.

---

# A IA pode

- sugerir findings;
- sugerir severidade;
- contextualizar problemas;
- sugerir melhorias;
- sugerir riscos.

---

# A IA NÃO pode

- aprovar review automaticamente;
- fechar findings automaticamente;
- substituir reviewer;
- executar alterações automaticamente.

---

# Objetivos da Estratégia

Permitir:

- desacoplamento;
- fallback;
- configuração;
- offline-first;
- múltiplos providers;
- resiliência.

---

# Providers Suportados

# O sistema deve suportar

| Provider | Obrigatório |
|---|---|
| Ollama | ✅ |
| OpenAI | ⚪ |
| Claude | ⚪ |
| Gemini | ⚪ |
| IDE native AI | ⚪ |

---

# Estratégia Offline

# O sistema deve funcionar

- localmente;
- offline;
- apenas com IA local.

---

# Objetivo

Garantir:

```txt
autonomia operacional
```

---

# Estratégia de Providers

# O usuário deve conseguir

| Ação | Obrigatória |
|---|---|
| ativar provider | ✅ |
| desativar provider | ✅ |
| alterar provider | ✅ |
| configurar fallback | ✅ |

---

# Estratégia de Fallback

# O sistema deve permitir

```txt
Cloud falha
 ↓
Fallback local
 ↓
Review continua
```

---

# Objetivo

Garantir:

```txt
continuidade operacional
```

---

# Estratégia de Runtime

# Providers NÃO podem

- travar IDE;
- bloquear editor;
- monopolizar CPU;
- congelar runtime.

---

# Runtime deve possuir

| Recurso | Obrigatório |
|---|---|
| timeout | ✅ |
| retry | ✅ |
| reconnect | ✅ |
| cancellation | ✅ |

---

# Estratégia de Segurança

# O sistema NÃO pode

- enviar código automaticamente;
- sincronizar contexto sem autorização;
- expor embeddings;
- expor documentação organizacional.

---

# Estratégia de Contexto

# Providers devem receber

| Contexto | Obrigatório |
|---|---|
| diff | ✅ |
| AST | ✅ |
| heurísticas | ✅ |
| RAG | ✅ |
| arquitetura | ✅ |

---

# Objetivo

Reduzir:

```txt
findings genéricos
```

---

# Estratégia de Custos

# O sistema deve permitir

| Estratégia | Obrigatória |
|---|---|
| IA local gratuita | ✅ |
| cloud opcional | ✅ |
| limite de contexto | ✅ |
| execução incremental | ✅ |

---

# Objetivo

Garantir:

```txt
baixo custo operacional
```

---

# Estratégia Organizacional

# Enterprise pode permitir

| Recurso | Obrigatório |
|---|---|
| providers corporativos | ⚪ |
| modelos internos | ⚪ |
| políticas organizacionais | ⚪ |

---

# Estratégia de UX

# O reviewer deve visualizar

| Informação | Obrigatória |
|---|---|
| provider ativo | ✅ |
| fallback ativo | ✅ |
| status do provider | ✅ |
| tempo de resposta | ⚪ |

---

# Objetivo Final

Os providers devem evoluir como:

```txt
Camada Desacoplada de Assistência Técnica Inteligente
```

e NÃO apenas:

```txt
integrações simples com APIs de IA
```