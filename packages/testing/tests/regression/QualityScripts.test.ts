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
    expect(packageJson.scripts['arch:depcruise']).toBeTruthy();
    expect(packageJson.scripts['arch:madge']).toBeTruthy();
    expect(packageJson.scripts['audit:critical']).toBeTruthy();
  });
});
