import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup/setupTests.ts'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/out/**', '**/tests/e2e/**', '**/.{idea,git,cache,output,temp}/**']
  },

  resolve: {
    alias: {
      'vscode': path.resolve(__dirname, './tests/mocks/vscode.ts'),
      '@code-review/core': path.resolve(
        __dirname,
        '../../packages/core/src/index.ts'
      ),

      '@code-review/domain': path.resolve(
        __dirname,
        '../../packages/domain/src/index.ts'
      ),

      '@code-review/infra': path.resolve(
        __dirname,
        '../../packages/infra/src/index.ts'
      ),

      '@code-review/ui': path.resolve(
        __dirname,
        '../../packages/ui/src/index.ts'
      )
    }
  }
});
