# Documento de Requisitos Funcionais (FRD) - Padrões de Qualidade

Este documento especifica os requisitos técnicos de qualidade obrigatórios para projetos, servindo como base para o *Definition of Ready (DoR)* e *Definition of Done (DoD)*.

## 1. Requisitos Funcionais e de Interface

### RF-01: Automação de Testes de Unidade e Integração
- **Critério**: Todas as novas funções, services e helpers devem possuir testes unitários isolados.
- **Validação**: Verificação via `npm test` (ou equivalente) no pipeline de CI.
- **Referência**: [1.1 Teste Unitário](./categorias/01_testes_funcionais.md#11-teste-unitário) e [1.2 Teste de Integração](./categorias/01_testes_funcionais.md#12-teste-de-integração).

### RF-02: Testes End-to-End (E2E) para Jornadas Críticas
- **Critério**: Fluxos de login, checkout e processos principais devem ser cobertos por testes E2E.
- **Ferramentas**: Playwright, Cypress.
- **Referência**: [1.4 Teste E2E](./categorias/01_testes_funcionais.md#14-teste-end-to-end-e2e).

### RF-03: Validação de API e Contratos
- **Critério**: Endpoints REST/GraphQL devem validar status codes, payloads e contratos.
- **Métrica**: 100% de cobertura de endpoints públicos.
- **Referência**: [1.9 Teste de API](./categorias/01_testes_funcionais.md#19-teste-de-api).

---

## 2. Requisitos de Estrutura e Arquitetura

### RE-01: Controle de Complexidade e Qualidade de Código
- **Critério**: A complexidade ciclomática média por método deve ser < 10.
- **Métrica**: Technical Debt Ratio < 5%.
- **Ferramenta**: SonarQube, ESLint.
- **Referência**: [8. Testes de Qualidade de Código](./categorias/08_teste_qualidade_codigo.md).

### RE-02: Cobertura de Código e Mutação
- **Critério**: Cobertura de branch mínima de 80%.
- **Métrica**: Mutation Score >= 70%.
- **Referência**: [3. Testes Estruturais](./categorias/03_testes_estruturais.md).

### RE-03: Conformidade Arquitetural
- **Critério**: O código deve respeitar a separação de camadas (Clean Architecture/DDD).
- **Validação**: Testes automatizados de dependência (ex: ArchUnit, dependency-cruiser).
- **Referência**: [5. Testes de Arquitetura](./categorias/05_testes_arquiteturais.md).

---

## 3. Requisitos Não Funcionais

### RNF-01: Desempenho e Escalabilidade
- **Critério**: O sistema deve suportar carga esperada com Latência P95 < 500ms.
- **Testes**: Carga, Stress e Spike.
- **Referência**: [2.1 Performance](./categorias/02_testes_nao_funcionais.md#21-performance).

### RNF-02: Segurança Cibernética
- **Critério**: Nenhuma vulnerabilidade de nível "Crítico" ou "Alto" permitida em produção.
- **Testes**: SAST, DAST, Dependency Scan e validação OWASP Top 10.
- **Referência**: [2.2 Segurança](./categorias/02_testes_nao_funcionais.md#22-segurança).

### RNF-03: Observabilidade Operacional
- **Critério**: Todo erro 5xx deve gerar log estruturado com context ID e rastreabilidade (Tracing).
- **Referência**: [2.6 Observabilidade](./categorias/02_testes_nao_funcionais.md#26-observabilidade).

---

## 4. Requisitos de Dados e Inteligência Artificial

### RD-01: Integridade e Migração de Dados
- **Critério**: Scripts de migração (Migrations) devem ser testados em ambiente de staging antes da produção.
- **Referência**: [4. Testes de Banco de Dados](./categorias/04_testes_de_dados.md).

### RD-02: Qualidade e Monitoramento de Modelos de IA
- **Critério**: Modelos devem ser validados contra Drift, Viés (Bias) e possuir métricas de precisão (IoU, Recall, F1) documentadas.
- **Referência**: [7. Testes de IA](./categorias/07_teste_inteligencia_artificial.md).

---

## 5. Requisitos de Governança e Processo

### RG-01: Rastreabilidade de Requisitos
- **Critério**: Cada commit deve estar vinculado a uma tarefa/requisito (Issue/Jira).
- **Referência**: [9.3 Rastreabilidade](./categorias/09_testes_organizacionais.md#93-rastreabilidade).

### RG-02: Quality Gates Automáticos
- **Critério**: O pipeline de CI deve bloquear o merge se os critérios de cobertura, lint e segurança não forem atendidos.
- **Referência**: [9.7 Quality Gates](./categorias/09_testes_organizacionais.md#97-quality-gates).

### RG-03: Auditoria e Evidências
- **Critério**: Deploys em produção exigem logs de auditoria imutáveis (quem, quando, o quê).
- **Referência**: [9.1 Auditoria](./categorias/09_testes_organizacionais.md#91-auditoria).
