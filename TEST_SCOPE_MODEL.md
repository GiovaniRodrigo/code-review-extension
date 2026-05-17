# TEST_SCOPE_MODEL.md

# Modelo de Separação de Escopos de QA e LLM

## Objetivo

Este documento define a separação oficial de escopos do projeto para:

- reduzir custo de testes;
- reduzir acoplamento;
- evitar duplicidade;
- permitir escalabilidade;
- facilitar manutenção;
- isolar testes com LLM;
- permitir CI/CD modular;
- aumentar previsibilidade de deploy.

---

# Princípios

## 1. Cada camada testa apenas sua responsabilidade

Não misturar:

- UI com LLM;
- IDE com domínio;
- RAG com renderização;
- provider com regra de negócio;
- runtime com testes unitários.

---

## 2. LLM é um subsistema separado

LLM NÃO é:

- UI;
- VSCode;
- regra de domínio;
- infraestrutura de IDE.

LLM possui:

- contratos;
- validações;
- custo;
- segurança;
- regressão;
- confiabilidade.

---

## 3. Testes devem possuir menor custo possível

Prioridade:

```txt
Unitário > Integração leve > Contrato > E2E
```

---

## 4. E2E deve ser mínimo

E2E existe apenas para validar:

* fluxo crítico;
* integração real;
* runtime real;
* publicação;
* compatibilidade.

---

---

# Estrutura Oficial

```txt
apps/
packages/
tests/
docs/
```

---

# Escopos Oficiais

# 1. CORE DOMAIN

## Objetivo

Responsável pelas regras centrais do sistema.

---

## Inclui

* entidades;
* value objects;
* domain services;
* regras;
* scoring;
* findings;
* policies;
* severity;
* validation;
* business rules.

---

## NÃO inclui

* VSCode;
* WebView;
* LLM real;
* API externa;
* filesystem real;
* banco real;
* Git real.

---

## Tipos de Teste

### Obrigatórios

* unitários;
* mutation tests;
* regressão de regras.

---

## Estrutura

```txt
packages/core/tests/unit/domain
packages/core/tests/mutation
```

---

## Cobertura mínima

```txt
90%
```

---

# 2. APPLICATION / USE CASES

## Objetivo

Orquestrar fluxos da aplicação.

---

## Inclui

* análise;
* revisão;
* sincronização;
* sessão;
* pipeline;
* orchestration;
* review flow;
* coordination.

---

## Tipos de Teste

### Obrigatórios

* unitários com mocks;
* integração leve.

---

## NÃO deve testar

* renderização;
* IDE;
* provider real;
* UI real.

---

## Estrutura

```txt
packages/core/tests/unit/application
packages/core/tests/integration/application
```

---

# 3. INFRASTRUCTURE

## Objetivo

Adaptar tecnologias externas.

---

## Inclui

* OpenAI;
* Claude;
* Gemini;
* Ollama;
* GitHub;
* GitLab;
* filesystem;
* embeddings;
* vector store;
* AST;
* ts-morph.

---

## Tipos de Teste

### Obrigatórios

* contrato;
* retry;
* timeout;
* parser;
* fallback;
* serialização.

---

## NÃO deve

* testar UI;
* testar VSCode;
* testar regra de negócio.

---

## Estrutura

```txt
packages/infra/tests/unit
packages/infra/tests/contracts
packages/infra/tests/smoke
```

---

# 4. LLM SCOPE

# Objetivo

Isolar completamente testes relacionados a IA.

---

# Inclui

* prompt builder;
* provider registry;
* model selection;
* response normalization;
* schema validation;
* retries;
* timeout;
* hallucination guard;
* safety;
* confidence;
* cost control;
* output parsing.

---

# Estrutura Oficial

```txt
tests/llm/
```

---

# Estrutura Completa

```txt
tests/llm/
  unit/
  contracts/
  regression/
  evaluation/
  safety/
  cost/
  fixtures/
  snapshots/
```

---

# Tipos Oficiais

# 4.1 Unit Tests

## Objetivo

Validar lógica interna.

---

## Exemplos

* parse JSON;
* validar schema;
* validar confidence;
* validar severity.

---

# 4.2 Contract Tests

## Objetivo

Garantir formato da resposta.

---

## Validar

```txt
response.findings[]
severity
message
line
filePath
confidence
```

---

## NÃO validar

* qualidade textual;
* criatividade;
* opinião da IA.

---

# 4.3 Regression Tests

## Objetivo

Garantir que bugs conhecidos não retornem.

---

## Bugs conhecidos

* markdown ao invés de JSON;
* JSON inválido;
* arquivo inexistente;
* linha inexistente;
* confidence inválida;
* severity inválida;
* hallucination;
* findings duplicados.

---

# 4.4 Evaluation Tests

## Objetivo

Validar qualidade funcional.

---

## Critérios

```txt
detectou risco esperado
não inventou arquivos
não vazou segredos
não extrapolou contexto
não retornou lixo
```

---

## NÃO usar snapshots rígidos

Usar:

* score;
* thresholds;
* assertions semânticas.

---

# 4.5 Safety Tests

## Objetivo

Garantir segurança.

---

## Validar

* vazamento de segredo;
* exposição de token;
* prompt injection;
* path traversal;
* shell injection;
* data leak;
* unsafe output.

---

# 4.6 Cost Tests

## Objetivo

Controlar custo operacional.

---

## Validar

* tamanho de prompt;
* chunks enviados;
* limite de tokens;
* retries;
* timeout;
* fallback;
* cache hit.

---

# 5. RAG SCOPE

# Objetivo

Validar recuperação de contexto.

---

# Inclui

* chunking;
* embeddings;
* indexing;
* retrieval;
* semantic search;
* ranking;
* compression;
* freshness.

