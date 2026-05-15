import { VSCodeContainer } from '../dependencies/buildContainer';

export const clearSessionCommand = {
  id: 'code-review.clearSession',
  async execute(container: VSCodeContainer) {
    try {
      const branch = await container.ide.getActiveBranch();
      await container.deleteCodeReviewUseCase.execute(branch);
      await container.reviewPanelProvider.refresh();
      await container.notifications.info(`Review session cleared for branch ${branch}.`);
    } catch (e: any) {
      await container.notifications.error(`Failed to clear session: ${e.message}`);
    }
  }
};
