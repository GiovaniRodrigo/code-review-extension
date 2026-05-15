# Review Diff Engine Strategy — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir a estratégia oficial do motor de diff da plataforma.

O objetivo NÃO é:

```txt
comparar linhas de código
```

O objetivo é:

```txt
entender impacto técnico incremental das alterações
```

---

# Princípio Principal

O diff engine representa:

- evolução incremental;
- contexto técnico;
- rastreabilidade;
- impacto arquitetural;
- continuidade do review.

---

# Objetivos do Diff Engine

Permitir:

- análise incremental;
- revalidação;
- detecção de regressão;
- navegação contextual;
- review eficiente.

---

# O sistema deve suportar

| Tipo de Diff | Obrigatório |
|---|---|
| branch diff | ✅ |
| PR diff | ✅ |
| arquivo aberto | ✅ |
| alterações locais | ⚪ |
| staged diff | ⚪ |

---

# Objetivo

Permitir:

```txt
review incremental contextual
```

---

# Estratégia Incremental

# O sistema deve detectar

| Situação | Obrigatória |
|---|---|
| novo código | ✅ |
| código removido | ✅ |
| código alterado | ✅ |
| refatoração | ⚪ |
| regressão | ✅ |

---

# Estratégia AST

# O diff engine deve utilizar

| Recurso | Obrigatório |
|---|---|
| AST | ✅ |
| dependency analysis | ✅ |
| boundary analysis | ✅ |
| impact analysis | ✅ |

---

# Objetivo

Reduzir:

```txt
falsos positivos por movimentação de código
```

---

# Estratégia de Revalidação

# O sistema deve detectar

| Situação | Obrigatória |
|---|---|
| finding persistente | ✅ |
| finding corrigido | ✅ |
| novo finding | ✅ |
| regressão | ✅ |

---

# Estratégia de Contexto

# O diff engine deve considerar

| Contexto | Obrigatório |
|---|---|
| arquitetura | ✅ |
| heurísticas | ✅ |
| RAG | ✅ |
| histórico | ⚪ |

---

# Estratégia de Runtime

# O diff engine NÃO pode

- travar IDE;
- bloquear editor;
- congelar runtime.

---

# Runtime deve possuir

| Recurso | Obrigatório |
|---|---|
| incremental processing | ✅ |
| debounce | ✅ |
| cache | ✅ |
| background execution | ✅ |

---

# Estratégia de Navegação

# O reviewer deve conseguir

| Ação | Obrigatória |
|---|---|
| navegar por blocos alterados | ✅ |
| navegar entre findings | ✅ |
| abrir contexto anterior | ✅ |
| abrir contexto atual | ✅ |

---

# Estratégia Offline

# O diff engine deve funcionar

- localmente;
- offline;
- apenas com Git local.

---

# Estratégia Cloud

# Cloud pode adicionar

- contexto compartilhado;
- histórico consolidado;
- analytics incrementais.

---

# Estratégia de Performance

# O sistema deve processar

- apenas arquivos alterados;
- apenas blocos relevantes;
- apenas módulos impactados.

---

# Objetivo

Evitar:

```txt
reanálise estrutural completa
```

---

# Objetivo Final

O diff engine deve evoluir como:

```txt
Motor Incremental Inteligente de Evolução Técnica
```

e NÃO apenas:

```txt
comparação textual de linhas
```