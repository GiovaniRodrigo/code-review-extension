# Modelos de Gestão

Os modelos de gestão conectam execução técnica com governança. Eles ajudam a transformar testes, métricas e evidências em decisão.

## Quality gates

Objetivo:

* bloquear mudanças que não atendem critérios mínimos de qualidade.

Critérios comuns:

* testes unitários passando;
* cobertura mínima;
* lint e análise estática sem erros críticos;
* security scan sem vulnerabilidades bloqueantes;
* build reproduzível;
* testes de contrato e integração em fluxos críticos.

Setores envolvidos:

* Engenharia;
* QA;
* Arquitetura;
* Segurança;
* DevOps/SRE.

## Matriz de risco

Objetivo:

* priorizar teste e revisão com base em impacto e probabilidade.

Dimensões comuns:

* risco financeiro;
* risco operacional;
* risco legal;
* risco de segurança;
* risco reputacional;
* risco técnico.

Setores envolvidos:

* Produto;
* QA;
* Segurança;
* Engenharia;
* Dados/IA.

## Rastreabilidade

Objetivo:

* conectar requisito, código, teste, deploy e evidência.

Cadeia recomendada:

```text
requisito -> historia -> codigo -> teste -> pipeline -> deploy -> evidencia
```

Setores envolvidos:

* Produto;
* QA;
* Engenharia;
* DevOps/SRE;
* Compliance.

## Dashboard de qualidade

Objetivo:

* dar visibilidade contínua sobre saúde do produto.

Métricas possíveis:

* cobertura;
* testes passando;
* falhas por camada;
* tempo de pipeline;
* defeitos por severidade;
* dívida técnica;
* vulnerabilidades;
* disponibilidade;
* SLO;
* DORA;
* mutation score.

Setores envolvidos:

* QA;
* Engenharia;
* Produto;
* DevOps/SRE;
* Segurança.

## Métricas DORA

Objetivo:

* medir desempenho de entrega de software.

Métricas:

* deployment frequency;
* lead time for changes;
* change failure rate;
* mean time to restore.

Setores envolvidos:

* DevOps/SRE;
* Engenharia;
* Produto;
* QA.

## SLO, SLA e error budget

Objetivo:

* governar confiabilidade em produção.

Uso:

* definir metas mensuráveis;
* acompanhar violações;
* limitar mudanças quando o error budget é consumido;
* direcionar investimento em estabilidade.

Setores envolvidos:

* DevOps/SRE;
* Engenharia;
* Produto;
* QA.

## Gestão de dívida técnica

Objetivo:

* controlar problemas que reduzem velocidade, segurança e manutenção.

Fontes:

* code smells;
* duplicação;
* complexidade alta;
* baixa cobertura;
* dependências vulneráveis;
* violações arquiteturais.

Setores envolvidos:

* Engenharia;
* Arquitetura;
* QA;
* Produto.

## Governança de segurança e compliance

Objetivo:

* garantir aderência a políticas, normas e leis.

Práticas:

* auditoria;
* trilhas imutáveis;
* segregação de permissões;
* aprovação de exceções;
* retenção de evidências;
* controles de acesso;
* LGPD, GDPR, ISO 27001, SOC 2.

Setores envolvidos:

* Segurança;
* Compliance;
* Produto;
* Engenharia;
* DevOps/SRE;
* Dados/IA.

## Governança de IA

Objetivo:

* controlar riscos de modelos, datasets e inferências.

Práticas:

* model cards;
* data cards;
* validação de drift;
* validação de viés;
* monitoramento de performance;
* aprovação de modelo;
* rastreabilidade de dataset e versão.

Setores envolvidos:

* Dados/IA;
* Produto;
* Segurança;
* Compliance;
* Engenharia;
* QA.
