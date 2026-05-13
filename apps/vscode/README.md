# AI Code Review

VS Code MVP for local AI-assisted code review with Human-in-the-Loop validation.

## Usage

1. Run `Analyze Code with IA`.
2. Review findings in `AI Review > Findings`.
3. Approve or reject each finding.
4. Approved findings are shown as inline diagnostics.
5. Run `Clear Current Review Session` to reset the current session.

## Providers

The default provider is `mock`. To use local Ollama, set:

```json
{
  "codeReview.provider": "ollama",
  "codeReview.ollama.baseUrl": "http://localhost:11434",
  "codeReview.ollama.model": "llama3"
}
```

To use OpenAI, set:

1. Run `Set OpenAI API Key`.
2. Save the key in the secure VS Code prompt.
3. Configure the provider:

```json
{
  "codeReview.provider": "openai",
  "codeReview.openai.model": "gpt-4o-mini"
}
```
