import baseConfig from './vitest.config';
import { mergeConfig } from 'vitest/config';

const coverageConfig = mergeConfig(baseConfig, {
  test: {
    coverage: {
      provider: 'v8',
      enabled: true,
      all: true,

      include: [
        'packages/{core,domain,infra,testing}/src/**/*.ts',
        'apps/vscode/src/**/*.ts'
      ],

      exclude: [
        '.stryker-tmp/**',
        '**/.stryker-tmp/**',
        '**/.stryker-tmp/**/*',

        'coverage/**',
        '**/coverage/**',
        'dist/**',
        '**/dist/**',
        'build/**',
        '**/build/**',
        '.vscode-test/**',
        '**/.vscode-test/**',
        'mutation-report/**',
        '**/mutation-report/**',

        '**/*.d.ts',
        '**/*.config.*',
        '**/index.ts',
        '**/tests/**',
        '**/mocks/**',
        '**/fixtures/**',
        '**/generated/**',
        '**/bootstrap/**',
        '**/runE2E.*',
        '**/runTest.*',
        '**/runRuntimeDiagnostics.*'
      ],
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
