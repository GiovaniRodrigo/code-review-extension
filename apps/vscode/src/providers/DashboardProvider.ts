import * as vscode from 'vscode';
import { HeatmapService, FileHeat } from '@code-review/core';

export class DashboardProvider implements vscode.WebviewViewProvider {
  static readonly viewType = 'code-review.dashboard';

  private _view?: vscode.WebviewView;

  constructor(private readonly heatmapService?: HeatmapService) {}

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    this._view = webviewView;
    webviewView.webview.options = { enableScripts: true };
    this.refresh();
  }

  async refresh(): Promise<void> {
    if (!this._view) return;
    
    const heat = this.heatmapService ? await this.heatmapService.getHeatmap() : [];
    
    this._view.webview.html = this._getHtml({
        coverage: 55,
        mutationScore: 97,
        gatesPassed: true,
        buildStatus: 'success',
        heat
    });
  }

  private _getHtml(data: any): string {
    const heatHtml = data.heat.slice(0, 5).map((h: FileHeat) => `
        <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px;">
            <span title="${h.file}" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 150px;">
                ${h.file.split('/').pop()}
            </span>
            <span style="color: ${this._getHeatColor(h.score)}; font-weight: bold;">${h.score} pts</span>
        </div>
    `).join('');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: var(--vscode-font-family); color: var(--vscode-foreground); padding: 10px; }
            .card { background: var(--vscode-sideBar-background); padding: 10px; margin-bottom: 10px; border: 1px solid var(--vscode-widget-border); }
            .title { font-size: 10px; text-transform: uppercase; opacity: 0.7; margin-bottom: 5px; }
            .score { font-size: 20px; font-weight: bold; }
            .status-success { color: #4caf50; }
            .status-error { color: #f44336; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="title">Technical Debt Hotspots</div>
            ${heatHtml || '<div style="opacity: 0.5; font-size: 11px;">No data yet. Run an analysis.</div>'}
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
            <div class="card">
                <div class="title">Coverage</div>
                <div class="score">${data.coverage}%</div>
            </div>
            <div class="card">
                <div class="title">Mutation</div>
                <div class="score">${data.mutationScore}%</div>
            </div>
          </div>

          <div class="card">
            <div class="title">Quality Gates</div>
            <div class="score ${data.gatesPassed ? 'status-success' : 'status-error'}">
                ${data.gatesPassed ? 'PASSED' : 'FAILED'}
            </div>
          </div>
        </body>
      </html>
    `;
  }

  private _getHeatColor(score: number): string {
    if (score > 100) return '#f44336';
    if (score > 50) return '#ff9800';
    return '#4caf50';
  }
}
