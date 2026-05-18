import * as vscode from 'vscode';
import * as os from 'os';
import type { CommandHandlerPort } from '@code-review/core';
import type { VSCodeContainerPort } from '../../dependencies/types/VSCodeContainerPort';

interface FindingLike {
  file?: string;
  line?: number;
  severity?: string;
  status?: string;
  message?: string;
  suggestedFix?: string;
}

export class ExportPdfCommandHandler implements CommandHandlerPort {
  constructor(private readonly container: VSCodeContainerPort) {}

  async execute(): Promise<void> {
    try {
      const branch = await this.container.ide.getActiveBranch();
      const session = await this.container.repository.getSessionByBranch(branch);

      if (!session) {
        await this.container.notifications.warning('No review session found. Run Start Review or Analyze Workspace before exporting PDF.');
        return;
      }

      const defaultName = `git-code-review-${sanitizeFileName(session.branch || branch)}-${new Date().toISOString().slice(0, 10)}.pdf`;
      const defaultUri = vscode.workspace.workspaceFolders?.[0]
        ? vscode.Uri.joinPath(vscode.workspace.workspaceFolders[0].uri, defaultName)
        : vscode.Uri.file(`${os.tmpdir()}/${defaultName}`);

      const uri = await vscode.window.showSaveDialog({
        defaultUri,
        filters: { PDF: ['pdf'] },
        title: 'Export Git Code Review report as PDF'
      });

      if (!uri) return;

      const pdf = createReviewPdf(session);
      await vscode.workspace.fs.writeFile(uri, pdf);

      const action = await vscode.window.showInformationMessage(
        `PDF review report exported: ${uri.fsPath}`,
        'Open PDF',
        'Show in Explorer'
      );

      if (action === 'Open PDF') {
        await vscode.commands.executeCommand('vscode.open', uri);
      }
      if (action === 'Show in Explorer') {
        await vscode.commands.executeCommand('revealFileInOS', uri);
      }
    } catch (error: any) {
      await this.container.notifications.error(`Failed to export PDF report: ${error?.message || String(error)}`);
    }
  }
}

function createReviewPdf(session: any): Uint8Array {
  const findings = Array.isArray(session.findings) ? session.findings as FindingLike[] : [];
  const approved = findings.filter(f => f.status === 'approved').length;
  const pending = findings.filter(f => f.status === 'pending').length;
  const critical = findings.filter(f => f.severity === 'critical' || f.severity === 'error').length;
  const warnings = findings.filter(f => f.severity === 'warning').length;
  const score = calculateScore(findings);

  const lines = [
    'Git Code Review — Technical Quality Report',
    `Generated: ${new Date().toISOString()}`,
    `Branch: ${session.branch || 'workspace'}`,
    `Session: ${session.id || '-'}`,
    '',
    'Executive Summary',
    `Quality Score: ${score}/100`,
    `Findings: ${findings.length}`,
    `Approved: ${approved}`,
    `Pending: ${pending}`,
    `Critical/Error: ${critical}`,
    `Warnings: ${warnings}`,
    '',
    'Top Findings',
    ...findings.slice(0, 35).flatMap((finding, index) => wrapText(`${index + 1}. [${finding.severity || 'info'}] ${finding.file || 'unknown'}:${finding.line || 1} — ${finding.message || ''}`, 92)),
    '',
    'Human-in-the-Loop Declaration',
    'AI suggestions are advisory. The final review decision belongs to the code reviewer.'
  ];

  return simplePdf(lines);
}

function simplePdf(lines: string[]): Uint8Array {
  const pageWidth = 612;
  const pageHeight = 792;
  const margin = 54;
  const lineHeight = 14;
  const linesPerPage = Math.floor((pageHeight - margin * 2) / lineHeight);
  const pages: string[][] = [];
  for (let i = 0; i < lines.length; i += linesPerPage) {
    pages.push(lines.slice(i, i + linesPerPage));
  }

  const objects: string[] = [];
  objects.push('<< /Type /Catalog /Pages 2 0 R >>');
  const kids = pages.map((_, index) => `${3 + index * 2} 0 R`).join(' ');
  objects.push(`<< /Type /Pages /Kids [ ${kids} ] /Count ${pages.length} >>`);

  pages.forEach((pageLines, index) => {
    const pageObjectId = 3 + index * 2;
    const contentObjectId = pageObjectId + 1;
    objects.push(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> /F2 << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> >> >> /Contents ${contentObjectId} 0 R >>`);
    const content = renderPageContent(pageLines, margin, pageHeight - margin, lineHeight, index + 1, pages.length);
    objects.push(`<< /Length ${Buffer.byteLength(content, 'utf8')} >>\nstream\n${content}\nendstream`);
  });

  let pdf = '%PDF-1.4\n% Git Code Review\n';
  const offsets: number[] = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf, 'utf8'));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf, 'utf8');
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';
  offsets.slice(1).forEach(offset => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`;

  return Buffer.from(pdf, 'utf8');
}

function renderPageContent(lines: string[], x: number, yStart: number, lineHeight: number, page: number, totalPages: number): string {
  let y = yStart;
  const commands: string[] = [];
  commands.push('BT');
  lines.forEach((line, index) => {
    const isTitle = index === 0 && page === 1;
    commands.push(`/${isTitle ? 'F2' : 'F1'} ${isTitle ? 16 : 10} Tf`);
    commands.push(`${x} ${y} Td (${escapePdfText(line)}) Tj`);
    commands.push(`${-x} ${-lineHeight} Td`);
    y -= lineHeight;
  });
  commands.push('/F1 9 Tf');
  commands.push(`${x} 32 Td (Page ${page} of ${totalPages}) Tj`);
  commands.push('ET');
  return commands.join('\n');
}

function wrapText(value: string, width: number): string[] {
  const words = value.replace(/\s+/g, ' ').trim().split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    if ((current + ' ' + word).trim().length > width) {
      if (current) lines.push(current);
      current = word;
    } else {
      current = (current + ' ' + word).trim();
    }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [''];
}

function escapePdfText(value: string): string {
  return value
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, '')
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)');
}

function calculateScore(findings: FindingLike[]): number {
  const penalty = findings.reduce((sum, f) => sum + (f.severity === 'critical' || f.severity === 'error' ? 12 : f.severity === 'warning' ? 6 : 2), 0);
  const approvedBonus = Math.min(10, findings.filter(f => f.status === 'approved').length);
  return Math.max(0, Math.min(100, 90 - penalty + approvedBonus));
}

function sanitizeFileName(value: string): string {
  return value.replace(/[^a-z0-9._-]+/gi, '-').replace(/^-+|-+$/g, '') || 'review';
}
