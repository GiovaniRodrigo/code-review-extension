import * as vscode from 'vscode';
import { 
  CodeReviewRepositoryPort, 
  IdeAdapterPort,
  ApproveFindingUseCase 
} from '@code-review/core';

export class ReviewPanelProvider implements vscode.WebviewViewProvider {
  static readonly viewType = 'code-review.findingsView';

  private _view?: vscode.WebviewView;

  constructor(
    private readonly repository: CodeReviewRepositoryPort,
    private readonly ide: IdeAdapterPort,
    private readonly approveFindingUseCase: ApproveFindingUseCase
  ) {}

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
          // We need a session to find the finding
          const session = await this.repository.getSessionById(message.sessionId);
          const finding = session?.findings.find(f => f.id === message.findingId);
          if (finding) {
            await this.ide.focusFinding(finding);
          }
          break;
      }
    });

    await this.refresh();
  }

  async refresh(): Promise<void> {
    if (!this._view) return;

    const branch = await this.ide.getActiveBranch();
    const session = await this.repository.getSessionByBranch(branch);

    this._view.webview.html = this._getHtml(session);
  }

  private _getHtml(session: any): string {
    if (!session || !session.findings.length) {
      return '<html><body><p>No findings for this branch.</p></body></html>';
    }

    const findingsHtml = session.findings.map((f: any) => `
      <div style="border: 1px solid #ccc; padding: 5px; margin-bottom: 5px;">
        <strong>${f.severity.toUpperCase()}</strong>: ${f.message}<br/>
        <small>${f.file}:${f.line}</small><br/>
        Status: ${f.status}<br/>
        <button onclick="approve('${session.id}', '${f.id}')" ${f.status === 'approved' ? 'disabled' : ''}>Approve</button>
        <button onclick="focus('${session.id}', '${f.id}')">Focus</button>
      </div>
    `).join('');

    return `
      <html>
        <body>
          <script>
            const vscode = acquireVsCodeApi();
            function approve(sessionId, findingId) {
              vscode.postMessage({ command: 'approve', sessionId, findingId });
            }
            function focus(sessionId, findingId) {
              vscode.postMessage({ command: 'focus', sessionId, findingId });
            }
          </script>
          ${findingsHtml}
        </body>
      </html>
    `;
  }
}
