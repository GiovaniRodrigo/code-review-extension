# 5. Testes de Arquitetura

Os testes de arquitetura validam se o sistema respeita as regras estruturais e princípios técnicos definidos para o projeto.

O foco não é:

```text id="faw99o"
“o sistema funciona?”
```

Mas sim:

```text id="7oz54x"
“o sistema continua saudável, sustentável e coerente arquiteturalmente?”
```

---

# Objetivos Principais

Garantir:

* baixo acoplamento,
* alta coesão,
* separação de responsabilidades,
* modularidade,
* manutenibilidade,
* escalabilidade,
* previsibilidade arquitetural.

---

# Problema que esses testes resolvem

Com o tempo, sistemas tendem a sofrer:

* acoplamento excessivo,
* dependências cíclicas,
* violação de camadas,
* lógica espalhada,
* regras inconsistentes,
* “arquitetura morta”.

Os testes arquiteturais evitam isso.

---

# 5.1 Teste de Dependência

Valida relações entre módulos e camadas.

## Objetivo

Garantir dependências corretas.

---

# O que valida

* direção das dependências,
* dependências proibidas,
* ciclos,
* imports inválidos.

---

# Exemplo

## Regra

```text id="p0jnhm"
Controller → Service → Repository
```

Proibido:

```text id="lu7bhx"
Repository → Controller
```

---

# Problema clássico

```text id="m4c4l2"
dependência circular
```

Exemplo:

```text id="mjlwmz"
A → B → C → A
```

Isso gera:

* difícil manutenção,
* forte acoplamento,
* compilação lenta,
* arquitetura instável.

---

# Ferramentas

* ArchUnit
* dependency-cruiser
* Nx

---

# Exemplo de regra

```ts id="0t8mlm"
modules/ui cannot import infrastructure/*
```

---

# 5.2 Teste de Modularidade

Valida isolamento entre módulos.

## Objetivo

Garantir independência modular.

---

# O que valida

* encapsulamento,
* comunicação controlada,
* fronteiras claras,
* reutilização.

---

# Exemplo

Módulo:

```text id="j9jlwm"
billing
```

não deve acessar:

```text id="j10jlwm"
auth internals
```

somente:

```text id="u9l06g"
interfaces públicas
```

---

# Avalia

| Item           | Objetivo               |
| -------------- | ---------------------- |
| Encapsulamento | esconder implementação |
| Reutilização   | independência          |
| Separação      | domínio isolado        |

---

# Problemas comuns

* shared excessivo,
* módulos gigantes,
* dependências ocultas,
* vazamento de responsabilidade.

---

# 5.3 Teste de Acoplamento

Avalia nível de dependência entre componentes.

## Objetivo

Reduzir dependências excessivas.

---

# Baixo Acoplamento

```text id="2wv74o"
ideal
```

Mudanças em um módulo:

* não quebram outros.

---

# Alto Acoplamento

```text id="rk4yx9"
problemático
```

Mudanças em um componente:

* afetam todo sistema.

---

# Exemplo ruim

```ts id="x6j1gm"
class PaymentService {
  constructor(
    private mysql,
    private redis,
    private rabbit,
    private logger,
    private email,
    private cache,
    private gateway
  ) {}
}
```

---

# Problemas

* difícil testar,
* difícil manter,
* baixa reutilização,
* cascata de falhas.

---

# Métricas comuns

| Métrica           | Objetivo                  |
| ----------------- | ------------------------- |
| Afferent Coupling | dependências recebidas    |
| Efferent Coupling | dependências externas     |
| Instability       | estabilidade arquitetural |

---

# 5.4 Teste de Boundary

Valida fronteiras arquiteturais.

## Objetivo

Garantir isolamento entre contextos e camadas.

---

# Conceito

Cada camada possui:

* responsabilidades,
* limites,
* contratos.

---

# Exemplo

## Permitido

```text id="o3wo0d"
Application → Domain
```

## Proibido

```text id="2r7w6v"
Infrastructure → UI
```

---

# Muito usado em

* Clean Architecture
* Hexagonal
* Onion Architecture
* DDD

---

# Problemas detectados

* vazamento de domínio,
* lógica em camada errada,
* dependência indevida.

---

# Exemplo clássico

```text id="7w8w0o"
Entity usando framework
```

ERRADO:

```ts id="lmb6t0"
@Entity()
class User {}
```

Domínio não deveria depender do ORM.

---

# 5.5 Teste de Clean Architecture

Valida princípios da Clean Architecture.

Baseado em:
Robert C. Martin.

---

# Objetivo

Garantir independência:

* de frameworks,
* banco,
* UI,
* infraestrutura.

---

# Regra principal

Dependências apontam para dentro.

---

# Estrutura clássica

```text id="j0m1n7"
Frameworks
    ↓
Adapters
    ↓
Use Cases
    ↓
Entities
```

---

# O que validar

| Regra                  | Exemplo     |
| ---------------------- | ----------- |
| domínio isolado        | sem ORM     |
| use cases puros        | sem HTTP    |
| infraestrutura externa | desacoplada |