---

# NÃO inclui

* qualidade da resposta da IA;
* renderização;
* VSCode;
* UI.

---

# Estrutura

```txt
tests/rag/
  unit/
  integration/
  fixtures/
```

---

# Testes Obrigatórios

## Chunking

Validar:

* tamanho;
* overlap;
* splitting;
* encoding.

---

## Indexação

Validar:

* arquivos ignorados;
* performance;
* metadata;
* duplicidade.

---

## Retrieval

Validar:

* ranking;
* relevância;
* contexto correto;
* contexto mínimo.

---

# 6. IDE ADAPTER SCOPE

# Objetivo

Adaptar IDEs diferentes.

---

# IDEs

* VSCode;
* JetBrains;
* Vim;
* Neovim;
* Sublime;
* Eclipse;
* Emacs;
* Fleet;
* Zed.

---

# Estrutura

```txt
apps/vscode/
apps/jetbrains/
apps/vim/
```

---

# Testes

## Devem validar

* commands;
* activation;
* menus;
* API da IDE;
* lifecycle;
* integration.

---

## NÃO devem validar

* LLM;
* regras de negócio;
* RAG;
* providers reais.

---

# 7. VSCODE EXTENSION SCOPE

# Objetivo

Validar extensão VSCode.

---

# Inclui

* activation;
* extension host;
* commands;
* webviews;
* configuration;
* menus;
* status bar;
* events.

---

# Estrutura

```txt
apps/vscode/tests/
  unit/
  integration/
  e2e-mocked/
  e2e-real/
  runtime/
```

---

# Tipos

## Unit

Mocks completos do VSCode.

---

## Integration

Integração parcial com APIs.

---

## E2E Mocked

Fluxo completo sem provider real.

---

## E2E Real

Fluxo real.

Executar apenas:

* nightly;
* release;
* manual.

---

## Runtime

Validar:

* memory leak;
* activation time;
* command latency;
* extension crash.

---

# 8. UI SCOPE

# Objetivo

Validar renderização e interação.

---

# Inclui

* componentes;
* dashboard;
* review panel;
* setup wizard;
* M3;
* shadcn.

---

# NÃO inclui

* IA real;
* VSCode real;
* filesystem real.

---

# Estrutura

```txt
packages/ui/tests/
tests/ui/
```

---

# Testes

## Obrigatórios

* render;
* accessibility;
* interaction;
* state;
* keyboard navigation.

---

# 9. ARCHITECTURE SCOPE

# Objetivo

Garantir arquitetura limpa.

---

# Inclui

* circular dependency;
* layering;
* boundaries;
* clean architecture;
* import rules.

---

# Estrutura

```txt
tests/architecture/
```

---

# Ferramentas

* dependency-cruiser;
* madge;
* eslint boundaries;
* ts-prune.

---

# Testes obrigatórios

## Validar

* domínio sem infra;
* UI sem core direto;
* adapters desacoplados;
* ausência de ciclos.

---

# 10. QUALITY GATE SCOPE

# Objetivo

Executar pipeline oficial de qualidade.

---

# Pipeline Oficial

## quality:fast

```txt
lint
typecheck
unit
```

---

## quality:llm

```txt
llm contracts
llm regression
llm safety
```

---

## quality:rag

```txt
rag unit
rag integration
```

---

## quality:ide

```txt
build vscode
integration vscode
```

---

## quality:release

```txt
todos os testes
```

---

# Scripts Oficiais

```json
{
  "scripts": {
    "test": "vitest",

    "test:unit": "vitest run",

    "test:integration": "vitest run tests/integration",

    "test:llm": "vitest run tests/llm",

    "test:llm:contracts": "vitest run tests/llm/contracts",

    "test:llm:regression": "vitest run tests/llm/regression",

    "test:llm:safety": "vitest run tests/llm/safety",

    "test:llm:evaluation": "vitest run tests/llm/evaluation",

    "test:llm:cost": "vitest run tests/llm/cost",

    "test:rag": "vitest run tests/rag",

    "test:ui": "vitest run tests/ui",

    "test:architecture": "vitest run tests/architecture",

    "test:vscode": "vitest run apps/vscode/tests",

    "quality:fast": "npm run lint && npm run typecheck && npm run test:unit",

    "quality:llm": "npm run test:llm",

    "quality:rag": "npm run test:rag",

    "quality:ide": "npm run test:vscode",

    "quality:release": "npm run quality:fast && npm run quality:llm && npm run quality:rag && npm run quality:ide"
  }
}
```

---

# Regras Oficiais

# 1. Não usar provider real por padrão

Usar:

* mock;
* fake;
* snapshot controlado;
* fixtures.

---

# 2. LLM real apenas em

```txt
tests/llm/evaluation
tests/llm/e2e-real
```

---

# 3. Todo provider deve possuir

* timeout;
* retry;
* schema validation;
* output normalization.

---

# 4. Todo teste de LLM deve validar

* schema;
* segurança;
* estabilidade;
* custo.

---

# 5. Todo fluxo crítico deve possuir

* unit;
* integration;
* regression.

---

# 6. E2E deve ser mínimo

Executar apenas:

* release;
* nightly;
* smoke.

---

# Estrutura Final Recomendada

```txt
apps/
packages/
tests/
  architecture/
  llm/
    unit/
    contracts/
    regression/
    safety/
    evaluation/
    cost/
    fixtures/
  rag/
    unit/
    integration/
  ui/
  smoke/
docs/
```

---

# Resultado Esperado

Após implementar este modelo:

* menor custo de QA;
* menor custo de IA;
* menos flakiness;
* menor tempo de pipeline;
* isolamento de falhas;
* deploy previsível;
* release mais segura;
* arquitetura escalável;
* manutenção simplificada.
