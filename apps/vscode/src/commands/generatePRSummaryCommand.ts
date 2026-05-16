import * as vscode from 'vscode';
import { VSCodeContainer } from '../dependencies/buildContainer';
import { GeneratePRSummaryUseCase } from '@code-review/core';

export const generatePRSummaryCommand = {
  id: 'code-review.generatePRSummary',
  async execute(container: VSCodeContainer) {
    try {
      const branch = await container.ide.getActiveBranch();
      const config = vscode.workspace.getConfiguration('codeReview');
      const baseBranch = config.get<string>('git.baseBranch', 'main');

      const useCase = new GeneratePRSummaryUseCase(
        (container as any).repository,
        (container as any).aiProviderRegistry,
        container.ide
      );

      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Generating AI Pull Request summary...',
        cancellable: false
      }, async () => {
        const result = await useCase.execute(branch, baseBranch);
        
        // Show summary in a new text document
        const doc = await vscode.workspace.openTextDocument({
          content: result.markdown,
          language: 'markdown'
        });
        
        await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
      });

      await container.notifications.info('PR Summary generated successfully.');
    } catch (e: any) {
      await container.notifications.error(`Failed to generate summary: ${e.message}`);
    }
  }
};
