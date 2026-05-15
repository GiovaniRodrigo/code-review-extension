# RAG Standard — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir o padrão oficial de utilização de RAG no sistema.

O objetivo do RAG NÃO é apenas:

```txt
buscar texto
```

O objetivo é:

```txt
contextualizar code review organizacionalmente
```

---

# Objetivo do RAG

O RAG deve permitir que a IA compreenda:

- arquitetura;
- contexto organizacional;
- padrões internos;
- decisões técnicas;
- convenções;
- regras de negócio;
- histórico técnico.

---

# RAG é Opcional

O sistema deve funcionar:

- com RAG;
- sem RAG;
- localmente;
- offline;
- cloud;
- híbrido.

---

# Fontes Suportadas

## Obrigatórias

| Fonte | Obrigatória |
|---|---|
| Markdown | ✅ |
| ADRs | ✅ |
| Arquitetura | ✅ |
| Style Guides | ✅ |
| Convenções | ✅ |
| Código | ✅ |

---

# Futuras

| Fonte | Futuro |
|---|---|
| OpenAPI | ⚪ |
| SQL Schema | ⚪ |
| Wiki | ⚪ |
| Git History | ⚪ |
| PR History | ⚪ |
| Diagrams | ⚪ |

---

# Estrutura Esperada

## Organização recomendada

```txt
/docs
  /adr
  /architecture
  /conventions
  /guides
  /heuristics
```

---

# Tipos de Contexto

# 1. Arquitetural

## Exemplos

- Clean Architecture;
- DDD;
- boundaries;
- módulos;
- padrões.

---

# 2. Organizacional

## Exemplos

- convenções internas;
- padrões da equipe;
- guidelines;
- regras de review.

---

# 3. Funcional

## Exemplos

- regras de negócio;
- workflows;
- integrações;
- comportamentos esperados.

---

# 4. Técnico

## Exemplos

- APIs;
- contratos;
- pipelines;
- infraestrutura;
- runtime.

---

# Chunking

# Objetivo

Gerar contexto eficiente.

---

# Estratégia obrigatória

## Chunking semântico

Chunks devem respeitar:

- contexto;
- seção;
- heading;
- assunto;
- arquitetura.

---

# NÃO permitido

- cortar texto arbitrariamente;
- quebrar contexto técnico;
- chunk puramente por caracteres.

---

# Estratégia de Embeddings

## O sistema deve permitir

| Tipo | Obrigatório |
|---|---|
| embeddings locais | ✅ |
| embeddings cloud | ✅ |
| embeddings customizados | ✅ |

---

# Estratégia de Indexação

## O sistema deve suportar

| Tipo | Obrigatório |
|---|---|
| indexação incremental | ✅ |
| reindexação | ✅ |
| indexação manual | ✅ |
| indexação automática | ✅ |

---

# Runtime RAG

## O sistema NÃO pode

- bloquear IDE;
- congelar runtime;
- indexar infinitamente;
- consumir recursos excessivos.

---

# Runtime deve possuir

| Recurso | Obrigatório |
|---|---|
| progress | ✅ |
| cancelamento | ✅ |
| retry | ✅ |
| fallback | ✅ |
| cache | ✅ |

---

# Contexto Utilizado pela IA

## O RAG deve enriquecer

- findings;
- análise arquitetural;
- análise organizacional;
- análise de segurança;
- análise de padrões.

---

# Objetivo Final

O RAG deve evoluir para:

```txt
Memória Organizacional Inteligente para Code Review
```

e NÃO apenas:

```txt
busca vetorial simples
```