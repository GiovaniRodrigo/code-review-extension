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
        await vscode.commands.executeCommand('code-review.openProviderSetup');
      } else if (message.command === 'indexRag') {
        await vscode.commands.executeCommand('code-review.indexRepositoryRag');
      }
    });

    this._updateHtml();
  }

  public refresh(): void { this._updateHtml(); }

  private async _handleMessage(query: string) {
    if (!this._view || !query?.trim()) return;
    this._history.push({ role: 'user', content: query.trim() });
    this._updateHtml(true);
    try {
      const response = await this.chatUseCase.execute(query.trim(), this._history.slice(0, -1));
      this._history.push({ role: 'assistant', content: response.answer });
    } catch (e: any) {
      this._history.push({ role: 'assistant', content: `I could not answer with repository context yet. ${e?.message || String(e)}` });
    } finally {
      this._updateHtml(false);
    }
  }

  private _updateHtml(loading = false) {
    if (!this._view) return;
    let activeProvider = 'Mock/Ollama';
    try { activeProvider = (this.chatUseCase as any).aiProvider?.activeProviderId || activeProvider; } catch {}
    const branch = vscode.workspace.workspaceFolders?.[0]?.name || 'current workspace';
    const messages = this._history.length ? this._history : [
      { role: 'assistant' as const, content: 'Ask about architecture, changed files, review risks or a specific finding. Index RAG first for better context.' }
    ];

    this._view.webview.html = `<!DOCTYPE html><html><head><meta charset="UTF-8" />
<style>
:root{--primary:#534AB7;--ok:#3B6D11;--warn:#BA7517;--border:var(--vscode-widget-border,rgba(255,255,255,.14));}
*{box-sizing:border-box}body{font-family:var(--vscode-font-family);color:var(--vscode-foreground);background:var(--vscode-editor-background);padding:12px;margin:0;height:100vh;display:flex;flex-direction:column;font-size:12px}.hero{border:1px solid var(--border);border-radius:16px;padding:12px;background:linear-gradient(135deg,rgba(83,74,183,.16),transparent);margin-bottom:10px}.kicker{text-transform:uppercase;letter-spacing:.08em;font-size:10px;color:var(--vscode-descriptionForeground)}.title{font-size:16px;font-weight:750;margin:4px 0}.muted{color:var(--vscode-descriptionForeground);font-size:11px}.badge{border:1px solid var(--border);border-radius:999px;padding:2px 8px;font-size:10px}.chat{flex:1;overflow-y:auto;display:flex;flex-direction:column;gap:10px;padding-bottom:10px}.wrap{display:flex;flex-direction:column}.wrap.user{align-items:flex-end}.wrap.assistant{align-items:flex-start}.sender{font-size:9px;color:var(--vscode-descriptionForeground);margin-bottom:3px}.msg{max-width:88%;padding:9px 11px;border-radius:12px;line-height:1.5;border:1px solid var(--border);white-space:pre-wrap}.msg.user{background:rgba(83,74,183,.18)}.msg.assistant{background:var(--vscode-sideBar-background)}.input{display:flex;gap:6px;border-top:1px solid var(--border);padding-top:10px}input{flex:1;background:var(--vscode-input-background);color:var(--vscode-input-foreground);border:1px solid var(--vscode-input-border);border-radius:8px;padding:8px}button{cursor:pointer;border:0;border-radius:8px;padding:8px 10px;background:var(--primary);color:#fff}.quick{display:flex;gap:5px;flex-wrap:wrap;margin-top:8px}.quick button{background:transparent;border:1px solid var(--border);color:var(--vscode-descriptionForeground);font-size:10px;padding:4px 8px}.top{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}</style></head>
<body>
<section class="hero"><div class="top"><div><div class="kicker">Project AI Chat</div><div class="title">Repository conversation</div><div class="muted">RAG context · ${escapeHtml(branch)} · Provider ${escapeHtml(activeProvider)}</div></div><span class="badge">${escapeHtml(activeProvider)}</span></div><div class="quick"><button onclick="post('Where is authentication implemented?')">Auth flow</button><button onclick="post('Explain current review risks')">Review risks</button><button onclick="post('Show findings by severity')">Findings</button><button onclick="vscode.postMessage({command:'indexRag'})">Index RAG</button></div></section>
<div class="chat" id="chat">${messages.map(m => `<div class="wrap ${m.role}"><div class="sender">${m.role === 'user' ? 'Reviewer' : 'AI with RAG context'}</div><div class="msg ${m.role}">${escapeHtml(m.content)}</div></div>`).join('')}${loading ? '<div class="wrap assistant"><div class="sender">AI with RAG context</div><div class="msg assistant">Thinking with repository context...</div></div>' : ''}</div>
<div class="input"><input id="input" placeholder="Ask about the codebase..." onkeydown="if(event.key==='Enter') send()" /><button onclick="send()">Send</button><button onclick="vscode.postMessage({command:'setup'})">Setup</button></div>
<script>const vscode=acquireVsCodeApi();function send(){const input=document.getElementById('input');const text=input.value.trim();if(!text)return;vscode.postMessage({command:'sendMessage',text});input.value='';}function post(text){vscode.postMessage({command:'sendMessage',text});}const chat=document.getElementById('chat');chat.scrollTop=chat.scrollHeight;</script></body></html>`;
  }
}

function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
