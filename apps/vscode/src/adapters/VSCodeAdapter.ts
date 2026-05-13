import * as vscode from 'vscode';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import {
  BranchCommit,
  CommitChangedFile,
  CommitChangeSet,
  IDEAdapter
} from '@code-review/infra';
import { Finding } from '@code-review/domain';
import { WorkspaceHelper }
  from '../helpers/WorkspaceHelper';

const execFileAsync = promisify(execFile);

export class VSCodeAdapter implements IDEAdapter {
  private readonly diagnosticCollection =
    vscode.languages?.createDiagnosticCollection?.('ai-code-review');

  async getActiveFileContent(): Promise<string> {
    const editor = this._getCurrentEditor();
    return editor?.document.getText() || '';
  }

  async getActiveFilePath(): Promise<string> {
    const editor = this._getCurrentEditor();
    return editor?.document.uri.fsPath || '';
  }

  async getActiveBranch(): Promise<string> {
    try {
      const gitExtension = vscode.extensions.getExtension('vscode.git');

      if (!gitExtension) {
        return this._getWorkspaceFallbackBranch();
      }

      if (!gitExtension.isActive) {
        await gitExtension.activate();
      }

      const git = gitExtension.exports?.getAPI?.(1);
      const repository = git?.repositories?.[0];
      const branch = repository?.state?.HEAD?.name;

      return branch || this._getWorkspaceFallbackBranch();
    } catch {
      return this._getWorkspaceFallbackBranch();
    }
  }

  async getBranchCommits(baseBranch: string): Promise<BranchCommit[]> {
    const cwd = WorkspaceHelper.getWorkspacePath();

    const { stdout } = await execFileAsync(
      'git',
      [
        'log',
        `${baseBranch}..HEAD`,
        '--pretty=format:%H%x09%an%x09%ad%x09%s',
        '--date=iso'
      ],
      { cwd }
    );

    return stdout
      .split('\n')
      .filter(Boolean)
      .map(line => {
        const [hash, author, date, ...messageParts] = line.split('\t');

        return {
          hash,
          author,
          date,
          message: messageParts.join('\t')
        };
      });
  }

  async getCommitChangedFiles(commitHash: string): Promise<CommitChangedFile[]> {
    const cwd = this._getWorkspacePath();

    const { stdout } = await execFileAsync(
      'git',
      [
        'show',
        '--name-status',
        '--format=',
        commitHash
      ],
      { cwd }
    );

    return stdout
      .split('\n')
      .filter(Boolean)
      .map(line => this._parseChangedFile(line));
  }

  async getCommitDiff(commitHash: string): Promise<string> {
    const cwd = this._getWorkspacePath();

    const { stdout } = await execFileAsync(
      'git',
      [
        'show',
        '--format=',
        '--unified=80',
        commitHash
      ],
      {
        cwd,
        maxBuffer: 1024 * 1024 * 20
      }
    );

    return stdout;
  }

  async getCommitChangeSet(commitHash: string): Promise<CommitChangeSet> {
    const commits = await this._getCommitMetadata(commitHash);
    const files = await this.getCommitChangedFiles(commitHash);
    const diff = await this.getCommitDiff(commitHash);

    return {
      commit: commits,
      files,
      diff
    };
  }

  async showFinding(finding: Finding): Promise<void> {
    const uri = vscode.Uri.file(finding.file);
    const line = Math.max((finding.line || 1) - 1, 0);
    const column = Math.max((finding.column || 1) - 1, 0);
    const range = new vscode.Range(line, column, line, column);
    const severity = this._toDiagnosticSeverity(finding.severity);
    const diagnostic = new vscode.Diagnostic(range, finding.message, severity);

    diagnostic.source = 'AI Code Review';
    diagnostic.code = finding.id;

    this.diagnosticCollection?.set(uri, [diagnostic]);

    vscode.window.showInformationMessage(
      `Finding approved: ${finding.message} at line ${finding.line}`
    );
  }

  async focusFinding(finding: Finding): Promise<void> {
    const uri = vscode.Uri.file(finding.file);
    const line = Math.max((finding.line || 1) - 1, 0);
    const column = Math.max((finding.column || 1) - 1, 0);
    const range = new vscode.Range(line, column, line, column);

    const document = await vscode.workspace.openTextDocument(uri);
    const editor = await vscode.window.showTextDocument(document, {
      selection: range,
      preview: false
    });

    editor.selection = new vscode.Selection(range.start, range.end);
    editor.revealRange(range, vscode.TextEditorRevealType.InCenter);
  }

