import baseConfig from './vitest.config';
import { mergeConfig } from 'vitest/config';

const coverageConfig = mergeConfig(baseConfig, {
  test: {
    coverage: {
      provider: 'v8',
      enabled: true,

      include: [
        'packages/core/src/**/*.ts',
        'packages/domain/src/**/*.ts',
        'packages/infra/src/**/*.ts',
        'packages/testing/src/**/*.ts',
        'apps/vscode/src/**/*.ts'
      ],

      exclude: [
        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',
        '**/dist/**',
        '**/build/**',
        '**/coverage/**',
        '**/.stryker-tmp/**',
        '**/.vscode-test/**',
        '**/mutation-report/**',
        '**/tests/**',
        '**/mocks/**',
        '**/fixtures/**',
        '**/generated/**',
        '**/bootstrap/**'
      ],

      thresholds: {
        lines: 80,
        functions: 80,
        branches: 70,
        statements: 80
      }
    }
  }
});

coverageConfig.test!.coverage!.thresholds = {
  global: {
    statements: 75,
    branches: 75,
    functions: 70,
    lines: 75
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
