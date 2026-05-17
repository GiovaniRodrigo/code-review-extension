import * as vscode from 'vscode';
import type { CommandHandlerPort } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';

export class AnalyzeWorkspaceCommandHandler implements CommandHandlerPort {
  constructor(private container: VSCodeContainerPort) {}

  async execute(): Promise<void> {
    try {
      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Analyzing workspace...',
        cancellable: true
      }, async (progress, token) => {
        await this.container.analyzeWorkspaceUseCase.execute({
          onProgress: (p) => progress.report({ increment: p.increment, message: p.message })
        } as any);
      });

      await this.container.reviewPanelProvider.refresh();
      await this.container.dashboardProvider.refresh();
      await this.container.notifications.info('Workspace analysis completed.');
    } catch (e: any) {
      await this.container.notifications.error(`Workspace analysis failed: ${e.message}`);
    }
  }
}
