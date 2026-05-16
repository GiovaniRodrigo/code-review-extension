import * as vscode from 'vscode';
import { VSCodeContainer } from '../dependencies/buildContainer';

let activeAbortController: AbortController | null = null;

export const analyzeCommand = {
  id: 'code-review.analyze',
  async execute(container: VSCodeContainer, args?: any) {
    if (activeAbortController) {
        activeAbortController.abort();
        activeAbortController = null;
    }

    activeAbortController = new AbortController();
    const signal = activeAbortController.signal;

    try {
      const code = args?.diff || await container.ide.getActiveFileContent();
      const filePath = args?.filePath || await container.ide.getActiveFilePath();
      const branch = await container.ide.getActiveBranch();
      
      await container.reviewPanelProvider.refresh(true); // Set loading state

      const result = await vscode.window.withProgress({
        location: vscode.ProgressLocation.Notification,
        title: 'AI is analyzing your code...',
        cancellable: true
      }, async (progress, token) => {
        token.onCancellationRequested(() => {
            activeAbortController?.abort();
        });

        let targetLines: number[] = [];
        if (!args?.diff) {
            try {
                targetLines = await container.ide.getUncommittedChangesLines(filePath);
            } catch (error) {
                console.warn('[ANALYZE] Git diff failed, falling back to full analysis', error);
            }
        }

        return await container.revalidateCodeReviewUseCase.execute({
          code,
          filePath,
          branch,
          targetLines,
          signal,
          onFinding: async (finding) => {
            // Update the review panel immediately when a finding is streamed
            await container.reviewPanelProvider.refresh();
            // We could also show a temporary diagnostic or status bar update
          }
        } as any);
      });

      if (signal.aborted) return;

      await container.ide.syncDiagnostics(result.findings);
      await container.reviewPanelProvider.refresh();
      await container.dashboardProvider.refresh();
      await container.notifications.info(`AI analysis completed: ${result.findings.length} finding(s) synced.`);
      return result;
    } catch (e: any) {
      if (e.name === 'AbortError' || e.message?.includes('aborted')) {
          console.log('[ANALYZE] Analysis cancelled.');
          return;
      }
      await container.notifications.error(`Failed to analyze: ${e.message}`);
    } finally {
        if (activeAbortController?.signal === signal) {
            activeAbortController = null;
        }
    }
  }
};
