import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

describe('quality scripts regression', () => {
  it('mantém scripts obrigatórios no package.json', () => {
    const packageJson = JSON.parse(
      readFileSync(resolve(__dirname, '../../../../package.json'), 'utf8')
    );

    expect(packageJson.scripts['test:unit']).toBeTruthy();
    expect(packageJson.scripts['test:integration']).toBeTruthy();
    expect(packageJson.scripts['test:coverage']).toBeTruthy();
    expect(packageJson.scripts['test:mutation:performance']).toBeTruthy();
    expect(packageJson.scripts['test:mutation:performance:dry-run']).toBeTruthy();
    expect(packageJson.scripts['test:mutation:performance:core:dry-run']).toBeTruthy();
    expect(packageJson.scripts['test:mutation:core:use-cases:ai']).toBeTruthy();
    expect(packageJson.scripts['test:mutation:core:use-cases:ast']).toBeTruthy();
    expect(packageJson.scripts['test:mutation:core:use-cases:rag']).toBeTruthy();
    expect(packageJson.scripts['test:mutation:core:use-cases:review']).toBeTruthy();
    expect(packageJson.scripts['test:mutation:core:use-cases:review:analysis']).toBeTruthy();
    expect(packageJson.scripts['test:mutation:core:use-cases:review:pr']).toBeTruthy();
    expect(packageJson.scripts['test:mutation:core:use-cases:review:workspace']).toBeTruthy();
    expect(packageJson.scripts['test:mutation:core:use-cases:review:workspace:analyze']).toBeTruthy();
    expect(packageJson.scripts['test:mutation:core:use-cases:review:workspace:revalidate']).toBeTruthy();
    expect(packageJson.scripts['test:mutation:core:use-cases:review:reporting']).toBeTruthy();
    expect(packageJson.scripts['test:mutation:core:use-cases:review:session']).toBeTruthy();
    expect(packageJson.scripts['test:mutation:core:use-cases:sync-vps']).toBeTruthy();
    expect(packageJson.scripts['test:mutation:performance:core:dry-run:review:analysis']).toBeTruthy();
    expect(packageJson.scripts['test:mutation:performance:core:dry-run:review:pr']).toBeTruthy();
    expect(packageJson.scripts['test:mutation:performance:core:dry-run:review:workspace']).toBeTruthy();
    expect(packageJson.scripts['test:mutation:performance:core:dry-run:review:workspace:analyze']).toBeTruthy();
    expect(packageJson.scripts['test:mutation:performance:core:dry-run:review:workspace:revalidate']).toBeTruthy();
    expect(packageJson.scripts['test:mutation:performance:core:dry-run:review:workspace:revalidate:basic']).toBeTruthy();
    expect(packageJson.scripts['test:mutation:performance:core:dry-run:review:workspace:revalidate:incremental']).toBeTruthy();
    expect(packageJson.scripts['test:mutation:performance:core:dry-run:review:reporting']).toBeTruthy();
    expect(packageJson.scripts['test:mutation:performance:core:dry-run:review:session']).toBeTruthy();
    expect(packageJson.scripts['arch:depcruise']).toBeTruthy();
    expect(packageJson.scripts['arch:madge']).toBeTruthy();
    expect(packageJson.scripts['audit:critical']).toBeTruthy();
  });
});
