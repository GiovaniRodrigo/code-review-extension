import { VSCodeContainer } from '../dependencies/buildContainer';

export const restoreSessionCommand = {
  id: 'code-review.restoreSession',
  async execute(container: VSCodeContainer) {
    const branch = await container.ide.getActiveBranch();
    await container.notifications.info(`Restoring session for ${branch}`);
  }
};
