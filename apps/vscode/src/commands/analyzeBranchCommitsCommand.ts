import * as vscode from 'vscode';
import { VSCodeContainer } from '../dependencies/buildContainer';
import { AnalyzeBranchCommitsUseCase } from '@code-review/core';

export const analyzeBranchCommitsCommand = {
  id: 'code-review.analyzeBranchCommits',
  async execute(container: VSCodeContainer) {
    const abortController = new AbortController();
    
    try {
      const config = vscode.workspace.getConfiguration('codeReview');
      const baseBranch = config.get<string>('git.baseBranch', 'main');

      const useCase = new AnalyzeBranchCommitsUseCase(
        container.ide,
        (container as any).analysisService,
        (container as any).reviewService
      );

      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `Analyzing changes since ${baseBranch}...`,
        cancellable: true
      }, async (progress, token) => {
        token.onCancellationRequested(() => abortController.abort());

        await useCase.execute({
          baseBranch,
          signal: abortController.signal,
          onProgress: (msg) => {
            progress.report({ message: msg });
          }
        });
      });

      await container.reviewPanelProvider.refresh();
      await container.notifications.info('Branch analysis completed.');
    } catch (e: any) {
      if (e.name === 'AbortError') return;
      await container.notifications.error(`Branch analysis failed: ${e.message}`);
    }
  }
};
