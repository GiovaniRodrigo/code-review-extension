import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as vscode from 'vscode';
import { PublishPRReviewUseCase } from '@code-review/core';
import { PublishPrReviewCommandHandler } from '../../../src/command-handlers/PublishPrReviewCommandHandler';
import { createDependencies } from '../../fixtures/dependencies.fixture';
import { GitProviderFactory } from '../../../src/services/GitProviderFactory';

describe('PublishPrReviewCommandHandler', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('publica review com sucesso quando há sessão ativa e remota', async () => {
    const dependencies = createDependencies();
    dependencies.reviewViewProvider.getCurrentSessionId.mockReturnValue('session-1');
    dependencies.reviewRepository.getSessionById = vi.fn().mockResolvedValue({
      id: 'session-1',
      findings: [],
      remote: {
        owner: 'owner',
        repo: 'repo',
        number: 123,
        provider: 'github'
      }
    });

    vi.spyOn(GitProviderFactory, 'create').mockResolvedValue({} as any);
    const publishSpy = vi.spyOn(PublishPRReviewUseCase.prototype, 'execute').mockResolvedValueOnce(undefined);

    await new PublishPrReviewCommandHandler(dependencies).execute();

    expect(dependencies.reviewViewProvider.setLoading).toHaveBeenCalledWith('Publicando comentários...');
    expect(publishSpy).toHaveBeenCalledWith({
      sessionId: 'session-1',
      owner: 'owner',
      repo: 'repo',
      prNumber: 123
    });
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('Review publicado com sucesso no github!');
  });

  it('exibe erro quando não há sessão ativa', async () => {
    const dependencies = createDependencies();
    dependencies.reviewViewProvider.getCurrentSessionId.mockReturnValue(undefined);

    await new PublishPrReviewCommandHandler(dependencies).execute();

    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('Nenhuma sessão de revisão ativa encontrada.');
  });
});
