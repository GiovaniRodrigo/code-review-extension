import { describe, expect, it } from 'vitest';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

type StrykerConfig = {
  coverageAnalysis?: string;
  mutate?: string[];
  ignorePatterns?: string[];
  reporters?: string[];
  vitest?: {
    configFile?: string;
  };
  htmlReporter?: {
    fileName?: string;
  };
};

const rootDir = resolve(__dirname, '../../../../');
const strykerConfigDir = resolve(rootDir, 'config/stryker');

const readJson = <T>(filePath: string): T =>
  JSON.parse(readFileSync(filePath, 'utf8')) as T;

const performanceIgnorePatterns = [
  '.stryker-tmp/**',
  'coverage/**',
  'mutation-report/**',
  'dist/**',
  'build/**',
  '.vscode-test/**',
  'apps/vscode/.vscode-test/**',
  'apps/vscode/dist/**',
  'apps/vscode/out/**',
  'apps/vscode/**/*.vsix',
  'docs/**'
];

const expectedPositiveMutatePatterns: Record<string, number> = {
  'core-use-cases-review-analysis': 8,
  'core-use-cases-review-pr': 3,
  'core-use-cases-review-reporting': 3,
  'core-use-cases-review-session': 7,
  'core-use-cases-review-workspace': 2,
  'core-use-cases-review-workspace-analyze': 1,
  'core-use-cases-review-workspace-revalidate': 1,
  'core-use-cases-review-workspace-revalidate-basic': 1,
  'core-use-cases-review-workspace-revalidate-incremental': 1,
  'core-use-cases-sync-vps': 2
};

describe('stryker performance regression', () => {
  const configFiles = readdirSync(strykerConfigDir)
    .filter(fileName => fileName.endsWith('.json'))
    .sort();

  it('mantém suites de mutation segmentadas por configuração', () => {
    expect(configFiles.length).toBeGreaterThan(1);

    for (const fileName of configFiles) {
      const config = readJson<StrykerConfig>(resolve(strykerConfigDir, fileName));
      const configName = fileName.replace('.json', '');

      expect(config.vitest?.configFile).toBe(`config/vitest/mutation.${configName}.config.ts`);
      expect(config.htmlReporter?.fileName).toBe(`mutation-report/${configName}/index.html`);
      expect(config.mutate?.filter(pattern => !pattern.startsWith('!'))).toHaveLength(
        expectedPositiveMutatePatterns[configName] ?? 1
      );
    }
  });

  it('evita trabalho extra nas execuções do Stryker', () => {
    for (const fileName of configFiles) {
      const config = readJson<StrykerConfig>(resolve(strykerConfigDir, fileName));

      expect(config.coverageAnalysis).toBe('off');
      expect(config.reporters).toEqual(['clear-text', 'html']);
      expect(config.mutate).toEqual(
        expect.arrayContaining([
          '!**/*.test.ts',
          '!**/*.spec.ts',
          '!**/tests/**'
        ])
      );
      expect(config.ignorePatterns).toEqual(
        expect.arrayContaining(performanceIgnorePatterns)
      );
    }
  });

  it('expõe profiler de DryRunExecute para Stryker core com limites de consumo', () => {
    const packageJson = readJson<{ scripts: Record<string, string> }>(resolve(rootDir, 'package.json'));
    const profilerPath = resolve(rootDir, 'scripts/stryker-dry-run-performance.mjs');
    const profilerSource = readFileSync(profilerPath, 'utf8');

    expect(existsSync(profilerPath)).toBe(true);
    expect(packageJson.scripts['test:mutation:performance:dry-run']).toContain('test:mutation:performance:core:dry-run');
    expect(packageJson.scripts['test:mutation:core:use-cases']).toContain('test:mutation:core:use-cases:review');
    expect(packageJson.scripts['test:mutation:performance:core:dry-run']).toContain('test:mutation:performance:core:dry-run:review:workspace');
    expect(packageJson.scripts['test:mutation:performance:core:dry-run:review:pr']).toContain('config/stryker/core-use-cases-review-pr.json');
    expect(packageJson.scripts['test:mutation:performance:core:dry-run:review:workspace']).toContain('test:mutation:performance:core:dry-run:review:workspace:analyze');
    expect(packageJson.scripts['test:mutation:performance:core:dry-run:review:workspace:analyze']).toContain('config/stryker/core-use-cases-review-workspace-analyze.json');
    expect(packageJson.scripts['test:mutation:performance:core:dry-run:review:workspace:revalidate']).toContain('test:mutation:performance:core:dry-run:review:workspace:revalidate:basic');
    expect(packageJson.scripts['test:mutation:performance:core:dry-run:review:workspace:revalidate:basic']).toContain('config/stryker/core-use-cases-review-workspace-revalidate-basic.json');
    expect(packageJson.scripts['test:mutation:performance:core:dry-run:review:workspace:revalidate:incremental']).toContain('config/stryker/core-use-cases-review-workspace-revalidate-incremental.json');
    expect(packageJson.scripts['test:mutation:performance:core:dry-run:review:reporting']).toContain('config/stryker/core-use-cases-review-reporting.json');
    expect(packageJson.scripts['test:mutation:performance:core:dry-run:review:session']).toContain('config/stryker/core-use-cases-review-session.json');
    expect(profilerSource).toContain("config/stryker/core-use-cases-review-pr.json");
    expect(profilerSource).toContain('--dryRunOnly');
    expect(profilerSource).toContain('--concurrency');
    expect(profilerSource).toContain('--testRunnerNodeArgs');
    expect(profilerSource).toContain('--max-old-space-size=1024');
    expect(profilerSource).toContain('STRYKER_PERF_TIMEOUT_MS');
    expect(profilerSource).toContain('STRYKER_PERF_MAX_RSS_MB');
    expect(profilerSource).toContain('STRYKER_PERF_MAX_CPU_PERCENT');
    expect(profilerSource).toContain('STRYKER_PERF_BUDGET_CONSECUTIVE_SAMPLES');
    expect(profilerSource).toContain('budgetViolations');
    expect(profilerSource).toContain('stoppedForBudget');
    expect(profilerSource).toContain('peakProcesses');
  });
});
