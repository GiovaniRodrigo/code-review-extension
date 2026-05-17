import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({

  plugins: [react()],

  test: {

    pool: 'forks',

    poolOptions: {
      forks: {
        singleFork: true
      }
    },

    globals: true,

    environment: 'node',

    setupFiles: [
      path.resolve(
        __dirname,
        'tests/setup/setupTests.ts'
      )
    ],

    include: [
      'packages/**/*.spec.ts',
      'packages/**/*.test.ts',
      'packages/**/*.test.tsx',
      'apps/vscode/tests/**/*.test.ts',
      'apps/vscode/tests/**/*.test.js',
      'tests/**/*.test.ts',
      'tests/**/*.test.js'
    ],

    exclude: [

      /*
      |--------------------------------------------------------------------------
      | E2E
      |--------------------------------------------------------------------------
      */

      'apps/vscode/tests/e2e/**',

      /*
      |--------------------------------------------------------------------------
      | Dependencies
      |--------------------------------------------------------------------------
      */

      'node_modules/**',
      '**/node_modules/**',

      /*
      |--------------------------------------------------------------------------
      | Build artifacts
      |--------------------------------------------------------------------------
      */

      'dist/**',
      '**/dist/**',

      'build/**',
      '**/build/**',

      'out/**',
      '**/out/**',

      /*
      |--------------------------------------------------------------------------
      | Coverage
      |--------------------------------------------------------------------------
      */

      'coverage/**',
      '**/coverage/**',

      /*
      |--------------------------------------------------------------------------
      | VSCode runtime
      |--------------------------------------------------------------------------
      */

      '.vscode-test/**',
      '**/.vscode-test/**',

      /*
      |--------------------------------------------------------------------------
      | Passive architecture files
      |--------------------------------------------------------------------------
      */

      '**/*.d.ts',

      '**/index.ts',

      '**/dto/**',

      '**/contracts/**',

      '**/ports/**',

      '**/types/**',

      '**/mocks/**',

      '**/fixtures/**'
    ],

    /*
    |--------------------------------------------------------------------------
    | Coverage
    |--------------------------------------------------------------------------
    */

    coverage: {
      enabled: false,
    },

    /*
    |--------------------------------------------------------------------------
    | Reporters
    |--------------------------------------------------------------------------
    */

    reporters: [
      'default',
      'html'
    ],

    outputFile: {
      html: './coverage/tests.html'
    }
  },

  resolve: {

    alias: {

      vscode: path.resolve(
        __dirname,
        'tests/mocks/vscode.ts'
      ),

      '@code-review/core': path.resolve(
        __dirname,
        'packages/core/src/index.ts'
      ),

      '@code-review/domain': path.resolve(
        __dirname,
        'packages/domain/src/index.ts'
      ),

      '@code-review/infra': path.resolve(
        __dirname,
        'packages/infra/src/index.ts'
      ),

      '@code-review/ui': path.resolve(
        __dirname,
        'packages/ui/src/index.ts'
      ),

      '@apps': path.resolve(
        __dirname,
        'apps'
      )
    }
  }
});