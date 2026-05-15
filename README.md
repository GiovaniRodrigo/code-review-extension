# AI Code Review (Beta)

Intelligent, local-first code review assistant for VS Code. Designed with a **Human-in-the-Loop** approach, ensuring the reviewer remains in control while AI provides surgical insights.

## 🚀 Key Features

- **HITL Workflow**: Approve or reject AI findings before they appear as diagnostics in your editor.
- **Context-Aware (RAG)**: Uses Retrieval Augmented Generation to understand your project structure and patterns.
- **Multi-Provider**: Use **Ollama** (100% local) or **OpenAI** (Cloud) for your analyses.
- **Branch Persistence**: Your review progress is automatically saved and restored when switching branches.
- **Operational Sidebar**: Organize, filter, and focus on findings efficiently.
- **Privacy First**: Sensitive keys are stored in the OS-level secure storage.

## 📦 Installation

1. Download the latest `.vsix` from the [releases page](https://github.com/giovani/code-review-extension/releases).
2. In VS Code, open the Command Palette (`Ctrl+Shift+P`) and type **"Extensions: Install from VSIX..."**.
3. Select the downloaded file.

## 🛠️ Quick Start

1. Open your project folder.
2. If using OpenAI, run command: `Code Review: Set OpenAI API Key`.
3. Open a file and run command: `Code Review: Analyze Code with IA`.
4. Open the **AI Review** view in the sidebar to manage your findings.

> **Tip**: Check the [QUICKSTART.md](./QUICKSTART.md) for a detailed 5-minute setup guide.

## ⚙️ Configuration

Access settings via `codeReview` prefix.

| Setting | Default | Description |
|---|---|---|
| `codeReview.provider` | `mock` | `mock`, `ollama`, or `openai` |
| `codeReview.ollama.baseUrl` | `http://localhost:11434` | Your local Ollama server |
| `codeReview.rag.enabled` | `true` | Enable project-wide context |
| `codeReview.autoRestoreSession` | `true` | Restore work on branch switch |

## 📖 Documentation

- [QUICKSTART.md](./QUICKSTART.md): Get started in 5 minutes.
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md): Common issues and solutions.
- [CHANGELOG.md](./CHANGELOG.md): History of changes and versions.

---

*Status: 🟢 **Beta**. We recommend using the Ollama provider for maximum privacy and zero cost.*
