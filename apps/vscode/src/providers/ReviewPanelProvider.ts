import * as vscode from 'vscode';
import * as path from 'node:path';
import {
  CodeReviewRepositoryPort,
  IdeAdapterPort,
  ApproveFindingUseCase,
  RefactorFindingUseCase,
  AddCommentToFindingUseCase
} from '@code-review/core';
import { renderReviewPanelHtml, ReviewPanelState } from '@code-review/ui';

export class ReviewPanelProvider implements vscode.WebviewViewProvider {
  static readonly viewType = 'code-review.findingsView';

  private _view?: vscode.WebviewView;

  constructor(
    private readonly repository: CodeReviewRepositoryPort,
    private readonly ide: IdeAdapterPort,
    private readonly approveFindingUseCase: ApproveFindingUseCase,
    private readonly refactorFindingUseCase: RefactorFindingUseCase,
    private readonly addCommentToFindingUseCase: AddCommentToFindingUseCase,
    private readonly context: vscode.ExtensionContext
  ) { }

  async resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): Promise<void> {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: []
    };

    webviewView.webview.onDidReceiveMessage(async (message) => {
      try {
        switch (message.command) {
          case 'startReview':
            await vscode.commands.executeCommand('code-review.startReview');
            break;

          case 'analyzeWorkspace':
            await vscode.commands.executeCommand('code-review.analyzeWorkspace');
            break;

          case 'indexRag':
            await vscode.commands.executeCommand('code-review.indexRepositoryRag');
            break;

          case 'approve':
            await this.approveFindingUseCase.execute(message.sessionId, message.findingId);
            await this.refresh();
            break;

          case 'focus':
            await this.focusFinding(message.sessionId, message.findingId);
            break;

          case 'revalidate':
            await vscode.commands.executeCommand('code-review.analyze');
            break;

          case 'copy':
            await vscode.env.clipboard.writeText(message.text || '');
            await vscode.window.showInformationMessage('Finding copied to clipboard.');
            break;

          case 'reply':
            await this.replyToFinding(message.sessionId, message.findingId);
            break;

          case 'addComment':
            await this.addComment(message.sessionId, message.findingId, message.body);
            break;

          case 'refactor':
            await this.refactorFinding(message.sessionId, message.findingId);
            break;

          case 'saveState':
            await this.context.workspaceState.update('review-panel-state', message.state);
            break;
        }
      } catch (e: any) {
        await vscode.window.showErrorMessage(`Review action failed: ${e?.message || String(e)}`);
      }
    });

    webviewView.onDidDispose(() => {
      this._view = undefined;
    });

    await this.refresh();
  }

  async refresh(isLoading = false): Promise<void> {
    if (!this._view) return;

    const branch = await this.ide.getActiveBranch();
    const session = await this.repository.getSessionByBranch(branch);
    const savedState = this.context.workspaceState.get('review-panel-state', { filter: 'all', collapsed: [] as string[] });

    const state: ReviewPanelState = {
      sessionId: session?.id || '',
      branch: session?.branch || branch,
      findings: session?.findings || [],
      loading: isLoading,
      filter: savedState.filter,
      collapsed: savedState.collapsed
    };

    this._view.webview.html = renderReviewPanelHtml(state);
  }

  private async focusFinding(sessionId: string, findingId: string): Promise<void> {
    const session = await this.repository.getSessionById(sessionId);
    const finding = session?.findings.find(f => f.id === findingId);

    if (!finding) {
      throw new Error('Finding not found. Re-run the analysis and try again.');
    }

    await this.ide.focusFinding(finding);
  }

  private async replyToFinding(sessionId: string, findingId: string): Promise<void> {
    const body = await vscode.window.showInputBox({
      title: 'Reply to finding',
      prompt: 'Write a note for this review finding.',
      placeHolder: 'Example: validar com o time antes de alterar',
      ignoreFocusOut: true,
      validateInput: value => value.trim().length === 0 ? 'Type a reply before saving.' : undefined
    });

    if (!body) {
      return;
    }

    await this.addComment(sessionId, findingId, body);
    await vscode.window.showInformationMessage('Reply added to finding.');
  }

  private async addComment(sessionId: string, findingId: string, body: string): Promise<void> {
    if (!body || !body.trim()) {
      return;
    }

    await this.addCommentToFindingUseCase.execute({
      sessionId,
      findingId,
      author: 'developer',
      body: body.trim()
    });
    await this.refresh();
  }

  private async refactorFinding(sessionId: string, findingId: string): Promise<void> {
    const previewBeforeApply = vscode.workspace
      .getConfiguration('codeReview')
      .get<boolean>('refactor.previewBeforeApply', true);

    if (!previewBeforeApply) {
      await vscode.window.withProgress(
        {
          location: vscode.ProgressLocation.Notification,
          title: 'Git Code Review: generating refactor...',
          cancellable: false
        },
        async () => {
          await this.refactorFindingUseCase.execute({ sessionId, findingId, previewOnly: false });
        }
      );
      await this.refresh();
      return;
    }

    const session = await this.repository.getSessionById(sessionId);
    if (!session) {
      throw new Error('Review session not found. Re-run the analysis and try again.');
    }
    const finding = session.findings.find(f => f.id === findingId);
    if (!finding) {
      throw new Error('Finding not found. Re-run the analysis and try again.');
    }

    const result = await vscode.window.withProgress(
      {
        location: vscode.ProgressLocation.Notification,
        title: 'Git Code Review: generating refactor preview...',
        cancellable: false
      },
      async () => this.refactorFindingUseCase.execute({ sessionId, findingId, previewOnly: true })
    );

    const originalUri = this.resolveUri(finding.file);
    const originalDocument = await vscode.workspace.openTextDocument(originalUri);
    const previewDocument = await vscode.workspace.openTextDocument({
      content: result.refactoredCode,
      language: originalDocument.languageId
    });

    await vscode.commands.executeCommand(
      'vscode.diff',
      originalDocument.uri,
      previewDocument.uri,
      `Git Code Review: ${path.basename(finding.file)} refactor preview`
    );

    const decision = await vscode.window.showWarningMessage(
      'Review the diff before applying this AI-generated refactor.',
      { modal: true },
      'Apply Fix',
      'Keep Suggestion',
      'Cancel'
    );

    if (decision === 'Apply Fix') {
      finding.suggestedFix = result.refactoredCode;
      finding.status = 'approved' as any;
      session.updatedAt = new Date();
      await this.repository.saveSession(session);
      await this.ide.applyFix(finding as any);
      await vscode.window.showInformationMessage('Refactor applied after reviewer approval.');
    } else if (decision === 'Keep Suggestion') {
      await vscode.window.showInformationMessage('Refactor suggestion saved in the local review session.');
    }

    await this.refresh();
  }

  private resolveUri(filePath: string): vscode.Uri {
    if (path.isAbsolute(filePath)) {
      return vscode.Uri.file(filePath);
    }

    const workspacePath = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    return vscode.Uri.file(workspacePath ? path.resolve(workspacePath, filePath) : filePath);
  }
}
