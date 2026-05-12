# 9. Testes Organizacionais / Processo

Os testes organizacionais e de processo validam governança, conformidade e controle de qualidade do ciclo de desenvolvimento.

O foco não é apenas:

```text id="jlwm2r"
“o software funciona?”
```

Mas também:

* o processo foi seguido?
* existem evidências?
* requisitos foram atendidos?
* há rastreabilidade?
* normas estão sendo respeitadas?
* o software pode ser auditado?

---

# Objetivos Principais

Garantir:

* governança,
* conformidade,
* auditoria,
* previsibilidade,
* qualidade organizacional,
* segurança processual,
* rastreabilidade completa.

---

# Muito importante em

* bancos,
* saúde,
* governo,
* aviação,
* indústria,
* IA regulada,
* sistemas críticos.

---

# 9.1 Auditoria

Valida conformidade do sistema e do processo.

## Objetivo

Garantir que:

* políticas,
* normas,
* processos,
* controles

foram corretamente executados.

---

# O que valida

| Item       | Exemplo            |
| ---------- | ------------------ |
| Logs       | auditoria de ações |
| Aprovações | workflow correto   |
| Evidências | documentação       |
| Segurança  | acessos            |
| Processo   | conformidade       |

---

# Tipos de auditoria

| Tipo      | Objetivo                  |
| --------- | ------------------------- |
| Interna   | governança interna        |
| Externa   | órgãos reguladores        |
| Técnica   | qualidade técnica         |
| Segurança | conformidade de segurança |

---

# Exemplos

## Auditoria financeira

Verificar:

```text id="jlwm2s"
quem aprovou pagamentos
```

---

## Auditoria de deploy

Validar:

* quem publicou,
* quando,
* qual versão,
* quais mudanças.

---

# Logs de auditoria

Muito importante:

```text id="jlwm2t"
imutabilidade
```

---

# Problemas comuns

* ausência de histórico,
* logs alteráveis,
* falta de evidências,
* acessos não rastreados.

---

# Normas relacionadas

* ISO 9001
* ISO 27001
* SOC 2
* LGPD
* GDPR

---

# 9.2 Compliance

Valida conformidade legal e regulatória.

## Objetivo

Garantir aderência a:

* leis,
* normas,
* contratos,
* políticas.

---

# Áreas comuns

| Área       | Exemplo   |
| ---------- | --------- |
| Segurança  | ISO 27001 |
| Dados      | LGPD      |
| Financeiro | BACEN     |
| Saúde      | HIPAA     |
| Qualidade  | ISO 9001  |

---

# Exemplos

## LGPD

Validar:

* consentimento,
* anonimização,
* retenção,
* exclusão de dados.

---

# Compliance técnico

* criptografia obrigatória,
* retenção de logs,
* controle de acesso,
* segregação de permissões.

---

# Problemas comuns

* coleta excessiva,
* armazenamento inseguro,
* ausência de consentimento,
* logs sensíveis.

---

# Ferramentas comuns

* OneTrust
* Vanta

---

# 9.3 Rastreabilidade

Permite rastrear mudanças, requisitos e execuções.

## Objetivo

Conectar:

```text id="jlwm2u"
requisito → código → teste → deploy
```

---

# O que rastrear

| Elemento     | Exemplo          |
| ------------ | ---------------- |
| Requisito    | RF-001           |
| Commit       | hash Git         |
| Pull Request | PR               |
| Teste        | execução         |
| Deploy       | versão publicada |

---

# Exemplo completo

```text id="jlwm2v"
RF-023
  ↓
PR #54
  ↓
Commit abc123
  ↓
Teste E2E aprovado
  ↓
Deploy v1.2.0
```

---

# Benefícios

* auditoria,
* debugging,
* governança,
* rollback,
* compliance.

---

# Muito importante em

* CI/CD,
* QA,
* DevOps,
* sistemas regulados.

---

# Ferramentas

* Jira
* Azure DevOps
* GitHub

---

# 9.4 Validação de Requisitos

Valida aderência aos requisitos definidos.

## Objetivo

Garantir que:

```text id="jlwm2w"
o sistema atende ao que foi solicitado
```

---

# Tipos de requisitos

| Tipo          | Exemplo          |
| ------------- | ---------------- |
| Funcional     | login            |
| Não funcional | performance      |
| Negócio       | regra financeira |
| Segurança     | MFA obrigatório  |

---

# Técnicas comuns

* checklist,
* matriz de rastreabilidade,
* BDD,
* revisão funcional.

---

# Exemplo

Requisito:

