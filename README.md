# Git Code Review

**Code review for reviewers, inside your IDE.**

Git Code Review is a code review governance workspace for VS Code. It helps **code reviewers** review changes with Git context, Human-in-the-Loop findings, local-first RAG, AI assistance, diagnostics, quality score and review sessions.

The AI assists the review process, but the final decision always belongs to the reviewer.

![Dashboard](media/screenshots/dashboard.png)

## Why Git Code Review?

| Problem | How Git Code Review helps |
|---|---|
| Reviews are scattered across IDE, Git and chat | Centralizes findings, comments, diagnostics and Git context inside VS Code |
| AI suggestions can be unsafe | Uses Human-in-the-Loop: reviewers approve, reject or reply |
| Reviewers lose repository context | Uses RAG to index repository context locally or through configured providers |
| Teams lack review consistency | Provides score, categories, reports and plan-based product packaging |
| Production readiness is hard to verify | Includes Product Diagnostics and VSIX validation gates |

## Core workflow

```text
Start Review
  ↓
Run Product Diagnostics
  ↓
Configure provider or use Mock/Ollama
  ↓
Index Repository RAG
  ↓
Analyze Workspace / Branch / Current File
  ↓
Review Findings
  ↓
Approve / Reply / Refactor / Generate Report
```

## Main features

| Feature | Description |
|---|---|
| Start Review | Product entrypoint for the reviewer workflow |
| Dashboard | Review readiness, active plan, provider, RAG and quality score |
| Product Diagnostics | Checks workspace, Git, AI provider, RAG and extension container |
| Findings | Human-reviewed technical findings with severity and confidence |
| Git Review | Analyze current file, workspace, branch commits and pull requests |
| RAG | Index repository context for better AI-assisted review |
| Project AI Chat | Ask questions about the codebase with contextual knowledge |
| PR Summary | Generate review-ready pull request summaries |
| Quality Report | Generate technical quality reports |
| Local-first | Works with Mock and Ollama without requiring cloud |

## Product plans

| Plan | Audience | Purpose |
|---|---|---|
| Community | Individual code reviewers | Free local-first adoption |
| Pro | Professional code reviewers | Cloud AI, productivity, reports and advanced history |
| Team | Squads and teams | Shared sessions, collaboration and review standards |
| Enterprise | Organizations | SSO, audit logs, RBAC, AI governance and self-hosted options |

## Quickstart

1. Install the extension.
2. Open the **Code Review** activity bar.
3. Run **Code Review: Start Review**.
4. Run **Code Review: Run Product Diagnostics**.
5. Use the default Mock provider, configure Ollama, or set a cloud provider.
6. Run **Code Review: Index Repository RAG**.
7. Run **Code Review: Analyze Workspace** or **Code Review: Analyze Branch Commits**.
8. Review findings and decide what to approve, reply, copy or refactor.

## Recommended commands

| Command | Purpose |
|---|---|
| Code Review: Start Review | Main entrypoint |
| Code Review: Guided Setup | Configure provider and RAG |
| Code Review: Run Product Diagnostics | Validate environment and runtime |
| Code Review: Analyze Workspace | Analyze the current workspace |
| Code Review: Analyze Branch Commits | Analyze branch changes |
| Code Review: Index Repository RAG | Build repository context |
| Code Review: Generate AI PR Summary | Generate pull request summary |
| Code Review: Generate Technical Quality Report | Generate quality report |

## Local-first providers

| Provider | Use case |
|---|---|
| Mock | Safe offline fallback and demos |
| Ollama | Local AI without cloud dependency |
| OpenAI / Gemini / Claude | Optional cloud AI for Pro/Team/Enterprise workflows |

## Diagnostics

![Diagnostics](media/screenshots/diagnostics.png)

Run:

```text
Code Review: Run Product Diagnostics
```

Diagnostics validates:

- product audience and plan;
- workspace;
- Git branch;
- AI provider;
- RAG provider;
- required use cases in the extension container.

## Privacy and control

- The reviewer remains in control.
- The extension defaults to a safe local/offline fallback.
- Local-first usage is supported through Mock and Ollama.
- Code sent to cloud providers depends on explicit provider configuration.
- Human approval is required for review decisions.

## Production gate

Before publishing or shipping a release, run:

```bash
npm run product:release
```

This validates typecheck, production tests, build, VSIX packaging, VSIX contents, product readiness and critical audit.

## Documentation

| Document | Purpose |
|---|---|
| `docs/PRICING_AND_PACKAGING.md` | Plans, limits and monetization |
| `docs/product/PRODUCT_POSITIONING.md` | Product positioning and messaging |
| `docs/product/PRODUCT_REQUIREMENTS.md` | Product requirements and DoD |
| `docs/product/MARKETPLACE_LISTING.md` | Marketplace copy and release listing |
| `docs/product/ONBOARDING_FLOW.md` | First-use journey |


## 4.0.3 Design Workspace

This release adds a full editor-area Code Review Workspace aligned with the product wireframe. Use `Code Review: Start Review` or `Code Review: Open Code Review Workspace` to operate the main flow outside the narrow sidebar.

## 5.0.2 Dependency Graph Fix

The Dependency Graph central workspace now uses the same dependency analysis data as the sidebar preview. It supports hover tooltips, package/file scope, import/cycle filters, and clicking nodes to open the related file. Package nodes open a file picker for files inside that package.
