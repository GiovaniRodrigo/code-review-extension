# Review Aggregate Model — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir oficialmente o aggregate principal do workflow.

---

# Aggregate Principal

```txt
Review
```

---

# Review agrega

| Entidade | Obrigatória |
|---|---|
| findings | ✅ |
| comentários | ✅ |
| lifecycle | ✅ |
| histórico | ✅ |

---

# Objetivo

Garantir:

```txt
consistência contextual do workflow técnico
```

---

# Invariantes

# O sistema NÃO pode

- remover histórico;
- perder findings;
- quebrar lifecycle;
- ignorar HITL.

---

# Objetivo Final

O aggregate deve evoluir como:

```txt
núcleo contextual do workflow técnico
```