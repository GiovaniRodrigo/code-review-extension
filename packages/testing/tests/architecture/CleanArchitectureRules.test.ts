import { describe, expect, it } from 'vitest';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

describe('Clean Architecture tooling', () => {
  it('possui configuração de dependency-cruiser', () => {
    expect(existsSync(resolve(__dirname, '../../../../.dependency-cruiser.cjs'))).toBe(true);
  });

  it('possui configuração de ESLint', () => {
    expect(existsSync(resolve(__dirname, '../../../../eslint.config.js'))).toBe(true);
  });
});
