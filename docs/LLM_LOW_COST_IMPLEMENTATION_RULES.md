# AI Low-Cost Implementation Rules

## 1. Objetivo

Este documento define regras obrigatórias para implementação do sistema utilizando:

- mínimo custo computacional
- mínimo uso de tokens
- mínimo reasoning/thinking
- mínimo número de arquivos
- mínimo número de alterações
- máxima reutilização da arquitetura existente

A IA deve agir como:

```text
IMPLEMENTADOR DETERMINÍSTICO
```

e NÃO como arquiteto exploratório.

---

# 2. Regras Fundamentais

## 2.1 A IA DEVE

- reutilizar código existente
- reutilizar interfaces existentes
- reutilizar analyzers existentes
- reutilizar mocks existentes
- reutilizar testes existentes
- reutilizar providers existentes
- reutilizar configs existentes

---

## 2.2 A IA NÃO DEVE

- refatorar arquitetura
- reorganizar pastas
- criar novas abstrações
- criar patterns novos
- criar helpers desnecessários
- criar wrappers desnecessários
- criar factories desnecessárias
- criar builders desnecessários
- criar decorators desnecessários
- criar complexidade adicional

---

# 3. Estratégia Obrigatória

## Ordem fixa

```text
1. Reutilizar
2. Estender
3. Implementar mínimo necessário
4. Testar
5. Finalizar
```

---

# 4. Estratégia de Código

## Sempre preferir

### Pequenas funções

```ts
function execute() {}
```

---

### Pequenas classes

```ts
class Service {}
```

---

### Objetos simples

```ts
const config = {}
```

---

## Nunca preferir

### Abstrações profundas

```ts
AbstractFactoryProviderBuilderStrategyManager
```

---

### Heranças desnecessárias

```ts
class A extends B extends C
```

---

# 5. Estratégia para Testes

## Cobrir apenas

- happy path
- error path
- retorno principal

---

## NÃO criar

- testes excessivos
- cenários redundantes
- mocks complexos
- fixtures gigantes
- factories de teste

---

# 6. Estratégia para Coverage

Objetivo:

```text
SUBIR COVERAGE
COM O MENOR NÚMERO POSSÍVEL DE TESTES
```

---

# 7. Estratégia para Mutation Testing

A IA deve:

- reutilizar testes existentes
- não criar mutation-specific tests
- aumentar robustez mínima necessária

---

# 8. Estratégia para UI

A IA deve:

- reutilizar componentes existentes
- usar shadcn/ui
- usar cards simples
- usar tabelas simples
- usar gráficos simples

---

# 9. Estratégia para Dashboard

A dashboard deve inicialmente conter apenas:

| Widget | Fonte |
|---|---|
| Coverage | Vitest |
| Mutation | Stryker |
| Quality Gates | UseCase |
| Findings | Analyzer |
| Build Status | CI |

---

## NÃO implementar inicialmente

- GraphRAG
- realtime sync
- websocket
- tracing complexo
- analytics avançado
- dashboards avançadas

---

# 10. Estratégia para IA

## A IA deve responder:

```text
MENOR IMPLEMENTAÇÃO POSSÍVEL
```

---

## A IA NÃO deve responder:

```text
MELHOR ARQUITETURA POSSÍVEL
```

---

# 11. Estratégia para Arquivos

## Modificar o mínimo possível

Preferir:

```text
1 arquivo alterado
```

ao invés de:

```text
10 arquivos reorganizados
```

---

# 12. Estratégia para Imports

Preferir:

```ts
import { X } from './X'
```

---

Evitar:

```ts
index.ts gigantes
barrel exports complexos
```

---

# 13. Estratégia para Dependências

## A IA deve:

- evitar novas libs
- reutilizar libs existentes
- evitar frameworks pesados

---

## Permitido apenas

| Categoria | Lib |
|---|---|
| Testes | Vitest |
| Coverage | Vitest |
| Mutation | Stryker |
| AST | ts-morph |
| Validation | zod |
| Logs | pino |

---

# 14. Estratégia para Performance

A IA deve:

- evitar loops desnecessários
- evitar scans repetidos
- evitar carregar projeto inteiro
- evitar AST global desnecessária

---

# 15. Estratégia para Monorepo

A IA deve:

- alterar apenas package necessário
- evitar rebuild completo
- evitar mudanças globais

---

# 16. Estratégia para Quality Gates

A IA deve bloquear apenas:

| Gate | Regra |
|---|---|
| Coverage | < 70% |
| Mutation | < 60% |
| Circular deps | > 0 |
| Critical vulnerabilities | > 0 |

---

# 17. Estratégia para Findings

Findings devem conter apenas:

```ts
{
  file,
  line,
  severity,
  message
}
```

---

## NÃO adicionar

- metadata excessiva
- objetos gigantes
- tracing complexo

---

# 18. Estratégia para Analyzers

Cada analyzer deve:

```text
FAZER UMA ÚNICA RESPONSABILIDADE
```

---

## Exemplo correto

| Analyzer | Responsabilidade |
|---|---|
| DependencyAnalyzer | dependências |
| ArchitectureAnalyzer | arquitetura |
| SOLIDAnalyzer | SOLID |
| ComplexityAnalyzer | complexidade |

---

# 19. Estratégia para CI/CD

Pipeline mínima:

```text
lint
↓
unit
↓
integration
↓
coverage
↓
mutation
↓
build
```

---

# 20. Estratégia para E2E

Inicialmente:

- apenas VSCode
- apenas comando principal
- apenas webview principal

---

# 21. Estratégia para RAG

Inicialmente:

- markdown
- ts
- tsx

---

## NÃO implementar inicialmente

- pdf
- docx
- OCR
- embeddings distribuídos

---

# 22. Estratégia Principal

A IA deve sempre perguntar internamente:

```text
EXISTE UMA IMPLEMENTAÇÃO MENOR?
```

Se SIM:

```text
UTILIZAR A IMPLEMENTAÇÃO MENOR
```

---

# 23. Regra Suprema

```text
IMPLEMENTAR
O MENOR CÓDIGO POSSÍVEL
COM O MENOR NÚMERO POSSÍVEL DE ALTERAÇÕES
UTILIZANDO A ARQUITETURA EXISTENTE
SEM THINKING DESNECESSÁRIO
SEM REFATORAÇÃO
SEM COMPLEXIDADE EXTRA
```