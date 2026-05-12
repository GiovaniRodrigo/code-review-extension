# Camadas do Software

As camadas organizam a qualidade pelo ponto onde o risco aparece: interface, regra de negócio, integração, dados, infraestrutura, segurança, observabilidade, arquitetura e inteligência artificial.

## 1. Interface e experiência do usuário

Responsabilidades:

* garantir fluxos de navegação corretos;
* validar acessibilidade, usabilidade e compatibilidade;
* proteger jornadas críticas contra regressão visual e funcional;
* validar estados de erro, carregamento, permissão e sessão.

Metodologias e estratégias:

* teste E2E;
* teste de interface;
* teste exploratório;
* BDD;
* teste de aceitação;
* Shift Left para validar protótipos, critérios e acessibilidade cedo.

Ferramentas:

* Playwright;
* Cypress;
* Selenium;
* axe;
* Lighthouse;
* Storybook;
* ferramentas de captura de evidências.

Modelos de gestão:

* critérios de aceite;
* Definition of Done;
* matriz de jornadas críticas;
* dashboard de regressão;
* homologação com Product Owner e stakeholders.

Literatura relacionada:

* [Testes funcionais](../categorias/01_testes_funcionais.md)
* [Testes não funcionais](../categorias/02_testes_nao_funcionais.md)
* [Estratégias e pirâmide de testes](../categorias/10_estratégias.md)

## 2. Aplicação, API e regras de negócio

Responsabilidades:

* validar regras de domínio;
* garantir contratos entre frontend, backend e consumidores externos;
* proteger fluxos críticos de negócio;
* manter testes rápidos e confiáveis para mudanças frequentes.

Metodologias e estratégias:

* testes unitários;
* testes de integração;
* testes de API;
* testes de contrato;
* TDD;
* BDD;
* ATDD;
* Risk-Based Testing.

Ferramentas:

* Jest;
* Vitest;
* PyTest;
* PHPUnit;
* xUnit;
* Postman;
* Pact;
* OpenAPI validators.

Modelos de gestão:

* pirâmide de testes;
* matriz requisito -> código -> teste;
* quality gates por cobertura;
* rastreabilidade de requisitos;
* revisão técnica por domínio.

Literatura relacionada:

* [Testes funcionais](../categorias/01_testes_funcionais.md)
* [Testes estruturais](../categorias/03_testes_estruturais.md)
* [Estratégias e pirâmide de testes](../categorias/10_estratégias.md)

## 3. Código, componentes e arquitetura interna

Responsabilidades:

* manter baixo acoplamento e alta coesão;
* impedir violação de camadas;
* controlar complexidade, duplicação e dívida técnica;
* proteger padrões arquiteturais como Clean Architecture, DDD e SOLID.

Metodologias e estratégias:

* testes estruturais;
* testes arquiteturais;
* static analysis;
* mutation testing;
* revisão de código;
* quality gates técnicos.

Ferramentas:

* SonarQube;
* ESLint;
* PHPStan;
* TypeScript;
* MyPy;
* ArchUnit;
* dependency-cruiser;
* Nx;
* JaCoCo;
* Istanbul;
* Coverage.py.

Modelos de gestão:

* quality score;
* technical debt tracking;
* RFCs de arquitetura;
* architecture decision records;
* critérios de merge por cobertura, complexidade e segurança.

Literatura relacionada:

* [Testes estruturais](../categorias/03_testes_estruturais.md)
* [Testes de arquitetura](../categorias/05_testes_arquiteturais.md)
* [Testes de qualidade de código](../categorias/08_teste_qualidade_codigo.md)

## 4. Dados, banco e pipelines de informação

Responsabilidades:

* validar integridade, consistência e qualidade dos dados;
* testar migrações, ETL, replicação e performance SQL;
* garantir privacidade, retenção e rastreabilidade;
* proteger contratos de schema e compatibilidade de dados.

Metodologias e estratégias:

* testes de banco de dados;
* testes de migração;
* testes de volume;
* validação de dataset;
* teste de contrato de schema;
* Risk-Based Testing para dados críticos.

Ferramentas:

* dbt tests;
* Great Expectations;
* SQL unit tests;
* ferramentas nativas do banco;
* scripts de migração;
* observabilidade de dados.

Modelos de gestão:

* data quality gates;
* catálogo de dados;
* lineage;
* política de retenção;
* matriz LGPD;
* auditoria de alterações.

Literatura relacionada:

