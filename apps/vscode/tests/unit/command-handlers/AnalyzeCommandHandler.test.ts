import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as vscode from 'vscode';
import { AnalyzeCodeUseCase } from '@code-review/core';
import { AnalyzeCommandHandler } from '../../../src/command-handlers/AnalyzeCommandHandler';
import { createDependencies } from '../../fixtures/dependencies.fixture';

describe('AnalyzeCommandHandler', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('executa análise, atualiza findings e informa sucesso', async () => {
    const dependencies = createDependencies();

    vi.spyOn(AnalyzeCodeUseCase.prototype, 'execute').mockResolvedValueOnce({
      id: 'session-1',
      branch: 'main',
      findings: [{ id: 'finding-1' }],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    } as any);

    await new AnalyzeCommandHandler(dependencies).execute();

    expect(dependencies.reviewViewProvider.setLoading).toHaveBeenCalled();
    expect(dependencies.reviewViewProvider.updateFindings).toHaveBeenCalledWith('session-1', [{ id: 'finding-1' }]);
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Review completed: 1 findings found.');
  });

  it('marca a view como erro quando a análise falha', async () => {
    const dependencies = createDependencies();

    vi.spyOn(AnalyzeCodeUseCase.prototype, 'execute').mockRejectedValueOnce(new Error('AI unavailable'));

    await new AnalyzeCommandHandler(dependencies).execute();

    expect(dependencies.reviewViewProvider.setError).toHaveBeenCalledWith('Error analyzing code: AI unavailable');
    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('Error analyzing code: AI unavailable');
  });
});
