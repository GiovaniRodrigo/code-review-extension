import type { CommandHandlerPort } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';

export class PublishPrReviewCommandHandler implements CommandHandlerPort {
  constructor(private container: VSCodeContainerPort) {}
  async execute(): Promise<void> {
    try {
      if (!this.container.publishCodeReviewUseCase || typeof this.container.publishCodeReviewUseCase.execute !== 'function') throw new Error('PR/MR publisher is not registered. Reinstall the extension and reload VS Code.');
      const branch = await this.container.ide.getActiveBranch(); const session = await this.container.repository.getSessionByBranch(branch);
      if (!session) { await this.container.notifications.warning(`No review session found for ${branch}. Run an analysis before publishing.`); return; }
      const approvedCount = session.findings.filter((finding: any) => finding.status === 'approved').length;
      if (approvedCount === 0) { await this.container.notifications.warning('No approved findings to publish. Approve at least one finding first.'); return; }
      await this.container.publishCodeReviewUseCase.execute(session); await this.container.notifications.info(`Published ${approvedCount} approved finding(s).`);
    } catch (e: any) { await this.container.notifications.error(`Failed to publish review: ${e?.message || String(e)}`); }
  }
}
