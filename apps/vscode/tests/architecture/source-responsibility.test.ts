import { describe, expect, it } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(__dirname, '../..');

function read(relativePath: string) {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

describe('source responsibility', () => {
  it('createExtensionDependencies deve conter somente a composição das dependências da extensão', () => {
    const source = read('src/dependencies/createExtensionDependencies.ts');

    expect(source).toContain('export function createExtensionDependencies');
    expect(source).toContain('new VSCodeAdapter');
    expect(source).toContain('new FileReviewRepository');
    expect(source).toContain('new ContextEngine');
    expect(source).toContain('new ValidateFindingUseCase');
    expect(source).toContain('new ReviewViewProvider');
    expect(source).not.toContain('export class ExtensionBootstrap');
    expect(source).not.toContain('registerCommands(');
    expect(source).not.toContain('restoreCurrentBranchSession(');
  });

  it('ClearSessionCommandHandler deve conter somente a regra de execução do comando clear session', () => {
    const source = read('src/command-handlers/ClearSessionCommandHandler.ts');

    expect(source).toContain('export class ClearSessionCommandHandler');
    expect(source).toContain('implements ICommandHandler');
    expect(source).toContain('async execute()');
    expect(source).toContain('reviewViewProvider.clear');
    expect(source).not.toMatch(/export\s+class\s+ClearSessionCommand\b(?!Handler)/);
    expect(source).not.toContain('registerCommand(');
    expect(source).not.toMatch(/implements\s+ICommand\b(?!Handler)/);
  });
});
