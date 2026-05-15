import * as vscode from 'vscode';
import { VSCodeContainer } from '../dependencies/buildContainer';
import { restoreCurrentBranchSession } from './restoreCurrentBranchSession';

export function registerEvents(context: vscode.ExtensionContext, container: VSCodeContainer): void {
  container.ide.onBranchChange(async (branch) => {
    console.log(`[EVENTS] Branch changed to: ${branch}. Restoring session...`);
    await restoreCurrentBranchSession(context, container);
  });
}
