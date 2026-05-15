import * as vscode from 'vscode';
import { VSCodeContainer } from '../dependencies/buildContainer';
import { restoreCurrentBranchSession } from './restoreCurrentBranchSession';

export function registerEvents(context: vscode.ExtensionContext, container: VSCodeContainer): void {
  container.ide.onBranchChange(async (branch) => {
    const config = vscode.workspace.getConfiguration('codeReview');
    if (config.get<boolean>('autoRestoreSession', true)) {
        console.log(`[EVENTS] Branch changed to: ${branch}. Restoring session...`);
        await restoreCurrentBranchSession(context, container);
    }
  });

  context.subscriptions.push(
    vscode.workspace.onDidSaveTextDocument(async (document) => {
      const config = vscode.workspace.getConfiguration('codeReview');
      if (config.get<boolean>('autoRevalidate', false)) {
        // Only revalidate if it's a code file
        if (['typescript', 'javascript', 'python'].includes(document.languageId)) {
            console.log(`[EVENTS] File saved: ${document.fileName}. Triggering revalidation...`);
            await vscode.commands.executeCommand('code-review.analyze');
        }
      }
    })
  );
}
