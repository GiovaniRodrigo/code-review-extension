import * as vscode from 'vscode';
import type { CommandHandlerPort } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';

export class RevalidateSessionCommandHandler implements CommandHandlerPort {
  constructor(private readonly container: VSCodeContainerPort) {}

  async execute(): Promise<void> {
    try {
      const branch = await this.container.ide.getActiveBranch();
      const session = await this.container.repository.getSessionByBranch(branch);

      if (!session) {
        await this.container.notifications.warning('No review session found. Run Start Review first.');
        return;
      }

      const target = await vscode.window.showQuickPick([
        { label: 'Revalidate current file', id: 'file', detail: 'Fastest option. Re-runs AI review for the active editor.' },
        { label: 'Revalidate workspace', id: 'workspace', detail: 'Re-analyzes the workspace with Community limits.' }
      ], { title: 'Revalidate Review Session' });

      if (!target) return;

      if (target.id === 'workspace') {
        await vscode.commands.executeCommand('code-review.analyzeWorkspace');
        return;
      }

      const filePath = await this.container.ide.getActiveFilePath();
      const code = await this.container.ide.getActiveFileContent();
      if (!filePath || !code) {
        await this.container.notifications.warning('Open a code file before revalidating the current file.');
        return;
      }

      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Git Code Review: revalidating current file...',
        cancellable: true
      }, async (_progress, token) => {
        const controller = new AbortController();
        token.onCancellationRequested(() => controller.abort());

        await this.container.revalidateCodeReviewUseCase.execute({
          branch,
          filePath,
          code,
          signal: controller.signal
        });
      });

      await this.container.reviewPanelProvider.refresh();
      await this.container.dashboardProvider.refresh();
      await this.container.notifications.info('Review session revalidated. Approved findings were preserved when still matching.');
    } catch (error: any) {
      if (error?.name === 'AbortError') {
        await this.container.notifications.info('Revalidation canceled.');
        return;
      }
      await this.container.notifications.error(`Revalidation failed: ${error?.message || String(error)}`);
    }
  }
}
