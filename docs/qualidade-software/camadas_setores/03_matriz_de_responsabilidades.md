# Matriz de Responsabilidades

Legenda:

* R: responsável direto;
* A: aprovador;
* C: consultado;
* I: informado.

| Atividade | Produto | Engenharia | QA | Arquitetura | DevOps/SRE | Segurança | Dados/IA |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Critérios de aceite | R | C | C | I | I | C | C |
| Testes unitários | I | R | C | C | I | C | C |
| Testes de integração | I | R | C | C | C | C | C |
| Testes E2E | C | C | R | I | C | I | I |
| Testes de API e contrato | C | R | C | C | I | C | C |
| Testes arquiteturais | I | C | I | R | I | C | I |
| Qualidade de código | I | R | C | A | I | C | I |
| Testes de performance | C | C | R | C | C | I | C |
| Testes de segurança | I | C | C | C | C | R | C |
| Testes de dados | C | C | C | I | C | C | R |
| Testes de IA | C | C | C | C | C | C | R |
| CI/CD | I | C | C | I | R | C | I |
| Deploy e rollback | I | C | I | C | R | C | I |
| Observabilidade | I | C | C | C | R | C | C |
| Homologação | A | C | R | I | I | C | C |
| Auditoria e compliance | C | I | C | C | C | R | C |
| Rastreabilidade | C | C | R | I | I | C | C |
| Quality gates | C | R | R | A | C | C | C |

## Diretrizes de uso

* Produto aprova valor e risco de negócio.
* Engenharia responde pela qualidade interna do código e pelas garantias próximas da implementação.
* QA orquestra estratégia, cobertura, evidências e regressão.
* Arquitetura aprova regras estruturais e fronteiras técnicas.
* DevOps/SRE responde por entrega, operação, observabilidade e confiabilidade.
* Segurança responde por riscos, vulnerabilidades e conformidade.
* Dados/IA responde por qualidade de dados, modelos, inferência, drift e viés.
