import * as vscode from 'vscode';
import type { CommandHandlerPort } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';

let activeAbortController: AbortController | null = null;

export class AnalyzeCommandHandler implements CommandHandlerPort {
  constructor(private container: VSCodeContainerPort) {}

  async execute(args?: any): Promise<any> {
    if (activeAbortController) {
        activeAbortController.abort();
        activeAbortController = null;
    }

    activeAbortController = new AbortController();
    const signal = activeAbortController.signal;

    if (!this.container.revalidateCodeReviewUseCase || typeof this.container.revalidateCodeReviewUseCase.execute !== 'function') {
        throw new Error('revalidateCodeReviewUseCase not registered in container. Please check buildContainer.ts.');
    }

    try {
      const code = args?.diff || await this.container.ide.getActiveFileContent();
      const filePath = args?.filePath || await this.container.ide.getActiveFilePath();
      const branch = await this.container.ide.getActiveBranch();
      
      await this.container.reviewPanelProvider.refresh(true); // Set loading state

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
                targetLines = await this.container.ide.getUncommittedChangesLines(filePath);
            } catch (error) {
                console.warn('[ANALYZE] Git diff failed, falling back to full analysis', error);
            }
        }

        return await this.container.revalidateCodeReviewUseCase.execute({
          code,
          filePath,
          branch,
          targetLines,
          signal,
          onFinding: async (finding: any) => {
            await this.container.reviewPanelProvider.refresh();
          }
        } as any);
      });

      if (signal.aborted) return;

      await this.container.ide.syncDiagnostics(result.findings);
      await this.container.reviewPanelProvider.refresh();
      await this.container.dashboardProvider.refresh();
      await this.container.notifications.info(`AI analysis completed: ${result.findings.length} finding(s) synced.`);
      return result;
    } catch (e: any) {
      if (e.name === 'AbortError' || e.message?.includes('aborted')) {
          console.log('[ANALYZE] Analysis cancelled.');
          return;
      }
      await this.container.notifications.error(`Failed to analyze: ${e.message}`);
    } finally {
        if (activeAbortController?.signal === signal) {
            activeAbortController = null;
        }
    }
  }
}
