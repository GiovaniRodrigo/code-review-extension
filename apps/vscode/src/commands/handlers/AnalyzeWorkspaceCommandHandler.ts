import * as vscode from 'vscode';
import type { CommandHandlerPort } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';

export class AnalyzeWorkspaceCommandHandler implements CommandHandlerPort {
  constructor(private container: VSCodeContainerPort) {}

  async execute(): Promise<void> {
    const abortController = new AbortController();

    try {
      const useCase = this.container.analyzeWorkspaceUseCase;
      if (!useCase || typeof useCase.execute !== 'function') {
        throw new Error('Workspace analyzer is not registered. Reinstall the extension and reload VS Code.');
      }

      const branch = await this.container.ide.getActiveBranch();
      const normalizedBranch = branch || 'workspace';

      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Analyzing workspace...',
        cancellable: true
      }, async (progress, token) => {
        token.onCancellationRequested(() => abortController.abort());

        await useCase.execute({
          branch: normalizedBranch,
          signal: abortController.signal,
          onProgress: (p: { current: number; total: number; file: string }) => {
            const total = Math.max(p.total || 1, 1);
            const fileName = (p.file || '').split(/[\/]/).pop() || p.file || 'file';

            progress.report({
              increment: 100 / total,
              message: `Analyzing ${p.current}/${p.total}: ${fileName}`
            });
          }
        });
      });

      if (abortController.signal.aborted) {
        await this.container.notifications.info('Workspace analysis canceled.');
        return;
      }

      await this.container.reviewPanelProvider.refresh();
      await this.container.dashboardProvider.refresh();
      await this.container.notifications.info('Workspace analysis completed.');
    } catch (e: any) {
      if (e?.name === 'AbortError' || abortController.signal.aborted) {
        await this.container.notifications.info('Workspace analysis canceled.');
        return;
      }

      await this.container.notifications.error(`Workspace analysis failed: ${e?.message || String(e)}`);
    }
  }
}
