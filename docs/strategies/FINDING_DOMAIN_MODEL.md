# Finding Domain Model — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir oficialmente o modelo conceitual de findings.

---

# Finding

## Representa

```txt
evidência técnica contextual detectada durante review
```

---

# Campos Obrigatórios

| Campo | Obrigatório |
|---|---|
| id | ✅ |
| categoria | ✅ |
| severidade | ✅ |
| contexto | ✅ |
| status | ✅ |
| localização | ✅ |

---

# Campos Futuros

| Campo | Futuro |
|---|---|
| confidence IA | ⚪ |
| regressão | ⚪ |
| histórico | ⚪ |

---

# Objetivo

Permitir:

```txt
governança contextual incremental
```

---

# Regras

# Findings NÃO podem

- ser aprovados automaticamente;
- ser fechados automaticamente;
- perder histórico.

---

# Objetivo Final

O finding deve evoluir como:

```txt
unidade contextual oficial de governança técnica
```