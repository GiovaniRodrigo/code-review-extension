import * as vscode from 'vscode';
import { VSCodeContainer } from '../dependencies/buildContainer';
import { AnalyzePrUseCase } from '@code-review/core';

export const analyzePrCommand = {
  id: 'code-review.analyzePr',
  async execute(container: VSCodeContainer) {
    try {
      const prInfo = await container.ide.getPullRequestInfo?.();
      if (!prInfo) {
        const prNumber = await vscode.window.showInputBox({ prompt: 'Enter PR/MR number' });
        if (!prNumber) return;
        
        // We'll need more info if not auto-detected
        await container.notifications.warning('Auto-detection failed. Using default repo info.');
        return;
      }

      const useCase = new AnalyzePrUseCase(
        container.ide,
        (container as any).analysisService,
        (container as any).reviewService
      );

      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `Analyzing Pull Request #${prInfo.number}...`,
        cancellable: true
      }, async (progress, token) => {
        await useCase.execute({
          prNumber: prInfo.number,
          owner: prInfo.owner,
          repo: prInfo.repo,
          signal: token.isCancellationRequested ? new AbortController().signal : undefined
        });
      });

      await container.reviewPanelProvider.refresh();
      await container.notifications.info('Pull Request analysis completed.');
    } catch (e: any) {
      await container.notifications.error(`PR analysis failed: ${e.message}`);
    }
  }
};
