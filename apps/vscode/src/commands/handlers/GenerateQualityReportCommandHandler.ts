import * as vscode from 'vscode';
import type { CommandHandlerPort } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';

export class GenerateQualityReportCommandHandler implements CommandHandlerPort {
  constructor(private container: VSCodeContainerPort) {}
  async execute(): Promise<void> {
    try {
      if (!this.container.generateQualityReportUseCase || typeof this.container.generateQualityReportUseCase.execute !== 'function') throw new Error('Quality report generator is not registered. Reinstall the extension and reload VS Code.');
      const branch = await this.container.ide.getActiveBranch();
      await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: 'Generating Technical Quality Report...', cancellable: false }, async () => { const report = await this.container.generateQualityReportUseCase.execute(branch); const doc = await vscode.workspace.openTextDocument({ content: report.markdown, language: 'markdown' }); await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside); });
      await this.container.notifications.info('Technical quality report generated.');
    } catch (e: any) { await this.container.notifications.error(`Failed to generate quality report: ${e?.message || String(e)}`); }
  }
}
