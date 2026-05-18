
## 5.0.2 — Dependency Graph Workspace Sync

- Central Dependency Graph now uses the same analysis data as the sidebar graph.
- Added interactive central graph canvas with tooltip support.
- Added node click behavior to open the related file or choose a file from a package node.
- Synced package/file scope, imports and cycle filters between compact and central graph behavior.

## 5.0.1 — Dependency Graph Stability

- Fixed dependency graph tooltip and dependency map generation.


## 4.0.4 - Runtime Stability

- Fixed shared session export default path to avoid writing to the filesystem root when no workspace folder is available.
- Fixed audit log and self-hosted readiness export default paths.
- Enterprise SSO/RBAC actions now persist in VS Code workspace state instead of relying on workspace configuration writes.
- Added safer fallback save locations for Markdown, PDF and Quality Report exports when no workspace is open.
- Reduced user-facing command failures discovered during VS Code runtime validation.


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


## 4.0.0 — Enterprise Ready

### Added

- Pro UX Polish workspaces: Provider Setup, PR Summary Workspace and Quality Report Workspace.
- RAG Manager and Project Chat navigation for reviewer workflows.
- Dependency Graph entrypoint for architectural review.
- Review Intelligence workspace for reports, history and decision support.
- Plans & Packaging screen with Community, Pro, Team and Enterprise.
- Local Pro trial and local license plan configuration.
- Team Dashboard, shared-session export and team review policies.
- Collaboration Center for Team workflows.
- Enterprise Governance workspace with SSO configuration, RBAC, audit logs, AI policies and self-hosted readiness.
- Audit log export and self-hosted readiness document generation.
- Documentation for versions 2.6.0 through 4.0.0.

### Notes

- Billing, SaaS login, real-time cloud sync, tenant management and real external IdP validation require backend services and are prepared as product foundations in this VS Code package.


## 2.5.0 — Pro Foundation

### Added

- Cloud provider configuration workflow for OpenAI, Gemini, Claude and custom OpenAI-compatible providers.
- `Code Review: Test AI Provider Connection` command for provider health validation.
- Advanced PR Summary generation with required reviewer-focused sections.
- Enhanced Technical Quality Report with score, decision signal, severity/category distribution, recommendations and HITL declaration.
- `Code Review: Export Review as PDF` command with local PDF report generation.
- `Code Review: Select Review Template` command with General, Security, Architecture, Laravel, React, API, Performance and Testability templates.
- `Code Review: Open Review History` command for local branch/session review history.
- `Code Review: View Pro Features` command for Pro packaging and upgrade explanation.
- Dashboard Pro Foundation panel with cloud provider, template, PR Summary and PDF status.

### Changed

- Version updated to 2.5.0.
- README updated with Pro Foundation workflow and commands.
- Product readiness checks now include Pro Foundation artifacts.

### Notes

- Billing, login, managed cloud sync, Team collaboration and Enterprise SSO/RBAC remain roadmap/backend features for future versions.

## 2.4.0 — Community Stable

### Added

- First-run Community onboarding prompt for code reviewers.
- Guided `Start Review` menu with workspace review, restore session, revalidate, export, RAG indexing, Ollama setup and diagnostics.
- `Code Review: Setup Ollama Local AI` command with health validation and safe fallback to Mock.
- `Code Review: Revalidate Current Review Session` command to re-check findings after code changes.
- `Code Review: Export Review as Markdown` command for local HITL review reports.
- Local session summary in the Dashboard.
- Professional empty state in Findings with direct actions.
- Safe refactor preview flow using VS Code diff before applying AI-generated fixes.
- Diagnostics check for local review-session persistence.

### Changed

- Refactor generation now saves suggestions and requires reviewer confirmation before applying fixes when preview mode is enabled.
- Dashboard now exposes Community Stable actions directly: Setup Ollama, Restore, Revalidate and Export Markdown.
- Review workflow now prioritizes safe workspace review over branch analysis when no base branch is available.

### Notes

- Team collaboration, billing, SSO/RBAC and self-hosted Enterprise remain roadmap/backend features.

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


## 2.1.9

- Fixed `Analyze Entire Workspace` crash caused by an unregistered workspace analysis use case.
- Passed active branch, cancellation signal, and progress contract correctly to workspace analysis.
- Added safe filtering for generated/vendor folders during workspace analysis.


## 2.1.7

- Corrige falha de ativação em produção causada por dependências externas ausentes no VSIX.
- Empacota `typescript`, `ts-morph` e dependências necessárias dentro de `dist/extension.js`.
- Mantém apenas `vscode` como dependência externa do runtime.
- Remove geração de sourcemap/metafile no build de produção.


## [2.1.0] - 2026-05-15

### Added
- **Gemini AI Provider**: Support for Google Gemini (Flash/Pro) with secure API key storage.
- **Hardened AI Parsers**: Improved JSON extraction and validation for Ollama and Gemini responses.
- **Relative Path Support**: Automatic resolution of relative file paths in diagnostics and editor focus.

### Improved
- **Ollama Integration**: Increased context window (8k) and optimized prompts for local analysis.
- **AST Efficiency**: Added file extension filtering to the TypeScript AST builder.
- **Mutation Resilience**: Optimized Stryker configuration to ignore build artifacts and test outputs.

### Fixed
- Prevented duplicate view registration when reloading the extension.
- Corrected path resolution for findings in multi-root workspaces.

## [2.0.0] - 2026-05-12

### Added
- MVP VS Code package with AI-assisted findings, HITL actions, inline diagnostics, persistent sessions, and configurable Mock/Ollama providers.
- Configurable OpenAI provider with secure API key storage, review-session clearing command, and webview loading/error/empty states.
