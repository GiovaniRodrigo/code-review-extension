# 6. Testes DevOps e Infraestrutura

Os testes DevOps e de infraestrutura validam a confiabilidade operacional do ambiente onde o software executa.

O foco não é apenas:

```text id="u0jlwm"
“o código funciona?”
```

Mas também:

* o pipeline é confiável?
* o deploy é seguro?
* a infraestrutura é reproduzível?
* o ambiente escala?
* o sistema resiste a falhas?
* o monitoramento funciona?

---

# Objetivos Principais

Garantir:

* automação confiável,
* entregas seguras,
* estabilidade operacional,
* escalabilidade,
* resiliência,
* observabilidade,
* recuperação rápida.

---

# 6.1 Teste de CI/CD

Valida pipelines de integração e entrega contínua.

CI/CD:

```text id="pjjlwm"
Continuous Integration / Continuous Delivery
```

---

# Objetivo

Garantir que:

* builds funcionem,
* testes executem corretamente,
* artefatos sejam gerados,
* deploys sejam automatizados,
* pipelines sejam reproduzíveis.

---

# O que validar

| Item      | Exemplo               |
| --------- | --------------------- |
| Build     | compilação            |
| Testes    | execução automática   |
| Artefatos | imagens Docker        |
| Segurança | scans                 |
| Deploy    | publicação automática |

---

# Pipeline típico

```text id="7n2ih9"
Commit
  ↓
Lint
  ↓
Testes
  ↓
Build
  ↓
Security Scan
  ↓
Deploy
```

---

# Problemas comuns

* pipeline quebrado,
* testes inconsistentes,
* dependências instáveis,
* builds não reproduzíveis,
* falhas silenciosas.

---

# Exemplo

Pipeline deve falhar se:

```text id="9jlwmz"
coverage < 80%
```

---

# Ferramentas

* GitHub Actions
* GitLab CI/CD
* Jenkins

---

# 6.2 Teste de Deploy

Valida processo de publicação do sistema.

## Objetivo

Garantir deploy seguro e previsível.

---

# O que validar

* rollback,
* downtime,
* migração,
* health checks,
* integridade pós-deploy.

---

# Estratégias de deploy

| Estratégia     | Objetivo             |
| -------------- | -------------------- |
| Blue-Green     | alternar ambientes   |
| Rolling Update | atualização gradual  |
| Canary         | liberar parcialmente |
| Recreate       | recriar aplicação    |

---

# Exemplo

Deploy:

```text id="jlwm0a"
v2
```

somente para:

```text id="jlwm0b"
10% dos usuários
```

---

# Problemas comuns

* downtime,
* migração quebrada,
* incompatibilidade,
* rollback falho.

---

# Validações importantes

## Pós-deploy

* API responde,
* banco conectou,
* métricas funcionando,
* logs ativos.

---

# 6.3 Teste de Infraestrutura

Valida ambiente operacional.

## Objetivo

Garantir infraestrutura confiável e reproduzível.

---

# O que validar

* servidores,
* rede,
* storage,
* DNS,
* balanceadores,
* firewall.

---

# Infraestrutura como código

Conceito:

```text id="jlwm0c"
Infrastructure as Code (IaC)
```

---

# Exemplos

* provisionamento,
* rede,
* segurança,
* permissões.

---

# Ferramentas

* Terraform
* Ansible
* Pulumi

---

# Problemas comuns

* drift de ambiente,
* configuração manual,
* inconsistência entre ambientes,
* permissões incorretas.

---

# 6.4 Teste Docker/Kubernetes

Valida ambientes containerizados.

---

# Objetivo

Garantir funcionamento correto de containers e orquestração.

---

# Docker

## O que validar

* build da imagem,
* dependências,
* networking,
* volumes,
* health checks.

---

# Exemplo

```dockerfile id="jlwm0d"
FROM node:20
```

Validar:

* imagem sobe,
* aplicação inicia,
* portas expostas.

---

# Kubernetes

## O que validar

* pods,
* services,
* ingress,
* autoscaling,
* probes.

---

# Health checks

## Liveness Probe

Valida:

```text id="jlwm0e"
processo vivo
```

---

## Readiness Probe

Valida:

```text id="jlwm0f"
aplicação pronta
```

---

# Problemas comuns

* crash loop,
* pod unhealthy,
* DNS interno,
* autoscaling incorreto,
* resource starvation.

---

# Ferramentas

* Docker
* Kubernetes
* Helm

---

# 6.5 Teste de Configuração

Valida variáveis e parâmetros do ambiente.

## Objetivo

Garantir consistência de configuração.

---

# O que validar

* env vars,
* secrets,
* feature flags,
* parâmetros,
* endpoints.

---

# Exemplo

```env id="jlwm0g"
DATABASE_URL=
JWT_SECRET=
REDIS_HOST=
```

