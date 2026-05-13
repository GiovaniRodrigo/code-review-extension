import * as vscode from 'vscode';

export class RagStatusProvider implements vscode.WebviewViewProvider {
  static readonly viewType = 'code-review.ragStatus';

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    webviewView.webview.html = '<html><body><h1>RAG Status</h1></body></html>';
  }
}
