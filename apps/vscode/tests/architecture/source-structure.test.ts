import { describe, it, expect } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const root = path.resolve(__dirname, '../../');

function exists(relativePath: string) {
  return fs.existsSync(path.join(root, relativePath));
}

describe('source structure', () => {
  it('mantém arquivos nas pastas esperadas pelos imports da nova arquitetura', () => {
    expect(exists('src/ui')).toBe(true);
    expect(exists('src/adapters')).toBe(true);
    expect(exists('src/bootstrap')).toBe(true);
    expect(exists('src/commands')).toBe(true);
    expect(exists('src/providers')).toBe(true);
  });
});
