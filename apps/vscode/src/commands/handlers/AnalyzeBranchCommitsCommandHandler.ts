import * as vscode from 'vscode';
import type { CommandHandlerPort } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';

export class AnalyzeBranchCommitsCommandHandler implements CommandHandlerPort {
  constructor(private container: VSCodeContainerPort) {}

  async execute(baseBranch: string = 'main'): Promise<void> {
    try {
      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `Analyzing commits from ${baseBranch}...`,
        cancellable: false
      }, async () => {
        await this.container.analyzeBranchCommitsUseCase.execute(baseBranch);
      });

      await this.container.reviewPanelProvider.refresh();
      await this.container.dashboardProvider.refresh();
      await this.container.notifications.info('Branch analysis completed.');
    } catch (e: any) {
      await this.container.notifications.error(`Branch analysis failed: ${e.message}`);
    }
  }
}
