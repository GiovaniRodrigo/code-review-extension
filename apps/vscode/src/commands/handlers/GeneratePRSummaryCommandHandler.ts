import * as vscode from 'vscode';
import type { CommandHandlerPort } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';

export class GeneratePRSummaryCommandHandler implements CommandHandlerPort {
  constructor(private container: VSCodeContainerPort) {}

  async execute(): Promise<void> {
    try {
      const summary = await this.container.generatePRSummaryUseCase.execute();
      const doc = await vscode.workspace.openTextDocument({ content: summary, language: 'markdown' });
      await vscode.window.showTextDocument(doc);
    } catch (e: any) {
      await this.container.notifications.error(`Failed to generate summary: ${e.message}`);
    }
  }
}