---

# Exemplo inválido

```ts id="g1v6l4"
class UserUseCase {
  constructor(private expressRequest) {}
}
```

UseCase não deveria conhecer Express.

---

# Testes típicos

* domínio não importa framework,
* use case não acessa banco diretamente,
* adapters isolados.

---

# 5.6 Teste DDD

Valida regras de Domain-Driven Design.

---

# Objetivo

Garantir modelagem correta do domínio.

---

# O que valida

* bounded contexts,
* entidades,
* value objects,
* aggregates,
* ubiquitous language,
* domain services.

---

# Exemplo

## Contextos

```text id="fwxgjo"
Financeiro
Vendas
Estoque
```

Não devem:

```text id="6kxjz2"
misturar responsabilidades
```

---

# Problema clássico

```text id="hlyxwt"
domínio anêmico
```

Exemplo:

```ts id="mzytgm"
class User {
  public name: string;
}
```

Sem comportamento de negócio.

---

# Correto

```ts id="t2frz1"
class User {
  changePassword() {}
}
```

---

# Validações comuns

| Elemento     | Regra                  |
| ------------ | ---------------------- |
| Entity       | identidade             |
| Value Object | imutabilidade          |
| Aggregate    | consistência           |
| Repository   | abstração persistência |

---

# 5.7 Teste de SOLID

Valida princípios SOLID.

Baseado em:
Robert C. Martin.

---

# S — Single Responsibility

Uma classe deve ter:

```text id="9jlwmw"
uma responsabilidade
```

---

# Problema

```ts id="cngm24"
class UserService {
  saveUser() {}
  sendEmail() {}
  generatePDF() {}
}
```

---

# O — Open/Closed

Sistema:

```text id="uh55u0"
aberto para extensão
fechado para modificação
```

---

# Problema clássico

Modificar código antigo toda vez que adiciona regra nova.

---

# L — Liskov Substitution

Subtipos devem substituir corretamente o tipo base.

---

# Exemplo ruim

```ts id="40rjlwm"
class Bird {
  fly() {}
}

class Penguin extends Bird {}
```

---

# I — Interface Segregation

Interfaces pequenas e específicas.

---

# Problema

```ts id="pqlm9x"
interface Worker {
  code()
  cook()
  drive()
}
```

---

# D — Dependency Inversion

Depender de abstrações.

---

# Correto

```ts id="km0uhx"
class Service {
  constructor(private repository: IUserRepository) {}
}
```

---

# 5.8 Teste de Convenções

Valida padrões técnicos definidos pela equipe.

## Objetivo

Garantir padronização.

---

# O que valida

* nomenclatura,
* estrutura,
* organização,
* estilo,
* padrões de projeto.

---

# Exemplos

## Convenção de pastas

```text id="mjlwmx"
src/modules/*
```

---

## Convenção de nomes

```text id="grrt1f"
UserService
CreateUserUseCase
UserRepository
```

---

# Problemas detectados

* código inconsistente,
* naming inválido,
* estrutura desorganizada.

---

# Ferramentas

* ESLint
* SonarQube
* PHPStan

---

# Relação Entre os Testes Arquiteturais

| Tipo               | Objetivo                  |
| ------------------ | ------------------------- |
| Dependência        | validar imports e direção |
| Modularidade       | validar isolamento        |
| Acoplamento        | reduzir dependências      |
| Boundary           | validar fronteiras        |
| Clean Architecture | validar camadas           |
| DDD                | validar domínio           |
| SOLID              | validar design OO         |
| Convenções         | validar padronização      |

---

# Métricas Arquiteturais

## Métricas importantes

| Métrica         | Objetivo       |
| --------------- | -------------- |
| Coupling        | acoplamento    |
| Cohesion        | coesão         |
| Complexity      | complexidade   |
| Stability       | estabilidade   |
| Maintainability | manutenção     |
| Technical Debt  | dívida técnica |

---

# Sinais de Arquitetura Saudável

## Sistema saudável

* módulos independentes,
* baixo acoplamento,
* domínio forte,
* regras claras,
* fácil refatoração,
* testes simples.

---

# Sinais de Arquitetura Ruim

## Code Smells

* God Class,
* cyclic dependency,
* shotgun surgery,
* feature envy,
* spaghetti code,
* smart UI,
* anemic domain.

---

# Estratégia Recomendada

## Pipeline moderno

```text id="9n63pr"
Lint
  ↓
Static Analysis
  ↓
Architecture Tests
  ↓
Unit Tests
  ↓
Integration Tests
```

---

# Arquitetura como Código

Conceito moderno:

```text id="yz7nfo"
Architecture as Code
```

---

# Exemplo prático

```ts id="4s7k2m"
it('domain não pode depender de infra', () => {
  expect(domainImports).not.toContain('typeorm');
});
```

---

# Benefícios

## Técnicos

* previsibilidade,
* manutenibilidade,
* escalabilidade,
* segurança estrutural.

## Negócio

* menos bugs,
* evolução segura,
* menor custo,
* maior estabilidade.
