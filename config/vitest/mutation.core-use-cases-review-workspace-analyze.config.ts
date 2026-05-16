import path from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    pool: 'forks',
    poolOptions: { forks: { singleFork: true } },
    globals: true,
    environment: 'node',
    setupFiles: [
      path.resolve(__dirname, '../../apps/vscode/tests/setup/setupTests.ts')
    ],
    include: [
      'packages/core/tests/unit/application/use-cases/review/AnalyzeWorkspaceUseCase.test.ts'
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/out/**',
      '**/coverage/**'
    ]
  },
  resolve: {
    alias: {
      vscode: path.resolve(__dirname, '../../apps/vscode/tests/mocks/vscode.ts'),
      '@code-review/core': path.resolve(__dirname, '../../packages/core/src/index.ts'),
      '@code-review/domain': path.resolve(__dirname, '../../packages/domain/src/index.ts'),
      '@code-review/infra': path.resolve(__dirname, '../../packages/infra/src/index.ts'),
      '@apps': path.resolve(__dirname, '../../apps')
    }
  }
});
