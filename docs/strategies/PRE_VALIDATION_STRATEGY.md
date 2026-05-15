# Pre Validation Strategy — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir a estratégia oficial de pré-validação com IA.

O objetivo NÃO é:

```txt
substituir o reviewer
```

O objetivo é:

```txt
reduzir esforço inicial de revisão técnica
```

---

# Princípio Principal

A pré-validação deve funcionar como:

```txt
assistência inteligente inicial
```

e NÃO como:

```txt
aprovação automática
```

---

# HITL

# Obrigatório

Toda recomendação gerada pela IA deve ser validada por humano.

---

# A IA pode

- sugerir findings;
- contextualizar;
- identificar riscos;
- sugerir melhorias;
- sugerir severidade.

---

# A IA NÃO pode

- aprovar review;
- fechar findings;
- tomar decisão final;
- substituir reviewer.

---

# Objetivo da Pré-Validação

A IA deve ajudar o reviewer a:

- encontrar problemas rapidamente;
- reduzir análise repetitiva;
- identificar riscos ocultos;
- identificar problemas arquiteturais;
- identificar violações organizacionais.

---

# Modos Suportados

# A pré-validação deve funcionar em

| Modo | Obrigatório |
|---|---|
| Pull Request | ✅ |
| Branch Diff | ✅ |
| Open File | ✅ |
| Workspace | ✅ |

---

# Contexto Utilizado

# A IA deve utilizar

| Fonte | Obrigatória |
|---|---|
| código | ✅ |
| diff | ✅ |
| AST | ✅ |
| heurísticas | ✅ |
| RAG | ✅ |
| arquitetura | ✅ |

---

# Objetivo

Reduzir:

```txt
falsos positivos
```

e melhorar:

```txt
contextualização
```

---

# Categorias de Análise

# A IA deve analisar

| Categoria | Obrigatória |
|---|---|
| arquitetura | ✅ |
| qualidade | ✅ |
| segurança | ✅ |
| performance | ✅ |
| convenções | ✅ |
| estrutura | ✅ |

---

# Findings Gerados

# Findings IA devem possuir

| Campo | Obrigatório |
|---|---|
| descrição | ✅ |
| severidade | ✅ |
| categoria | ✅ |
| confidence score | ✅ |
| contexto | ✅ |
| sugestão | ✅ |

---

# Confidence Score

# Objetivo

Ajudar reviewer a avaliar confiança da IA.

---

# Escala

| Score | Significado |
|---|---|
| 0-30 | baixa confiança |
| 31-70 | média confiança |
| 71-100 | alta confiança |

---

# Workflow

```txt
Reviewer inicia review
 ↓
IA executa pré-validação
 ↓
Findings sugeridos
 ↓
Reviewer aceita/rejeita/edita
 ↓
Reviewer adiciona validações próprias
```

---

# Revalidação Incremental

# O sistema deve detectar

| Situação | Obrigatória |
|---|---|
| findings persistentes | ✅ |
| findings corrigidos | ✅ |
| novos findings | ✅ |
| regressões | ✅ |

---

# Objetivo

Evitar:

```txt
reanálise completa
```

---

# Runtime

# A pré-validação NÃO pode

- travar IDE;
- congelar editor;
- bloquear typing;
- monopolizar CPU.

---

# Runtime deve possuir

| Recurso | Obrigatório |
|---|---|
| timeout | ✅ |
| cancelamento | ✅ |
| retry | ✅ |
| loading state | ✅ |
| progress state | ✅ |

---

# Estratégia Offline

# O sistema deve permitir

- IA local;
- review local;
- embeddings locais;
- RAG local.

---

# Estratégia Cloud

# Cloud deve adicionar

- IA especializada;
- inteligência organizacional;
- heurísticas compartilhadas;
- contexto compartilhado.

---

# Objetivo Final

A pré-validação deve evoluir como:

```txt
Camada Inteligente de Assistência Técnica ao Reviewer
```

e NÃO como:

```txt
aprovação automática de código
```