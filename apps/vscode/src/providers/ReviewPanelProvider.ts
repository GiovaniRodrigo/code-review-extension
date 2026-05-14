import * as vscode from 'vscode';

export class ReviewPanelProvider implements vscode.WebviewViewProvider {
  static readonly viewType = 'code-review.reviewPanel';

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    webviewView.webview.html = '<html><body><h1>Review Findings</h1></body></html>';
  }

  clear(message: string): void {
    console.log(`Review panel cleared: ${message}`);
  }
}
