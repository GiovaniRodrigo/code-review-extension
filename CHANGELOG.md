
## 5.0.2 — Dependency Graph Workspace Sync

- Central Dependency Graph now uses the same analysis data as the sidebar graph.
- Added interactive central graph canvas with tooltip support.
- Added node click behavior to open the related file or choose a file from a package node.
- Synced package/file scope, imports and cycle filters between compact and central graph behavior.


## 4.0.3 - Design Workspace

- Added full editor-area Code Review Workspace aligned with the wireframe.
- Start Review now opens the visual workspace instead of only a QuickPick menu.
- Project Chat and Dependency Graph commands now open the full workspace tabs.
- Sidebar remains as compact operational preview.

# Changelog

## 4.0.5 - Dashboard Navigation Restore

- Restored the explicit Dashboard button in the Code Review view toolbar.
- Added `Code Review: Open Dashboard` as a command palette entry.
- Added a persistent Dashboard shortcut in the full Code Review Workspace navigation.
- Added a Dashboard action to return from Findings, Chat, RAG and Graph without relying on Command Palette.


## 2.3.1 — Marketplace Release

### Changed

- Polished Marketplace-facing branding for Git Code Review.
- Renamed Activity Bar container to Code Review.
- Renamed configuration title to Git Code Review.
- Added safer auto-detection for Git base branches.
- Changed default Git base branch to auto-detect mode.
- Improved branch review fallback when no base branch exists.
- Aligned dashboard readiness status with the quality score.
- Improved findings summary wording for reviewers.

### Added

- Marketplace release report.
- Marketplace publishing checklist.

## 2.3.0 — Product Ready

### Added

- Product positioning for the official target audience: code reviewers.
- `Code Review: Start Review` as the main product entrypoint.
- Product-ready Dashboard with quality score, plan, provider, RAG, modules and readiness.
- Product Diagnostics with audience, plan and runtime checks.
- Marketplace icon and screenshots.
- Pricing and Packaging documentation for Community, Pro, Team and Enterprise.
- Product positioning, requirements, onboarding and marketplace listing documents.
- `product:ready` and `product:release` gates.

### Changed

- Extension display name changed to `Git Code Review`.
- Marketplace description, keywords and categories aligned with product positioning.
- README rewritten as a product page for code reviewers.

### Notes

- Billing, Team cloud collaboration and Enterprise SSO/RBAC are defined as product packaging and roadmap items, not shipped as backend services in this VS Code-only package.


## 2.2.0 — Production Ready

- Removed beta branding from the packaged extension.
- Registered missing production use cases for PR analysis, PR summary, quality report and publishing.
- Added safe command execution wrapper to prevent unhandled command crashes.
- Added `Code Review: Run Production Diagnostics` command.
- Added production wiring tests for contributed command registration and runtime use-case availability.
- Added VSIX validation script to block source/tests/scripts/maps/internal files from release packages.
- Defaulted first-run provider to the offline mock fallback so the extension does not crash when Ollama is unavailable.


## 2.1.7

- Corrige falha de ativação em produção causada por dependências externas ausentes no VSIX.
- Empacota `typescript`, `ts-morph` e dependências necessárias dentro de `dist/extension.js`.
- Mantém apenas `vscode` como dependência externa do runtime.
- Remove geração de sourcemap/metafile no build de produção.


All notable changes to the project Code Review Extension will be documented in this file.

---

## [2.1.1] - 2026-05-17

### Added

* **LLM Pipeline Tests**: Added dedicated smoke and regression test suites for:

  * LLM contract validation;
  * provider selection;
  * data masking safety;
  * runtime provider wiring.
* **RAG Pipeline Tests**: Added smoke tests for RAG pipeline validation and search result structure.
* **Runtime Wiring Diagnostics**: Added integration tests validating dependency injection container registration and VS Code command runtime execution.
* **Analyze Runtime Protection**: Added explicit runtime guards for missing use cases to prevent silent `undefined.execute` failures.
* **Extension Runtime Diagnostics**: Added automated runtime diagnostics validation for Extension Host execution.
* **Release Hardening Pipeline**: Expanded release validation with:

  * runtime diagnostics;
  * E2E validation;
  * VS Code integration tests;
  * LLM pipeline checks;
  * RAG pipeline checks.

