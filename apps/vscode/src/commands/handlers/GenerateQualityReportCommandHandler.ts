import * as vscode from 'vscode';
import type { CommandHandlerPort } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';

export class GenerateQualityReportCommandHandler implements CommandHandlerPort {
  constructor(private container: VSCodeContainerPort) {}

  async execute(): Promise<void> {
    try {
      const report = await this.container.generateQualityReportUseCase.execute();
      const doc = await vscode.workspace.openTextDocument({ content: report, language: 'markdown' });
      await vscode.window.showTextDocument(doc);
    } catch (e: any) {
      await this.container.notifications.error(`Failed to generate report: ${e.message}`);
    }
  }
}
