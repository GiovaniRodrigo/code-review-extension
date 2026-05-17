import * as vscode from 'vscode';
import type { CommandHandlerPort } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';

export class IndexRepositoryRagCommandHandler implements CommandHandlerPort {
  constructor(private container: VSCodeContainerPort) {}

  async execute(): Promise<void> {
    try {
      const workspacePath = this.container.workspace.getWorkspacePath();
      if (!workspacePath) throw new Error('No workspace folder opened.');
      
      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Indexing repository for RAG...',
        cancellable: false
      }, async () => {
        await this.container.indexRepositoryRagUseCase.execute(workspacePath);
      });

      await this.container.ragStatusProvider.refresh();
      await this.container.dashboardProvider.refresh();
      await this.container.notifications.info('Repository indexed successfully.');
    } catch (e: any) {
      await this.container.notifications.error(`Failed to index: ${e.message}`);
    }
  }
}
