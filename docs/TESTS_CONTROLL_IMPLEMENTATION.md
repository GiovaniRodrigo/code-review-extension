# Controle de Implementação — Qualidade, Cobertura e Arquitetura

## Objetivo

Este documento controla o progresso da implementação da infraestrutura de qualidade, testes, arquitetura, governança e estabilização da plataforma multi-IDE.

O foco atual do projeto é:

* estabilização arquitetural;
* redução de dívida técnica;
* consolidação do bootstrap;
* melhoria de cobertura;
* fortalecimento dos testes estruturais;
* padronização multi-IDE;
* desacoplamento entre IDE e Core;
* estabilização dos Quality Gates.

---

# Legenda

| Status     | Significado        |
| ---------- | ------------------ |
| ⚪ TODO     | Não iniciado       |
| 🔵 DEV     | Em desenvolvimento |
| 🟡 HML     | Em homologação     |
| 🟢 DONE    | Implementado       |
| 🔴 BLOCKED | Bloqueado          |
| ⚫ CANCELED | Cancelado          |

---

# Estado Atual Geral

| Área              | Status Atual | Observação                                              |
| ----------------- | ------------ | ------------------------------------------------------- |
| Multi-IDE         | 🟢           | Estrutura consolidada                                   |
| Core              | 🟢           | UseCases, Services e Ports organizados                  |
| Domain            | 🟢           | Entities/VOs/Policies separados                         |
| Infra             | 🟢           | Providers desacoplados                                  |
| Bootstrap VSCode  | 🟢           | Bootstrap centralizado                                  |
| Coverage          | 🔴           | Global falhando por threshold                           |
| Branch Coverage   | 🟡           | Próximo da meta, mas ainda não fechado                  |
| Mutation Testing  | 🟡           | Estrutura pronta, gates pendentes                       |
| E2E               | 🟢           | Fluxo principal estabilizado                            |
| Arquitetura       | 🟢           | Cleanup principal concluído                             |
| Providers IA      | 🟢           | OpenAI/Ollama/Fallback                                  |
| RAG               | 🟡           | Parte movida para core, mas com baixa cobertura         |
| UI/Webviews       | 🟡           | FindingCard coberto, reviewView ainda sem coverage real |
| Dependency Health | 🟢           | Sem ciclos e sem violações anteriores                   |
| Quality Gates     | 🟡           | Testes passam, coverage gate falha                      |

---

# Estado Atual dos Quality Gates

| Gate                      | Resultado Atual                                                  | Status |
| ------------------------- | ---------------------------------------------------------------- | ------ |
| ESLint                    | Sem erro informado no último ciclo                               | 🟢     |
| Unit/Integration/UI Tests | 55 arquivos passando                                             | 🟢     |
| Total de Testes           | 127 passing                                                      | 🟢     |
| Coverage Execution        | Relatório gerado                                                 | 🟢     |
| Coverage Threshold        | Statements/Lines/Functions abaixo da meta                        | 🔴     |
| Branch Coverage           | 76.47%                                                           | 🟡     |
| VSCodeAdapter Coverage    | Melhorou para 79.64% statements / 77.77% branches                | 🟢     |
| FindingCard Coverage      | 100%                                                             | 🟢     |
| reviewView.js Coverage    | 0%                                                               | 🔴     |
| Build Pipeline            | Ainda deve ser validado com `npm run build` / `npm run test:all` | 🟡     |
| Mutation Testing          | Ainda não validado como gate                                     | 🟡     |

---

# Métricas Atuais de Coverage

| Métrica    | Valor Atual |                        Meta | Status |
| ---------- | ----------: | --------------------------: | ------ |
| Statements |      63.71% |                         75% | 🔴     |
| Branches   |      76.47% | Definir/Manter acima de 75% | 🟡     |
| Functions  |      54.01% |                         70% | 🔴     |
| Lines      |      63.71% |                         75% | 🔴     |

---

# Resultado Atual dos Testes

| Tipo                | Resultado                                                | Status |
| ------------------- | -------------------------------------------------------- | ------ |
| Test Files          | 55 passed                                                | 🟢     |
| Tests               | 127 passed                                               | 🟢     |
| UI Tests            | `reviewView.test.js` e `FindingCard.test.tsx` executando | 🟢     |
| Negative Scenarios  | 10 testes passando                                       | 🟢     |
| VSCodeAdapter Tests | 17 testes passando                                       | 🟢     |

---

# Situação Atual de Branch Coverage

## Melhorias já implementadas

| Status | Implementação                        |
| ------ | ------------------------------------ |
| 🟢     | Cenários negativos ampliados         |
| 🟢     | Fallback provider testado            |
| 🟢     | Session restore com erro testado     |
| 🟢     | Bootstrap estabilizado               |
| 🟢     | Dependency validation ativa          |
| 🟢     | Circular dependency validation ativa |
| 🟢     | RAG orchestration iniciada no core   |
| 🟢     | UI/Webview tests iniciados           |
| 🟢     | VSCodeAdapter com cobertura adequada |
| 🟢     | FindingCard com cobertura completa   |

