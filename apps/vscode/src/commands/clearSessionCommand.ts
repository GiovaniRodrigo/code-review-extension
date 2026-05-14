import { VSCodeContainer } from '../dependencies/buildContainer';

export const clearSessionCommand = {
  id: 'code-review.clearSession',
  async execute(container: VSCodeContainer) {
    const branch = await container.ide.getActiveBranch();
    container.reviewPanelProvider.clear(`Review session cleared for branch ${branch}.`);
  }
};
