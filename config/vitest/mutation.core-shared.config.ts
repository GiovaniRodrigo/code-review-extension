import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    pool: 'forks',
    poolOptions: { forks: { singleFork: true } },
    globals: true,
    environment: 'node',
    include: [
      'packages/core/tests/unit/shared/**/*.test.ts',
      'packages/core/tests/unit/shared/**/*.spec.ts',
      'packages/core/tests/unit/Result.test.ts',
      'packages/core/tests/unit/ApplicationError.test.ts'
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/out/**',
      '**/coverage/**'
    ]
  }
});