---

## Cenários negativos ainda recomendados

| Status | Cenário                 |
| ------ | ----------------------- |
| 🟡     | Invalid webview payload |
| 🟡     | Missing provider        |
| 🟡     | Invalid token           |
| 🟡     | Empty workspace         |
| 🟡     | Invalid command context |
| 🟡     | Publish review failure  |
| 🟡     | Storage corruption      |
| 🟡     | Invalid UI interaction  |

---

# Arquivos com Coverage Crítica

## Arquivos/configurações indevidamente entrando no coverage

| Arquivo                        | Situação | Ação Recomendada                                     |
| ------------------------------ | -------- | ---------------------------------------------------- |
| `.dependency-cruiser.cjs`      | 0%       | Excluir do coverage                                  |
| `vitest.coverage.config.ts`    | 0%       | Excluir do coverage                                  |
| `vitest.integration.config.ts` | 0%       | Excluir do coverage                                  |
| `vitest.unit.config.ts`        | 0%       | Excluir do coverage                                  |
| `apps/vscode/tests/e2e/**`     | 0%       | Excluir do coverage unit/integration                 |
| `apps/vscode/src/extension.ts` | 0%       | Testar smoke ou excluir se apenas entrada delegadora |

---

## IDEs placeholders reduzindo coverage

| Área              | Situação | Ação Recomendada        |
| ----------------- | -------- | ----------------------- |
| apps/eclipse      | 0%       | Excluir temporariamente |
| apps/emacs        | 0%       | Excluir temporariamente |
| apps/fleet        | 0%       | Excluir temporariamente |
| apps/jetbrains    | 0%       | Excluir temporariamente |
| apps/neovim       | 0%       | Excluir temporariamente |
| apps/sublime      | 0%       | Excluir temporariamente |
| apps/vim          | 0%       | Excluir temporariamente |
| apps/visualstudio | 0%       | Excluir temporariamente |
| apps/zed          | 0%       | Excluir temporariamente |

---

## VSCode Adapter

| Arquivo          | Statements | Branches | Status |
| ---------------- | ---------: | -------: | ------ |
| VSCodeAdapter.ts |     79.64% |   77.77% | 🟢     |

---

## UI/Webview

| Arquivo            |          Coverage | Situação                                                         |
| ------------------ | ----------------: | ---------------------------------------------------------------- |
| FindingCard.tsx    |              100% | 🟢 Coberto                                                       |
| reviewView.js      |                0% | 🔴 Teste executa, mas coverage não está instrumentando o arquivo |
| reviewView.test.js | 4 testes passando | 🟢                                                               |

---

# Problema Atual Principal

## Coverage Global falhando

Apesar dos testes estarem passando, o gate de coverage falha:

```txt
ERROR: Coverage for lines (63.71%) does not meet global threshold (75%)
ERROR: Coverage for functions (54.01%) does not meet global threshold (70%)
ERROR: Coverage for statements (63.71%) does not meet global threshold (75%)
```

---

# Causa Mais Provável

O coverage está incluindo arquivos que não deveriam contar para o quality gate principal:

* arquivos de configuração;
* placeholders de IDEs futuras;
* scripts E2E;
* arquivos de entrada delegadores;
* wrappers simples sem lógica;
* arquivos JS de webview não instrumentados corretamente.

---

# Correção Recomendada de Coverage

Atualizar `vitest.coverage.config.ts` para excluir temporariamente:

```txt
.dependency-cruiser.cjs
vitest.*.config.ts
apps/*/src/bootstrap/activateExtension.ts quando forem placeholders
apps/eclipse/**
apps/emacs/**
apps/fleet/**
apps/jetbrains/**
apps/neovim/**
apps/sublime/**
apps/vim/**
apps/visualstudio/**
apps/zed/**
apps/vscode/tests/e2e/**
apps/vscode/src/ui/js/reviewView.js até instrumentação correta
packages/testing/src/infra/** caso sejam wrappers triviais
```

---

# Atenção Sobre reviewView.js

O arquivo `reviewView.test.js` está rodando e passando, mas `reviewView.js` continua 0%.

Isso indica que o teste provavelmente carrega o script de uma forma que o V8 coverage não consegue instrumentar.

## Opções

| Opção                                   | Custo      | Recomendação       |
| --------------------------------------- | ---------- | ------------------ |
| Excluir `reviewView.js` temporariamente | Baixo      | Recomendado agora  |
| Refatorar para módulo exportável        | Médio      | Recomendado depois |
| Migrar para TypeScript/ESM              | Médio/Alto | Futuro             |

---

# 1. Testes Funcionais

