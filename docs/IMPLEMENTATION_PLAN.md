# Roadmap de Implementação — Extensão Multi-IDE de Code Review com IA

---

# Legenda

| Status | Significado |
|---|---|
| ⚪ TODO | Ainda não iniciado |
| 🔵 DEV | Em desenvolvimento |
| 🟡 HML | Em homologação |
| 🟢 DONE | Finalizado |
| 🔴 BLOCKED | Bloqueado |
| ⚫ CANCELED | Cancelado |

---

# Controle Geral de Implementação

| ID | Status | Módulo | Progresso | Responsável | Dependência |
|---|---|---|---:|---|---|
| EP-01 | ⚪ TODO | Fundação Arquitetural | 0% | - | - |
| EP-02 | ⚪ TODO | Integração Multi-IDE | 0% | - | EP-01 |
| EP-03 | ⚪ TODO | Core de Code Review | 0% | - | EP-01 |
| EP-04 | ⚪ TODO | Providers de IA | 0% | - | EP-03 |
| EP-05 | ⚪ TODO | Sistema RAG | 0% | - | EP-04 |
| EP-06 | ⚪ TODO | AST Builder | 0% | - | EP-03 |
| EP-07 | ⚪ TODO | Analyzers | 0% | - | EP-06 |
| EP-08 | ⚪ TODO | Persistência Local | 0% | - | EP-03 |
| EP-09 | ⚪ TODO | VPS / Git Sync | 0% | - | EP-03 |
| EP-10 | ⚪ TODO | UI/UX | 0% | - | EP-02 |
| EP-11 | ⚪ TODO | Testes | 0% | - | TODOS |
| EP-12 | ⚪ TODO | Documentação | 0% | - | TODOS |

---

# EP-01 — Fundação Arquitetural

## Objetivo
Criar base da arquitetura desacoplada entre IDEs, Core e Infraestrutura.

---

## Tasks

| ID | Status | Task | Tipo | Prioridade | Progresso |
|---|---|---|---|---|---:|
| ARC-001 | ⚪ TODO | Criar monorepo | Infra | Alta | 0% |
| ARC-002 | ⚪ TODO | Criar packages/core | Core | Alta | 0% |
| ARC-003 | ⚪ TODO | Criar packages/domain | Domain | Alta | 0% |
| ARC-004 | ⚪ TODO | Criar packages/infra | Infra | Alta | 0% |
| ARC-005 | ⚪ TODO | Criar packages/ui | UI | Média | 0% |
| ARC-006 | ⚪ TODO | Configurar TypeScript workspace | Infra | Alta | 0% |
| ARC-007 | ⚪ TODO | Configurar DI container | Core | Alta | 0% |
| ARC-008 | ⚪ TODO | Definir padrão Ports & Adapters | Arquitetura | Alta | 0% |
| ARC-009 | ⚪ TODO | Criar interfaces polimórficas | Arquitetura | Alta | 0% |
| ARC-010 | ⚪ TODO | Configurar lint global | DevOps | Média | 0% |

---

# EP-02 — Integração Multi-IDE

## Objetivo
Integrar múltiplas IDEs mantendo desacoplamento do core.

---

## VS Code

| ID | Status | Task | Tipo | Prioridade | Progresso |
|---|---|---|---|---|---:|
| VSC-001 | ⚪ TODO | Criar VSCodeIdeAdapter | IDE | Alta | 0% |
| VSC-002 | ⚪ TODO | Criar VSCodeWorkspaceAdapter | IDE | Alta | 0% |
| VSC-003 | ⚪ TODO | Criar VSCodeNotificationAdapter | IDE | Média | 0% |
| VSC-004 | ⚪ TODO | Criar VSCodeWebviewAdapter | IDE | Alta | 0% |
| VSC-005 | ⚪ TODO | Registrar comandos | IDE | Alta | 0% |
| VSC-006 | ⚪ TODO | Criar painel de review | UI | Alta | 0% |
| VSC-007 | ⚪ TODO | Criar marcações tracejadas | UI | Alta | 0% |
| VSC-008 | ⚪ TODO | Navegar até linha do finding | UX | Alta | 0% |

---

## JetBrains

| ID | Status | Task | Tipo | Prioridade | Progresso |
|---|---|---|---|---|---:|
| JTB-001 | ⚪ TODO | Criar JetBrainsIdeAdapter | IDE | Alta | 0% |
| JTB-002 | ⚪ TODO | Criar ToolWindow | UI | Alta | 0% |
| JTB-003 | ⚪ TODO | Registrar actions | IDE | Alta | 0% |

---

## Neovim

| ID | Status | Task | Tipo | Prioridade | Progresso |
|---|---|---|---|---|---:|
| NVM-001 | ⚪ TODO | Criar NeovimIdeAdapter | IDE | Média | 0% |
| NVM-002 | ⚪ TODO | Criar integração Lua | IDE | Média | 0% |

