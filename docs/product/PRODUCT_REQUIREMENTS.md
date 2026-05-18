# Product Requirements

## Objetivo

Transformar o Git Code Review em um produto utilizável, comunicável e publicável para code reviewers.

## Unidade central

```text
Review Session
```

Uma Review Session representa uma revisão vinculada a branch, workspace, arquivos alterados, findings, score, comentários, decisões e histórico.

## Módulos oficiais

| Módulo | Função |
|---|---|
| Dashboard | Visão executiva da revisão, plano, score, readiness e módulos |
| Diagnósticos | Validação de workspace, Git, IA, RAG, container e produção |
| Findings | Lista de problemas, severidade, confiança, status e ações |
| Inteligência | Provider IA, RAG e chat com contexto do projeto |
| Comentários | Discussões e feedbacks por finding |
| Git Review | Análise por arquivo, workspace, branch e PR |
| Conformidades | Heurísticas, políticas e regras de review |
| Telemetria | Métricas de uso e qualidade por plano |
| Histórico | Sessões anteriores e decisões tomadas |
| Configurações | Provider, RAG, tokens, plano e preferências |

## Ações principais

| Ação | Obrigatória |
|---|---:|
| Start Review | Sim |
| Guided Setup | Sim |
| Run Product Diagnostics | Sim |
| Analyze Workspace | Sim |
| Analyze Branch Commits | Sim |
| Analyze Current File | Sim |
| Index Repository RAG | Sim |
| Search Repository Context | Sim |
| Approve Finding | Sim |
| Reply / Comment | Sim |
| Refactor Finding | Sim |
| Generate PR Summary | Sim |
| Generate Technical Quality Report | Sim |

## Estados vazios obrigatórios

| View | Estado vazio esperado |
|---|---|
| Dashboard | Explicar Start Review, plano, provider, RAG e diagnóstico |
| Findings | Explicar que ainda não há findings e sugerir Analyze Workspace |
| Chat | Explicar que RAG deve ser indexado para melhor contexto |
| RAG | Explicar status e permitir indexar/reindexar |
| Graph | Explicar dependências e pedir análise/indexação |

## Score de Qualidade

| Faixa | Classificação |
|---|---|
| 90–100 | Excellent |
| 75–89 | Good |
| 60–74 | Attention |
| 40–59 | Risk |
| 0–39 | Blocked |

## Regras de segurança do produto

| Regra | Descrição |
|---|---|
| IA não decide | A IA nunca aprova automaticamente |
| IA não aplica sem preview | Correções devem passar por revisão humana |
| Mock é fallback seguro | Sem provider configurado, a extensão não deve quebrar |
| Dados sensíveis devem ser mascarados | O padrão deve proteger tokens, emails e IPs |
| Falha deve orientar ação | Erros devem indicar próximo passo |

## Definition of Done de produto

| Gate | Critério |
|---|---|
| Build | `npm run build --workspace git-code-review` passa |
| Typecheck | `npm run typecheck --workspace git-code-review` passa |
| Product tests | `npm run test:production --workspace git-code-review` passa |
| Product readiness | `npm run product:ready` passa |
| VSIX | `npm run package:vscode` gera pacote |
| Validate VSIX | `npm run validate:vsix --workspace git-code-review` passa |
| Audit | `npm run audit:critical` sem crítica |
| UX | Dashboard tem Start Review e Diagnostics |
| Marketplace | README, icon, screenshots, changelog e descrição prontos |
