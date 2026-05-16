import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    pool: 'forks',
    poolOptions: { forks: { singleFork: true } },
    globals: true,
    environment: 'node',
    include: [
      'packages/analyzers/tests/unit/**/*.test.ts',
      'packages/analyzers/tests/unit/**/*.spec.ts',
      'packages/analyzers/tests/integration/**/*.test.ts',
      'packages/analyzers/tests/integration/**/*.spec.ts'
    ],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/out/**',
      '**/coverage/**'
    ]
  }
});
