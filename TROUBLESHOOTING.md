# Troubleshooting

Common issues and how to fix them.

## AI Issues

### Ollama is offline
- **Problem**: Analysis fails with "Connection refused".
- **Solution**: Ensure the Ollama server is running (`ollama serve`) and accessible at the URL in `codeReview.ollama.baseUrl`.

### OpenAI Key Invalid
- **Problem**: Analysis fails with "401 Unauthorized".
- **Solution**: Re-run command `Code Review: Set OpenAI API Key` and paste a valid key.

### Analysis Timeout
- **Problem**: Analysis takes longer than 30 seconds and fails.
- **Solution**: Large files or slow models can trigger timeouts. Increase `codeReview.ai.timeout` in settings or use a faster model (e.g., `llama3:8b`).

## UI Issues

### Findings do not appear in Sidebar
- **Problem**: Analysis completed but the sidebar is empty.
- **Solution**: Ensure you are on the correct Git branch. Use the "Revalidate" button to force a refresh.

### Diagnostics (Underlines) do not appear
- **Problem**: I approved a finding but the code isn't underlined.
- **Solution**: Diagnostics only appear if the file is open and the line numbers still match the code. If you edited the file, run "Analyze" again.

### Sidebar is Blank or Stuck
- **Problem**: The webview fails to load.
- **Solution**: Run command `Developer: Reload Window`.

## RAG Issues

### RAG not indexing
- **Problem**: Indexing finishes too fast or zero chunks created.
- **Solution**: Ensure your files are in the workspace root and have supported extensions (`.ts`, `.tsx`, `.js`). Check `codeReview.rag.ignoredFolders`.

## Installation

### VSIX installation fails
- **Problem**: "Incompatible extension host".
- **Solution**: Ensure your VS Code version is at least `1.118.0`.
