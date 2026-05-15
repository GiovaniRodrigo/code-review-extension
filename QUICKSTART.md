# Quick Start Guide (5 Minutes)

Follow these steps to start reviewing your code with AI.

## 1. Installation
Install the `.vsix` file using the VS Code extensions menu ("Install from VSIX...").

## 2. Pick Your Provider
By default, the extension uses a `mock` provider for testing. To use real AI:

### Using Ollama (Local)
1. Install [Ollama](https://ollama.com/).
2. Run `ollama run llama3`.
3. In VS Code Settings, set `codeReview.provider` to `ollama`.

### Using OpenAI (Cloud)
1. In VS Code, run command (`Ctrl+Shift+P`): `Code Review: Set OpenAI API Key`.
2. Enter your key.
3. In VS Code Settings, set `codeReview.provider` to `openai`.

## 3. Index Your Project (Optional)
To provide the AI with project context (RAG):
- Run command: `Code Review: Index Repository RAG`.
- Wait for the notification "Repository indexed successfully."

## 4. Analyze Code
1. Open any TypeScript or JavaScript file.
2. Run command: `Code Review: Analyze Code with IA`.
3. Wait for the loading indicator in the sidebar.

## 5. Review and Approve
1. Click the **AI Review** icon in the activity bar.
2. Expand the file sections to see findings.
3. Click **Focus** to jump to the code.
4. Click **Approve** to generate a diagnostic (red/yellow underline) in the editor.
5. Click **Copy** if you want to share the finding.

## 6. Switch Context
Change your Git branch. The extension will automatically restore your approved findings for that branch!
