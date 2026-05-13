import { defineConfig } from 'vitest/config';
import path from 'node:path';

const root = path.resolve(__dirname, '../..');

export default defineConfig({
  test: {
    pool: 'forks',
    poolOptions: { forks: { singleFork: true } },
    globals: true,
    environment: 'node',
    setupFiles: [path.resolve(__dirname, 'tests/setup/setupTests.ts')],
    include: ['tests/**/*.test.ts'],
    exclude: ['tests/e2e/**', 'node_modules/**', 'dist/**', 'out/**', 'coverage/**']
  },
  resolve: {
    alias: {
      vscode: path.resolve(__dirname, 'tests/mocks/vscode.ts'),
      '@code-review/core': path.resolve(root, 'packages/core/src/index.ts'),
      '@code-review/domain': path.resolve(root, 'packages/domain/src/index.ts'),
      '@code-review/infra': path.resolve(root, 'packages/infra/src/index.ts')
    }
  }
});
