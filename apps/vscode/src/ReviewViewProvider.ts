import * as vscode from 'vscode';
import { ValidateFindingUseCase } from '@code-review/core';
import { IDEAdapter } from '@code-review/infra';
import { getWebviewContent } from '../src/views/getWebviewContent';
import * as path from 'node:path';

export class ReviewViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'code-review.findingsView';

  private _view?: vscode.WebviewView;
  private _currentSessionId?: string;
  private _findings: any[] = [];

  private _state: 'idle' | 'loading' | 'ready' | 'error' = 'idle';
  private _message = 'Waiting for analysis...';

  private _progress?: number;
  private _steps: string[] = [];

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _validateUseCase: ValidateFindingUseCase,
    private readonly _ideAdapter: IDEAdapter
  ) { }

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        vscode.Uri.file(
          path.join(
            this._extensionUri.fsPath,
            'src',
            'views',
            'webview'
          )
        )
      ]
    };

    webviewView.webview.html =
      this._getHtmlForWebview(webviewView.webview);

    this._postState();

    webviewView.webview.onDidReceiveMessage(async data => {
      if (!this._currentSessionId && data.sessionId) {
        this._currentSessionId = data.sessionId;
      }

      switch (data.type) {
        case 'select': {
          const finding = this._findings.find(f => f.id === data.id);

          if (finding) {
            await this._ideAdapter.focusFinding(finding);
          }

          break;
        }

        case 'approve':
          await this._handleAction(data.id, 'approved');
          break;

        case 'reject':
          await this._handleAction(data.id, 'rejected');
          break;

        case 'applyFix':
          await this._handleApplyFix(data.id);
          break;
      }
    });
  }

  public updateFindings(
    sessionId: string,
    findings: any[]
  ): void {
    this._currentSessionId = sessionId;
    this._findings = findings;
    this._state = 'ready';
    this._message =
      findings.length > 0
        ? 'Review session loaded.'
        : 'No findings found.';

    this._progress = undefined;
    this._steps = [];

    this._postState();
  }


  public setLoading(
    message = 'Analyzing active file...'
  ): void {
    this._state = 'loading';
    this._message = message;
    this._progress = undefined;
    this._steps = [];
    this._postState();
  }

  

  public setProgress(
    message: string,
    progress?: number,
    steps: string[] = []
  ): void {
    this._state = 'loading';
    this._message = message;
    this._progress = progress;
    this._steps = steps;
    this._postState();
  }

  public appendProgressStep(
    step: string
  ): void {
    this._steps = [
      ...this._steps,
      step
    ];

    this._postState();
  }

  public setError(
    message: string
  ): void {
    this._state = 'error';
    this._message = message;
    this._progress = undefined;
    this._steps = [];
    this._postState();
  }

  public clear(
    message = 'No active review session.'
  ): void {
    this._currentSessionId = undefined;
    this._findings = [];
    this._state = 'idle';
    this._message = message;
    this._progress = undefined;
    this._steps = [];
    this._postState();
  }

  public getCurrentSessionId(): string | undefined {
    return this._currentSessionId;
  }

  private async _handleAction(
    findingId: string,
    status: 'approved' | 'rejected'
  ): Promise<void> {
    if (!this._currentSessionId) {
      vscode.window.showErrorMessage('No active session found.');
      return;
    }

    try {
      const session =
        await this._validateUseCase.execute(
          this._currentSessionId,
          findingId,
          status
        );

      this.updateFindings(
        session.id,
        session.findings
      );

      vscode.window.showInformationMessage(
        `Finding ${status} successfully.`
      );
    } catch (error: any) {
      vscode.window.showErrorMessage(
        `Error updating finding: ${error.message}`
      );
    }
  }

  private async _handleApplyFix(
    findingId: string
  ): Promise<void> {
    const finding =
      this._findings.find(
        f => f.id === findingId
      );

    if (!finding) {
      vscode.window.showErrorMessage(
        `Finding ${findingId} not found.`
      );
      return;
    }

    try {
      await this._ideAdapter.applyFix(finding);
    } catch (error: any) {
      vscode.window.showErrorMessage(
        `Error applying fix: ${error.message}`
      );
    }
  }

  private _postState(): void {
    this._view?.webview.postMessage({
      type: 'state',
      state: this._state,
      message: this._message,
      progress: this._progress,
      steps: this._steps,
      sessionId: this._currentSessionId,
      findings: this._findings
    });
  }

  private _getHtmlForWebview(
    webview: vscode.Webview
  ): string {
    return getWebviewContent(
      this._extensionUri,
      webview
    );
  }
}