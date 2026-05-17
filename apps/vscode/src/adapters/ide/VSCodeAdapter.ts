import * as vscode from 'vscode';
import * as path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import {
  BranchCommit,
  CommitChangedFile,
  CommitChangeSet,
  IdeAdapterPort
} from '@code-review/core';
import { Finding } from '@code-review/domain';

const execFileAsync = promisify(execFile);

export class VSCodeAdapter implements IdeAdapterPort {
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
    } catch (error) {
      console.debug('[VSCodeAdapter] Git extension activation failed or unavailable:', error);
      return this._getWorkspaceFallbackBranch();
    }
  }

  async getUncommittedChangesLines(filePath: string): Promise<number[]> {
    const cwd = this._getWorkspacePath();
    try {
      // Get lines changed since HEAD (unstaged and staged)
      const { stdout } = await execFileAsync(
        'git',
        ['diff', 'HEAD', '-U0', '--', filePath],
        { cwd }
      );

      const changedLines: number[] = [];
      const lines = stdout.split('\n');

      for (const line of lines) {
        if (line.startsWith('@@')) {
            // Match @@ -1,1 +5,10 @@ or similar
            const match = line.match(/@@ -\d+(?:,\d+)? \+(\d+)(?:,(\d+))? @@/);
            if (match) {
                const start = parseInt(match[1]);
                const count = match[2] ? parseInt(match[2]) : 1;
                for (let i = 0; i < count; i++) {
                    changedLines.push(start + i);
                }
            }
        }
      }

      return changedLines;
    } catch (error) {
      console.warn(`[VSCodeAdapter] Failed to get git diff for ${filePath}`, error);
      return [];
    }
  }

  async getBranchCommits(baseBranch: string): Promise<BranchCommit[]> {
    const cwd = this._getWorkspacePath();

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
    const uri = this._resolveUri(finding.file);
    const line = Math.max((finding.line || 1) - 1, 0);
    const column = Math.max((finding.column || 1) - 1, 0);
    const range = new vscode.Range(line, column, line, column);
    const severity = this._toDiagnosticSeverity(finding.severity);
    const diagnostic = new vscode.Diagnostic(range, finding.message, severity);

    diagnostic.source = 'AI Code Review';
    diagnostic.code = finding.id;

    const currentDiagnostics = Array.from(this.diagnosticCollection?.get(uri) || []);
    
    // Avoid duplicates
    if (!currentDiagnostics.some(d => d.code === finding.id)) {
        this.diagnosticCollection?.set(uri, [...currentDiagnostics, diagnostic]);
    }

    vscode.window.showInformationMessage(
      `Finding approved: ${finding.message} at line ${finding.line}`
    );
  }

  async focusFinding(finding: Finding): Promise<void> {
    const uri = this._resolveUri(finding.file);
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

    const uri = this._resolveUri(finding.file);
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

  private _branchChangeListener?: vscode.Disposable;

  onBranchChange(callback: (branch: string) => void): void {
    if (this._branchChangeListener) {
        this._branchChangeListener.dispose();
    }

    try {
      const gitExtension = vscode.extensions.getExtension('vscode.git');
      if (!gitExtension) return;

      const git = gitExtension.exports?.getAPI?.(1);
      const repository = git?.repositories?.[0];

      if (repository) {
        this._branchChangeListener = repository.state.onDidChange(() => {
          const branch = repository.state.HEAD?.name;
          if (branch) callback(branch);
        });
      }
    } catch (error) {
      console.debug('[VSCodeAdapter] Failed to register branch change listener:', error);
    }
  }

  clearDiagnostics(): void {
    this.diagnosticCollection?.clear();
  }

  async syncDiagnostics(findings: Finding[]): Promise<void> {
    this.clearDiagnostics();
    const approved = findings.filter(f => f.status === 'approved');
    
    // Group by file to set all diagnostics for a file at once
    const byFile = approved.reduce((acc, f) => {
        if (!acc[f.file]) acc[f.file] = [];
        acc[f.file].push(f);
        return acc;
    }, {} as Record<string, Finding[]>);

    for (const file in byFile) {
        const uri = this._resolveUri(file);
        const diagnostics = byFile[file].map(f => {
            const line = Math.max((f.line || 1) - 1, 0);
            const column = Math.max((f.column || 1) - 1, 0);
            const range = new vscode.Range(line, column, line, column);
            const severity = this._toDiagnosticSeverity(f.severity);
            const diagnostic = new vscode.Diagnostic(range, f.message, severity);
            diagnostic.source = 'AI Code Review';
            diagnostic.code = f.id;
            return diagnostic;
        });
        this.diagnosticCollection?.set(uri, diagnostics);
    }
  }

  dispose(): void {
    this._branchChangeListener?.dispose();
    this.diagnosticCollection?.dispose();
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

  private _resolveUri(filePath: string): vscode.Uri {
    if (path.isAbsolute(filePath)) {
        return vscode.Uri.file(filePath);
    }
    
    try {
        const workspacePath = this._getWorkspacePath();
        return vscode.Uri.file(path.resolve(workspacePath, filePath));
    } catch {
        return vscode.Uri.file(filePath);
    }
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

  async getPullRequestInfo(): Promise<any | null> {
    try {
      const gitExtension = vscode.extensions.getExtension('vscode.git');
      const git = gitExtension?.exports?.getAPI?.(1);
      const repository = git?.repositories?.[0];
      const remote = repository?.state?.remotes?.[0];
      const url = remote?.fetchUrl || remote?.pushUrl || '';

      if (!url) return null;

      let owner = '';
      let repo = '';
      let provider: 'github' | 'gitlab' = 'github';

      if (url.includes('github.com')) {
        const match = url.match(/github\.com[:/]([^/]+)\/([^.]+)(\.git)?/);
        if (match) {
          owner = match[1];
          repo = match[2];
          provider = 'github';
        }
      } else if (url.includes('gitlab.com')) {
        const match = url.match(/gitlab\.com[:/]([^/]+)\/([^.]+)(\.git)?/);
        if (match) {
          owner = match[1];
          repo = match[2];
          provider = 'gitlab';
        }
      }

      if (!owner || !repo) return null;

      const prNumber = await vscode.window.showInputBox({
        prompt: `Enter ${provider === 'github' ? 'PR' : 'MR'} number for ${owner}/${repo}`,
        validateInput: (value) => isNaN(Number(value)) ? 'Must be a number' : null
      });

      if (!prNumber) return null;

      return {
        number: Number(prNumber),
        owner,
        repo,
        provider
      };
    } catch (e) {
      console.error('[VSCodeAdapter] Failed to get PR info', e);
      return null;
    }
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

  async getBranchDiff(baseBranch: string): Promise<string> {
    const cwd = this._getWorkspacePath();

    const { stdout } = await execFileAsync(
      'git',
      [
        'diff',
        `${baseBranch}...HEAD`
      ],
      {
        cwd,
        maxBuffer: 1024 * 1024 * 20
      }
    );

    return stdout;
  }
}