import * as vscode from 'vscode';
import { AnalyzeWorkspaceDependenciesUseCase, DependencyGraphPort } from '@code-review/core';

export class DependencyGraphProvider implements vscode.WebviewViewProvider {
  static readonly viewType = 'code-review.dependencyGraph';

  private _view?: vscode.WebviewView;

  constructor(
    private readonly workspace: any,
    private readonly fileSystem: any,
    private readonly graphBuilder: DependencyGraphPort
  ) {}

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    this._view = webviewView;
    webviewView.webview.options = { enableScripts: true };
    this.refresh();
  }

  async refresh(): Promise<void> {
    if (!this._view) return;

    this._view.webview.html = '<html><body><p>Loading dependency graph...</p></body></html>';

    try {
        const useCase = new AnalyzeWorkspaceDependenciesUseCase(
            this.workspace,
            this.fileSystem,
            this.graphBuilder
        );
        const report = await useCase.execute();
        this._view.webview.html = this._getHtml(report);
    } catch (e: any) {
        this._view.webview.html = `<html><body><p>Error: ${e.message}</p></body></html>`;
    }
  }

  private _getHtml(report: any): string {
    const nodes = JSON.stringify(report.nodes);
    const cycles = JSON.stringify(report.cycles);

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: var(--vscode-font-family); color: var(--vscode-foreground); padding: 10px; overflow: hidden; }
            #graph-container { width: 100%; height: 400px; border: 1px solid #444; position: relative; }
            .node { fill: #2196f3; stroke: #fff; stroke-width: 1px; cursor: pointer; }
            .node.cycle { fill: #f44336; }
            .link { stroke: #666; stroke-opacity: 0.6; stroke-width: 1px; marker-end: url(#arrowhead); }
            .link.cycle { stroke: #f44336; stroke-width: 2px; }
            .label { font-size: 8px; fill: #ccc; pointer-events: none; }
            .legend { font-size: 10px; margin-top: 10px; }
            .legend-item { display: flex; align-items: center; gap: 5px; margin-bottom: 3px; }
          </style>
        </head>
        <body>
          <div style="margin-bottom: 10px;">
            <strong>Dependency Graph</strong> (${report.totalFiles} files)
            <button onclick="refresh()" style="float: right; cursor: pointer; font-size: 10px;">Refresh</button>
          </div>
          
          <div id="graph-container">
            <svg id="svg" width="100%" height="100%">
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="15" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#666" />
                    </marker>
                </defs>
            </svg>
          </div>

          <div class="legend">
            <div class="legend-item"><span style="background: #2196f3; width: 10px; height: 10px; border-radius: 50%;"></span> Normal Module</div>
            <div class="legend-item"><span style="background: #f44336; width: 10px; height: 10px; border-radius: 50%;"></span> Circular Dependency</div>
            <div style="margin-top: 5px; color: #f44336;"><strong>Cycles detected:</strong> ${report.cycles.length}</div>
          </div>

          <script>
            const vscode = acquireVsCodeApi();
            const nodes = ${nodes};
            const cycles = ${cycles};
            
            function refresh() {
                location.reload();
            }

            const svg = document.getElementById('svg');
            const width = svg.clientWidth || 300;
            const height = svg.clientHeight || 400;
            const centerX = width / 2;
            const centerY = height / 2;
            const radius = Math.min(width, height) * 0.4;

            // Simple Circle Layout
            nodes.forEach((node, i) => {
                const angle = (i / nodes.length) * 2 * Math.PI;
                node.x = centerX + radius * Math.cos(angle);
                node.y = centerY + radius * Math.sin(angle);
                node.isCycle = cycles.some(c => c.path.includes(node.id));
            });

            // Draw links
            nodes.forEach(node => {
                node.dependsOn.forEach(targetId => {
                    const target = nodes.find(n => n.id === targetId);
                    if (target) {
                        const link = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                        link.setAttribute('x1', node.x);
                        link.setAttribute('y1', node.y);
                        link.setAttribute('x2', target.x);
                        link.setAttribute('y2', target.y);
                        link.setAttribute('class', 'link' + (node.isCycle && target.isCycle ? ' cycle' : ''));
                        svg.appendChild(link);
                    }
                });
            });

            // Draw nodes
            nodes.forEach(node => {
                const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                circle.setAttribute('cx', node.x);
                circle.setAttribute('cy', node.y);
                circle.setAttribute('r', 5);
                circle.setAttribute('class', 'node' + (node.isCycle ? ' cycle' : ''));
                circle.setAttribute('title', node.id);
                svg.appendChild(circle);

                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', node.x + 7);
                text.setAttribute('y', node.y + 3);
                text.setAttribute('class', 'label');
                text.textContent = node.id.split('/').pop();
                svg.appendChild(text);
            });
          </script>
        </body>
      </html>
    `;
  }
}
