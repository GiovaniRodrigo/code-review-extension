import * as vscode from 'vscode';
import {
  CodeReviewRepositoryPort,
  IdeAdapterPort,
  ApproveFindingUseCase
} from '@code-review/core';
import { renderReviewPanelHtml, ReviewPanelState } from '@code-review/ui';

export class ReviewPanelProvider implements vscode.WebviewViewProvider {
  static readonly viewType = 'code-review.findingsView';

  private _view?: vscode.WebviewView;

  constructor(
    private readonly repository: CodeReviewRepositoryPort,
    private readonly ide: IdeAdapterPort,
    private readonly approveFindingUseCase: ApproveFindingUseCase,
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
      switch (message.command) {
        case 'approve':
          await this.approveFindingUseCase.execute(message.sessionId, message.findingId);
          await this.refresh();
          break;
        case 'focus':
          {
            const session = await this.repository.getSessionById(message.sessionId);
            const finding = session?.findings.find(f => f.id === message.findingId);
            if (finding) {
              await this.ide.focusFinding(finding);
            }
          }
          break;
        case 'revalidate':
          await vscode.commands.executeCommand('code-review.analyze');
          break;
        case 'copy':
          await vscode.env.clipboard.writeText(message.text);
          await vscode.window.showInformationMessage('Finding copied to clipboard.');
          break;
        case 'addComment':
          await (this as any).addCommentToFindingUseCase?.execute({
            sessionId: message.sessionId,
            findingId: message.findingId,
            author: 'developer',
            body: message.body
          });
          await this.refresh();
          break;
        case 'refactor':
          try {
            await (this as any).refactorFindingUseCase?.execute({
                sessionId: message.sessionId,
                findingId: message.findingId
            });
            await this.refresh();
          } catch (e: any) {
            vscode.window.showErrorMessage(`Refactoring failed: ${e.message}`);
          }
          break;
        case 'saveState':
          await this.context.workspaceState.update('review-panel-state', message.state);
          break;
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
}