---

# EP-03 — Core de Code Review

## Objetivo
Implementar núcleo do sistema desacoplado da IDE.

---

| ID | Status | Task | Tipo | Prioridade | Progresso |
|---|---|---|---|---|---:|
| COR-001 | ⚪ TODO | Criar entidade CodeReview | Domain | Alta | 0% |
| COR-002 | ⚪ TODO | Criar entidade Finding | Domain | Alta | 0% |
| COR-003 | ⚪ TODO | Criar ReviewSession | Domain | Média | 0% |
| COR-004 | ⚪ TODO | Criar AnalyzeCodeWithAIUseCase | Core | Alta | 0% |
| COR-005 | ⚪ TODO | Criar CreateCodeReviewUseCase | Core | Alta | 0% |
| COR-006 | ⚪ TODO | Criar PublishCodeReviewUseCase | Core | Média | 0% |
| COR-007 | ⚪ TODO | Criar fluxo de findings | Core | Alta | 0% |
| COR-008 | ⚪ TODO | Padronizar severidade | Domain | Média | 0% |

---

# EP-04 — Providers de IA

## Objetivo
Permitir múltiplas estratégias de IA via polimorfismo.

---

| ID | Status | Task | Tipo | Prioridade | Progresso |
|---|---|---|---|---|---:|
| AI-001 | ⚪ TODO | Criar AIProviderPort | Core | Alta | 0% |
| AI-002 | ⚪ TODO | Implementar OllamaProvider | Infra | Alta | 0% |
| AI-003 | ⚪ TODO | Implementar OpenAIProvider | Infra | Alta | 0% |
| AI-004 | ⚪ TODO | Implementar CloudAIProvider | Infra | Média | 0% |
| AI-005 | ⚪ TODO | Implementar IDEIntegratedAIProvider | Infra | Média | 0% |
| AI-006 | ⚪ TODO | Criar AIProviderFactory | Infra | Alta | 0% |
| AI-007 | ⚪ TODO | Criar PromptBuilder | Infra | Alta | 0% |

---

# EP-05 — Sistema RAG

## Objetivo
Permitir contexto inteligente para IA usando documentação e código.

---

| ID | Status | Task | Tipo | Prioridade | Progresso |
|---|---|---|---|---|---:|
| RAG-001 | ⚪ TODO | Criar SetupRagUseCase | Core | Alta | 0% |
| RAG-002 | ⚪ TODO | Perguntar cadastro inicial do RAG | UX | Alta | 0% |
| RAG-003 | ⚪ TODO | Criar MarkdownLoader | Infra | Alta | 0% |
| RAG-004 | ⚪ TODO | Criar ADRLoader | Infra | Média | 0% |
| RAG-005 | ⚪ TODO | Criar CodeChunker | Infra | Alta | 0% |
| RAG-006 | ⚪ TODO | Criar MarkdownChunker | Infra | Média | 0% |
| RAG-007 | ⚪ TODO | Criar EmbeddingProvider | Infra | Alta | 0% |
| RAG-008 | ⚪ TODO | Criar SQLiteVectorStore | Infra | Alta | 0% |
| RAG-009 | ⚪ TODO | Criar busca híbrida | Infra | Alta | 0% |
| RAG-010 | ⚪ TODO | Criar reranking | Infra | Média | 0% |
| RAG-011 | ⚪ TODO | Criar GraphRAG | Infra | Alta | 0% |
| RAG-012 | ⚪ TODO | Criar visualização do grafo | UI | Média | 0% |

---

# EP-06 — AST Builder

## Objetivo
Interpretar semanticamente o código-fonte.

---

| ID | Status | Task | Tipo | Prioridade | Progresso |
|---|---|---|---|---|---:|
| AST-001 | ⚪ TODO | Criar AstBuilderPort | Core | Alta | 0% |
| AST-002 | ⚪ TODO | Implementar TypeScript AST | Infra | Alta | 0% |
| AST-003 | ⚪ TODO | Implementar parser de imports | Infra | Alta | 0% |
| AST-004 | ⚪ TODO | Criar dependency graph | Infra | Alta | 0% |
| AST-005 | ⚪ TODO | Integrar AST ao RAG | Core | Alta | 0% |
| AST-006 | ⚪ TODO | Integrar AST aos analyzers | Core | Alta | 0% |

---

# EP-07 — Analyzers

## Objetivo
Criar sistema modular de análise.

---

