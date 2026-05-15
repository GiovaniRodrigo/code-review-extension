# Heuristics Engine — Plataforma Multi-IDE de Code Review com IA

# Objetivo

Definir o motor de heurísticas do sistema.

O objetivo NÃO é apenas:

```txt
executar regras fixas
```

O objetivo é:

```txt
permitir inteligência organizacional configurável
```

---

# Objetivo das Heurísticas

As heurísticas devem permitir:

- padronização organizacional;
- validações arquiteturais;
- regras de review;
- políticas internas;
- convenções técnicas;
- validações contextuais.

---

# Estratégia Principal

Tudo deve ser:

```txt
opcional e configurável
```

---

# Tipos de Heurísticas

# 1. Arquiteturais

## Exemplos

| Regra | Obrigatória |
|---|---|
| domínio não acessa infra | ✅ |
| UI não acessa banco | ✅ |
| módulos não cruzam boundaries | ✅ |
| adapters seguem padrão | ✅ |

---

# 2. Qualidade

## Exemplos

| Regra | Obrigatória |
|---|---|
| cobertura mínima | ✅ |
| mutation mínima | ✅ |
| arquivos muito grandes | ✅ |
| complexidade máxima | ✅ |

---

# 3. Segurança

## Exemplos

| Regra | Obrigatória |
|---|---|
| secrets hardcoded | ✅ |
| eval inseguro | ✅ |
| SQL injection | ✅ |
| auth bypass | ✅ |

---

# 4. Organização

## Exemplos

| Regra | Obrigatória |
|---|---|
| nomenclatura | ✅ |
| estrutura de pastas | ✅ |
| convenções internas | ✅ |
| naming conventions | ✅ |

---

# 5. Runtime

## Exemplos

| Regra | Obrigatória |
|---|---|
| duplicated registration | ✅ |
| runtime diagnostics | ✅ |
| provider timeout | ✅ |
| fallback obrigatório | ✅ |

---

# Origem das Heurísticas

## O sistema deve suportar

| Origem | Obrigatória |
|---|---|
| local | ✅ |
| projeto | ✅ |
| workspace | ✅ |
| organizacional | ⚪ |
| cloud | ⚪ |

---

# Heurísticas por Linguagem

## O sistema deve permitir

| Linguagem | Obrigatória |
|---|---|
| TypeScript | ✅ |
| JavaScript | ✅ |
| PHP | ✅ |
| C# | ⚪ |
| Java | ⚪ |

---

# Heurísticas por Arquitetura

## Exemplos

| Arquitetura | Obrigatória |
|---|---|
| Clean Architecture | ✅ |
| DDD | ✅ |
| Modular Monolith | ⚪ |
| Hexagonal | ⚪ |
| MVC | ⚪ |

---

# Estratégia de Execução

# As heurísticas devem funcionar em

| Momento | Obrigatório |
|---|---|
| pré-validação IA | ✅ |
| análise manual | ✅ |
| runtime validation | ✅ |
| sync | ⚪ |
| CI | ⚪ |

---

# Integração com IA

## A IA deve utilizar heurísticas para

- contextualizar findings;
- reduzir falsos positivos;
- entender convenções;
- adaptar review organizacionalmente.

---

# Integração com AST

## O motor deve utilizar AST para

- identificar arquitetura;
- validar boundaries;
- validar dependências;
- detectar violações.

---

# Integração com RAG

## O motor deve utilizar RAG para

- convenções organizacionais;
- guidelines;
- padrões internos;
- ADRs.

---

# Findings de Heurística

## Devem possuir

| Campo | Obrigatório |
|---|---|
| regra | ✅ |
| categoria | ✅ |
| severidade | ✅ |
| descrição | ✅ |
| sugestão | ✅ |
| contexto | ✅ |

---

# Configuração

## O usuário deve conseguir

| Ação | Obrigatória |
|---|---|
| habilitar/desabilitar | ✅ |
| ajustar severidade | ✅ |
| ajustar escopo | ✅ |
| criar regra | ⚪ |
| compartilhar regra | ⚪ |

---

# Runtime

## O motor NÃO pode

- bloquear IDE;
- congelar runtime;
- executar infinitamente;
- consumir CPU excessivamente.

---

# Runtime deve possuir

| Recurso | Obrigatório |
|---|---|
| cache | ✅ |
| debounce | ✅ |
| incremental execution | ✅ |
| timeout | ✅ |
| cancelamento | ✅ |

---

# Objetivo Final

O Heuristics Engine deve evoluir como:

```txt
Motor Organizacional Inteligente de Code Review
```

e NÃO apenas:

```txt
conjunto fixo de regras
```