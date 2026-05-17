import * as vscode from 'vscode';
import { ProjectChatUseCase } from '@code-review/core';

export class ChatProvider implements vscode.WebviewViewProvider {
  static readonly viewType = 'code-review.chatView';

  private _view?: vscode.WebviewView;
  private _history: { role: 'user' | 'assistant', content: string }[] = [];

  constructor(private readonly chatUseCase: ProjectChatUseCase) {}

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    this._view = webviewView;
    webviewView.webview.options = { enableScripts: true };

    webviewView.webview.onDidReceiveMessage(async (message) => {
      if (message.command === 'sendMessage') {
        await this._handleMessage(message.text);
      } else if (message.command === 'setup') {
        await vscode.commands.executeCommand('code-review.setup');
      }
    });

    this._updateHtml();
  }

  public refresh(): void {
    this._updateHtml();
  }

  private async _handleMessage(query: string) {
    if (!this._view) return;

    this._history.push({ role: 'user', content: query });
    this._updateHtml(true);

    try {
      const response = await this.chatUseCase.execute(query, this._history.slice(0, -1));
      this._history.push({ role: 'assistant', content: response.answer });
    } catch (e: any) {
      this._history.push({ role: 'assistant', content: `Error: ${e.message}` });
    } finally {
      this._updateHtml(false);
    }
  }

  private _updateHtml(loading = false) {
    if (!this._view) return;

    // Get active provider for display
    let activeProvider = 'Unknown';
    try {
        activeProvider = (this.chatUseCase as any).aiProvider?.activeProviderId || 'Default';
    } catch (e) {
        console.debug('[CHAT] Could not get active provider ID', e);
    }

    this._view.webview.html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: var(--vscode-font-family); color: var(--vscode-foreground); padding: 10px; margin: 0; display: flex; flex-direction: column; height: 100vh; }
            #chat { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; margin-bottom: 10px; }
            .msg { padding: 8px; border-radius: 6px; max-width: 90%; font-size: 13px; line-height: 1.4; }
            .user { align-self: flex-end; background: var(--vscode-button-background); color: var(--vscode-button-foreground); }
            .assistant { align-self: flex-start; background: var(--vscode-editor-inactiveSelectionBackground); }
            .header { display: flex; justify-content: space-between; align-items: center; padding-bottom: 8px; border-bottom: 1px solid var(--vscode-widget-border); margin-bottom: 10px; }
            .provider-badge { font-size: 10px; background: var(--vscode-badge-background); color: var(--vscode-badge-foreground); padding: 2px 6px; border-radius: 10px; }
            .input-container { display: flex; gap: 5px; }
            input { flex: 1; padding: 6px; background: var(--vscode-input-background); color: var(--vscode-input-foreground); border: 1px solid var(--vscode-input-border); border-radius: 4px; }
            button { background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; padding: 6px 12px; border-radius: 4px; cursor: pointer; }
            button:disabled { opacity: 0.5; }
            .setup-btn { background: none; color: var(--vscode-textLink-foreground); text-decoration: underline; padding: 0; font-size: 10px; border: none; cursor: pointer; }
          </style>
        </head>
        <body>
          <div class="header">
            <span style="font-weight: bold; font-size: 12px;">AI Assistant</span>
            <div style="display: flex; align-items: center; gap: 4px;">
                <span class="provider-badge">${activeProvider}</span>
                <button class="setup-btn" onclick="vscode.postMessage({ command: 'setup' })">Configure</button>
            </div>
          </div>
          <div id="chat">
            ${this._history.map(m => `<div class="msg ${m.role}">${m.content}</div>`).join('')}
            ${loading ? '<div class="msg assistant">...</div>' : ''}
          </div>
          <div class="input-container">
            <input type="text" id="input" placeholder="Ask about the code..." onkeydown="if(event.key==='Enter') send()">
            <button id="btn" ${loading ? 'disabled' : ''} onclick="send()">Send</button>
          </div>
          <script>
            const vscode = acquireVsCodeApi();
            function send() {
                const text = document.getElementById('input').value;
                if (!text) return;
                vscode.postMessage({ command: 'sendMessage', text });
                document.getElementById('input').value = '';
            }
            // Auto-scroll
            const chat = document.getElementById('chat');
            chat.scrollTop = chat.scrollHeight;
          </script>
        </body>
      </html>
    `;
  }
}
