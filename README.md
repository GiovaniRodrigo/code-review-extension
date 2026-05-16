# AI Code Review (Beta)

Intelligent, local-first code review assistant for VS Code. Designed with a **Human-in-the-Loop** approach, ensuring the reviewer remains in control while AI provides surgical insights.

## 🚀 Key Features

- **HITL Workflow**: Approve or reject AI findings before they appear as diagnostics in your editor.
- **Context-Aware (RAG)**: Uses Retrieval Augmented Generation to understand your project structure and patterns via the **Project AI Chat**.
- **Advanced Quality Metrics**: Automatic detection of **SOLID** violations, **Cognitive Complexity**, and **Testability Index**.
- **Smart Fix (AI Refactoring)**: Automatically generate and apply code corrections for identified findings.
- **PR Summary Generator**: Create detailed, technical descriptions for Pull Requests automatically.
- **Multi-Provider Support**: Use **Ollama** (100% local), **OpenAI**, **Gemini**, or **Claude**.
- **Privacy & Security**: Built-in **Data Masking** for PII/Secrets and OS-level secure credential storage.
- **Cloud Sync (VPS)**: Sincronize your review sessions and findings across different machines.
- **Multi-Language**: Structural analysis support for **TypeScript**, **Python**, and **Go**.

## 📦 Installation

1. Download the latest `.vsix` from the [releases page](https://github.com/giovani/code-review-extension/releases).
2. In VS Code, open the Command Palette (`Ctrl+Shift+P`) and type **"Extensions: Install from VSIX..."**.
3. Select the downloaded file.

## 🛠️ Quick Start

1. **Setup Provider**: Run `Code Review: Set AI Provider` and select your preferred engine.
2. **Setup RAG**: Run `Code Review: Setup RAG` to index your project for context-aware analysis.
3. **Analyze**: 
   - **Current File**: `Ctrl+Alt+R` (or `Cmd+Alt+R` on Mac).
   - **Full Workspace**: Run `Code Review: Analyze Entire Workspace`.
4. **Review Findings**: Open the **AI Review** sidebar view to approve/reject suggestions.
5. **PR Automation**: Run `Code Review: Generate AI PR Summary` before pushing your changes.

> **Tip**: Check the [QUICKSTART.md](./QUICKSTART.md) for a detailed 5-minute setup guide.

## ⚙️ Configuration

Access settings via `codeReview` prefix.

| Setting | Default | Description |
|---|---|---|
| `codeReview.provider` | `mock` | `mock`, `ollama`, `openai`, `gemini`, or `claude` |
| `codeReview.rag.enabled` | `true` | Enable project-wide context enrichment |
| `codeReview.privacy.maskData` | `true` | Automatically mask PII and Secrets |
| `codeReview.autoRevalidate` | `false` | Re-analyze code automatically on save |
| `codeReview.autoRestoreSession` | `true` | Restore work on branch switch |

## 📖 Documentation

- [QUICKSTART.md](./QUICKSTART.md): Get started in 5 minutes.
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md): Common issues and solutions.
- [CHANGELOG.md](./CHANGELOG.md): History of changes and versions.

---

*Status: 🟢 **Prod-Ready Beta**. Optimized for privacy and developer productivity.*
