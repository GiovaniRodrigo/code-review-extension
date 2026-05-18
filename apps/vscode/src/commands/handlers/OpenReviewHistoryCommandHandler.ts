import * as vscode from 'vscode';
import type { CommandHandlerPort } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';

export class OpenReviewHistoryCommandHandler implements CommandHandlerPort {
  constructor(private readonly container: VSCodeContainerPort) {}

  async execute(): Promise<void> {
    try {
      const sessions = await this.container.repository.getAllSessions();
      if (!sessions.length) {
        await this.container.notifications.info('No local review history yet. Run Start Review first.');
        return;
      }

      const items = sessions
        .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .map((session: any) => {
          const findings = Array.isArray(session.findings) ? session.findings : [];
          const approved = findings.filter((finding: any) => finding.status === 'approved').length;
          const pending = findings.filter((finding: any) => finding.status === 'pending').length;
          return {
            label: session.branch || 'workspace',
            description: `${findings.length} finding(s)` ,
            detail: `Approved ${approved} · Pending ${pending} · Updated ${formatDate(session.updatedAt)}`,
            session
          };
        });

      const picked = await vscode.window.showQuickPick(items as any[], {
        title: 'Git Code Review — Local Review History',
        placeHolder: 'Select a review session to inspect'
      });

      if (!picked) return;
      const pickedItem = picked as any;
      const markdown = renderSessionSummary(pickedItem.session);
      const doc = await vscode.workspace.openTextDocument({ content: markdown, language: 'markdown' });
      await vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside);
    } catch (error: any) {
      await this.container.notifications.error(`Failed to open review history: ${error?.message || String(error)}`);
    }
  }
}

function renderSessionSummary(session: any): string {
  const findings = Array.isArray(session.findings) ? session.findings : [];
  const rows = findings.slice(0, 100).map((finding: any, index: number) => `| ${index + 1} | ${escapeCell(finding.severity || 'info')} | ${escapeCell(finding.status || 'pending')} | ${escapeCell(finding.file || '')} | ${finding.line || 1} | ${escapeCell(finding.message || '')} |`).join('\n');
  return `# Review History — ${escapeCell(session.branch || 'workspace')}\n\n| Field | Value |\n|---|---|\n| Session ID | ${escapeCell(session.id)} |\n| Branch | ${escapeCell(session.branch)} |\n| Created | ${formatDate(session.createdAt)} |\n| Updated | ${formatDate(session.updatedAt)} |\n| Findings | ${findings.length} |\n\n## Findings\n\n| # | Severity | Status | File | Line | Message |\n|---:|---|---|---|---:|---|\n${rows || '| - | - | - | - | - | No findings |'}\n`;
}

function formatDate(value: unknown): string {
  if (!value) return '-';
  const date = new Date(value as any);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleString();
}

function escapeCell(value: unknown): string {
  return String(value ?? '').replaceAll('|', '\\|').replaceAll('\n', ' ');
}
