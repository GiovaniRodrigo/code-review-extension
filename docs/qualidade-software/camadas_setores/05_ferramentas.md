# Ferramentas por Camada e Setor

As ferramentas abaixo são exemplos práticos. A escolha final depende da linguagem, arquitetura, orçamento, maturidade da equipe e exigências regulatórias.

## Por camada

| Camada | Ferramentas | Uso principal |
| --- | --- | --- |
| Interface e UX | Playwright, Cypress, Selenium, axe, Lighthouse, Storybook | E2E, acessibilidade, compatibilidade e regressão visual |
| Aplicação e API | Jest, Vitest, PyTest, PHPUnit, xUnit, Postman, Pact, OpenAPI validators | Unitários, integração, API e contrato |
| Código e arquitetura | SonarQube, ESLint, PHPStan, TypeScript, MyPy, ArchUnit, dependency-cruiser, Nx | Qualidade de código, análise estática e regras arquiteturais |
| Dados | dbt, Great Expectations, SQL tests, ferramentas nativas do banco | Integridade, migração, ETL, schema e qualidade de dados |
| Infraestrutura | GitHub Actions, GitLab CI/CD, Jenkins, Docker, Kubernetes, Terraform | CI/CD, deploy, IaC e ambientes |
| Segurança | OWASP ZAP, Snyk, Dependabot, Trivy, Semgrep, SIEM | Vulnerabilidades, dependências, containers e auditoria |
| Observabilidade | Prometheus, Grafana, OpenTelemetry, Datadog, New Relic, ELK, Loki | Logs, métricas, traces, alertas e SLO |
| IA | MLflow, Evidently AI, Great Expectations, pipelines MLOps | Modelo, inferência, drift, viés, dataset e governança |

## Por setor

| Setor | Ferramentas | Uso principal |
| --- | --- | --- |
| Produto | Jira, Azure DevOps, Notion, Confluence | Backlog, critérios, priorização e homologação |
| Engenharia | Frameworks de teste, linters, type checkers, coverage tools | Implementação confiável e qualidade técnica |
| QA | TestRail, Zephyr, Xray, Playwright, Cypress, Postman | Plano, execução, evidências, regressão e rastreabilidade |
| Arquitetura | ArchUnit, dependency-cruiser, Nx, SonarQube, C4, ADRs | Regras de dependência, modularidade e decisões técnicas |
| DevOps/SRE | GitHub Actions, Kubernetes, Terraform, Prometheus, Grafana | Pipeline, operação, deploy, monitoramento e incidentes |
| Segurança | OWASP ZAP, Snyk, Trivy, Semgrep, Vanta, OneTrust | Segurança técnica, compliance e auditoria |
| Dados/IA | dbt, Great Expectations, MLflow, Evidently AI | Qualidade de dados, modelos, métricas e drift |

## Critérios de seleção

* A ferramenta deve integrar com o pipeline.
* O resultado deve ser rastreável e auditável.
* A saída deve gerar ação clara: falhar build, abrir alerta, bloquear merge ou gerar evidência.
* O custo de manutenção deve ser menor que o risco que ela reduz.
* Ferramentas críticas devem ter ownership definido.
