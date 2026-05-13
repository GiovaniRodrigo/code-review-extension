import baseConfig from './vitest.config';
import { mergeConfig } from 'vitest/config';

export default mergeConfig(baseConfig, {
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary'],
      thresholds: {
        'packages/domain/**': { statements: 95, branches: 95, functions: 95, lines: 95 },
        'packages/core/**': { statements: 90, branches: 90, functions: 90, lines: 90 },
        'packages/application/**': { statements: 90, branches: 90, functions: 90, lines: 90 },
        'packages/infra/**': { statements: 80, branches: 80, functions: 80, lines: 80 }
      }
    }
  }
});
