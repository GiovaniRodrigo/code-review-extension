import { describe, expect, it, vi } from 'vitest';
import { ClearSessionCommandHandler } from '../../../src/command-handlers/ClearSessionCommandHandler';
import { createDependencies } from '../../fixtures/dependencies.fixture';
import { window } from 'vscode';

describe('ClearSessionCommandHandler', () => {
  it('limpa a sessão exibida na view para a branch atual', async () => {
    const dependencies = createDependencies();
    dependencies.vscodeAdapter.getActiveBranch.mockResolvedValue('feat/testes');

    const handler = new ClearSessionCommandHandler(dependencies);

    await handler.execute();

    expect(dependencies.reviewViewProvider.clear).toHaveBeenCalledWith(
      'Review session cleared for branch feat/testes.'
    );
    expect(window.showInformationMessage).toHaveBeenCalledWith(
      'Review session cleared for branch feat/testes.'
    );
  });

  it('exibe erro quando não consegue limpar a sessão', async () => {
    const dependencies = createDependencies();
    dependencies.vscodeAdapter.getActiveBranch.mockRejectedValue(new Error('branch error'));

    const handler = new ClearSessionCommandHandler(dependencies);

    await handler.execute();

    expect(dependencies.reviewViewProvider.setError).toHaveBeenCalledWith(
      'Could not clear review session: branch error'
    );
    expect(window.showErrorMessage).toHaveBeenCalledWith(
      'Could not clear review session: branch error'
    );
  });
});
