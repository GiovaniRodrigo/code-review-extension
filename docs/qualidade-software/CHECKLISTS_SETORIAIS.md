# Checklists de Qualidade por Setor

Estes checklists traduzem as fases do [Roadmap de Qualidade](./ROADMAP.md) em ações específicas por setor, respeitando as responsabilidades definidas nas [Camadas do Software](./camadas_setores/01_camadas_do_software.md).

---

## 1. Setor: Produto e Negócio
*Responsável por definir valor, critérios de aceite e validar a entrega final.*

### Fase 1: Fundação
- [ ] Definir **Critérios de Aceite** claros para cada história de usuário.
- [ ] Validar se as histórias de usuário possuem **objetivos de negócio** mensuráveis.

### Fase 2: Integridade Estrutural
- [ ] Participar da definição de **Jornadas Críticas** para priorização de testes.
- [ ] Alinhar requisitos funcionais com a **Matriz de Rastreabilidade**.

### Fase 3: Confiabilidade Operacional
- [ ] Definir **SLOs de negócio** (ex: tempo máximo de resposta para checkout).
- [ ] Validar se os fluxos de erro atendem à experiência do usuário esperada.

### Fase 4: Engenharia Avançada
- [ ] Colaborar no **Risk-Based Testing** para priorizar validações em funcionalidades complexas.
- [ ] Definir critérios de sucesso para modelos de **IA** (ex: precisão mínima aceitável).

### Fase 5: Governança e Conformidade
- [ ] Realizar a **Homologação formal** e testes de **UAT**.
- [ ] Validar a conformidade com requisitos de **Privacidade (LGPD/GDPR)**.

---

## 2. Setor: Engenharia de Software
*Responsável pela implementação técnica, testes unitários e qualidade do código.*

### Fase 1: Fundação
- [ ] Configurar **Linters** e ferramentas de **Static Analysis**.
- [ ] Garantir 100% de cobertura de **Testes Unitários** em novas lógicas.

### Fase 2: Integridade Estrutural
- [ ] Implementar **Testes de Integração** e **Testes de API**.
- [ ] Monitorar e reduzir **Dívida Técnica** e **Complexidade Ciclomática**.

### Fase 3: Confiabilidade Operacional
- [ ] Implementar logs estruturados e **Tracing** para observabilidade.
- [ ] Garantir que o código suporte **Rollbacks** seguros e migrações de dados.

### Fase 4: Engenharia Avançada
- [ ] Executar **Mutation Testing** para validar a eficácia da suíte de testes.
- [ ] Implementar **Testes de Contrato** entre serviços e frontend.

### Fase 5: Governança e Conformidade
- [ ] Cumprir os **Quality Gates** definidos para o pipeline de CI/CD.
- [ ] Garantir a geração automática de **evidências técnicas** durante o build.

---

## 3. Setor: QA e Qualidade
*Responsável pela estratégia de testes, automação E2E e orquestração da qualidade.*

### Fase 1: Fundação
- [ ] Executar **Testes Smoke** pós-deploy em ambientes de teste.
- [ ] Validar a estabilidade básica das **rotas principais**.

### Fase 2: Integridade Estrutural
- [ ] Automatizar **Jornadas Críticas** via testes **E2E (Playwright/Cypress)**.
- [ ] Gerir a **Matriz de Rastreabilidade** (Requisito -> Código -> Teste).

### Fase 3: Confiabilidade Operacional
- [ ] Coordenar **Testes de Performance** (Carga/Stress) junto com SRE.
- [ ] Validar a **Observabilidade** (dashboards e alertas) durante as execuções.

### Fase 4: Engenharia Avançada
- [ ] Aplicar estratégias de **Shift Left** para testar protótipos e requisitos cedo.
- [ ] Realizar **Testes Exploratórios** em busca de edge cases e bugs complexos.

### Fase 5: Governança e Conformidade
- [ ] Gerar **Relatórios de Qualidade** consolidados para stakeholders.
- [ ] Validar a **Acessibilidade (WCAG)** e usabilidade geral.

---

## 4. Setor: Arquitetura e Liderança Técnica
*Responsável por padrões, fronteiras e integridade estrutural a longo prazo.*

