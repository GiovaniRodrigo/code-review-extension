# Architecture Review Strategy — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir a estratégia oficial de review arquitetural da plataforma.

O objetivo NÃO é apenas:

```txt
executar lint arquitetural
```

O objetivo é:

```txt
identificar riscos estruturais e violações arquiteturais reais
```

---

# Objetivo do Review Arquitetural

O sistema deve identificar:

- violações de layer;
- dependências proibidas;
- acoplamento excessivo;
- quebra de boundaries;
- problemas estruturais;
- degradação arquitetural.

---

# Contexto Utilizado

# O sistema deve utilizar

| Fonte | Obrigatória |
|---|---|
| AST | ✅ |
| heurísticas | ✅ |
| RAG | ✅ |
| arquitetura organizacional | ✅ |
| dependency analysis | ✅ |

---

# Categorias de Análise

# O sistema deve analisar

| Categoria | Obrigatória |
|---|---|
| layering | ✅ |
| boundaries | ✅ |
| coupling | ✅ |
| modularidade | ✅ |
| responsabilidades | ✅ |
| dependências | ✅ |

---

# Problemas Detectáveis

# O sistema deve identificar

| Problema | Obrigatório |
|---|---|
| cyclic dependency | ✅ |
| infra leakage | ✅ |
| domain leakage | ✅ |
| forbidden imports | ✅ |
| God Class | ✅ |
| módulo frágil | ✅ |
| acoplamento excessivo | ✅ |

---

# Heurísticas Arquiteturais

# O sistema deve permitir

| Regra | Obrigatória |
|---|---|
| domínio não acessa infra | ✅ |
| UI não acessa database | ✅ |
| módulos isolados | ✅ |
| boundaries obrigatórios | ✅ |

---

# Findings Arquiteturais

# Findings devem possuir

| Campo | Obrigatório |
|---|---|
| módulo afetado | ✅ |
| boundary violado | ✅ |
| dependência envolvida | ✅ |
| severidade | ✅ |
| sugestão | ✅ |

---

# Categorias

| Categoria | Descrição |
|---|---|
| ARCHITECTURE | violação arquitetural |
| COUPLING | acoplamento excessivo |
| DEPENDENCY | dependência inválida |
| STRUCTURE | problema estrutural |

---

# Objetivo

Permitir:

```txt
governança arquitetural contínua
```

---

# Revalidação Incremental

# O sistema deve detectar

| Situação | Obrigatória |
|---|---|
| violação persistente | ✅ |
| violação corrigida | ✅ |
| regressão arquitetural | ✅ |

---

# Runtime

# O review arquitetural NÃO pode

- bloquear IDE;
- congelar runtime;
- executar análise infinita.

---

# Runtime deve possuir

| Recurso | Obrigatório |
|---|---|
| incremental analysis | ✅ |
| cache | ✅ |
| timeout | ✅ |
| debounce | ✅ |

---

# Estratégia Offline

# O sistema deve funcionar

- sem cloud;
- com AST local;
- com heurísticas locais.

---

# Estratégia Cloud

# Cloud deve adicionar

- inteligência organizacional;
- heurísticas compartilhadas;
- histórico arquitetural;
- analytics arquiteturais.

---

# Objetivo Final

O review arquitetural deve evoluir como:

```txt
Governança Arquitetural Inteligente Integrada ao Review
```

e NÃO apenas:

```txt
lint arquitetural isolado
```