# Changelog

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
