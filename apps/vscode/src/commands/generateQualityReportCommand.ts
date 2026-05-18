import * as vscode from 'vscode';
import * as os from 'os';
import { VSCodeContainer } from '../dependencies/buildContainer';
import { GenerateQualityReportUseCase } from '@code-review/core';

export const generateQualityReportCommand = {
  id: 'code-review.generateQualityReport',
  async execute(container: VSCodeContainer) {
    try {
      const branch = await container.ide.getActiveBranch();
      const useCase = new GenerateQualityReportUseCase((container as any).repository);

      await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'Generating Technical Quality Report...',
        cancellable: false
      }, async () => {
        const report = await useCase.execute(branch);
        
        // Show report in a new text document
        const doc = await vscode.workspace.openTextDocument({
          content: report.markdown,
          language: 'markdown'
        });
        
        await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);

        // Offer to save to a file
        const defaultName = `quality-report-${branch.replace(/\//g, '-')}.md`;
        const defaultUri = vscode.workspace.workspaceFolders?.[0]
            ? vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, defaultName)
            : vscode.Uri.file(`${os.tmpdir()}/${defaultName}`);
        const saveUri = await vscode.window.showSaveDialog({
            defaultUri,
            filters: { 'Markdown': ['md'], 'JSON': ['json'] }
        });

        if (saveUri) {
            const content = saveUri.fsPath.endsWith('.json') 
                ? JSON.stringify(report, null, 2) 
                : report.markdown;
                
            await vscode.workspace.fs.writeFile(saveUri, Buffer.from(content));
            await container.notifications.info(`Report saved to ${saveUri.fsPath}`);
        }
      });

    } catch (e: any) {
      await container.notifications.error(`Failed to generate quality report: ${e.message}`);
    }
  }
};
