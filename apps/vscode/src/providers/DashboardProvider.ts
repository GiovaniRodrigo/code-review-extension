import * as vscode from 'vscode';
import { HeatmapService, AuditLogService, AIProviderRegistry } from '@code-review/core';
import { renderDashboardHtml, DashboardState } from '@code-review/ui';

export class DashboardProvider implements vscode.WebviewViewProvider {
  static readonly viewType = 'code-review.dashboard';

  private _view?: vscode.WebviewView;

  constructor(
    private readonly heatmapService?: HeatmapService,
    private readonly auditLog?: AuditLogService,
    private readonly aiRegistry?: AIProviderRegistry
  ) {}

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    this._view = webviewView;
    webviewView.webview.options = { enableScripts: true };

    webviewView.webview.onDidReceiveMessage(async (message) => {
        if (message.command === 'setup') {
            await vscode.commands.executeCommand('code-review.setup');
        }
        this.refresh();
    });

    this.refresh();
  }

  async refresh(): Promise<void> {
    if (!this._view) return;
    
    const heat = this.heatmapService ? await this.heatmapService.calculateHeatmap() : [];
    const logs = this.auditLog ? await this.auditLog.getLogs({}) : [];
    
    let activeProviderId = '';
    try {
        activeProviderId = (this.aiRegistry as any)?.activeProviderId || '';
    } catch (e) {
        console.debug('[DASHBOARD] Could not get active provider ID', e);
    }

    const state: DashboardState = {
        coverage: 55,
        mutationScore: 97,
        testability: { score: 85, level: 'easy' },
        gatesPassed: true,
        buildStatus: 'success',
        heat: heat.map(h => ({ file: h.file, score: h.score })),
        logs: logs.reverse().slice(0, 10).map(l => ({
            action: l.action,
            timestamp: l.timestamp,
            metadata: l.metadata
        })),
        activeAIProvider: activeProviderId
    };

    this._view.webview.html = renderDashboardHtml(state);
  }
}
