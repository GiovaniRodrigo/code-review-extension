import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(__dirname, '../..');

function exists(relativePath: string) {
  return fs.existsSync(path.join(root, relativePath));
}

describe('source structure', () => {
  it('mantém arquivos nas pastas esperadas pelos imports da arquitetura', () => {
    expect(exists('src/views/ReviewViewProvider.ts')).toBe(true);
    expect(exists('src/adapters/VSCodeAdapter.ts')).toBe(true);
    expect(exists('src/providers/createAIProvider.ts')).toBe(true);
    expect(exists('src/commands/SetOpenAIKeyCommand.ts')).toBe(true);
    expect(exists('src/command-handlers/ClearSessionCommandHandler.ts')).toBe(true);
    expect(exists('src/dependencies/createExtensionDependencies.ts')).toBe(true);
  });
});
