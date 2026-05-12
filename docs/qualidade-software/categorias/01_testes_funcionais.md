# 1. Testes Funcionais

Os testes funcionais validam se o sistema executa corretamente os requisitos esperados pelo usuário, regras de negócio e fluxos da aplicação.

---

# 1.1 Teste Unitário

Valida pequenas unidades isoladas do sistema, normalmente funções, métodos ou classes.

## Objetivo

Garantir que cada unidade de código funcione individualmente.

## Características

* Rápido
* Isolado
* Sem dependência externa
* Fácil automação

## Escopo

* Funções
* Services
* Helpers
* Validators
* Regras de negócio

## Exemplo

```ts
function soma(a: number, b: number): number {
  return a + b;
}

test('deve somar dois números', () => {
  expect(soma(2, 3)).toBe(5);
});
```

## Ferramentas

* Jest
* Vitest
* PHPUnit
* xUnit
* PyTest

## Métricas importantes

* Cobertura de código
* Cobertura de branches
* Mutation score

---

# 1.2 Teste de Integração

Valida a comunicação entre módulos do sistema.

## Objetivo

Garantir que componentes integrados funcionem corretamente juntos.

## Escopo

* API + banco
* Service + repository
* Mensageria
* Cache
* Sistemas externos

## Exemplos

* Salvar usuário no banco
* Integração com Redis
* Integração com fila RabbitMQ

## Características

* Mais lento que unitário
* Usa infraestrutura real ou simulada
* Detecta falhas de comunicação

## Exemplo

```ts
test('deve salvar usuário no banco', async () => {
  const user = await userRepository.create({
    name: 'Giovani'
  });

  expect(user.id).toBeDefined();
});
```

---

# 1.3 Teste de Sistema

Valida o sistema completo funcionando como produto final.

## Objetivo

Garantir que o software inteiro opere corretamente.

## Escopo

* Backend
* Frontend
* Banco
* APIs
* Infraestrutura

## Características

* Ambiente próximo da produção
* Fluxos completos
* Alto custo de execução

## Exemplo

* Usuário realiza login
* Faz compra
* Recebe confirmação

---

# 1.4 Teste End-to-End (E2E)

Simula o comportamento real do usuário.

## Objetivo

Validar jornadas completas do usuário.

## Escopo

* Navegação
* Cliques
* Formulários
* Fluxos reais

## Características

* Mais próximo da experiência real
* Mais lento
* Sensível a UI

## Exemplo

```ts
test('usuário deve realizar login', async ({ page }) => {
  await page.goto('/login');

  await page.fill('#email', 'admin@test.com');
  await page.fill('#password', '123456');

  await page.click('button[type=submit]');

  await expect(page).toHaveURL('/dashboard');
});
```

## Ferramentas

* Playwright
* Cypress
* Selenium

---

# 1.5 Teste de Aceitação

Valida se o sistema atende aos requisitos do cliente.

## Objetivo

Garantir conformidade com regras de negócio.

## Responsáveis

* QA
* Cliente
* Product Owner
* Stakeholders

## Características

* Baseado em requisitos
* Foco no valor de negócio
* Aprovação funcional

## Exemplo

```gherkin
Cenário: Aprovação de pagamento
Dado que o usuário possui saldo
Quando realizar uma compra
Então o pagamento deve ser aprovado
```

---

# 1.6 Teste de Regressão

Verifica se alterações quebraram funcionalidades antigas.

## Objetivo

Evitar efeitos colaterais após mudanças.

## Quando usar

* Novas features
* Refatorações
* Correções
* Atualizações

## Características

* Muito automatizado
* Executado frequentemente

## Exemplo

Após alterar login:

* cadastro ainda funciona
* reset de senha continua funcionando

---

# 1.7 Teste Smoke

Validação rápida para verificar se o sistema “liga”.

## Objetivo

Detectar falhas críticas rapidamente.

## Escopo

* Inicialização
* Rotas principais
* Serviços essenciais

## Características

* Curto
* Superficial
* Executado após deploy

## Exemplo