---

# Problemas comuns

* secrets expostos,
* variáveis ausentes,
* ambiente inconsistente,
* configuração divergente.

---

# Estratégias modernas

## Feature Flags

Permitem:

* ativação gradual,
* rollback rápido,
* testes A/B.

---

# Ferramentas

* Vault
* LaunchDarkly

---

# 6.6 Teste de Observabilidade

Valida capacidade operacional de diagnóstico.

---

# Objetivo

Garantir visibilidade completa do sistema.

---

# Observabilidade moderna

Baseada em:

* logs,
* métricas,
* tracing.

---

# O que validar

| Elemento | Objetivo            |
| -------- | ------------------- |
| Logs     | rastreabilidade     |
| Métricas | comportamento       |
| Tracing  | fluxo distribuído   |
| Alertas  | detecção automática |

---

# Logs

Validar:

* contexto,
* correlação,
* erros,
* auditoria.

---

# Métricas

Exemplos:

* CPU,
* memória,
* latência,
* throughput,
* erros.

---

# Tracing

Fluxo distribuído:

```text id="jlwm0h"
Frontend
 → API Gateway
 → Auth
 → Payment
 → Database
```

---

# Alertas

Exemplo:

```text id="jlwm0i"
CPU > 90%
```

---

# Ferramentas

* Prometheus
* Grafana
* OpenTelemetry
* Jaeger

---

# Problemas comuns

* logs insuficientes,
* ausência de tracing,
* métricas inconsistentes,
* alert fatigue.

---

# 6.7 Chaos Engineering

Uma das áreas mais avançadas de confiabilidade.

---

# Objetivo

Validar resiliência do sistema sob falhas reais.

---

# Conceito

Introduzir falhas controladas intencionalmente.

---

# Exemplo

Desligar:

```text id="jlwm0j"
servidor de banco
```

e observar:

* recuperação,
* tolerância,
* failover,
* degradação.

---

# Falhas simuladas

| Tipo      | Exemplo           |
| --------- | ----------------- |
| Rede      | latência          |
| CPU       | sobrecarga        |
| Banco     | indisponibilidade |
| Container | kill pod          |
| DNS       | resolução falha   |

---

# Objetivo real

Descobrir:

```text id="jlwm0k"
falhas antes da produção
```

---

# Conceitos importantes

## Resiliência

Capacidade de continuar operando.

---

## Degradação Graceful

Sistema reduz funcionalidades:

```text id="jlwm0l"
sem colapsar totalmente
```

---

## Self-Healing

Sistema:

```text id="jlwm0m"
recupera automaticamente
```

---

# Ferramentas

* Chaos Monkey
* LitmusChaos
* Gremlin

---

# Relação Entre os Testes DevOps

| Tipo              | Objetivo              |
| ----------------- | --------------------- |
| CI/CD             | validar pipeline      |
| Deploy            | validar publicação    |
| Infraestrutura    | validar ambiente      |
| Docker/K8s        | validar containers    |
| Configuração      | validar parâmetros    |
| Observabilidade   | validar monitoramento |
| Chaos Engineering | validar resiliência   |

---

# Métricas Operacionais

## DORA Metrics

Métricas modernas DevOps.

---

# Deployment Frequency

Frequência de deploys.

---

# Lead Time

Tempo entre commit e produção.

---

# MTTR

Tempo médio de recuperação.

MTTR = \frac{Tempo\ Total\ de\ Recuperação}{Número\ de\ Incidentes}

---

# Change Failure Rate

Percentual de deploys com falha.

Change\ Failure\ Rate = \frac{Deploys\ com\ Falha}{Deploys\ Totais} \times 100

---

# Pipeline Moderno Recomendado

```text id="jlwm0n"
Commit
  ↓
Static Analysis
  ↓
Testes
  ↓
Security Scan
  ↓
Build
  ↓
Container Scan
  ↓
Deploy Staging
  ↓
Smoke Tests
  ↓
Canary
  ↓
Production
```

---

# Sinais de Infraestrutura Saudável

## Ambiente saudável

* deploy automatizado,
* rollback rápido,
* observabilidade completa,
* autoscaling funcional,
* recovery automático,
* alta disponibilidade.

---

# Sinais de Problemas

## Anti-patterns

* deploy manual,
* ambientes inconsistentes,
* ausência de logs,
* configuração manual,
* snowflake servers,
* sem rollback,
* downtime frequente.

---

# Conceitos Modernos Relacionados

| Conceito                 | Objetivo                     |
| ------------------------ | ---------------------------- |
| GitOps                   | infraestrutura via Git       |
| DevSecOps                | segurança integrada          |
| SRE                      | engenharia de confiabilidade |
| Platform Engineering     | plataformas internas         |
| IaC                      | infraestrutura declarativa   |
| Immutable Infrastructure | ambientes imutáveis          |
