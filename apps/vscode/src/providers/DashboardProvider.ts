import * as vscode from 'vscode';

export class DashboardProvider implements vscode.WebviewViewProvider {
  static readonly viewType = 'code-review.dashboard';

  private _view?: vscode.WebviewView;

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    this._view = webviewView;
    webviewView.webview.options = { enableScripts: true };
    this.update({
        coverage: 55,
        mutationScore: 97,
        gatesPassed: true,
        buildStatus: 'success'
    });
  }

  update(data: { coverage: number, mutationScore: number, gatesPassed: boolean, buildStatus: string }): void {
    if (this._view) {
      this._view.webview.html = this._getHtml(data);
    }
  }

  private _getHtml(data: any): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            .card { background: var(--vscode-sideBar-background); padding: 10px; margin-bottom: 10px; border: 1px solid var(--vscode-widget-border); }
            .score { font-size: 24px; font-weight: bold; }
            .status-success { color: #4caf50; }
            .status-error { color: #f44336; }
          </style>
        </head>
        <body>
          <div class="card">
            <div>Coverage</div>
            <div class="score">${data.coverage}%</div>
          </div>
          <div class="card">
            <div>Mutation Score</div>
            <div class="score">${data.mutationScore}%</div>
          </div>
          <div class="card">
            <div>Quality Gates</div>
            <div class="score ${data.gatesPassed ? 'status-success' : 'status-error'}">
                ${data.gatesPassed ? 'PASSED' : 'FAILED'}
            </div>
          </div>
          <div class="card">
            <div>Build Status</div>
            <div class="score status-success">${data.buildStatus}</div>
          </div>
        </body>
      </html>
    `;
  }
}