```text id="jlwm2x"
Usuário deve resetar senha
```

Validação:

* email enviado,
* token válido,
* senha alterada.

---

# Problemas comuns

* requisito ambíguo,
* requisito incompleto,
* implementação divergente.

---

# Matriz de rastreabilidade

| Requisito | Teste | Status |
|---|---|
| RF-001 | login.spec.ts | aprovado |
| RF-002 | payment.spec.ts | falhou |

---

# 9.5 Homologação

Validação formal antes da produção.

## Objetivo

Obter aprovação oficial.

---

# Responsáveis

* cliente,
* PO,
* negócio,
* stakeholders.

---

# Características

* ambiente próximo da produção,
* validação funcional,
* aprovação formal.

---

# Exemplo

Cliente valida:

* fluxo de compra,
* relatórios,
* integrações.

---

# Resultado esperado

```text id="jlwm2y"
aprovado para produção
```

---

# Problemas comuns

* ambiente divergente,
* requisitos mal definidos,
* falta de dados reais.

---

# 9.6 Teste UAT

UAT:

```text id="jlwm2z"
User Acceptance Testing
```

---

# Objetivo

Garantir aceitação pelo usuário final.

---

# Diferença importante

| Tipo | Foco            |
| ---- | --------------- |
| QA   | técnico         |
| UAT  | negócio/usuário |

---

# Características

* usuários reais,
* cenários reais,
* foco operacional.

---

# Exemplos

Usuário executa:

* cadastro,
* aprovação,
* emissão de relatório,
* fluxo financeiro.

---

# O que validar

* usabilidade,
* clareza,
* aderência operacional,
* produtividade.

---

# Problemas encontrados

* UX ruim,
* fluxo complexo,
* nomenclatura confusa,
* processo inviável.

---

# 9.7 Quality Gates

São regras automáticas que bloqueiam avanço de software ruim.

---

# Objetivo

Impedir promoção de builds problemáticos.

---

# Exemplo de fluxo

```text id="jlwm30"
Commit
  ↓
Pipeline
  ↓
Quality Gates
  ↓
Deploy permitido
```

---

# Regras comuns

| Regra            | Exemplo      |
| ---------------- | ------------ |
| Coverage         | > 80%        |
| Vulnerabilidades | 0 críticas   |
| Lint             | sem erros    |
| Build            | obrigatório  |
| Testes           | todos verdes |

---

# Exemplo moderno

## Gate falha se:

```text id="jlwm31"
Mutation Score < 70%
```

---

# Tipos de gates

| Tipo        | Objetivo         |
| ----------- | ---------------- |
| Qualidade   | coverage         |
| Segurança   | vulnerabilidades |
| Arquitetura | dependências     |
| Performance | latência         |
| Compliance  | normas           |

---

# Ferramentas

* SonarQube
* GitHub Actions
* GitLab CI/CD

---

# Pipeline Organizacional Moderno

```text id="jlwm32"
Requisito
   ↓
Planejamento
   ↓
Desenvolvimento
   ↓
Code Review
   ↓
Testes
   ↓
Quality Gates
   ↓
Homologação
   ↓
UAT
   ↓
Deploy
   ↓
Auditoria
```

---

# Governança de Qualidade

## Elementos principais

| Elemento  | Objetivo        |
| --------- | --------------- |
| Evidência | comprovação     |
| Aprovação | controle        |
| Histórico | rastreabilidade |
| Auditoria | conformidade    |
| Métricas  | governança      |

---

# Indicadores Organizacionais

## KPIs comuns

| KPI               | Objetivo          |
| ----------------- | ----------------- |
| Taxa de aprovação | qualidade         |
| Lead Time         | velocidade        |
| MTTR              | recuperação       |
| Failure Rate      | estabilidade      |
| Coverage          | qualidade técnica |

---

# Sinais de Processo Saudável

## Organização madura

* rastreabilidade completa,
* auditoria automatizada,
* quality gates fortes,
* homologação formal,
* compliance integrado.

---

# Sinais de Problema

## Anti-patterns

* deploy sem aprovação,
* ausência de evidências,
* sem rastreabilidade,
* requisitos não documentados,
* homologação informal.

---

# Conceitos Modernos Relacionados

| Conceito              | Objetivo                |
| --------------------- | ----------------------- |
| DevSecOps             | segurança integrada     |
| Continuous Compliance | compliance contínuo     |
| Governance as Code    | governança automatizada |
| Audit Trail           | trilha de auditoria     |
| Shift Left Quality    | qualidade antecipada    |
| Quality Engineering   | engenharia de qualidade |