  async applyFix(finding: Finding): Promise<void> {
    if (!finding.suggestedFix) {
      vscode.window.showWarningMessage('This finding does not include a suggested fix.');
      return;
    }

    if (finding.status !== 'approved') {
      vscode.window.showWarningMessage('Approve the finding before applying its suggested fix.');
      return;
    }

    const uri = vscode.Uri.file(finding.file);
    const document = await vscode.workspace.openTextDocument(uri);
    const editor = await vscode.window.showTextDocument(document);
    const lineIndex = Math.max((finding.line || 1) - 1, 0);
    const currentLine = document.lineAt(lineIndex);

    const preview = `Current:\n${currentLine.text}\n\nSuggested:\n${finding.suggestedFix}`;

    const confirmation = await vscode.window.showWarningMessage(
      preview,
      { modal: true },
      'Apply Fix'
    );

    if (confirmation !== 'Apply Fix') {
      return;
    }

    const applied = await editor.edit(editBuilder => {
      editBuilder.replace(currentLine.range, finding.suggestedFix || '');
    });

    if (!applied) {
      throw new Error('VS Code rejected the edit operation');
    }

    vscode.window.showInformationMessage(
      `Suggested fix applied at ${finding.file}:${finding.line}`
    );
  }

  async showNotification(
    message: string,
    type: 'info' | 'warning' | 'error'
  ): Promise<void> {
    if (type === 'error') {
      vscode.window.showErrorMessage(message);
      return;
    }

    if (type === 'warning') {
      vscode.window.showWarningMessage(message);
      return;
    }

    vscode.window.showInformationMessage(message);
  }

  private async _getCommitMetadata(commitHash: string): Promise<BranchCommit> {
    const cwd = this._getWorkspacePath();

    const { stdout } = await execFileAsync(
      'git',
      [
        'show',
        '-s',
        '--pretty=format:%H%x09%an%x09%ad%x09%s',
        '--date=iso',
        commitHash
      ],
      { cwd }
    );

    const [hash, author, date, ...messageParts] = stdout.split('\t');

    return {
      hash,
      author,
      date,
      message: messageParts.join('\t')
    };
  }

  private _parseChangedFile(line: string): CommitChangedFile {
    const [statusCode, firstPath, secondPath] = line.split('\t');

    const statusMap: Record<string, CommitChangedFile['status']> = {
      A: 'added',
      M: 'modified',
      D: 'deleted',
      R: 'renamed'
    };

    const statusKey = statusCode.charAt(0);

    return {
      path: secondPath || firstPath,
      status: statusMap[statusKey] || 'unknown'
    };
  }

  private _toDiagnosticSeverity(severity: Finding['severity']): vscode.DiagnosticSeverity {
    if (severity === 'error') return vscode.DiagnosticSeverity.Error;
    if (severity === 'warning') return vscode.DiagnosticSeverity.Warning;
    return vscode.DiagnosticSeverity.Information;
  }

  private _getCurrentEditor(): vscode.TextEditor | undefined {
    if (vscode.window.activeTextEditor?.document.uri.fsPath) {
      return vscode.window.activeTextEditor;
    }

    return vscode.window.visibleTextEditors?.find(editor =>
      Boolean(editor.document.uri.fsPath)
    );
  }

  private _getWorkspacePath(): string {
    const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

    if (!workspacePath) {
      throw new Error('No workspace folder opened.');
    }

    return workspacePath;
  }

  private _getWorkspaceFallbackBranch(): string {
    return vscode.workspace.workspaceFolders?.[0]?.name || 'main';
  }

  async getPullRequests(): Promise<any[]> {
    const cwd = this._getWorkspacePath();

    const { stdout } = await execFileAsync(
      'gh',
      [
        'pr',
        'list',
        '--json',
        'number,title,headRefName,baseRefName,url,state'
      ],
      { cwd }
    );

    return JSON.parse(stdout);
  }

  async getPullRequestDiff(
    prNumber: number
  ): Promise<string> {
    const cwd = this._getWorkspacePath();

    const { stdout } = await execFileAsync(
      'gh',
      [
        'pr',
        'diff',
        String(prNumber)
      ],
      {
        cwd,
        maxBuffer: 1024 * 1024 * 20
      }
    );

    return stdout;
  }
}