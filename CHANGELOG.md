# Changelog

All notable changes to this project will be documented in this file.

## [2.1.0] - 2026-05-15

### Added
- **Gemini AI Provider**: Support for Google Gemini (Flash/Pro) with secure API key storage.
- **Hardened AI Parsers**: Improved JSON extraction and validation for Ollama and Gemini responses.
- **Relative Path Support**: Enhanced file resolution in VS Code for complex project structures.

### Improved
- **Ollama Integration**: Optimized local analysis with larger context window and refined prompts.
- **AST Performance**: Implementation of file-type filtering in the TypeScript AST builder to reduce overhead.
- **Testing Infrastructure**: Hardened mutation testing configuration and increased test coverage for AI providers.

### Fixed
- Duplicate event registration in VS Code view providers.
- Absolute vs Relative path handling in IDE adapters.

## [2.0.0] - 2026-05-14 (Stable Release)

### Added
- **Workflow HITL (Human-in-the-Loop)**: Reviewers must approve findings before they appear as diagnostics in the editor.
- **Persistent Sessions**: Sessions are automatically saved and restored based on the current Git branch.
- **Multi-Provider AI**: Support for Mock, Ollama (local), and OpenAI (cloud) providers.
- **RAG (Retrieval Augmented Generation)**: Incremental repository indexing for contextual analysis.
- **Operational Sidebar**: A dedicated view to manage findings, with filtering by severity (Error, Warning, Info) and file grouping.
- **Secure Storage**: OpenAI API Keys are now stored using VS Code's native `SecretStorage`.
- **Incremental Indexing**: RAG now tracks file modification times to avoid redundant processing.
- **Analysis Resilience**: Implemented automatic retries, timeouts (30s), and manual/automatic task cancellation.
- **Interactive Features**: Focus finding in editor, Copy to clipboard, and Manual/Auto revalidation.
- **Zod Validation**: Robust schema validation for all AI responses to prevent crashes.
- **UI State Persistence**: Sidebar filters and section collapse states now persist across VS Code reloads.
- **Diagnostics Sync**: Smart synchronization between findings and editor underlines to eliminate orphan diagnostics.
- **Enhanced Hardening**: Protection against multiple event subscriptions and robust memory cleanup for all IDE listeners.

### Fixed
- Improved memory management with proper resource disposal.
- Fixed diagnostic collection leaks on branch switching.
- Standardized severity levels across different AI providers.

### Security
- Shifted sensitive credentials from plain storage to encrypted OS storage via VS Code API.