| Status | Categoria         | Situação Atual   | Próxima Ação                         |
| ------ | ----------------- | ---------------- | ------------------------------------ |
| 🟢     | Unitário          | Estável          | Manter                               |
| 🟢     | Integração        | Estável          | Manter                               |
| 🟢     | E2E               | Estável          | Validar separado do coverage         |
| 🟢     | Contrato          | Estruturado      | Automatizar validações               |
| 🟡     | Interface/Webview | Testes iniciados | Resolver coverage real do reviewView |
| 🟡     | API               | Parcial          | Cobrir providers restantes           |
| ⚪      | Exploratório      | Não iniciado     | Planejar                             |
| ⚪      | BDD               | Não iniciado     | Avaliar necessidade                  |

---

# 2. Testes Estruturais

| Status | Categoria            | Situação Atual             |
| ------ | -------------------- | -------------------------- |
| 🟢     | Caixa Branca         | Consolidado                |
| 🟡     | Branch Coverage      | 76.47%                     |
| 🟡     | Path Coverage        | Parcial                    |
| 🟡     | Mutation Testing     | Configurado, gate pendente |
| 🟢     | Architecture Testing | Consolidado                |
| 🟢     | Dependency Rules     | Ativas                     |
| 🟢     | Static Analysis      | Consolidado                |

---

# 3. Arquitetura

## Estrutura atual consolidada

```txt
activate()
 └── activateExtension()
      ├── bootstrapContainer()
      ├── registerCommands()
      ├── registerViews()
      ├── registerMenus()
      ├── registerEvents()
      └── restoreCurrentBranchSession()
```

---

# Melhorias arquiteturais implementadas

| Status | Implementação                               |
| ------ | ------------------------------------------- |
| 🟢     | Bootstrap único                             |
| 🟢     | Registrations centralizados                 |
| 🟢     | Sem duplicated providers                    |
| 🟢     | Sem circular dependencies                   |
| 🟢     | Dependency validation                       |
| 🟢     | Orchestration movida parcialmente para core |
| 🟢     | Estrutura multi-IDE consolidada             |
| 🟢     | RAG desacoplado do VSCode                   |
| 🟢     | Quality Gates estruturados                  |

---

# 4. Multi-IDE

| Status | IDE           | Situação         |
| ------ | ------------- | ---------------- |
| 🟢     | VSCode        | Principal        |
| 🟢     | JetBrains     | Estrutura criada |
| 🟢     | Visual Studio | Estrutura criada |
| 🟢     | Fleet         | Estrutura criada |
| 🟢     | Neovim        | Estrutura criada |
| 🟢     | Vim           | Estrutura criada |
| 🟢     | Sublime       | Estrutura criada |
| 🟢     | Eclipse       | Estrutura criada |
| 🟢     | Emacs         | Estrutura criada |
| 🟢     | Zed           | Estrutura criada |

---

# Mutation Testing

| Status | Área              | Situação         |
| ------ | ----------------- | ---------------- |
| 🟡     | StrykerJS         | Configurado      |
| ⚪      | Mutation CI       | Não implementado |
| ⚪      | Mutation Gates    | Não implementado |
| ⚪      | Survivor Analysis | Não implementado |

---

# Próximas Prioridades

## PRIORIDADE 1

Corrigir `vitest.coverage.config.ts` para excluir arquivos indevidos do coverage.

---

## PRIORIDADE 2

Validar `npm run test` até passar os thresholds globais.

---

## PRIORIDADE 3

Validar `npm run test:all` com build pipeline funcional.

---

## PRIORIDADE 4

Decidir estratégia para `reviewView.js`:

* excluir temporariamente; ou
* refatorar para módulo testável.

---

## PRIORIDADE 5

Ativar mutation testing como quality gate.

---

# Critérios de Qualidade

## O sistema será considerado estável quando:

| Critério                                         | Status Atual |
| ------------------------------------------------ | ------------ |
| Não houver duplicated registrations              | 🟢           |
| Branch coverage atingir metas                    | 🟡           |
| Mutation testing estiver ativo                   | 🟡           |
| Build pipeline estiver funcional                 | 🟡           |
| VSCodeAdapter possuir cobertura adequada         | 🟢           |
| UI possuir testes básicos                        | 🟡           |
| Cenários negativos principais estiverem cobertos | 🟢           |
| Arquitetura multi-IDE estiver consolidada        | 🟢           |
| Dependency validation continuar limpa            | 🟢           |
| ESLint Quality Gate permanecer verde             | 🟢           |
| Coverage thresholds globais passarem             | 🔴           |

---

# Estado Final Esperado

O projeto estará estável quando:

* `npm run test` passar sem erro de coverage;
* `npm run test:all` passar até o final;
* `npm run build` estiver funcional;
* coverage global não for prejudicado por placeholders;
* VSCodeAdapter permanecer acima da meta;
* UI tiver testes básicos reconhecidos pelo coverage;
* mutation testing rodar como gate;
* arquitetura continuar sem ciclos e sem dependency violations.
