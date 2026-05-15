# Open File Review Strategy — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir a estratégia oficial de review de arquivo aberto.

O objetivo NÃO é:

```txt
executar lint simples no arquivo
```

O objetivo é:

```txt
permitir micro-review contextual durante desenvolvimento
```

---

# Princípio Principal

O reviewer/desenvolvedor deve conseguir:

```txt
validar rapidamente o arquivo atual sem interromper o fluxo
```

---

# Objetivos do Open File Review

Permitir:

- validação imediata;
- revisão contextual;
- identificação rápida de riscos;
- redução de retrabalho;
- feedback contínuo.

---

# Workflow Principal

```txt
Arquivo aberto
 ↓
Reviewer executa review local
 ↓
IA executa pré-validação
 ↓
Findings são exibidos
 ↓
Reviewer analisa/corrige
```

---

# Objetivo

Permitir:

```txt
micro-review contínuo
```

---

# O sistema deve permitir

| Recurso | Obrigatório |
|---|---|
| review do arquivo atual | ✅ |
| findings contextuais | ✅ |
| heurísticas locais | ✅ |
| navegação rápida | ✅ |
| revalidação rápida | ✅ |

---

# Estratégia de Contexto

# O sistema deve utilizar

| Contexto | Obrigatório |
|---|---|
| AST local | ✅ |
| heurísticas | ✅ |
| arquitetura | ✅ |
| RAG contextual | ✅ |

---

# Estratégia Incremental

# O sistema deve analisar

- apenas arquivo atual;
- apenas alterações atuais;
- apenas módulos relacionados.

---

# Objetivo

Evitar:

```txt
processamento desnecessário
```

---

# Estratégia de Findings

# Findings devem possuir

| Campo | Obrigatório |
|---|---|
| severidade | ✅ |
| categoria | ✅ |
| contexto | ✅ |
| confidence IA | ✅ |

---

# Estratégia HITL

# Obrigatório

Toda decisão final continua humana.

---

# Estratégia de Navegação

# O reviewer deve conseguir

| Ação | Obrigatória |
|---|---|
| navegar entre findings | ✅ |
| abrir linha específica | ✅ |
| visualizar contexto | ✅ |
| aplicar correção manual | ✅ |

---

# Estratégia de Runtime

# Open file review NÃO pode

- travar editor;
- congelar typing;
- monopolizar CPU.

---

# Runtime deve possuir

| Recurso | Obrigatório |
|---|---|
| debounce | ✅ |
| background execution | ✅ |
| timeout | ✅ |
| cancelamento | ✅ |

---

# Estratégia Offline

# O sistema deve funcionar

- localmente;
- offline;
- sem cloud.

---

# Estratégia Cloud

# Cloud pode adicionar

- IA especializada;
- analytics organizacionais;
- contexto compartilhado.

---

# Estratégia de UX

# O reviewer deve visualizar

| Informação | Obrigatória |
|---|---|
| findings locais | ✅ |
| severidade visual | ✅ |
| status visual | ✅ |
| confidence IA | ✅ |

---

# Objetivo Final

O open file review deve evoluir como:

```txt
Fluxo Contínuo de Micro-Review Contextual
```

e NÃO apenas:

```txt
lint contextual simples
```