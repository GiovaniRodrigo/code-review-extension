import type { CommandHandlerPort } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';

export class ClearSessionCommandHandler implements CommandHandlerPort {
  constructor(private container: VSCodeContainerPort) {}
  async execute(): Promise<void> {
    try { const branch = await this.container.ide.getActiveBranch(); const session = await this.container.repository.getSessionByBranch(branch); if (!session) { await this.container.notifications.info(`No review session found for ${branch}.`); return; } await this.container.deleteCodeReviewUseCase.execute(session.id); await this.container.ide.clearDiagnostics(); await this.container.reviewPanelProvider.refresh(); await this.container.dashboardProvider.refresh(); await this.container.notifications.info(`Session for ${branch} cleared.`); }
    catch (e: any) { await this.container.notifications.error(`Failed to clear session: ${e?.message || String(e)}`); }
  }
}
