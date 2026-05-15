# Review Human-In-The-Loop Strategy — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir a estratégia oficial HITL (Human-In-The-Loop) da plataforma.

O objetivo NÃO é:

```txt
manter aprovação manual simbólica
```

O objetivo é:

```txt
garantir controle humano contínuo sobre o workflow técnico
```

---

# Princípio Principal

O reviewer humano representa:

- responsabilidade técnica;
- governança;
- contexto organizacional;
- tomada de decisão;
- validação final.

---

# Objetivos do HITL

Garantir:

- controle humano;
- rastreabilidade;
- responsabilidade técnica;
- governança contínua;
- revisão contextual.

---

# Obrigatório

Toda decisão final deve ser humana.

---

# A IA pode

| Ação | Permitida |
|---|---|
| sugerir findings | ✅ |
| sugerir severidade | ✅ |
| contextualizar riscos | ✅ |
| sugerir melhorias | ✅ |

---

# A IA NÃO pode

| Ação | Proibida |
|---|---|
| aprovar review automaticamente | ✅ |
| fechar findings automaticamente | ✅ |
| substituir reviewer | ✅ |
| alterar status final automaticamente | ✅ |

---

# Workflow Oficial

```txt
IA executa pré-validação
 ↓
Reviewer humano valida findings
 ↓
Reviewer decide aprovação/rejeição
 ↓
Developer responde/corrige
 ↓
Reviewer revalida
```

---

# Objetivo

Garantir:

```txt
governança técnica humana contínua
```

---

# Estratégia de Findings

# Todo finding deve permitir

| Ação Humana | Obrigatória |
|---|---|
| aprovar | ✅ |
| rejeitar | ✅ |
| comentar | ✅ |
| reabrir | ✅ |

---

# Estratégia de Histórico

# O sistema deve preservar

| Informação | Obrigatória |
|---|---|
| decisão humana | ✅ |
| histórico de validação | ✅ |
| reaberturas | ✅ |
| regressões | ✅ |

---

# Estratégia Organizacional

# Enterprise pode permitir

| Recurso | Obrigatório |
|---|---|
| múltiplos reviewers | ⚪ |
| workflows corporativos | ⚪ |
| auditoria organizacional | ⚪ |

---

# Estratégia de Runtime

# HITL NÃO pode

- travar IDE;
- bloquear workflow;
- degradar runtime.

---

# Runtime deve possuir

| Recurso | Obrigatório |
|---|---|
| autosave | ✅ |
| restore state | ✅ |
| retry | ✅ |
| reconnect | ✅ |

---

# Estratégia Offline

# HITL deve funcionar

- localmente;
- offline;
- sem cloud.

---

# Estratégia Cloud

# Cloud pode adicionar

- colaboração compartilhada;
- workflows organizacionais;
- auditoria corporativa.

---

# Estratégia de UX

# O reviewer deve visualizar

| Informação | Obrigatória |
|---|---|
| findings pendentes | ✅ |
| decisões humanas | ✅ |
| histórico de validação | ✅ |
| revalidações | ✅ |

---

# Estratégia de Segurança

# O sistema NÃO pode

- aprovar automaticamente;
- alterar decisões humanas;
- sobrescrever validações humanas.

---

# Objetivo Final

O HITL deve evoluir como:

```txt
Camada Contínua de Governança Técnica Humana
```

e NÃO apenas:

```txt
aprovação manual simbólica
```