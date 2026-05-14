import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as vscode from 'vscode';
import { SyncRemotePRCommandHandler } from '../../../src/command-handlers/SyncRemotePRCommandHandler';
import { createDependencies } from '../../fixtures/dependencies.fixture';
import { PullRequestProviderFactory } from '../../../src/providers/PullRequestProviderFactory';

describe('SyncRemotePRCommandHandler', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('sincroniza com PR existente quando confirmado pelo usuário', async () => {
    const dependencies = createDependencies();
    dependencies.vscodeAdapter.getActiveBranch.mockResolvedValue('feat/test');
    
    vi.mocked(vscode.window.showQuickPick).mockResolvedValue({ value: 'github-api' } as any);

    const mockPR = {
      number: 42,
      title: 'Test PR',
      url: 'http://github.com/test/42',
      provider: 'github-api'
    };

    const mockProvider = {
      getPullRequestByBranch: vi.fn().mockResolvedValue(mockPR),
      configure: vi.fn()
    };

    vi.spyOn(PullRequestProviderFactory, 'create').mockReturnValue(mockProvider as any);
    vi.mocked(vscode.window.showInformationMessage).mockResolvedValue('Sincronizar' as any);
    
    dependencies.reviewRepository.getSessionByBranch.mockResolvedValue({
      id: 'session-123',
      branch: 'feat/test',
      findings: [],
      comments: []
    });

    await new SyncRemotePRCommandHandler(dependencies).execute();

    expect(dependencies.reviewViewProvider.setLoading).toHaveBeenCalled();
    expect(dependencies.reviewRepository.saveSession).toHaveBeenCalledWith(expect.objectContaining({
      remote: expect.objectContaining({
        number: 42,
        owner: 'owner',
        repo: 'repo'
      })
    }));
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith(expect.stringContaining('Sessão sincronizada com sucesso'));
  });

  it('exibe erro quando falha ao buscar PR', async () => {
    const dependencies = createDependencies();
    dependencies.vscodeAdapter.getActiveBranch.mockResolvedValue('feat/test');
    vi.mocked(vscode.window.showQuickPick).mockResolvedValue({ value: 'github-api' } as any);
    
    vi.spyOn(PullRequestProviderFactory, 'create').mockImplementation(() => {
        throw new Error('Provider error');
    });

    await new SyncRemotePRCommandHandler(dependencies).execute();

    expect(dependencies.reviewViewProvider.setError).toHaveBeenCalledWith('Falha na sincronização: Provider error');
    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('Falha na sincronização: Provider error');
  });
});
