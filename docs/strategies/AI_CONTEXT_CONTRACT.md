# AI Context Contract — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir oficialmente o contrato contextual da IA.

---

# Objetivo Principal

Garantir:

```txt
contextualização incremental consistente e governada
```

---

# Contexto Obrigatório

# Toda execução IA deve considerar

| Contexto | Obrigatório |
|---|---|
| diff | ✅ |
| AST | ✅ |
| heurísticas | ✅ |
| severidade | ✅ |
| arquitetura | ✅ |
| RAG | ✅ |

---

# Objetivo

Evitar:

```txt
findings genéricos e desconectados
```

---

# Contexto Opcional

| Contexto | Futuro |
|---|---|
| histórico organizacional | ⚪ |
| regressões recorrentes | ⚪ |
| analytics | ⚪ |

---

# Estratégia HITL

# Obrigatório

Toda decisão final continua humana.

---

# Estratégia de Segurança

# A IA NÃO pode

- aprovar automaticamente;
- enviar código implicitamente;
- sincronizar embeddings automaticamente.

---

# Estratégia Incremental

# O sistema deve enviar

- apenas arquivos alterados;
- apenas contexto relevante;
- apenas embeddings relacionados.

---

# Objetivo Final

O contrato contextual deve evoluir como:

```txt
camada oficial de governança contextual da IA
```