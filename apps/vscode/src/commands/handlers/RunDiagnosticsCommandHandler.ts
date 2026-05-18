import * as vscode from 'vscode';
import type { CommandHandlerPort } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';

export class RunDiagnosticsCommandHandler implements CommandHandlerPort {
  constructor(private container: VSCodeContainerPort) {}

  async execute(): Promise<void> {
    const checks: Array<{ name: string; status: 'OK' | 'WARN' | 'FAIL'; detail: string }> = [];
    const push = (name: string, status: 'OK' | 'WARN' | 'FAIL', detail: string) => checks.push({ name, status, detail });

    try {
      const productConfig = vscode.workspace.getConfiguration('codeReview');
      push('Product audience', 'OK', productConfig.get<string>('product.targetAudience', 'code reviewers'));
      push('Product plan', 'OK', productConfig.get<string>('product.plan', 'community'));
    } catch (error: any) {
      push('Product metadata', 'WARN', error?.message || String(error));
    }

    try {
      const workspacePath = this.container.workspace.getWorkspacePath?.();
      push('Workspace', workspacePath ? 'OK' : 'FAIL', workspacePath || 'No workspace folder opened.');
    } catch (error: any) {
      push('Workspace', 'FAIL', error?.message || String(error));
    }

    let activeBranch = '';
    try {
      activeBranch = await this.container.ide.getActiveBranch();
      push('Git branch', activeBranch ? 'OK' : 'WARN', activeBranch || 'No active branch detected.');
    } catch (error: any) {
      push('Git branch', 'WARN', error?.message || String(error));
    }

    try {
      const persistLocal = vscode.workspace.getConfiguration('codeReview').get<boolean>('session.persistLocal', true);
      const session = activeBranch ? await this.container.repository.getSessionByBranch(activeBranch) : null;
      push('Local session persistence', persistLocal ? 'OK' : 'WARN', persistLocal ? (session ? `${session.findings?.length || 0} finding(s) saved for ${activeBranch}.` : 'Enabled. No session for current branch yet.') : 'Disabled in settings.');
    } catch (error: any) {
      push('Local session persistence', 'WARN', error?.message || String(error));
    }

    try {
      const health = await this.container.aiProviderRegistry.checkHealth();
      push('AI provider', health?.status === 'available' ? 'OK' : 'WARN', `${health?.status || 'unknown'}${health?.message ? ` — ${health.message}` : ''}`);
    } catch (error: any) {
      push('AI provider', 'FAIL', error?.message || String(error));
    }

    push('RAG provider', this.container.ragStatusProvider ? 'OK' : 'FAIL', this.container.ragStatusProvider ? 'Registered.' : 'Missing.');

    const requiredUseCases = [
      'analyzeCodeWithAIUseCase',
      'analyzeWorkspaceUseCase',
      'analyzeBranchCommitsUseCase',
      'analyzePrUseCase',
      'generatePRSummaryUseCase',
      'generateQualityReportUseCase',
      'publishCodeReviewUseCase',
      'approveFindingUseCase',
      'indexRepositoryRagUseCase',
      'searchRagContextUseCase',
      'projectChatUseCase'
    ];

    for (const key of requiredUseCases) {
      const candidate = this.container[key];
      push(`Container: ${key}`, candidate && typeof candidate.execute === 'function' ? 'OK' : 'FAIL', candidate ? 'Registered.' : 'Missing.');
    }

    const markdown = this.renderMarkdown(checks);
    const doc = await vscode.workspace.openTextDocument({ content: markdown, language: 'markdown' });
    await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);

    const failed = checks.filter(check => check.status === 'FAIL').length;
    const warned = checks.filter(check => check.status === 'WARN').length;

    if (failed > 0) {
      await this.container.notifications.error(`Diagnostics completed with ${failed} failure(s) and ${warned} warning(s).`);
      return;
    }

    if (warned > 0) {
      await this.container.notifications.warning(`Diagnostics completed with ${warned} warning(s).`);
      return;
    }

    await this.container.notifications.info('Diagnostics completed successfully.');
  }

  private renderMarkdown(checks: Array<{ name: string; status: string; detail: string }>): string {
    const rows = checks
      .map(check => `| ${this.icon(check.status)} ${check.status} | ${this.escape(check.name)} | ${this.escape(check.detail)} |`)
      .join('\n');

    return `# Git Code Review — Product Diagnostics\n\nGenerated at: ${new Date().toISOString()}\n\n| Status | Check | Detail |\n|---|---|---|\n${rows}\n\n## Next steps\n\n- FAIL items must be fixed before publishing or using the extension broadly.\n- WARN items are acceptable only when the related feature is intentionally not configured.\n`;
  }

  private icon(status: string): string {
    if (status === 'OK') return '✅';
    if (status === 'WARN') return '⚠️';
    return '❌';
  }

  private escape(value: unknown): string {
    return String(value ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ');
  }
}
