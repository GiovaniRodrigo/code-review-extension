# Setores Envolvidos

Os setores dividem a responsabilidade organizacional da qualidade. Cada setor participa de uma parte do ciclo, mas a qualidade final depende da integração entre todos.

## Produto e negócio

Responsabilidades:

* definir valor, critérios de aceite e prioridades;
* classificar riscos de negócio;
* validar jornadas críticas;
* aprovar entregas e homologações.

Metodologias e estratégias:

* ATDD;
* BDD;
* teste de aceitação;
* teste UAT;
* Risk-Based Testing;
* validação de requisitos.

Ferramentas:

* Jira;
* Azure DevOps;
* Notion;
* Confluence;
* ferramentas de prototipação;
* matrizes de rastreabilidade.

Modelos de gestão:

* backlog orientado a risco;
* critérios de aceite;
* Definition of Ready;
* Definition of Done;
* matriz de impacto;
* homologação formal.

## Engenharia de software

Responsabilidades:

* implementar código testável;
* manter testes unitários e de integração;
* corrigir débitos técnicos;
* preservar arquitetura, modularidade e padrões.

Metodologias e estratégias:

* TDD;
* testes unitários;
* testes de integração;
* testes estruturais;
* mutation testing;
* revisão de código;
* testes arquiteturais.

Ferramentas:

* frameworks de teste da linguagem;
* SonarQube;
* linters;
* type checkers;
* ArchUnit;
* dependency-cruiser;
* ferramentas de coverage.

Modelos de gestão:

* quality gates;
* revisão por pares;
* RFCs técnicas;
* ADRs;
* gestão de dívida técnica;
* ownership por domínio.

## QA e qualidade

Responsabilidades:

* planejar estratégia de testes;
* desenhar cenários manuais e automatizados;
* gerir evidências, regressão e rastreabilidade;
* apoiar homologação e melhoria contínua.

Metodologias e estratégias:

* pirâmide de testes;
* teste exploratório;
* testes funcionais;
* testes não funcionais;
* regressão;
* smoke;
* sanity;
* Continuous Testing.

Ferramentas:

* TestRail;
* Zephyr;
* Xray;
* Playwright;
* Cypress;
* Postman;
* geradores de relatório;
* repositórios de evidências.

Modelos de gestão:

* plano de testes;
* matriz de cobertura;
* matriz de rastreabilidade;
* relatório de execução;
* dashboard de qualidade;
* classificação de defeitos.

## Arquitetura e liderança técnica

Responsabilidades:

* definir fronteiras, camadas e padrões;
* revisar decisões técnicas relevantes;
* impedir erosão arquitetural;
* alinhar escalabilidade, segurança e manutenibilidade.

Metodologias e estratégias:

* testes de arquitetura;
* testes de dependência;
* testes de modularidade;
* Clean Architecture;
* DDD;
* SOLID;
* análise estática.

Ferramentas:

* dependency-cruiser;
* ArchUnit;
* Nx;
* SonarQube;
* diagramas C4;
* repositório de ADRs.

Modelos de gestão:

* architecture review board;
* RFCs;
* ADRs;
* mapas de contexto;
* quality score arquitetural;
* auditoria técnica periódica.

## DevOps, SRE e infraestrutura

Responsabilidades:

* manter pipelines confiáveis;
* automatizar build, teste, scan e deploy;
* monitorar produção;
* preparar rollback, recuperação e escalabilidade.

Metodologias e estratégias:

* CI/CD;
* Continuous Testing;
* testes de deploy;
* testes de infraestrutura;
* chaos engineering;
* Shift Right Testing;
* validação de observabilidade.

Ferramentas:

* GitHub Actions;
* GitLab CI/CD;
* Jenkins;
* Docker;
* Kubernetes;
* Terraform;
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

## Segurança e compliance

Responsabilidades:

* definir políticas de segurança;
* validar vulnerabilidades, acessos e criptografia;
* garantir conformidade regulatória;
* manter evidências e trilhas de auditoria.

Metodologias e estratégias:

* pentest;
* teste OWASP;
* threat modeling;
* dependency scan;
* security scan;
* auditoria;
* compliance.

Ferramentas:

* OWASP ZAP;
* Snyk;
* Trivy;
* Semgrep;
* Dependabot;
* Vanta;
* OneTrust;
* SIEM.

Modelos de gestão:

* matriz de risco;
* ISO 27001;
* SOC 2;
* LGPD;
* GDPR;
* política de exceção;
* segregação de funções.

## Dados, BI e IA

Responsabilidades:

* validar datasets, pipelines e métricas;
* testar migrações, ETL e qualidade de dados;
* monitorar modelos de IA;
* garantir governança e explicabilidade.

Metodologias e estratégias:

* testes de dados;
* validação de dataset;
* testes de modelo;
* testes de inferência;
* testes de drift;
* testes de viés;
* explainability.

Ferramentas:

* dbt;
* Great Expectations;
* MLflow;
* Evidently AI;
* notebooks;
* observabilidade de dados;
* catálogo de dados.

Modelos de gestão:

* data governance;
* model governance;
* data lineage;
* model cards;
* data cards;
* aprovação de modelo;
* auditoria de inferência.
