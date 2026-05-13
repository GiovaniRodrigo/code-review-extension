import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as vscode from 'vscode';
import { restoreCurrentBranchSession } from '../../../src/services/restoreCurrentBranchSession';
import { createDependencies } from '../../fixtures/dependencies.fixture';

describe('restoreCurrentBranchSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('restaura a sessão quando existe sessão para a branch atual', async () => {
    const dependencies = createDependencies();

    dependencies.reviewRepository.getSessionByBranch.mockResolvedValueOnce({
      id: 'session-main',
      findings: [{ id: 'finding-1' }]
    });

    await restoreCurrentBranchSession(
      dependencies.vscodeAdapter,
      dependencies.reviewRepository,
      dependencies.reviewViewProvider
    );

    expect(dependencies.vscodeAdapter.getActiveBranch).toHaveBeenCalled();
    expect(dependencies.reviewRepository.getSessionByBranch).toHaveBeenCalledWith('main');
    expect(dependencies.reviewViewProvider.updateFindings).toHaveBeenCalledWith('session-main', [{ id: 'finding-1' }]);
  });

  it('limpa a view quando não existe sessão para a branch atual', async () => {
    const dependencies = createDependencies();

    await restoreCurrentBranchSession(
      dependencies.vscodeAdapter,
      dependencies.reviewRepository,
      dependencies.reviewViewProvider
    );

    expect(dependencies.reviewViewProvider.clear)
      .toHaveBeenCalledWith('No review session found for branch main.');
  });

  it('mostra warning quando ocorre erro ao restaurar sessão', async () => {
    const dependencies = createDependencies();

    dependencies.vscodeAdapter.getActiveBranch
      .mockRejectedValueOnce(new Error('git unavailable'));

    await restoreCurrentBranchSession(
      dependencies.vscodeAdapter,
      dependencies.reviewRepository,
      dependencies.reviewViewProvider
    );

    expect(dependencies.reviewViewProvider.setError)
      .toHaveBeenCalledWith('Could not restore review session: git unavailable');

    expect(vscode.window.showWarningMessage)
      .toHaveBeenCalledWith('Could not restore review session: git unavailable');
  });
});