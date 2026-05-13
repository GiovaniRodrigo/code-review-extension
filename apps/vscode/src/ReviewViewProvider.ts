import * as vscode from 'vscode';
import { ValidateFindingUseCase } from '@code-review/core';
import { IDEAdapter } from '@code-review/infra';

export class ReviewViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'code-review.findingsView';
  private _view?: vscode.WebviewView;
  private _currentSessionId?: string;
  private _findings: any[] = [];
  private _state: 'idle' | 'loading' | 'ready' | 'error' = 'idle';
  private _message = 'Waiting for analysis...';

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _validateUseCase: ValidateFindingUseCase,
    private readonly _ideAdapter: IDEAdapter
  ) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken,
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    this._postState();

    webviewView.webview.onDidReceiveMessage(async (data) => {
      if (!this._currentSessionId && data.sessionId) {
        this._currentSessionId = data.sessionId;
      }

      switch (data.type) {
        case 'select':
          const finding = this._findings.find(f => f.id === data.id);
          if (finding) {
            await this._ideAdapter.focusFinding(finding);
          }
          break;
        case 'approve':
          await this._handleAction(data.id, 'approved');
          break;
        case 'reject':
          await this._handleAction(data.id, 'rejected');
          break;
      }
    });
  }

  private async _handleAction(findingId: string, status: 'approved' | 'rejected') {
    if (!this._currentSessionId) {
      vscode.window.showErrorMessage('No active session found.');
      return;
    }

    try {
      const session = await this._validateUseCase.execute(this._currentSessionId, findingId, status);
      this.updateFindings(session.id, session.findings);
      vscode.window.showInformationMessage(`Finding ${status} successfully.`);
    } catch (error: any) {
      vscode.window.showErrorMessage(`Error updating finding: ${error.message}`);
    }
  }

  public updateFindings(sessionId: string, findings: any[]) {
    this._currentSessionId = sessionId;
    this._findings = findings;
    this._state = 'ready';
    this._message = findings.length > 0 ? 'Review session loaded.' : 'No findings found.';
    this._postState();
  }

  public setLoading(message = 'Analyzing active file...') {
    this._state = 'loading';
    this._message = message;
    this._postState();
  }

  public setError(message: string) {
    this._state = 'error';
    this._message = message;
    this._postState();
  }

  public clear(message = 'No active review session.') {
    this._currentSessionId = undefined;
    this._findings = [];
    this._state = 'idle';
    this._message = message;
    this._postState();
  }

  public getCurrentSessionId(): string | undefined {
    return this._currentSessionId;
  }

  private _postState() {
    if (this._view) {
      this._view.webview.postMessage({
        type: 'state',
        state: this._state,
        message: this._message,
        sessionId: this._currentSessionId,
        findings: this._findings
      });
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Code Review Findings</title>
        <style>
          body { font-family: sans-serif; padding: 10px; color: var(--vscode-foreground); }
          .card { border: 1px solid var(--vscode-panel-border); padding: 10px; margin-bottom: 10px; border-radius: 4px; }
          .card[data-status="approved"] { opacity: 0.85; }
          .card[data-status="rejected"] { opacity: 0.65; }
          .error { border-left: 4px solid var(--vscode-errorForeground); }
          .warning { border-left: 4px solid var(--vscode-editorWarning-foreground); }
          .info { border-left: 4px solid var(--vscode-editorInfo-foreground); }
          .meta { display: flex; justify-content: space-between; gap: 8px; }
          .status { font-size: 11px; text-transform: uppercase; color: var(--vscode-descriptionForeground); }
          .fix { white-space: pre-wrap; padding: 8px; background: var(--vscode-textCodeBlock-background); }
          button { cursor: pointer; padding: 4px 8px; margin-right: 5px; }
        </style>
			</head>
			<body>
				<div id="findings-container">Waiting for analysis...</div>
				<script>
					const vscode = acquireVsCodeApi();
          const container = document.getElementById('findings-container');
          let currentSessionId = null;

					window.addEventListener('message', event => {
						const message = event.data;
						if (message.type === 'state') {
              currentSessionId = message.sessionId;
							renderState(message);
						}
					});

          function renderState(message) {
            if (message.state === 'loading') {
              container.innerHTML = \`<div class="status">\${escapeHtml(message.message)}</div>\`;
              return;
            }

            if (message.state === 'error') {
              container.innerHTML = \`<div class="card error">\${escapeHtml(message.message)}</div>\`;
              return;
            }

            render(message.findings, message.message);
          }

          function render(findings) {
            if (!findings || findings.length === 0) {
              container.innerHTML = 'No findings found.';
              return;
            }
            container.innerHTML = findings.map(f => \`
              <div class="card \${escapeHtml(f.severity)}" data-status="\${escapeHtml(f.status)}" onclick="action('select', '\${escapeHtml(f.id)}')" style="cursor: pointer;">
                <div class="meta">
                  <strong>\${escapeHtml(f.severity.toUpperCase())}</strong>
                  <span class="status">\${escapeHtml(f.status)}</span>
                </div>
                <div>\${escapeHtml(f.file)}:\${escapeHtml(String(f.line))}</div>
                <p>\${escapeHtml(f.message)}</p>
                \${f.suggestedFix ? \`<pre class="fix">\${escapeHtml(f.suggestedFix)}</pre>\` : ''}
                \${f.status === 'pending' ? \`
                  <button onclick="event.stopPropagation(); action('approve', '\${escapeHtml(f.id)}')">Approve</button>
                  <button onclick="event.stopPropagation(); action('reject', '\${escapeHtml(f.id)}')">Reject</button>
                \` : ''}
              </div>
            \`).join('');
          }

          function action(type, id) {
            vscode.postMessage({ type, id, sessionId: currentSessionId });
          }

          function escapeHtml(value) {
            return String(value)
              .replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .replace(/>/g, '&gt;')
              .replace(/"/g, '&quot;')
              .replace(/'/g, '&#039;');
          }
				</script>
			</body>
			</html>`;
  }
}