### Fase 1: Fundação
- [ ] Definir padrões de **nomenclatura e estrutura** de pastas.
- [ ] Validar o uso de **Static Analysis** e tipagem forte.

### Fase 2: Integridade Estrutural
- [ ] Implementar e validar **Testes Arquiteturais** (Clean Architecture/DDD).
- [ ] Impedir **Dependências Circulares** e violações de camadas.

### Fase 3: Confiabilidade Operacional
- [ ] Revisar estratégias de **Escalabilidade** e redundância.
- [ ] Definir padrões de **comunicação entre serviços** (Sync/Async).

### Fase 4: Engenharia Avançada
- [ ] Avaliar a arquitetura para suportar **Chaos Engineering**.
- [ ] Definir padrões de **Versionamento de API** e contratos.

### Fase 5: Governança e Conformidade
- [ ] Manter e revisar os **Architecture Decision Records (ADRs)**.
- [ ] Realizar **Auditorias Técnicas** periódicas na estrutura do sistema.

---

## 5. Setor: DevOps, SRE e Infraestrutura
*Responsável pela entrega, operação, resiliência e monitoramento.*

### Fase 1: Fundação
- [ ] Configurar pipelines de **CI/CD** estáveis com build automático.
- [ ] Automatizar a execução de **Unit Tests e Lint** no pipeline.

### Fase 2: Integridade Estrutural
- [ ] Implementar **Gates de Cobertura** no pipeline.
- [ ] Configurar ambientes de **Staging** espelhados à produção.

### Fase 3: Confiabilidade Operacional
- [ ] Automatizar **Testes de Infraestrutura (IaC)** e validação de **Containers**.
- [ ] Configurar **Auto-scaling** e monitoramento de **SLIs/SLOs**.

### Fase 4: Engenharia Avançada
- [ ] Implementar experimentos de **Chaos Engineering**.
- [ ] Configurar estratégias de **Canary Release** e **Blue-Green Deploy**.

### Fase 5: Governança e Conformidade
- [ ] Garantir **Trilha de Auditoria** imutável para todos os deploys.
- [ ] Validar processos de **Backup e Disaster Recovery**.

---

## 6. Setor: Segurança e Compliance
*Responsável por vulnerabilidades, proteção de dados e normas legais.*

### Fase 1: Fundação
- [ ] Implementar **Dependency Scan** (Snyk/Dependabot).
- [ ] Validar configurações básicas de segurança (HTTPS, CORS).

### Fase 2: Integridade Estrutural
- [ ] Executar **Static Application Security Testing (SAST)**.
- [ ] Validar mecanismos de **Autenticação e Autorização**.

### Fase 3: Confiabilidade Operacional
- [ ] Realizar **Dynamic Application Security Testing (DAST)** e **Pentests**.
- [ ] Validar **Criptografia** de dados em repouso e em trânsito.

### Fase 4: Engenharia Avançada
- [ ] Realizar **Threat Modeling** em novas funcionalidades críticas.
- [ ] Validar segurança em **APIs e Microserviços** (OAuth/JWT).

### Fase 5: Governança e Conformidade
- [ ] Garantir conformidade com **LGPD/GDPR**.
- [ ] Manter evidências prontas para **Auditorias de Segurança**.

---

## 7. Setor: Dados, BI e IA
*Responsável por integridade de dados, pipelines e modelos analíticos.*

### Fase 1: Fundação
- [ ] Validar **Schemas de Banco de Dados** e tipos de dados.
- [ ] Implementar validações básicas de **Integridade Referencial**.

### Fase 2: Integridade Estrutural
- [ ] Testar **Scripts de Migração** de dados exaustivamente.
- [ ] Validar **Integridade de Dados** em pipelines ETL.

### Fase 3: Confiabilidade Operacional
- [ ] Realizar **Testes de Volume** e performance SQL.
- [ ] Validar processos de **Replicação e Sincronismo** de bancos.

### Fase 4: Engenharia Avançada
- [ ] Implementar monitoramento de **Data Drift** e **Model Drift**.
- [ ] Validar **Viés (Bias)** e **Explicabilidade (Explainability)** de modelos de IA.

### Fase 5: Governança e Conformidade
- [ ] Garantir **Linhagem de Dados** e Catálogo de Dados.
- [ ] Validar políticas de **Retenção e Exclusão** de dados sensíveis.