* API responde
* Banco conecta
* Login abre

---

# 1.8 Teste Sanity

Valida rapidamente uma alteração específica.

## Objetivo

Garantir que uma correção funciona minimamente.

## Diferença para Smoke

* Smoke → sistema inteiro
* Sanity → funcionalidade alterada

## Exemplo

Após corrigir exportação PDF:

* validar apenas geração do PDF

---

# 1.9 Teste de API

Valida endpoints e contratos HTTP.

## Objetivo

Garantir funcionamento das APIs.

## Escopo

* REST
* GraphQL
* gRPC

## Validações

* Status code
* Payload
* Headers
* Autenticação
* Performance

## Exemplo

```ts
test('GET /users', async () => {
  const response = await request(app)
    .get('/users');

  expect(response.status).toBe(200);
});
```

## Ferramentas

* Postman
* Insomnia
* Supertest
* Pact

---

# 1.10 Teste de Interface (UI)

Valida elementos visuais e interação gráfica.

## Objetivo

Garantir funcionamento da interface.

## Escopo

* Botões
* Inputs
* Modais
* Responsividade
* Estados visuais

## Características

* Sensível a CSS
* Pode validar acessibilidade

## Exemplo

* botão desabilitado
* modal abre corretamente
* spinner aparece

---

# 1.11 Teste de Contrato

Valida contratos entre serviços.

## Objetivo

Garantir compatibilidade entre consumidor e provedor.

## Muito usado em

* Microsserviços
* APIs
* Sistemas distribuídos

## Exemplo

Serviço A espera:

```json
{
  "id": 1,
  "name": "Giovani"
}
```

Serviço B não pode mudar isso sem quebrar consumidores.

## Ferramentas

* Pact
* Spring Cloud Contract

---

# 1.12 Teste de Fluxo de Negócio

Valida processos completos de negócio.

## Objetivo

Garantir execução correta das regras empresariais.

## Escopo

* Aprovação
* Financeiro
* Estoque
* Workflow

## Exemplo

Fluxo:

1. Criar pedido
2. Aprovar pagamento
3. Reservar estoque
4. Emitir nota
5. Enviar produto

---

# 1.13 Teste Exploratório

Testes realizados manualmente sem roteiro rígido.

## Objetivo

Descobrir comportamentos inesperados.

## Características

* Criativo
* Manual
* Baseado em experiência

## Muito útil para

* UX
* Bugs complexos
* Edge cases

## Exemplo

Usuário tenta:

* spam de clique
* inputs inválidos
* navegação rápida
* abrir múltiplas abas

---

# 1.14 Teste Baseado em Comportamento (BDD)

Descreve comportamento esperado usando linguagem natural.

## Objetivo

Aproximar negócio, QA e desenvolvimento.

## Estrutura

* Given
* When
* Then

## Exemplo

```gherkin
Funcionalidade: Login

Cenário: Login válido
Dado que o usuário possui uma conta
Quando informar email e senha válidos
Então deve acessar o dashboard
```

## Benefícios

* Documentação viva
* Melhor comunicação
* Requisitos executáveis

## Ferramentas

* Cucumber
* Behat
* SpecFlow

---

# Relação Entre os Testes

| Tipo         | Escopo      | Velocidade   | Objetivo                |
| ------------ | ----------- | ------------ | ----------------------- |
| Unitário     | Pequeno     | Muito rápido | Validar lógica          |
| Integração   | Médio       | Médio        | Validar comunicação     |
| Sistema      | Grande      | Lento        | Validar produto         |
| E2E          | Completo    | Muito lento  | Simular usuário         |
| API          | Médio       | Médio        | Validar endpoints       |
| UI           | Interface   | Médio/Lento  | Validar frontend        |
| Contrato     | Integração  | Rápido       | Validar compatibilidade |
| Regressão    | Variado     | Variado      | Evitar quebra           |
| Smoke        | Superficial | Muito rápido | Validar estabilidade    |
| Sanity       | Pontual     | Rápido       | Validar correção        |
| Exploratório | Manual      | Variável     | Descobrir falhas        |
