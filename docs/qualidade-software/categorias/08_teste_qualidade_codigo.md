# 8. Testes de Qualidade de Código

Os testes de qualidade de código validam a saúde técnica do software.

O objetivo não é apenas:

```text id="jlwm24"
“o sistema funciona?”
```

Mas também:

* o código é sustentável?
* fácil de manter?
* seguro?
* legível?
* escalável?
* confiável para evolução futura?

---

# Objetivos Principais

Garantir:

* manutenibilidade,
* legibilidade,
* padronização,
* segurança,
* baixa dívida técnica,
* redução de bugs,
* evolução sustentável.

---

# Problema que esses testes resolvem

Sem qualidade técnica:

* manutenção fica cara,
* bugs aumentam,
* refatorações tornam-se perigosas,
* onboarding fica lento,
* produtividade cai.

---

# 8.1 Lint

Valida padrões sintáticos e estilísticos do código.

## Objetivo

Garantir consistência e prevenir erros simples.

---

# O que valida

* formatação,
* nomenclatura,
* imports,
* variáveis não usadas,
* estilo,
* padrões.

---

# Exemplo

Código ruim:

```ts id="jlwm25"
var x=1
```

Código correto:

```ts id="jlwm26"
const x = 1;
```

---

# Problemas detectados

* variável não usada,
* import desnecessário,
* código inconsistente,
* sintaxe suspeita.

---

# Benefícios

* padronização,
* leitura mais fácil,
* menos bugs triviais,
* revisão mais rápida.

---

# Ferramentas

* ESLint
* Pylint
* PHP_CodeSniffer

---

# Exemplo ESLint

```json id="jlwm27"
{
  "semi": ["error", "always"]
}
```

---

# 8.2 Static Analysis

Analisa código sem executá-lo.

## Objetivo

Detectar problemas estruturais antecipadamente.

---

# O que valida

* tipos,
* nullability,
* fluxo,
* segurança,
* arquitetura,
* performance.

---

# Exemplo

```ts id="jlwm28"
const user = null;

console.log(user.name);
```

Static analysis detecta:

```text id="jlwm29"
possible null reference
```

---

# Diferença importante

| Técnica         | Executa código? |
| --------------- | --------------- |
| Lint            | não             |
| Static Analysis | não             |
| Teste unitário  | sim             |

---

# Problemas detectados

* null pointer,
* unreachable code,
* type mismatch,
* memory misuse,
* dependências inválidas.

---

# Ferramentas

* SonarQube
* PHPStan
* TypeScript
* MyPy

---

# 8.3 Code Smell

Identifica sinais de má qualidade arquitetural.

---

# Conceito

“Smell”:

```text id="jlwm2a"
indício de problema
```

Não necessariamente bug.

---

# Objetivo

Detectar código difícil de manter.

---

# Principais Code Smells

| Smell           | Problema                    |
| --------------- | --------------------------- |
| God Class       | classe gigante              |
| Long Method     | método enorme               |
| Duplicate Code  | repetição                   |
| Shotgun Surgery | alteração espalhada         |
| Feature Envy    | invasão de responsabilidade |
| Spaghetti Code  | fluxo caótico               |

---

# Exemplo

```ts id="jlwm2b"
class UserService {
  save() {}
  delete() {}
  sendEmail() {}
  generatePDF() {}
  exportExcel() {}
  createReport() {}
}
```

Problema:

```text id="jlwm2c"
múltiplas responsabilidades
```

---

# Objetivo real

Prevenir:

* degradação arquitetural,
* dívida técnica,
* acoplamento.

---

# Ferramentas

* SonarQube
* Code Climate

---

# 8.4 Complexidade Ciclomática

Mede complexidade lógica do código.

Baseada em:
Thomas J. McCabe.

---

# Objetivo

Determinar dificuldade de:

* testar,
* manter,
* entender.

---

# Conceito

Cada desvio aumenta complexidade:

* if,
* else,
* switch,
* loops,
* try/catch.

---

# Fórmula

M = E - N + 2P

Onde:

* E = edges,
* N = nodes,
* P = componentes conectados.

---

# Interpretação

| Complexidade | Situação |
| ------------ | -------- |
| 1–10         | saudável |
| 11–20        | moderada |
| 21–50        | alta     |
| > 50         | crítica  |

---

# Exemplo

```ts id="jlwm2d"
if (a) {
  if (b) {
    if (c) {
      ...
    }
  }
}
```

Complexidade cresce rapidamente.

---

# Problemas causados

* difícil testar,
* muitos caminhos,
* bugs escondidos,
* baixa previsibilidade.

---

# Estratégias de redução

* extração de métodos,
* polimorfismo,
* strategy pattern,
* simplificação lógica.

---

# 8.5 Duplicação

Detecta repetição de código.

## Objetivo

Garantir reutilização adequada.

---

# Problema clássico

Mesmo código:

```text id="jlwm2e"
copiado em vários lugares
```

---

# Consequências

* manutenção cara,
* bugs replicados,
* inconsistência,
* refatoração difícil.

---

# Exemplo ruim

```ts id="jlwm2f"
if (status === 'ACTIVE') {
  ...
}
```

