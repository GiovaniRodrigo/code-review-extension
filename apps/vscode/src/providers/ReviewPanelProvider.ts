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
        case 'revalidate':
          await vscode.commands.executeCommand('code-review.analyze');
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

    const findingsByFile = session.findings.reduce((acc: any, f: any) => {
        if (!acc[f.file]) acc[f.file] = [];
        acc[f.file].push(f);
        return acc;
    }, {});

    const sectionsHtml = Object.keys(findingsByFile).map(file => {
        const fileFindings = findingsByFile[file];
        const itemsHtml = fileFindings.map((f: any) => `
            <div style="border-left: 3px solid ${this._getSeverityColor(f.severity)}; padding-left: 10px; margin-bottom: 10px;">
                <strong>${f.severity.toUpperCase()}</strong>: ${f.message}<br/>
                <small>Line ${f.line}</small> | <em>${f.status}</em><br/>
                <button onclick="approve('${session.id}', '${f.id}')" ${f.status === 'approved' ? 'disabled' : ''}>Approve</button>
                <button onclick="focus('${session.id}', '${f.id}')">Focus</button>
            </div>
        `).join('');

        return `
            <details open>
                <summary style="font-weight: bold; cursor: pointer; padding: 5px; background: #333;">${file} (${fileFindings.length})</summary>
                <div style="padding: 5px;">${itemsHtml}</div>
            </details>
        `;
    }).join('');

    return `
      <html>
        <body style="font-family: var(--vscode-font-family); color: var(--vscode-foreground);">
          <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <strong>Branch:</strong> ${session.branch}<br/>
                <small><strong>Approved:</strong> ${session.findings.filter((f: any) => f.status === 'approved').length}/${session.findings.length}</small>
            </div>
            <button onclick="revalidate()">Revalidate</button>
          </div>
          <script>
            const vscode = acquireVsCodeApi();
            function approve(sessionId, findingId) {
              vscode.postMessage({ command: 'approve', sessionId, findingId });
            }
            function focus(sessionId, findingId) {
              vscode.postMessage({ command: 'focus', sessionId, findingId });
            }
            function revalidate() {
              vscode.postMessage({ command: 'revalidate' });
            }
          </script>
          ${sectionsHtml}
        </body>
      </html>
    `;
  }

  private _getSeverityColor(severity: string): string {
    switch (severity) {
        case 'critical':
        case 'error': return '#f44336';
        case 'warning': return '#ff9800';
        default: return '#2196f3';
    }
  }
}
