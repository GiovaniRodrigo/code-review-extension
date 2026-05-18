# AI Test Implementation Rules

## 1. Objetivo

Este documento define regras obrigatórias para implementação automatizada das ferramentas de testes da extensão multi-IDE.

A IA deve:

- Reduzir ao máximo reasoning/thinking
- Evitar decisões subjetivas
- Evitar arquiteturas alternativas
- Seguir implementação determinística
- Reutilizar padrões existentes
- Nunca quebrar Open/Closed Principle
- Nunca alterar código existente sem necessidade

---

# 2. Regras Gerais

## 2.1 Regras Obrigatórias

A IA DEVE:

- Usar TypeScript
- Usar Node.js
- Usar NPM
- Usar arquitetura existente
- Respeitar SOLID
- Respeitar DDD
- Respeitar Clean Architecture
- Implementar via Ports & Adapters
- Criar código desacoplado
- Criar testes automatizados
- Criar interfaces antes das implementações

## 2.2 Regras Proibidas

A IA NÃO DEVE:

- Criar lógica monolítica
- Acoplar IDE ao core
- Duplicar código
- Alterar comportamento existente
- Reescrever módulos estáveis
- Criar dependências desnecessárias
- Introduzir frameworks pesados
- Criar abstrações desnecessárias

---

# 3. Stack Obrigatória

| Categoria | Tecnologia |
|---|---|
| Runtime | Node.js |
| Linguagem | TypeScript |
| Testes | Vitest |
| Lint | ESLint |
| AST | ts-morph |
| Arquitetura | dependency-cruiser |
| Dependências | madge |
| Configuração | zod |
| Logs | pino |

---

# 4. Estratégia de Implementação

## Ordem Obrigatória

```text
1. Interface
2. Port
3. Domain
4. UseCase
5. Infra
6. Tests
7. UI
```

A IA nunca deve inverter esta ordem.

---

# 5. Estratégia de Testes

## 5.1 Testes Obrigatórios

Toda implementação DEVE possuir:

- Teste unitário
- Teste de integração
- Teste de arquitetura
- Teste de regressão

## 5.2 Cobertura Obrigatória

| Camada | Cobertura |
|---|---|
| Domain | 95% |
| Application | 90% |
| Infra | 80% |

---

# 6. Estrutura Obrigatória

```text
packages/
├── domain/
├── application/
├── core/
├── infra/
├── analyzers/
├── testing/
└── ui/
```

---

# 7. Regras Arquiteturais

## Permitido

```text
UI -> Application
Application -> Domain
Infra -> Application
Infra -> Domain
```

## Proibido

```text
Domain -> Infra
Domain -> UI
Application -> UI
```

---

# 8. Regras para IA

## 8.1 Redução de Thinking

A IA deve:

- Preferir implementação direta
- Evitar brainstorming
- Evitar múltiplas soluções
- Escolher solução padrão
- Não explicar excessivamente
- Não gerar alternativas desnecessárias

## 8.2 Estratégia Determinística

Se existir padrão anterior:

```text
REUTILIZAR
```

Se existir interface:

```text
IMPLEMENTAR
```

Se existir adapter:

```text
EXTENDER
```

Se existir analyzer:

```text
SEGUIR PADRÃO
```

---

# 9. Estratégia para Ferramentas de Teste

## 9.1 Vitest

Implementar:

- unit tests
- integration tests
- mocks
- coverage

Estrutura:

```text
tests/
├── unit/
├── integration/
├── architecture/
└── e2e/
```

## 9.2 ESLint

Implementar:

- regras arquiteturais
- code smell
- naming conventions
- import restrictions

## 9.3 dependency-cruiser

Implementar:

- boundary validation
- anti circular dependency
- clean architecture validation

## 9.4 madge

Implementar:

- dependency graph
- circular dependency detection

---

# 10. Regras de Qualidade

Bloquear merge quando:

- cobertura insuficiente
- dependência circular
- lint error crítico
- violação arquitetural
- vulnerabilidade crítica

---

# 11. Regras de Performance

A IA deve priorizar:

- baixo uso de memória
- execução incremental
- cache local
- lazy loading
- execução offline

---

# 12. Regras de Extensibilidade

Toda implementação deve:

- suportar plugins
- suportar polimorfismo
- suportar novos analyzers
- suportar novas IDEs
- suportar novos providers IA

---

# 13. Regra Principal

A IA deve SEMPRE:

```text
IMPLEMENTAR O MENOR CÓDIGO POSSÍVEL
COM A MENOR COMPLEXIDADE POSSÍVEL
SEM QUEBRAR A ARQUITETURA
```
