# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Added a `HeatmapService` to aggregate file risks based on historical review sessions.
- Added a `ContextEngine` that uses Human-in-the-Loop feedback (approved/rejected findings) to improve AI analysis.
- Added `AIProviderRegistry` for managing multiple AI providers and dynamic switching.
- Added `FallbackAIProvider` to provide automatic failover between primary and secondary providers.
- Added `GitHubProvider` and `PublishPRReviewUseCase` for publishing approved findings as comments on GitHub PRs.
- Added `AuditLogService` for traceability and enterprise compliance of critical actions.
- Added `EmbeddingProvider` and `VectorStore` interfaces as a foundation for future RAG (Retrieval-Augmented Generation) support.
- Added a core `AstBuilder` for TypeScript/JavaScript structural summaries and static-analysis metrics.
- Added a core runtime entrypoint to keep VS Code bundles from including static-analysis parser dependencies.
- Added a configurable static rule engine for AST-based validation.
- Added an initial risk scorer based on static rule findings and AST metrics.
- Added controlled suggested-fix application from the VS Code findings view after human approval.
- Added file-based review session persistence for the VS Code MVP.
- Added branch-aware session restore using the VS Code Git API.
- Added VS Code settings for selecting the `mock` or local `ollama` AI provider.
- Added configurable OpenAI provider support in the VS Code extension.
- Added secure OpenAI API key storage through VS Code SecretStorage.
- Added a `Clear Current Review Session` VS Code command.
- Added loading, empty-session, restored-session, and error states to the findings webview.
- Added validation for missing active files and empty files before running AI analysis.
- Added a VS Code extension build step using `esbuild` before packaging.
- Added package metadata files for the VS Code MVP extension artifact.
- Added a VS Code extension license file for packaging metadata.
- Added VS Code packaging ignore rules to keep the MVP artifact scoped to the extension runtime files.
- Added a root `.gitignore` for generated dependencies, build outputs, packages, coverage, and Turbo cache.
- Added MVP usage and provider configuration instructions to `README.md`.
- Added `usage.md` with install, configuration, provider, workflow, persistence, and troubleshooting instructions.

### Changed
- Integrated `ContextEngine` into `AnalyzeCodeUseCase` to provide historical context to AI providers.
- Extended `ReviewRepository` and its implementations (`FileReviewRepository`, `InMemoryReviewRepository`) with `getAllSessions` for heatmap and context aggregation.
- Reorganized `infra` package contracts into `interfaces.ts` to prevent circular dependencies.
- Made updating `usage.md` mandatory when implementation changes affect usage.
- Made updating `CHANGELOG.md` mandatory after every completed implementation.
- VS Code extension now uses persistent storage instead of in-memory review sessions.
- VS Code analysis now falls back to the first visible editor when no active editor is reported.
- Updated the implementation control matrix to reflect validated MVP foundation items.
- Documented the explicit VS Code usable MVP milestone in `docs/roadmap.md`.

## [2.0.0] - 2026-05-12

### Added
- Monorepo structure initialization (`apps/`, `packages/`).
- Root `package.json` with workspace configuration.
- Initial project architecture setup.
- Core Domain entities (`Finding`, `ReviewSession`).
- Infrastructure Contracts (`IDEAdapter`, `AIProvider`, `ReviewRepository`).
- `AnalyzeCodeUseCase` with initial logic.
- `ValidateFindingUseCase` for HITL flow.
- Unit test for `AnalyzeCodeUseCase` using Vitest.
- `InMemoryReviewRepository` for local state management.
- `MockAIProvider` for simulated AI analysis.
- Implementation of `ValidateFindingUseCase` with persistence.
- VSCode extension boilerplate (`apps/vscode`).
- `VSCodeAdapter` implementation for IDE interaction.
- Basic "Analyze Code" command in VSCode.
- `FindingCard` UI component in React (`packages/ui`).
- `ReviewViewProvider` for VSCode Webview integration.
- Activity Bar and Sidebar view contribution in VSCode.
- Real-time updates of findings in the Sidebar UI.
- Full TDD coverage for `AnalyzeCodeUseCase`, `ValidateFindingUseCase`, and `InMemoryReviewRepository`.
- 100% compliance with business logic testing mandates.
- Reorganization of tests into dedicated `tests/` folders in each package.
- Implementation of finding navigation (scroll to line) in VSCode.
- Strict TDD enforcement in `apps/vscode` for Adapter and Provider layers.
- Global and local packaging scripts for VS Code (`vsce package`).
- Support for generating `.vsix` files for the Extension Store.
- Multi-IDE packaging support for VS Code and JetBrains.
- Support for Vim/Neovim (coc.nvim) and Sublime Text packaging.
- Global `package:all` script to build all extension artifacts.
- Implementation of `OpenAIProvider` with strict TDD.
- Support for structured AI input/output with confidence scores.
