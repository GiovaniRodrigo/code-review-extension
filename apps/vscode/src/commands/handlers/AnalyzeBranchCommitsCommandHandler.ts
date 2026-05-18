import * as vscode from 'vscode';
import type { CommandHandlerPort } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';
import { resolveGitBaseBranch } from '../resolveGitBaseBranch';

export class AnalyzeBranchCommitsCommandHandler implements CommandHandlerPort {
  constructor(private container: VSCodeContainerPort) {}

  async execute(baseBranch?: unknown): Promise<void> {
    const config = vscode.workspace.getConfiguration('codeReview');
    const configuredBaseBranch = config.get<string>('git.baseBranch', '');
    const currentBranch = await this.container.ide.getActiveBranch();

    const resolvedBaseBranch = await resolveGitBaseBranch({
      explicitBaseBranch: baseBranch,
      configuredBaseBranch,
      workspacePath: this.container.workspace.getWorkspacePath?.(),
      currentBranch,
      askWhenMissing: true
    });

    if (!resolvedBaseBranch) {
      const action = await vscode.window.showWarningMessage(
        'Git Code Review could not detect a base branch. Configure a base branch or run workspace analysis instead.',
        'Analyze Workspace',
        'Open Settings'
      );

      if (action === 'Analyze Workspace') {
        await vscode.commands.executeCommand('code-review.analyzeWorkspace');
      }

      if (action === 'Open Settings') {
        await vscode.commands.executeCommand('workbench.action.openSettings', 'codeReview.git.baseBranch');
      }
      return;
    }

    try {
      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `Analyzing branch changes from ${resolvedBaseBranch}...`,
        cancellable: true
      }, async (progress, token) => {
        const controller = new AbortController();

        token.onCancellationRequested(() => controller.abort());

        await this.container.analyzeBranchCommitsUseCase.execute({
          baseBranch: resolvedBaseBranch,
          signal: controller.signal,
          onProgress: (message: string) => progress.report({ message })
        });
      });

      await this.container.reviewPanelProvider.refresh();
      await this.container.dashboardProvider.refresh();
      await this.container.notifications.info(`Branch analysis completed against ${resolvedBaseBranch}.`);
    } catch (e: any) {
      if (e?.name === 'AbortError') {
        await this.container.notifications.warning('Branch analysis canceled.');
        return;
      }

      const message = e?.message || String(e);
      if (message.includes('No changes found')) {
        await this.container.notifications.info(message);
        return;
      }

      await this.container.notifications.error(`Branch analysis failed: ${message}`);
    }
  }
}