repetido:

```text id="jlwm2g"
12 vezes
```

---

# Estratégias

* abstração,
* shared services,
* utilitários,
* composição.

---

# Métrica comum

## Duplication Rate

Duplication\ Rate = \frac{Linhas\ Duplicadas}{Linhas\ Totais} \times 100

---

# Ferramentas

* PMD
* SonarQube

---

# 8.6 Debt Analysis

Avalia dívida técnica do sistema.

---

# Conceito

Dívida técnica:

```text id="jlwm2h"
atalhos técnicos acumulados
```

---

# Objetivo

Medir impacto futuro de más decisões.

---

# Exemplos

* TODOs permanentes,
* hacks,
* código legado,
* ausência de testes,
* duplicação,
* acoplamento.

---

# Tipos de dívida

| Tipo           | Exemplo         |
| -------------- | --------------- |
| Código         | duplicação      |
| Arquitetura    | acoplamento     |
| Testes         | baixa cobertura |
| Infraestrutura | deploy manual   |

---

# Métrica comum

## Technical Debt Ratio

Debt\ Ratio = \frac{Tempo\ de\ Correção}{Tempo\ de\ Desenvolvimento}

---

# Classificação

| Nível   | Situação            |
| ------- | ------------------- |
| Baixa   | saudável            |
| Média   | atenção             |
| Alta    | risco               |
| Crítica | refatoração urgente |

---

# Ferramentas

* SonarQube
* CodeScene

---

# 8.7 Security Scan

Analisa vulnerabilidades no código.

## Objetivo

Detectar riscos de segurança automaticamente.

---

# O que valida

* SQL Injection,
* XSS,
* secrets expostos,
* insecure patterns,
* autenticação fraca.

---

# Exemplo

```ts id="jlwm2i"
const query = "SELECT * FROM users WHERE id = " + id;
```

Problema:

```text id="jlwm2j"
SQL Injection
```

---

# Tipos

| Tipo | Objetivo         |
| ---- | ---------------- |
| SAST | análise estática |
| DAST | análise dinâmica |
| IAST | híbrido          |

---

# Ferramentas

* Semgrep
* CodeQL
* Bandit

---

# 8.8 Dependency Scan

Analisa vulnerabilidades em dependências.

## Objetivo

Detectar bibliotecas inseguras.

---

# Problema moderno

Grande parte do software depende de:

```text id="jlwm2k"
pacotes externos
```

---

# Riscos

* CVEs,
* supply chain attacks,
* bibliotecas abandonadas,
* malware.

---

# Exemplo

```json id="jlwm2l"
"lodash": "4.17.11"
```

Pode conter:

```text id="jlwm2m"
vulnerabilidade conhecida
```

---

# O que validar

* versões vulneráveis,
* licenças,
* dependências transitivas,
* reputação.

---

# Ferramentas

* Dependabot
* Snyk
* OWASP Dependency-Check

---

# Relação Entre os Testes de Qualidade

| Tipo            | Objetivo                  |
| --------------- | ------------------------- |
| Lint            | padronização              |
| Static Analysis | detectar problemas        |
| Code Smell      | detectar degradação       |
| Complexidade    | medir dificuldade         |
| Duplicação      | reduzir repetição         |
| Debt Analysis   | medir dívida              |
| Security Scan   | detectar vulnerabilidades |
| Dependency Scan | validar bibliotecas       |

---

# Pipeline Moderno de Qualidade

```text id="jlwm2n"
Lint
  ↓
Formatting
  ↓
Static Analysis
  ↓
Architecture Tests
  ↓
Security Scan
  ↓
Dependency Scan
  ↓
Unit Tests
  ↓
Mutation Testing
```

---

# Quality Gates

Regras automáticas para bloquear código ruim.

---

# Exemplos

## Cobertura mínima

```text id="jlwm2o"
coverage >= 80%
```

---

## Complexidade máxima

```text id="jlwm2p"
complexidade < 15
```

---

## Debt Ratio

```text id="jlwm2q"
debt ratio < 5%
```

---

# Métricas Importantes

| Métrica               | Objetivo     |
| --------------------- | ------------ |
| Coverage              | cobertura    |
| Complexity            | complexidade |
| Duplication           | repetição    |
| Debt Ratio            | dívida       |
| Maintainability Index | manutenção   |
| Vulnerabilities       | segurança    |

---

# Conceitos Modernos Relacionados

| Conceito              | Objetivo                 |
| --------------------- | ------------------------ |
| Clean Code            | legibilidade             |
| Secure Coding         | segurança                |
| Shift Left Quality    | qualidade antecipada     |
| DevSecOps             | segurança integrada      |
| Architecture as Code  | arquitetura automatizada |
| Continuous Inspection | inspeção contínua        |

---

# Sinais de Código Saudável

## Sistema saudável

* baixo acoplamento,
* baixa complexidade,
* alta cobertura,
* baixa duplicação,
* poucos smells,
* dependências seguras.

---

# Sinais de Problema

## Anti-patterns

* God Object,
* callback hell,
* spaghetti code,
* shotgun surgery,
* cyclic dependency,
* copy-paste programming.
