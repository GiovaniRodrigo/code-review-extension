import * as vscode from 'vscode';
import type { CommandHandlerPort } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';
import { resolveGitBaseBranch } from '../resolveGitBaseBranch';

export class GeneratePRSummaryCommandHandler implements CommandHandlerPort {
  constructor(private container: VSCodeContainerPort) {}

  async execute(): Promise<void> {
    try {
      if (!this.container.generatePRSummaryUseCase || typeof this.container.generatePRSummaryUseCase.execute !== 'function') {
        throw new Error('PR summary generator is not registered. Reinstall the extension and reload VS Code.');
      }

      const branch = await this.container.ide.getActiveBranch();
      const config = vscode.workspace.getConfiguration('codeReview');
      const baseBranch = await resolveGitBaseBranch({
        configuredBaseBranch: config.get<string>('git.baseBranch', ''),
        workspacePath: this.container.workspace.getWorkspacePath?.(),
        currentBranch: branch,
        askWhenMissing: true
      });

      if (!baseBranch) {
        const action = await vscode.window.showWarningMessage(
          'Git Code Review could not detect a base branch for PR summary generation.',
          'Open Settings'
        );
        if (action === 'Open Settings') {
          await vscode.commands.executeCommand('workbench.action.openSettings', 'codeReview.git.baseBranch');
        }
        return;
      }

      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `Generating pull request summary against ${baseBranch}...`,
        cancellable: false
      }, async () => {
        const result = await this.container.generatePRSummaryUseCase.execute(branch, baseBranch);
        const doc = await vscode.workspace.openTextDocument({ content: result.markdown, language: 'markdown' });
        await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
      });

      await this.container.notifications.info('PR summary generated.');
    } catch (e: any) {
      const message = e?.message || String(e);
      if (message.includes('No changes found')) {
        await this.container.notifications.info(message);
        return;
      }
      await this.container.notifications.error(`Failed to generate PR summary: ${message}`);
    }
  }
}
