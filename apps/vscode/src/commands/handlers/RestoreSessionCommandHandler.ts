import type { CommandHandlerPort } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';

export class RestoreSessionCommandHandler implements CommandHandlerPort {
  constructor(private container: VSCodeContainerPort) {}

  async execute(): Promise<void> {
    try {
      const branch = await this.container.ide.getActiveBranch();
      const session = await this.container.repository.getSessionByBranch(branch);
      if (session) {
        await this.container.reviewPanelProvider.refresh();
        await this.container.dashboardProvider.refresh();
        await this.container.notifications.info(`Session for ${branch} restored.`);
      } else {
        await this.container.notifications.info(`No existing session found for ${branch}.`);
      }
    } catch (e: any) {
      await this.container.notifications.error(`Failed to restore session: ${e.message}`);
    }
  }
}
