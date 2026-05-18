import * as vscode from 'vscode';
import * as os from 'os';
import type { CommandHandlerPort } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';

interface FindingLike {
  id?: string;
  file?: string;
  line?: number;
  severity?: string;
  status?: string;
  message?: string;
  confidenceScore?: number;
  suggestedFix?: string;
  discussion?: Array<{ author?: string; body?: string; createdAt?: Date | string }>;
}

export class ExportMarkdownCommandHandler implements CommandHandlerPort {
  constructor(private readonly container: VSCodeContainerPort) {}

  async execute(): Promise<void> {
    try {
      const branch = await this.container.ide.getActiveBranch();
      const session = await this.container.repository.getSessionByBranch(branch);

      if (!session) {
        await this.container.notifications.warning('No review session found. Run Start Review or Analyze Workspace first.');
        return;
      }

      const markdown = this.renderMarkdown(session);
      const doc = await vscode.workspace.openTextDocument({ content: markdown, language: 'markdown' });
      await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);

      const save = await vscode.window.showInformationMessage(
        'Review report generated.',
        'Save Markdown',
        'Keep Open'
      );

      if (save === 'Save Markdown') {
        const defaultName = `git-code-review-${sanitizeFileName(session.branch)}-${new Date().toISOString().slice(0, 10)}.md`;
        const defaultUri = vscode.workspace.workspaceFolders?.[0]
          ? vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, defaultName)
          : vscode.Uri.file(`${os.tmpdir()}/${defaultName}`);

        const uri = await vscode.window.showSaveDialog({
          defaultUri,
          filters: { Markdown: ['md'] },
          title: 'Save Git Code Review report'
        });

        if (uri) {
          await vscode.workspace.fs.writeFile(uri, Buffer.from(markdown, 'utf8'));
          await this.container.notifications.info(`Review report saved: ${uri.fsPath}`);
        }
      }
    } catch (error: any) {
      await this.container.notifications.error(`Failed to export review report: ${error?.message || String(error)}`);
    }
  }

  private renderMarkdown(session: any): string {
    const findings = Array.isArray(session.findings) ? session.findings as FindingLike[] : [];
    const approved = findings.filter(f => f.status === 'approved').length;
    const pending = findings.filter(f => f.status === 'pending').length;
    const errors = findings.filter(f => f.severity === 'error').length;
    const warnings = findings.filter(f => f.severity === 'warning').length;
    const info = findings.filter(f => f.severity === 'info').length;
    const score = calculateScore(findings);

    const rows = findings.map((f, index) => `| ${index + 1} | ${escapeCell(f.severity || 'info')} | ${escapeCell(f.status || 'pending')} | ${escapeCell(f.file || '')} | ${f.line || 1} | ${escapeCell(f.message || '')} | ${confidence(f)} |`).join('\n');
    const comments = findings.flatMap(f => (f.discussion || []).map(comment => ({ finding: f, comment })));
    const commentsMarkdown = comments.length
      ? comments.map(({ finding, comment }, index) => `### Comment ${index + 1}\n\n- Finding: ${finding.file || 'unknown'}:${finding.line || 1}\n- Author: ${comment.author || 'developer'}\n- Body: ${comment.body || ''}`).join('\n\n')
      : 'No comments recorded.';

    return `# Git Code Review Report\n\nGenerated at: ${new Date().toISOString()}\n\n## Review Session\n\n| Field | Value |\n|---|---|\n| Branch | ${escapeCell(session.branch)} |\n| Session ID | ${escapeCell(session.id)} |\n| Created | ${formatDate(session.createdAt)} |\n| Updated | ${formatDate(session.updatedAt)} |\n| Quality Score | ${score}/100 |\n\n## Summary\n\n| Metric | Value |\n|---|---:|\n| Findings | ${findings.length} |\n| Approved | ${approved} |\n| Pending | ${pending} |\n| Errors | ${errors} |\n| Warnings | ${warnings} |\n| Info | ${info} |\n\n## Findings\n\n| # | Severity | Status | File | Line | Message | Confidence |\n|---:|---|---|---|---:|---|---:|\n${rows || '| - | - | - | - | - | No findings | - |'}\n\n## Reviewer Comments\n\n${commentsMarkdown}\n\n## Human-in-the-Loop Declaration\n\nAI suggestions are advisory. The final review decision belongs to the code reviewer.\n`;
  }
}

function calculateScore(findings: FindingLike[]): number {
  const penalty = findings.reduce((sum, f) => sum + (f.severity === 'error' ? 12 : f.severity === 'warning' ? 6 : 2), 0);
  const approvedBonus = Math.min(10, findings.filter(f => f.status === 'approved').length);
  return Math.max(0, Math.min(100, 90 - penalty + approvedBonus));
}

function confidence(finding: FindingLike): number | string {
  return typeof finding.confidenceScore === 'number' ? Math.round(finding.confidenceScore * 100) + '%' : '-';
}

function escapeCell(value: unknown): string {
  return String(value ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ');
}

function formatDate(value: unknown): string {
  if (!value) return '-';
  const date = new Date(value as any);
  return Number.isNaN(date.getTime()) ? String(value) : date.toISOString();
}

function sanitizeFileName(value: string): string {
  return value.replace(/[^a-z0-9._-]+/gi, '-').replace(/^-+|-+$/g, '') || 'review';
}