| ID | Status | Task | Tipo | Prioridade | Progresso |
|---|---|---|---|---|---:|
| ANL-001 | ⚪ TODO | Criar AnalyzerPort | Core | Alta | 0% |
| ANL-002 | ⚪ TODO | Criar ArchitectureAnalyzer | Core | Alta | 0% |
| ANL-003 | ⚪ TODO | Criar SolidAnalyzer | Core | Alta | 0% |
| ANL-004 | ⚪ TODO | Criar SecurityAnalyzer | Core | Média | 0% |
| ANL-005 | ⚪ TODO | Criar DependencyAnalyzer | Core | Alta | 0% |
| ANL-006 | ⚪ TODO | Criar CodeSmellAnalyzer | Core | Média | 0% |
| ANL-007 | ⚪ TODO | Criar RagConsistencyAnalyzer | Core | Alta | 0% |
| ANL-008 | ⚪ TODO | Criar orchestrator de analyzers | Core | Alta | 0% |

---

# EP-08 — Persistência Local

| ID | Status | Task | Tipo | Prioridade | Progresso |
|---|---|---|---|---|---:|
| DB-001 | ⚪ TODO | Criar LocalDatabasePort | Core | Alta | 0% |
| DB-002 | ⚪ TODO | Implementar SQLiteLocalDatabase | Infra | Alta | 0% |
| DB-003 | ⚪ TODO | Implementar IDEStorageDatabase | Infra | Média | 0% |
| DB-004 | ⚪ TODO | Persistir findings | Core | Alta | 0% |
| DB-005 | ⚪ TODO | Persistir sessões | Core | Média | 0% |
| DB-006 | ⚪ TODO | Persistir embeddings | Infra | Alta | 0% |

---

# EP-09 — VPS / Git Sync

## Objetivo
Permitir sincronização polimórfica.

---

| ID | Status | Task | Tipo | Prioridade | Progresso |
|---|---|---|---|---|---:|
| SYN-001 | ⚪ TODO | Criar RepositorySyncPort | Core | Alta | 0% |
| SYN-002 | ⚪ TODO | Criar GitHubSyncProvider | Infra | Alta | 0% |
| SYN-003 | ⚪ TODO | Criar GitLabSyncProvider | Infra | Alta | 0% |
| SYN-004 | ⚪ TODO | Criar BitbucketSyncProvider | Infra | Média | 0% |
| SYN-005 | ⚪ TODO | Criar SelfHostedGitSyncProvider | Infra | Média | 0% |
| SYN-006 | ⚪ TODO | Criar RepositorySyncFactory | Infra | Alta | 0% |
| SYN-007 | ⚪ TODO | Publicar review no GitHub | Infra | Média | 0% |
| SYN-008 | ⚪ TODO | Publicar review no GitLab | Infra | Média | 0% |

---

# EP-10 — UI/UX

| ID | Status | Task | Tipo | Prioridade | Progresso |
|---|---|---|---|---|---:|
| UI-001 | ⚪ TODO | Criar Dashboard | UI | Alta | 0% |
| UI-002 | ⚪ TODO | Criar ReviewPanel | UI | Alta | 0% |
| UI-003 | ⚪ TODO | Criar filtro de findings | UX | Média | 0% |
| UI-004 | ⚪ TODO | Criar painel de configuração | UI | Média | 0% |
| UI-005 | ⚪ TODO | Criar visualização GraphRAG | UI | Alta | 0% |
| UI-006 | ⚪ TODO | Aplicar Material Design 3 | UI | Média | 0% |
| UI-007 | ⚪ TODO | Aplicar componentes shadcn | UI | Média | 0% |

---

# EP-11 — Testes

| ID | Status | Task | Tipo | Prioridade | Progresso |
|---|---|---|---|---|---:|
| TST-001 | ⚪ TODO | Testes unitários domain | QA | Alta | 0% |
| TST-002 | ⚪ TODO | Testes unitários core | QA | Alta | 0% |
| TST-003 | ⚪ TODO | Testes integração infra | QA | Alta | 0% |
| TST-004 | ⚪ TODO | Testes integração IDE | QA | Alta | 0% |
| TST-005 | ⚪ TODO | Testes E2E VS Code | QA | Alta | 0% |
| TST-006 | ⚪ TODO | Testes de performance RAG | QA | Média | 0% |

---

# EP-12 — Documentação

| ID | Status | Task | Tipo | Prioridade | Progresso |
|---|---|---|---|---|---:|
| DOC-001 | ⚪ TODO | Documentar arquitetura | Docs | Alta | 0% |
| DOC-002 | ⚪ TODO | Documentar RAG | Docs | Alta | 0% |
| DOC-003 | ⚪ TODO | Documentar providers IA | Docs | Média | 0% |
| DOC-004 | ⚪ TODO | Documentar AST Builder | Docs | Média | 0% |
| DOC-005 | ⚪ TODO | Documentar analyzers | Docs | Média | 0% |
| DOC-006 | ⚪ TODO | Documentar sync providers | Docs | Média | 0% |