* [Testes de dados](../categorias/04_testes_de_dados.md)
* [Testes não funcionais](../categorias/02_testes_nao_funcionais.md)
* [Testes organizacionais e processo](../categorias/09_testes_organizacionais.md)

## 5. Infraestrutura, entrega e operação

Responsabilidades:

* garantir CI/CD confiável;
* validar deploy, rollback e health checks;
* testar infraestrutura como código;
* assegurar escalabilidade, resiliência e recuperação;
* manter observabilidade operacional.

Metodologias e estratégias:

* Continuous Testing;
* Shift Left em pipeline;
* Shift Right em produção;
* testes de CI/CD;
* testes de deploy;
* testes de infraestrutura;
* chaos engineering;
* testes de recuperação e failover.

Ferramentas:

* GitHub Actions;
* GitLab CI/CD;
* Jenkins;
* Docker;
* Kubernetes;
* Terraform;
* k6;
* JMeter;
* Prometheus;
* Grafana;
* OpenTelemetry.

Modelos de gestão:

* métricas DORA;
* SLO e SLA;
* error budget;
* change management;
* runbooks;
* postmortems;
* gates de deploy.

Literatura relacionada:

* [Testes DevOps e infraestrutura](../categorias/06_testes_devops_infraestrutura.md)
* [Testes não funcionais](../categorias/02_testes_nao_funcionais.md)
* [Estratégias e pirâmide de testes](../categorias/10_estratégias.md)

## 6. Segurança e conformidade técnica

Responsabilidades:

* identificar vulnerabilidades;
* validar autenticação, autorização e criptografia;
* proteger dependências, segredos e configurações;
* garantir aderência a normas e políticas.

Metodologias e estratégias:

* teste de vulnerabilidade;
* pentest;
* teste OWASP;
* dependency scan;
* security scan;
* threat modeling;
* Shift Left Security.

Ferramentas:

* OWASP ZAP;
* Snyk;
* Dependabot;
* Trivy;
* Semgrep;
* SonarQube;
* scanners de container;
* ferramentas de auditoria.

Modelos de gestão:

* matriz de risco;
* política de exceções;
* compliance ISO 27001, SOC 2, LGPD e GDPR;
* trilha de auditoria;
* segregação de permissões;
* aprovação para riscos aceitos.

Literatura relacionada:

* [Testes não funcionais](../categorias/02_testes_nao_funcionais.md)
* [Testes de qualidade de código](../categorias/08_teste_qualidade_codigo.md)
* [Testes organizacionais e processo](../categorias/09_testes_organizacionais.md)

## 7. Observabilidade e confiabilidade

Responsabilidades:

* validar logs, métricas e traces;
* detectar falhas antes do usuário;
* medir latência, throughput, erros e saturação;
* apoiar diagnóstico, incidentes e auditoria.

Metodologias e estratégias:

* testes de observabilidade;
* testes de monitoramento;
* testes de recuperação;
* Shift Right Testing;
* chaos engineering;
* validação de SLO.

Ferramentas:

* Prometheus;
* Grafana;
* OpenTelemetry;
* Datadog;
* New Relic;
* ELK;
* Loki;
* alert managers.

Modelos de gestão:

* SLO e SLA;
* error budget;
* incident management;
* postmortem;
* runbooks;
* matriz de criticidade de alertas.

Literatura relacionada:

* [Testes não funcionais](../categorias/02_testes_nao_funcionais.md)
* [Testes DevOps e infraestrutura](../categorias/06_testes_devops_infraestrutura.md)

## 8. Inteligência artificial e modelos analíticos

Responsabilidades:

* validar modelo, inferência, drift, viés e robustez;
* garantir qualidade de dataset;
* monitorar degradação em produção;
* documentar limites, métricas e riscos do modelo.

Metodologias e estratégias:

* teste de modelo;
* teste de inferência;
* teste de drift;
* teste de viés;
* teste de dataset;
* teste de robustez;
* explainability;
* validação contínua.

Ferramentas:

* MLflow;
* Evidently AI;
* Great Expectations;
* notebooks de validação;
* pipelines MLOps;
* ferramentas de monitoramento de modelo.

Modelos de gestão:

* model cards;
* data cards;
* aprovação de modelo;
* governança de dataset;
* matriz de risco algorítmico;
* auditoria de inferências.

Literatura relacionada:

* [Testes de inteligência artificial](../categorias/07_teste_inteligencia_artificial.md)
* [Testes de dados](../categorias/04_testes_de_dados.md)
* [Testes organizacionais e processo](../categorias/09_testes_organizacionais.md)
