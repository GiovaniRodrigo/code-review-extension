# Metodologias e Estratégias

Este documento posiciona as estratégias da literatura de [categorias](../categorias) dentro de camadas e setores.

## Pirâmide de testes

Aplicação:

* base com testes unitários em regras e componentes;
* meio com testes de integração, API, banco e contratos;
* topo com E2E, aceitação e fluxos críticos.

Setores envolvidos:

* Engenharia;
* QA;
* Produto;
* DevOps/SRE.

Uso recomendado:

* manter muitos testes rápidos na base;
* usar integração para riscos reais entre módulos;
* reservar E2E para jornadas essenciais.

## Shift Left Testing

Aplicação:

* validar requisitos, arquitetura, segurança e testabilidade antes da implementação tardia;
* antecipar lint, análise estática, testes unitários, contrato e security scan no pipeline.

Setores envolvidos:

* Produto;
* Engenharia;
* QA;
* Arquitetura;
* Segurança.

Uso recomendado:

* critérios de aceite claros;
* testes criados junto da feature;
* quality gates em pull request;
* threat modeling em funcionalidades sensíveis.

## Shift Right Testing

Aplicação:

* validar comportamento em produção ou ambiente realista;
* usar métricas, logs, traces, canary, feature flags e monitoramento.

Setores envolvidos:

* DevOps/SRE;
* Engenharia;
* QA;
* Produto.

Uso recomendado:

* acompanhar SLO;
* medir regressões reais;
* usar canary e rollback;
* manter alertas acionáveis.

## Continuous Testing

Aplicação:

* executar testes automaticamente em commits, pull requests, builds e deploys;
* conectar testes funcionais, estruturais, segurança e infraestrutura.

Setores envolvidos:

* Engenharia;
* QA;
* DevOps/SRE;
* Segurança.

Uso recomendado:

* pipeline com lint, unitários, integração, scans, build e deploy;
* gates objetivos;
* relatórios de execução e cobertura.

## Risk-Based Testing

Aplicação:

* priorizar testes por impacto e probabilidade de falha;
* proteger fluxos financeiros, dados sensíveis, login, autorização, pagamento e operação crítica.

Setores envolvidos:

* Produto;
* QA;
* Segurança;
* Engenharia;
* Dados/IA.

Uso recomendado:

* matriz de risco;
* cenários obrigatórios por criticidade;
* regressão seletiva;
* aprovação formal para riscos aceitos.

## Testes orientados a contrato

Aplicação:

* validar contratos entre frontend, backend, APIs externas, mensageria e consumidores;
* reduzir falhas de integração e dependência de E2E pesado.

Setores envolvidos:

* Engenharia;
* QA;
* Arquitetura.

Uso recomendado:

* contratos versionados;
* validação em pipeline;
* compatibilidade retroativa;
* Pact ou OpenAPI validators.

## TDD

Aplicação:

* construir regras de negócio e componentes com teste antes ou junto do código;
* reforçar design simples e feedback rápido.

Setores envolvidos:

* Engenharia.

Uso recomendado:

* domínio crítico;
* regras com muitos cenários;
* refatorações seguras.

## BDD

Aplicação:

* traduzir comportamento esperado em linguagem comum;
* aproximar Produto, QA e Engenharia.

Setores envolvidos:

* Produto;
* QA;
* Engenharia.

Uso recomendado:

* cenários em Gherkin quando ajudam comunicação;
* foco em comportamento, não em detalhes internos.

## ATDD

Aplicação:

* definir testes de aceitação antes da implementação;
* alinhar entrega ao requisito aprovado.

Setores envolvidos:

* Produto;
* QA;
* Engenharia;
* stakeholders.

Uso recomendado:

* histórias com alto risco de interpretação;
* homologação formal;
* rastreabilidade requisito -> aceite -> teste.
