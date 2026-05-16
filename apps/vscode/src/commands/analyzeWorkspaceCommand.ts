import * as vscode from 'vscode';
import { VSCodeContainer } from '../dependencies/buildContainer';
import { AnalyzeWorkspaceUseCase } from '@code-review/core';

export const analyzeWorkspaceCommand = {
  id: 'code-review.analyzeWorkspace',
  async execute(container: VSCodeContainer) {
    const abortController = new AbortController();
    
    try {
      const branch = await container.ide.getActiveBranch();
      const useCase = new AnalyzeWorkspaceUseCase(
        container.workspace,
        (container as any).fileSystem || (container as any).ide, // VSCodeIdeAdapter usually implements both
        (container as any).analysisService,
        (container as any).reviewService
      );

      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Analyzing workspace...',
        cancellable: true
      }, async (progress, token) => {
        token.onCancellationRequested(() => abortController.abort());

        await useCase.execute({
          branch,
          signal: abortController.signal,
          onProgress: (p) => {
            progress.report({
                message: `Analyzing ${p.current}/${p.total}: ${p.file.split('/').pop()}`,
                increment: (1 / p.total) * 100
            });
          }
        });
      });

      await container.reviewPanelProvider.refresh();
      await container.notifications.info('Workspace analysis completed.');
    } catch (e: any) {
      if (e.name === 'AbortError') return;
      await container.notifications.error(`Workspace analysis failed: ${e.message}`);
    }
  }
};