### Improved

* **AI Provider Runtime Synchronization**:

  * Dashboard now reflects active provider changes correctly;
  * Project AI Chat refreshes active provider dynamically;
  * runtime provider selection now prioritizes `codeReview.ai.activeProviderId`.
* **Gemini Provider Setup**:

  * improved runtime validation flow;
  * improved provider activation checks;
  * safer provider activation lifecycle.
* **VS Code Runtime Stability**:

  * improved container wiring validation;
  * improved command registration diagnostics;
  * improved extension activation resilience.
* **Testing Infrastructure**:

  * expanded smoke coverage for runtime and AI flows;
  * expanded integration coverage for command handlers and providers;
  * strengthened runtime regression protection.

### Fixed

* Fixed runtime crash:

  ```txt
  Cannot read properties of undefined (reading 'execute')
  ```

  during Analyze Code execution.
* Fixed stale AI provider state in Dashboard and Project AI Chat after provider configuration changes.
* Fixed missing runtime validation in Analyze command handlers.
* Fixed failing `quality:llm` pipeline caused by missing LLM test files.
* Fixed failing `quality:rag` pipeline caused by missing RAG test files.
* Fixed container/runtime wiring inconsistencies after refactor.
* Fixed release pipeline instability during runtime diagnostics validation.

### Security

* Improved validation flow for AI provider activation.
* Improved defensive runtime validation for unresolved dependencies.
* Expanded masking validation coverage for sensitive data handling.

---

## [2.1.0] - 2026-05-15

### Added

* **Gemini AI Provider**: Support for Google Gemini (Flash/Pro) with secure API key storage.
* **Hardened AI Parsers**: Improved JSON extraction and validation for Ollama and Gemini responses.
* **Relative Path Support**: Enhanced file resolution in VS Code for complex project structures.

### Improved

* **Ollama Integration**: Optimized local analysis with larger context window and refined prompts.
* **AST Performance**: Implementation of file-type filtering in the TypeScript AST builder to reduce overhead.
* **Testing Infrastructure**: Hardened mutation testing configuration and increased test coverage for AI providers.

### Fixed

* Duplicate event registration in VS Code view providers.
* Absolute vs Relative path handling in IDE adapters.

---

## [2.0.0] - 2026-05-14 (Stable Release)

### Added

* **Workflow HITL (Human-in-the-Loop)**: Reviewers must approve findings before they appear as diagnostics in the editor.
* **Persistent Sessions**: Sessions are automatically saved and restored based on the current Git branch.
* **Multi-Provider AI**: Support for Mock, Ollama (local), and OpenAI (cloud) providers.
* **RAG (Retrieval Augmented Generation)**: Incremental repository indexing for contextual analysis.
* **Operational Sidebar**: A dedicated view to manage findings, with filtering by severity (Error, Warning, Info) and file grouping.
* **Secure Storage**: OpenAI API Keys are now stored using VS Code's native `SecretStorage`.
* **Incremental Indexing**: RAG now tracks file modification times to avoid redundant processing.
* **Analysis Resilience**: Implemented automatic retries, timeouts (30s), and manual/automatic task cancellation.
* **Interactive Features**: Focus finding in editor, Copy to clipboard, and Manual/Auto revalidation.
* **Zod Validation**: Robust schema validation for all AI responses to prevent crashes.
* **UI State Persistence**: Sidebar filters and section collapse states now persist across VS Code reloads.
* **Diagnostics Sync**: Smart synchronization between findings and editor underlines to eliminate orphan diagnostics.
* **Enhanced Hardening**: Protection against multiple event subscriptions and robust memory cleanup for all IDE listeners.

### Fixed

* Improved memory management with proper resource disposal.
* Fixed diagnostic collection leaks on branch switching.
* Standardized severity levels across different AI providers.

### Security

* Shifted sensitive credentials from plain storage to encrypted OS storage via VS Code API.

## 5.1.0 — AI Coding Guard

- Added AI Coding Guard for validating LLM-generated code before applying it to the repository.
