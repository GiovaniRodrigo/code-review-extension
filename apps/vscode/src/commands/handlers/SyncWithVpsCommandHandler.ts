import * as vscode from 'vscode';
import type { CommandHandlerPort } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';

export class SyncWithVpsCommandHandler implements CommandHandlerPort {
  constructor(private container: VSCodeContainerPort) {}

  async execute(): Promise<void> {
    try {
      const branch = await this.container.ide.getActiveBranch();
      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `Syncing review session for ${branch}...`,
        cancellable: false
      }, async () => {
        await this.container.syncWithVpsUseCase.execute(branch);
      });
      await this.container.reviewPanelProvider.refresh();
      await this.container.dashboardProvider.refresh();
      await this.container.notifications.info('Sync completed successfully.');
    } catch (e: any) {
      await this.container.notifications.error(`Sync failed: ${e.message}`);
    }
  }
}
