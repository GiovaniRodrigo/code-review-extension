import * as vscode from 'vscode';
import { HeatmapService, AuditLogService } from '@code-review/core';
import { renderDashboardHtml, DashboardState } from '@code-review/ui';

export class DashboardProvider implements vscode.WebviewViewProvider {
  static readonly viewType = 'code-review.dashboard';

  private _view?: vscode.WebviewView;

  constructor(
    private readonly heatmapService?: HeatmapService,
    private readonly auditLog?: AuditLogService
  ) {}

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    this._view = webviewView;
    webviewView.webview.options = { enableScripts: true };
    this.refresh();
  }

  async refresh(): Promise<void> {
    if (!this._view) return;
    
    const heat = this.heatmapService ? await this.heatmapService.calculateHeatmap() : [];
    const logs = this.auditLog ? await this.auditLog.getLogs({}) : [];
    
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
        }))
    };

    this._view.webview.html = renderDashboardHtml(state);
  }
}
