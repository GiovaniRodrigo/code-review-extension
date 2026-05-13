import * as vscode from 'vscode';

export class DashboardProvider implements vscode.WebviewViewProvider {
  static readonly viewType = 'code-review.dashboard';

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    webviewView.webview.html = '<html><body><h1>AI Code Review</h1></body></html>';
  }
}
