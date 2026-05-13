import * as vscode from 'vscode';
import { IDEAdapter } from '@code-review/infra';
import { Finding } from '@code-review/domain';

export class VSCodeAdapter implements IDEAdapter {
  private readonly diagnosticCollection = vscode.languages?.createDiagnosticCollection?.('ai-code-review');

  async getActiveFileContent(): Promise<string> {
    const editor = vscode.window.activeTextEditor;
    return editor?.document.getText() || '';
  }

  async getActiveFilePath(): Promise<string> {
    const editor = vscode.window.activeTextEditor;
    return editor?.document.uri.fsPath || '';
  }

  async getActiveBranch(): Promise<string> {
    const gitExtension = vscode.extensions.getExtension('vscode.git')?.exports;
    const git = gitExtension?.getAPI?.(1);
    const repository = git?.repositories?.[0];
    const branch = repository?.state?.HEAD?.name;

    if (branch) {
      return branch;
    }

    return vscode.workspace.workspaceFolders?.[0]?.name || 'main';
  }

  async showFinding(finding: Finding): Promise<void> {
    const uri = vscode.Uri.file(finding.file);
    const line = Math.max(finding.line - 1, 0);
    const column = Math.max((finding.column || 1) - 1, 0);
    const range = new vscode.Range(line, column, line, column);
    const severity = this._toDiagnosticSeverity(finding.severity);
    const diagnostic = new vscode.Diagnostic(range, finding.message, severity);
    diagnostic.source = 'AI Code Review';
    diagnostic.code = finding.id;

    this.diagnosticCollection?.set(uri, [diagnostic]);
    vscode.window.showInformationMessage(`Finding approved: ${finding.message} at line ${finding.line}`);
  }

  async focusFinding(finding: Finding): Promise<void> {
    const uri = vscode.Uri.file(finding.file);
    const document = await vscode.workspace.openTextDocument(uri);
    const editor = await vscode.window.showTextDocument(document);
    
    const range = new vscode.Range(finding.line - 1, 0, finding.line - 1, 0);
    editor.selection = new vscode.Selection(range.start, range.end);
    editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
  }

  async applyFix(finding: Finding): Promise<void> {
    if (!finding.suggestedFix) return;
    // Lógica para aplicar o fix no editor
  }

  async showNotification(message: string, type: 'info' | 'warning' | 'error'): Promise<void> {
    if (type === 'error') vscode.window.showErrorMessage(message);
    else if (type === 'warning') vscode.window.showWarningMessage(message);
    else vscode.window.showInformationMessage(message);
  }

  private _toDiagnosticSeverity(severity: Finding['severity']): vscode.DiagnosticSeverity {
    if (severity === 'error') return vscode.DiagnosticSeverity.Error;
    if (severity === 'warning') return vscode.DiagnosticSeverity.Warning;
    return vscode.DiagnosticSeverity.Information;
  }
}
