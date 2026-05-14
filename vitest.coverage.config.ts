import baseConfig from './vitest.config';
import { mergeConfig } from 'vitest/config';

const coverageConfig = mergeConfig(baseConfig, {
  test: {
    coverage: {
      provider: 'v8',
      enabled: true,

      reporter: [
        'text',
        'json-summary',
        'html'
      ],

      reportsDirectory: './coverage',

      exclude: [
        '**/*.spec.ts',
        '**/*.test.ts',
        'apps/vscode/tests/**',

        '**/*.d.ts',
        '**/index.ts',
        '**/dto/**',
        '**/contracts/**',
        '**/ports/**',
        '**/types/**',

        '**/mocks/**',
        '**/fixtures/**',

        '**/dist/**',
        '**/build/**',
        '**/out/**',
        '**/coverage/**',
        '**/.vscode-test/**',
        '**/node_modules/**',
        '**/*.config.ts',
        '**/.dependency-cruiser.cjs',
        '**/extension.ts',

        '**/commands/ai/**',
        '**/commands/rag/**',
        '**/commands/review/**',
        '**/commands/vps/**',
      ]
    }
  }
});

coverageConfig.test!.coverage!.thresholds = {
  global: {
    statements: 50,
    branches: 70,
    functions: 53,
    lines: 50
  },

  'packages/domain/**': {
    statements: 87,
    branches: 75,
    functions: 60,
    lines: 87
  },

  'packages/core/**': {
    statements: 90,
    branches: 80,
    functions: 65,
    lines: 90
  },

  'packages/infra/**': {
    statements: 80,
    branches: 75,
    functions: 50,
    lines: 80
  }
};

export default coverageConfig;