## Key Improvements

1. **Guided Configuration**  
   Implemented a new `code-review.setup` command that provides a step-by-step guided flow for configuring AI providers, setting API keys/tokens, and setting up RAG indexing.

2. **Configuration Sync Fix**  
   Added a configuration change listener in `registerEvents.ts`. The extension now dynamically updates its internal AI provider registry whenever settings are modified in VS Code, ensuring it always uses the latest user configuration without requiring a reload.

3. **Enhanced Command Palette**  
   Added `code-review.setup` to `package.json` for easy discovery.

## QA Implementation: New Tests

Added 4 new integration test suites in `apps/vscode/tests/integration/` to cover critical areas:

- `configuration.test.ts`  
  Validates extension activation, default settings, and reaction to configuration updates.

- `ai-providers.test.ts`  
  Verifies that `MockAIProvider` functions correctly, handles large inputs, and reports health.

- `persistence.test.ts`  
  Ensures review sessions are correctly saved, retrieved by branch with the latest first, and deleted from local storage.

- `rag-indexer.test.ts`  
  Tests the RAG indexing logic, verifying that it correctly processes files, respects folder exclusion rules such as `node_modules`, and clears indices as expected.

## Infrastructure & Mocks

- Updated the VS Code mock to support `onDidChangeConfiguration`, which was missing and causing test failures.
- Stabilized the test suite by fixing import paths and ensuring compatibility with the monorepo structure.

## Test Result

All 60 tests are now passing, providing a solid foundation for a safe production release.

```bash
# To run the tests again:
cd apps/vscode && npm run test