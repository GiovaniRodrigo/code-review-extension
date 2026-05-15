import * as vscode from 'vscode';
import { VSCodeContainer } from '../dependencies/buildContainer';

export async function restoreCurrentBranchSession(context: vscode.ExtensionContext, container: VSCodeContainer): Promise<void> {
  try {
    const branch = await container.ide.getActiveBranch();
    const session = await container.getCodeReviewUseCase.execute(branch);
    
    // Always clear old diagnostics when switching branch or reloading
    container.ide.clearDiagnostics();

    if (session) {
        console.log(`[BOOTSTRAP] Restoring session for branch: ${branch} (${session.findings.length} findings)`);
        
        // Refresh UI
        await container.reviewPanelProvider.refresh();
        
        // Restore approved diagnostics
        const approvedFindings = session.findings.filter(f => f.status === 'approved');
        for (const finding of approvedFindings) {
            await container.ide.showFinding(finding);
        }
    }
  } catch (error: any) {
    console.debug(`[BOOTSTRAP] Could not restore review session: ${error.message}`);
  }
}
