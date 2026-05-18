import * as vscode from 'vscode';
import type { CommandHandlerPort } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';

export class AnalyzePrCommandHandler implements CommandHandlerPort {
  constructor(private container: VSCodeContainerPort) {}
  async execute(prNumber?: unknown): Promise<void> {
    try {
      if (!this.container.analyzePrUseCase || typeof this.container.analyzePrUseCase.execute !== 'function') throw new Error('Pull Request analyzer is not registered. Reinstall the extension and reload VS Code.');
      const detected = await this.container.ide.getPullRequestInfo?.();
      let owner = detected?.owner; let repo = detected?.repo; let targetPr = typeof prNumber === 'number' ? prNumber : detected?.number;
      if (!targetPr) { const input = await vscode.window.showInputBox({ prompt: 'Enter PR/MR number', validateInput: value => Number.isInteger(Number(value)) && Number(value) > 0 ? undefined : 'Enter a valid PR/MR number.' }); if (!input) return; targetPr = Number(input); }
      if (!owner || !repo) { const remote = await vscode.window.showInputBox({ prompt: 'Repository owner/name', placeHolder: 'example-org/example-repository', validateInput: value => /^.+\/.+$/.test(value.trim()) ? undefined : 'Use owner/repository format.' }); if (!remote) return; [owner, repo] = remote.split('/', 2); }
      await vscode.window.withProgress({ location: vscode.ProgressLocation.Notification, title: `Analyzing PR/MR #${targetPr}...`, cancellable: true }, async (_progress, token) => { const controller = new AbortController(); token.onCancellationRequested?.(() => controller.abort()); await this.container.analyzePrUseCase.execute({ prNumber: targetPr, owner, repo, signal: controller.signal }); });
      await this.container.reviewPanelProvider.refresh(); await this.container.dashboardProvider.refresh(); await this.container.notifications.info(`PR/MR #${targetPr} analysis completed.`);
    } catch (e: any) { if (e?.name === 'AbortError') { await this.container.notifications.info('PR/MR analysis canceled.'); return; } await this.container.notifications.error(`PR/MR analysis failed: ${e?.message || String(e)}`); }
  }
}
