import * as vscode from 'vscode';
import { renderRagStatusHtml } from '@code-review/ui';
import { RagIndexingService } from '@code-review/core';

export class RagStatusProvider implements vscode.WebviewViewProvider {
  static readonly viewType = 'code-review.ragStatus';

  private _view?: vscode.WebviewView;

  constructor(private readonly ragService: RagIndexingService) {}

  async resolveWebviewView(webviewView: vscode.WebviewView): Promise<void> {
    this._view = webviewView;
    webviewView.webview.options = { enableScripts: true };

    webviewView.webview.onDidReceiveMessage(async (message) => {
      switch (message.command) {
        case 'index':
          await vscode.commands.executeCommand('code-review.indexRepositoryRag');
          break;
        case 'clear':
          await vscode.commands.executeCommand('code-review.clearRepositoryRag');
          break;
        case 'search':
          await vscode.commands.executeCommand('code-review.searchRepositoryContext');
          break;
        case 'configure':
          await vscode.commands.executeCommand('workbench.action.openSettings', 'codeReview.rag');
          break;
      }
      this.refresh();
    });

    await this.refresh();
  }

  async refresh(): Promise<void> {
    if (!this._view) return;

    try {
        const status = await this.ragService.getStatus();
        this._view.webview.html = renderRagStatusHtml({
            status: status.status as any,
            totalChunks: status.totalChunks,
            totalFiles: status.totalFiles,
            lastIndexed: status.lastIndexed ? new Date(status.lastIndexed).toLocaleString() : 'Never',
            error: status.lastError
        });
    } catch (e: any) {
        this._view.webview.html = renderRagStatusHtml({
            status: 'error',
            error: e.message
        });
    }
  }
}
