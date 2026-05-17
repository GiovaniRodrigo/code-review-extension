import * as vscode from 'vscode';
import type { CommandHandlerPort } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';

export class AnalyzePrCommandHandler implements CommandHandlerPort {
  constructor(private container: VSCodeContainerPort) {}

  async execute(prNumber?: number): Promise<void> {
    try {
      let targetPr = prNumber;
      if (!targetPr) {
        const input = await vscode.window.showInputBox({ prompt: 'Enter PR Number' });
        if (input) targetPr = parseInt(input);
      }

      if (!targetPr) return;

      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: `Analyzing PR #${targetPr}...`,
        cancellable: false
      }, async () => {
        await this.container.analyzePrUseCase.execute(targetPr!);
      });

      await this.container.reviewPanelProvider.refresh();
      await this.container.dashboardProvider.refresh();
      await this.container.notifications.info(`PR #${targetPr} analysis completed.`);
    } catch (e: any) {
      await this.container.notifications.error(`PR analysis failed: ${e.message}`);
    }
  }
}
