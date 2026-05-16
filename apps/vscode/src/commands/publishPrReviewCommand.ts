import * as vscode from 'vscode';
import { VSCodeContainer } from '../dependencies/buildContainer';
import { GitProviderFactory } from '@code-review/infra';
import { PublishPRReviewUseCase } from '@code-review/core';

export const publishPrReviewCommand = {
  id: 'code-review.publishPrReview',
  async execute(container: VSCodeContainer) {
    try {
      const prInfo = await container.ide.getPullRequestInfo?.();
      if (!prInfo) {
        await container.notifications.warning('Could not determine Pull Request information.');
        return;
      }

      const branch = await container.ide.getActiveBranch();
      const session = await container.getCodeReviewUseCase.execute(branch);

      if (!session) {
        await container.notifications.warning(`No review session found for branch ${branch}.`);
        return;
      }

      const config = vscode.workspace.getConfiguration('codeReview');
      let gitProvider;

      if (prInfo.provider === 'github') {
        const token = await container.context.secrets.get('github-token') || config.get<string>('github.token', '');
        if (!token) {
          throw new Error('GitHub token not found. Set it in settings or use the appropriate command.');
        }
        gitProvider = GitProviderFactory.createGitHub(token);
      } else {
        const token = await container.context.secrets.get('gitlab-token') || config.get<string>('gitlab.token', '');
        const baseUrl = config.get<string>('gitlab.baseUrl', 'https://gitlab.com');
        if (!token) {
          throw new Error('GitLab token not found. Set it in settings or use the appropriate command.');
        }
        gitProvider = GitProviderFactory.createGitLab({ baseUrl, token });
      }

      const publishUseCase = new PublishPRReviewUseCase(
        (container as any).repository, // We need to expose repository or use a service
        gitProvider as any
      );

      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `Publishing review to ${prInfo.provider === 'github' ? 'PR' : 'MR'} #${prInfo.number}...`,
        cancellable: false
      }, async () => {
        await publishUseCase.execute({
          sessionId: session.id,
          owner: prInfo.owner,
          repo: prInfo.repo,
          prNumber: prInfo.number
        });
      });

      await container.notifications.info('Review findings published successfully.');
    } catch (e: any) {
      await container.notifications.error(`Failed to publish review: ${e.message}`);
    }
  }
};
