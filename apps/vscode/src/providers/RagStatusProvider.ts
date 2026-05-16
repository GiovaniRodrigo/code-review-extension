import * as vscode from 'vscode';
import { renderRagStatusHtml } from '@code-review/ui';

export class RagStatusProvider implements vscode.WebviewViewProvider {
  static readonly viewType = 'code-review.ragStatus';

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    webviewView.webview.html = renderRagStatusHtml({
        status: 'idle',
        totalChunks: 0,
        lastIndexed: 'Never'
    });
  }
}
