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
    private readonly approveFindingUseCase: ApproveFindingUseCase,
    private readonly context: vscode.ExtensionContext
  ) { }

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
          {
            const session = await this.repository.getSessionById(message.sessionId);
            const finding = session?.findings.find(f => f.id === message.findingId);
            if (finding) {
              await this.ide.focusFinding(finding);
            }
          }
          break;
        case 'revalidate':
          await vscode.commands.executeCommand('code-review.analyze');
          break;
        case 'copy':
          await vscode.env.clipboard.writeText(message.text);
          await vscode.window.showInformationMessage('Finding copied to clipboard.');
          break;
        case 'saveState':
          await this.context.workspaceState.update('review-panel-state', message.state);
          break;
      }
    });

    webviewView.onDidDispose(() => {
      this._view = undefined;
    });

    await this.refresh();
  }

  async refresh(isLoading = false): Promise<void> {
    if (!this._view) return;

    const branch = await this.ide.getActiveBranch();
    const session = await this.repository.getSessionByBranch(branch);
    const savedState = this.context.workspaceState.get('review-panel-state', { filter: 'all', collapsed: [] as string[] });

    this._view.webview.html = this._getHtml(session, isLoading, savedState);
  }

  private _getHtml(session: any, isLoading = false, state: any = {}): string {
    const loadingHtml = isLoading ? '<div style="background: #333; padding: 5px; text-align: center;">AI is analyzing...</div>' : '';

    if (!session || !session.findings.length) {
      return `<html><body style="font-family: var(--vscode-font-family); color: var(--vscode-foreground);">${loadingHtml}<p>No findings for this branch.</p></body></html>`;
    }

    const findingsByFile = session.findings.reduce((acc: any, f: any) => {
      if (!acc[f.file]) acc[f.file] = [];
      acc[f.file].push(f);
      return acc;
    }, {});

    const sectionsHtml = Object.keys(findingsByFile).map(file => {
      const fileFindings = findingsByFile[file];
      const isCollapsed = state.collapsed?.includes(file);
      const itemsHtml = fileFindings.map((f: any) => {
      const confidence = f.confidenceScore !== undefined ? f.confidenceScore : 0.8;
      const confidencePercent = Math.round(confidence * 100);
      const confidenceColor = confidence >= 0.8 ? '#4caf50' : confidence >= 0.5 ? '#ff9800' : '#f44336';
      const confidenceLabel = confidence >= 0.8 ? 'High' : confidence >= 0.5 ? 'Medium' : 'Low';

      return `
            <div class="finding-item" id="item-${f.id}" data-severity="${f.severity}" style="border-left: 3px solid ${this._getSeverityColor(f.severity)}; padding-left: 10px; margin-bottom: 10px; position: relative;">
                <div style="font-size: 10px; position: absolute; right: 5px; top: 0; color: #888;">#${f.id.substring(0, 4)}</div>
                <strong>${f.severity.toUpperCase()}</strong>: ${f.message}<br/>
                <small>Line ${f.line}</small> | <em>${f.status}</em><br/>
                <div style="margin-top: 5px; font-size: 10px; display: flex; align-items: center; gap: 5px;">
                    <span title="AI Confidence: ${confidencePercent}%" style="background: ${confidenceColor}; width: 8px; height: 8px; border-radius: 50%; display: inline-block;"></span>
                    <span style="color: ${confidenceColor}; opacity: 0.8;">AI Confidence: ${confidenceLabel} (${confidencePercent}%)</span>
                </div>
                <div style="margin-top: 5px; display: flex; gap: 5px;">
                    <button onclick="approve('${session.id}', '${f.id}')" ${f.status === 'approved' ? 'disabled' : ''}>Approve</button>
                    <button onclick="focusItem('${session.id}', '${f.id}')">Focus</button>
                    <button onclick="copyFinding('${f.message}')">Copy</button>
                </div>
            </div>
        `;
    }).join('');

      return `
            <details class="file-section" ${isCollapsed ? '' : 'open'} ontoggle="saveCurrentState()">
                <summary style="font-weight: bold; cursor: pointer; padding: 5px; background: #333; margin-bottom: 5px;" data-file="${file}">${file} (${fileFindings.length})</summary>
                <div style="padding: 5px;">${itemsHtml}</div>
            </details>
        `;
    }).join('');

    return `
      <html>
        <head>
          <style>
            .filter-btn { background: none; border: 1px solid #555; color: #ccc; cursor: pointer; padding: 2px 5px; font-size: 10px; }
            .filter-btn.active { background: #555; color: white; }
            .highlight { background: rgba(255, 255, 0, 0.1); }
            button { cursor: pointer; font-size: 11px; }
          </style>
        </head>
        <body style="font-family: var(--vscode-font-family); color: var(--vscode-foreground);">
          <div style="margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
            <div>
                <strong>Branch:</strong> ${session.branch}<br/>
                <small><strong>Approved:</strong> ${session.findings.filter((f: any) => f.status === 'approved').length}/${session.findings.length}</small>
            </div>
            <button onclick="revalidate()">Revalidate</button>
          </div>
          <div style="margin-bottom: 10px; display: flex; gap: 5px;">
            <button class="filter-btn ${state.filter === 'all' ? 'active' : ''}" data-type="all" onclick="filter('all', this)">All</button>
            <button class="filter-btn ${state.filter === 'error' ? 'active' : ''}" data-type="error" onclick="filter('error', this)">Errors</button>
            <button class="filter-btn ${state.filter === 'warning' ? 'active' : ''}" data-type="warning" onclick="filter('warning', this)">Warnings</button>
            <button class="filter-btn ${state.filter === 'info' ? 'active' : ''}" data-type="info" onclick="filter('info', this)">Info</button>
          </div>
          ${loadingHtml}
          <div id="findings-container">
            ${sectionsHtml}
          </div>
          <script>
            const vscode = acquireVsCodeApi();
            
            // Apply initial filter if not 'all'
            window.addEventListener('load', () => {
                const activeFilter = document.querySelector('.filter-btn.active');
                if (activeFilter && activeFilter.dataset.type !== 'all') {
                    filter(activeFilter.dataset.type, activeFilter);
                }
            });

            function approve(sessionId, findingId) {
              vscode.postMessage({ command: 'approve', sessionId, findingId });
            }
            function focusItem(sessionId, findingId) {
              document.querySelectorAll('.finding-item').forEach(i => i.classList.remove('highlight'));
              const item = document.getElementById('item-' + findingId);
              if (item) item.classList.add('highlight');
              vscode.postMessage({ command: 'focus', sessionId, findingId });
            }
            function copyFinding(text) {
              vscode.postMessage({ command: 'copy', text });
            }
            function revalidate() {
              vscode.postMessage({ command: 'revalidate' });
            }
            function filter(severity, btn) {
              document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
              btn.classList.add('active');
              
              document.querySelectorAll('.finding-item').forEach(item => {
                if (severity === 'all' || item.dataset.severity === severity || (severity === 'error' && item.dataset.severity === 'critical')) {
                  item.style.display = 'block';
                } else {
                  item.style.display = 'none';
                }
              });

              document.querySelectorAll('.file-section').forEach(section => {
                const visibleItems = Array.from(section.querySelectorAll('.finding-item')).filter(i => i.style.display !== 'none');
                section.style.display = visibleItems.length > 0 ? 'block' : 'none';
              });
              saveCurrentState();
            }

            function saveCurrentState() {
                const state = {
                    filter: document.querySelector('.filter-btn.active').dataset.type,
                    collapsed: Array.from(document.querySelectorAll('.file-section:not([open]) summary')).map(s => s.dataset.file)
                };
                vscode.postMessage({ command: 'saveState', state });
            }
          </script>
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
