import * as vscode from 'vscode';
import type { CommandHandlerPort } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';

export class ApproveFindingCommandHandler implements CommandHandlerPort {
  constructor(private container: VSCodeContainerPort) {}

  async execute(sessionId: any, findingId: any): Promise<void> {
    try {
      await this.container.approveFindingUseCase.execute(sessionId, findingId);
      await this.container.reviewPanelProvider.refresh();
      await this.container.dashboardProvider.refresh();
      await this.container.notifications.info('Finding approved and diagnostics updated.');
    } catch (e: any) {
      await this.container.notifications.error(`Failed to approve: ${e.message}`);
    }
  }
}
