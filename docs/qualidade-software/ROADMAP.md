# Roadmap de Qualidade de Software

Este roadmap define a evolução da maturidade de qualidade para projetos, organizando as categorias de testes e padrões técnicos em fases incrementais.

## Fase 1: Fundação (Essential Quality)
*Foco: Automatização básica, padronização de código e detecção precoce de erros.*

- **[8.1 Lint](./categorias/08_teste_qualidade_codigo.md#81-lint)**: Padronização sintática e estilística.
- **[8.2 Static Analysis](./categorias/08_teste_qualidade_codigo.md#82-static-analysis)**: Detecção de erros sem execução (tipagem, null safety).
- **[1.1 Teste Unitário](./categorias/01_testes_funcionais.md#11-teste-unitário)**: Validação de lógica isolada.
- **[6.1 Teste de CI/CD](./categorias/06_testes_devops_infraestrutura.md#61-teste-de-cicd)**: Automação básica de build e testes.
- **[1.7 Teste Smoke](./categorias/01_testes_funcionais.md#17-teste-smoke)**: Validação rápida de estabilidade pós-deploy.

---

## Fase 2: Integridade Estrutural (Technical Health)
*Foco: Comunicação entre módulos, saúde arquitetural e cobertura de caminhos.*

- **[1.2 Teste de Integração](./categorias/01_testes_funcionais.md#12-teste-de-integração)**: Validação da comunicação entre componentes/serviços.
- **[1.9 Teste de API](./categorias/01_testes_funcionais.md#19-teste-de-api)**: Garantia de contratos e endpoints.
- **[5. Testes de Arquitetura](./categorias/05_testes_arquiteturais.md)**: Validação de Clean Architecture, SOLID, DDD e dependências.
- **[3. Testes Estruturais](./categorias/03_testes_estruturais.md)**: Cobertura de Branch, Condição e Caminho.
- **[8.3 Code Smell & Complexidade](./categorias/08_teste_qualidade_codigo.md#83-code-smell)**: Controle de dívida técnica e complexidade ciclomática.

---

## Fase 3: Confiabilidade Operacional (Resilience & Security)
*Foco: Performance, segurança, infraestrutura e observabilidade.*

- **[2.1 Performance](./categorias/02_testes_nao_funcionais.md#21-performance)**: Testes de Carga, Stress e Spike.
- **[2.2 Segurança](./categorias/02_testes_nao_funcionais.md#22-segurança)**: Vulnerability Scan (SAST/DAST), Autenticação e Autorização.
- **[6.3 Teste de Infraestrutura](./categorias/06_testes_devops_infraestrutura.md#63-teste-de-infraestrutura)**: Validação de IaC (Terraform/Ansible) e Containers (Docker/K8s).
- **[2.6 Observabilidade](./categorias/02_testes_nao_funcionais.md#26-observabilidade)**: Validação de Logs, Métricas e Tracing.
- **[4. Testes de Dados](./categorias/04_testes_de_dados.md)**: Integridade, Migração e Performance SQL.

---

## Fase 4: Engenharia Avançada (Deep Validation)
*Foco: Robustez extrema, validação de IA e estratégias modernas.*

- **[3.6 Mutation Testing](./categorias/03_testes_estruturais.md#36-mutation-testing)**: Validação da qualidade real da suíte de testes.
- **[6.7 Chaos Engineering](./categorias/06_testes_devops_infraestrutura.md#67-chaos-engineering)**: Resiliência sob falhas controladas.
- **[7. Testes de IA](./categorias/07_teste_inteligencia_artificial.md)**: Validação de Drift, Viés, Robustez e Explainability.
- **[1.11 Teste de Contrato](./categorias/01_testes_funcionais.md#111-teste-de-contrato)**: Garantia de compatibilidade entre microserviços.
- **[10. Estratégias Modernas](./categorias/10_estrat%C3%A9gias.md)**: Shift Left, Shift Right e Continuous Testing.

---

## Fase 5: Governança e Conformidade (Compliance & Business)
*Foco: Rastreabilidade, auditoria e aprovação formal de negócio.*

- **[9.1 Auditoria & Compliance](./categorias/09_testes_organizacionais.md#91-auditoria)**: Evidências imutáveis e aderência a normas (LGPD/ISO).
- **[9.3 Rastreabilidade](./categorias/09_testes_organizacionais.md#93-rastreabilidade)**: Conexão Requisito -> Código -> Teste -> Deploy.
- **[9.7 Quality Gates](./categorias/09_testes_organizacionais.md#97-quality-gates)**: Regras automáticas para bloqueio de promoção de ambiente.
- **[9.6 Teste UAT & Homologação](./categorias/09_testes_organizacionais.md#96-teste-uat)**: Aceitação formal pelo usuário e stakeholders.
- **[2.5 Usabilidade & Acessibilidade](./categorias/02_testes_nao_funcionais.md#25-usabilidade)**: Garantia de experiência humana e inclusão digital.

---

## Pirâmide de Testes Alvo
Para cada projeto, a distribuição ideal deve seguir:
1. **Base (Unitários/Static)**: ~70-80%
2. **Meio (Integração/API/Arquitetura)**: ~15-25%
3. **Topo (E2E/UI)**: ~5-10%
