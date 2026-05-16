import * as vscode from 'vscode';
import { ProjectChatUseCase } from '@code-review/core';

export class ChatProvider implements vscode.WebviewViewProvider {
  static readonly viewType = 'code-review.chatView';

  private _view?: vscode.WebviewView;

  constructor(private readonly chatUseCase: ProjectChatUseCase) {}

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    this._view = webviewView;
    webviewView.webview.options = { enableScripts: true };
    webviewView.webview.html = this._getHtml();

    webviewView.webview.onDidReceiveMessage(async (message) => {
      switch (message.command) {
        case 'ask':
          await this._handleAsk(message.text);
          break;
      }
    });
  }

  private async _handleAsk(text: string) {
      if (!this._view) return;
      
      this._view.webview.postMessage({ command: 'addMessage', role: 'user', content: text });
      this._view.webview.postMessage({ command: 'setLoading', loading: true });

      try {
          const response = await this.chatUseCase.execute(text);
          this._view.webview.postMessage({ 
              command: 'addMessage', 
              role: 'assistant', 
              content: response.answer,
              files: response.relevantFiles
          });
      } catch (e: any) {
          this._view.webview.postMessage({ command: 'addMessage', role: 'assistant', content: `Error: ${e.message}` });
      } finally {
          this._view.webview.postMessage({ command: 'setLoading', loading: false });
      }
  }

  private _getHtml(): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: var(--vscode-font-family); color: var(--vscode-foreground); padding: 10px; display: flex; flex-direction: column; height: 100vh; margin: 0; box-sizing: border-box; }
            #chat-history { flex: 1; overflow-y: auto; margin-bottom: 10px; }
            .message { margin-bottom: 10px; padding: 8px; border-radius: 4px; font-size: 12px; line-height: 1.4; }
            .user { background: var(--vscode-button-background); color: var(--vscode-button-foreground); align-self: flex-end; margin-left: 20px; }
            .assistant { background: var(--vscode-sideBar-background); border: 1px solid var(--vscode-widget-border); margin-right: 20px; }
            #input-container { display: flex; gap: 5px; }
            input { flex: 1; background: var(--vscode-input-background); color: var(--vscode-input-foreground); border: 1px solid var(--vscode-input-border); padding: 5px; }
            button { background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: none; padding: 5px 10px; cursor: pointer; }
            button:disabled { opacity: 0.5; }
            .files { font-size: 10px; opacity: 0.6; margin-top: 5px; border-top: 1px solid #444; padding-top: 3px; }
          </style>
        </head>
        <body>
          <div id="chat-history">
            <div class="message assistant">Hello! I am your Project AI Assistant. Ask me anything about this codebase.</div>
          </div>
          <div id="input-container">
            <input type="text" id="chat-input" placeholder="Ask about the code..." />
            <button id="send-btn">Send</button>
          </div>

          <script>
            const vscode = acquireVsCodeApi();
            const history = document.getElementById('chat-history');
            const input = document.getElementById('chat-input');
            const btn = document.getElementById('send-btn');

            btn.onclick = () => {
                const text = input.value;
                if (text) {
                    vscode.postMessage({ command: 'ask', text });
                    input.value = '';
                }
            };

            input.ononkeydown = (e) => {
                if (e.key === 'Enter') btn.click();
            };

            window.addEventListener('message', event => {
                const m = event.data;
                if (m.command === 'addMessage') {
                    const div = document.createElement('div');
                    div.className = 'message ' + m.role;
                    div.innerHTML = '<strong>' + (m.role === 'user' ? 'You' : 'AI') + ':</strong><br/>' + m.content;
                    
                    if (m.files && m.files.length > 0) {
                        const filesDiv = document.createElement('div');
                        filesDiv.className = 'files';
                        filesDiv.textContent = 'Relevant files: ' + m.files.map(f => f.split('/').pop()).join(', ');
                        div.appendChild(filesDiv);
                    }

                    history.appendChild(div);
                    history.scrollTop = history.scrollHeight;
                }
                if (m.command === 'setLoading') {
                    btn.disabled = m.loading;
                    input.disabled = m.loading;
                    if (m.loading) btn.textContent = '...';
                    else btn.textContent = 'Send';
                }
            });
          </script>
        </body>
      </html>
    `;
  }
}
