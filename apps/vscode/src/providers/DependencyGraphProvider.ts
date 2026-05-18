import * as vscode from 'vscode';
import { AnalyzeWorkspaceDependenciesUseCase, DependencyGraphPort } from '@code-review/core';


async function openDependencyGraphFile(message: any): Promise<void> {
  const files = Array.isArray(message.files)
    ? message.files.map((file: unknown) => String(file || '')).filter(Boolean)
    : [];
  let filePath = typeof message.filePath === 'string' ? message.filePath : '';

  if (!filePath && files.length === 1) filePath = files[0];

  if (!filePath && files.length > 1) {
    const selected = await vscode.window.showQuickPick(
      files.map(file => ({
        label: file.split(/[\\/]/).pop() || file,
        description: file,
        filePath: file
      })),
      { title: 'Open dependency graph file' }
    );
    filePath = selected?.filePath || '';
  }

  if (!filePath) {
    vscode.window.showInformationMessage('No file is attached to this dependency node.');
    return;
  }

  try {
    const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(filePath));
    await vscode.window.showTextDocument(doc, { preview: false });
  } catch (error: any) {
    vscode.window.showWarningMessage(`Could not open dependency graph file: ${error?.message || String(error)}`);
  }
}

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
    webviewView.webview.onDidReceiveMessage(async (message) => {
      switch (message.command) {
        case 'openFile': {
          await openDependencyGraphFile(message);
          break;
        }
        case 'refresh':
          await this.refresh();
          break;
      }
    });
    this.refresh();
  }

  async refresh(): Promise<void> {
    if (!this._view) return;
    this._view.webview.html = this.loadingHtml();
    try {
      const useCase = new AnalyzeWorkspaceDependenciesUseCase(this.workspace, this.fileSystem, this.graphBuilder);
      const report = await useCase.execute();
      this._view.webview.html = this.renderGraph(report);
    } catch (e: any) {
      this._view.webview.html = this.errorHtml(e?.message || String(e));
    }
  }

  private loadingHtml(): string {
    return this.shell(`<section class="card"><div class="title">Dependency Graph</div><div class="muted">Building graph from workspace dependencies...</div></section>`);
  }

  private errorHtml(message: string): string {
    return this.shell(`<section class="card danger"><div class="title">Dependency Graph error</div><div class="muted">${escapeHtml(message)}</div><button onclick="vscode.postMessage({command:'refresh'})">Refresh</button></section>`);
  }

  private renderGraph(report: any): string {
    const rawNodes = Array.isArray(report.nodes) ? report.nodes : [];
    const rawCycles = Array.isArray(report.cycles) ? report.cycles : [];
    const nodes = safeJson(rawNodes.slice(0, 320));
    const cycles = safeJson(rawCycles.slice(0, 40));
    const totalFiles = Number(report.totalFiles || rawNodes.length || 0);
    const renderedFiles = Number(report.renderedFiles || rawNodes.length || 0);
    const totalEdges = rawNodes.reduce((sum: number, node: any) => sum + new Set(node.dependsOn || []).size, 0);

    return this.shell(`
      <section class="hero">
        <div>
          <div class="kicker">Architecture view</div>
          <div class="title">Dependency Graph</div>
          <div class="muted">Clean package/file dependency map. Generated files, tests, node_modules, declaration files and broken paths are excluded.</div>
        </div>
        <button onclick="vscode.postMessage({command:'refresh'})">Refresh</button>
      </section>

      <section class="stats">
        <div class="stat"><span>Total files</span><strong>${totalFiles}</strong></div>
        <div class="stat"><span>Rendered files</span><strong>${renderedFiles}</strong></div>
        <div class="stat"><span>Dependencies</span><strong>${totalEdges}</strong></div>
        <div class="stat"><span>Cycles</span><strong class="danger-text">${rawCycles.length}</strong></div>
      </section>

      <section class="toolbar">
        <span>Scope</span>
        <button class="pill active" id="scopePackage" onclick="setScope('package')">Package</button>
        <button class="pill" id="scopeFile" onclick="setScope('file')">File</button>
        <span class="sep"></span>
        <label><input type="checkbox" id="showImports" checked onchange="render()" /> Imports</label>
        <label><input type="checkbox" id="showCycles" checked onchange="render()" /> Cycles</label>
        <span class="sep"></span>
        <button class="pill" onclick="resetView()">Reset</button>
      </section>

      <section class="canvasWrap">
        <canvas id="graph" width="680" height="390"></canvas>
        <div class="tooltip" id="tooltip"></div>
      </section>
      <section class="legend"><span><i class="dot normal"></i>Module</span><span><i class="dot cycle"></i>Circular dependency</span><span><i class="line"></i>Import</span><span>Click a file node to open it</span></section>

      <script>
        const vscode = acquireVsCodeApi();
        const rawNodes = ${nodes};
        const cycles = ${cycles};
        const canvas = document.getElementById('graph');
        const ctx = canvas.getContext('2d');
        const tip = document.getElementById('tooltip');
        let scope = 'package';
        let hoverId = null;
        let graphState = { nodes: [], edges: [] };

        function setScope(next) {
          scope = next;
          document.getElementById('scopePackage').classList.toggle('active', next === 'package');
          document.getElementById('scopeFile').classList.toggle('active', next === 'file');
          hoverId = null;
          render();
        }

        function resetView() { hoverId = null; render(); }
        function shorten(id) { const parts = String(id || '').split(/[\\/]/).filter(Boolean); return parts[parts.length - 1] || String(id || 'module'); }
        function packageName(id) {
          const parts = String(id || '').split(/[\\/]/).filter(Boolean);
          if (parts.length === 0) return 'workspace';
          if ((parts[0] === 'packages' || parts[0] === 'apps') && parts[1]) return parts.slice(0, 2).join('/');
          if (parts[0] === 'app' && parts[1]) return parts.slice(0, 2).join('/');
          if (parts[0] === 'resources' && parts[1]) return parts.slice(0, Math.min(3, parts.length)).join('/');
          if ((parts[0] === 'src' || parts[0] === 'routes' || parts[0] === 'database') && parts[1]) return parts.slice(0, 2).join('/');
          return parts[0];
        }

        const cycleFileSet = new Set();
        cycles.forEach(c => (c.path || []).forEach(p => cycleFileSet.add(String(p))));
        function isCycleNode(id) {
          if (scope === 'file') return cycleFileSet.has(String(id));
          return Array.from(cycleFileSet).some(p => packageName(p) === id);
        }

        function buildGraph() {
          if (scope === 'file') {
            const degree = new Map();
            rawNodes.forEach(n => {
              degree.set(n.id, (degree.get(n.id) || 0) + new Set(n.dependsOn || []).size);
              (n.dependsOn || []).forEach(d => degree.set(d, (degree.get(d) || 0) + 1));
            });
            const visible = rawNodes
              .filter(n => (degree.get(n.id) || 0) > 0)
              .sort((a,b) => (degree.get(b.id) || 0) - (degree.get(a.id) || 0) || String(a.id).localeCompare(String(b.id)))
              .slice(0, 90);
            const visibleIds = new Set(visible.map(n => n.id));
            const nodes = visible.map(n => ({ id: n.id, label: shorten(n.id), filePath: n.filePath || n.id, degree: degree.get(n.id) || 0, files: [n.id] }));
            const edges = [];
            visible.forEach(n => Array.from(new Set(n.dependsOn || [])).forEach(dep => { if (visibleIds.has(dep)) edges.push({ from: n.id, to: dep }); }));
            return { nodes, edges };
          }

          const packages = new Map();
          rawNodes.forEach(n => {
            const key = packageName(n.id);
            if (!packages.has(key)) packages.set(key, { id: key, label: key, files: [], deps: new Set(), degree: 0 });
            packages.get(key).files.push(n.filePath || n.id);
          });
          rawNodes.forEach(n => {
            const from = packageName(n.id);
            const fromNode = packages.get(from);
            if (!fromNode) return;
            Array.from(new Set(n.dependsOn || [])).forEach(dep => {
              const to = packageName(dep);
              if (to && to !== from && packages.has(to)) fromNode.deps.add(to);
            });
          });
          const all = Array.from(packages.values());
          all.forEach(pkg => { pkg.degree = pkg.deps.size + all.filter(other => other.deps.has(pkg.id)).length; });
          const nodes = all.sort((a,b) => b.degree - a.degree || b.files.length - a.files.length || a.id.localeCompare(b.id)).slice(0, 70);
          const visible = new Set(nodes.map(n => n.id));
          const edges = [];
          nodes.forEach(n => Array.from(n.deps).forEach(dep => { if (visible.has(dep)) edges.push({ from: n.id, to: dep }); }));
          return { nodes, edges };
        }

        function layout(graph) {
          const nodes = graph.nodes;
          const edges = graph.edges;
          const w = canvas.width;
          const h = canvas.height;
          const cx = w / 2;
          const cy = h / 2;
          if (nodes.length === 0) return;
          const radius = Math.min(w, h) * 0.34;
          nodes.forEach((n, i) => {
            const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
            const ring = radius * (0.72 + ((i % 3) * 0.12));
            n.x = cx + Math.cos(angle) * ring;
            n.y = cy + Math.sin(angle) * ring;
          });
          const byId = new Map(nodes.map(n => [n.id, n]));
          for (let iter = 0; iter < 90; iter++) {
            for (let i = 0; i < nodes.length; i++) {
              for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i]; const b = nodes[j];
                let dx = a.x - b.x; let dy = a.y - b.y;
                let d2 = dx * dx + dy * dy || 0.01;
                const f = Math.min(900 / d2, 1.8);
                const d = Math.sqrt(d2);
                dx /= d; dy /= d;
                a.x += dx * f; a.y += dy * f; b.x -= dx * f; b.y -= dy * f;
              }
            }
            edges.forEach(e => {
              const a = byId.get(e.from); const b = byId.get(e.to); if (!a || !b) return;
              const dx = b.x - a.x; const dy = b.y - a.y; const d = Math.sqrt(dx*dx + dy*dy) || 1;
              const target = scope === 'package' ? 150 : 110;
              const f = (d - target) * 0.006;
              a.x += dx / d * f; a.y += dy / d * f; b.x -= dx / d * f; b.y -= dy / d * f;
            });
            nodes.forEach(n => { n.x += (cx - n.x) * 0.008; n.y += (cy - n.y) * 0.008; n.x = Math.max(30, Math.min(w - 30, n.x)); n.y = Math.max(28, Math.min(h - 28, n.y)); });
          }
        }

        function render() {
          graphState = buildGraph();
          layout(graphState);
          const nodes = graphState.nodes;
          const edges = graphState.edges;
          const byId = new Map(nodes.map(n => [n.id, n]));
          ctx.clearRect(0,0,canvas.width,canvas.height);
          ctx.fillStyle = getComputedStyle(document.body).getPropertyValue('--bg') || '#1e1e1e';
          ctx.fillRect(0,0,canvas.width,canvas.height);
          drawGrid();
          if (document.getElementById('showImports').checked) {
            edges.forEach(e => {
              const a = byId.get(e.from); const b = byId.get(e.to); if (!a || !b) return;
              const cycle = isCycleNode(a.id) && isCycleNode(b.id);
              if (cycle && !document.getElementById('showCycles').checked) return;
              drawLink(a,b,cycle);
            });
          }
          if (!nodes.length) drawEmptyState();
          nodes.forEach(n => drawNode(n, isCycleNode(n.id), hoverId === n.id));
        }

        function drawGrid() {
          ctx.strokeStyle = 'rgba(136,135,128,.10)'; ctx.lineWidth = 1;
          for(let x=0;x<canvas.width;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke();}
          for(let y=0;y<canvas.height;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke();}
        }
        function drawEmptyState(){ ctx.fillStyle = 'rgba(136,135,128,.85)'; ctx.textAlign='center'; ctx.font='12px var(--vscode-font-family)'; ctx.fillText('No internal dependencies detected after filters.', canvas.width/2, canvas.height/2); }
        function drawLink(a,b,cycle){
          const dx=b.x-a.x, dy=b.y-a.y, len=Math.hypot(dx,dy)||1, ux=dx/len, uy=dy/len;
          const start=scope==='package'?34:18, end=scope==='package'?34:18;
          const sx=a.x+ux*start, sy=a.y+uy*start, ex=b.x-ux*end, ey=b.y-uy*end;
          ctx.strokeStyle=cycle?'#E24B4A':'rgba(136,135,128,.62)'; ctx.lineWidth=cycle?2:1;
          ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(ex,ey); ctx.stroke();
          const ang=Math.atan2(ey-sy, ex-sx); ctx.fillStyle=ctx.strokeStyle; ctx.beginPath(); ctx.moveTo(ex,ey); ctx.lineTo(ex-Math.cos(ang-.45)*7, ey-Math.sin(ang-.45)*7); ctx.lineTo(ex-Math.cos(ang+.45)*7, ey-Math.sin(ang+.45)*7); ctx.closePath(); ctx.fill();
        }
        function drawNode(n,cycle,active){
          const isPkg=scope==='package'; ctx.beginPath();
          if(isPkg){ roundRect(ctx,n.x-42,n.y-20,84,40,10); } else { ctx.arc(n.x,n.y,13,0,Math.PI*2); }
          ctx.fillStyle=cycle?'rgba(226,75,74,.22)':active?'rgba(83,74,183,.32)':'rgba(47,127,215,.24)'; ctx.fill();
          ctx.strokeStyle=cycle?'#E24B4A':active?'#8B80FF':'#2F7FD7'; ctx.lineWidth=active?2:1; ctx.stroke();
          ctx.fillStyle=getComputedStyle(document.body).getPropertyValue('--fg') || '#ddd'; ctx.font='10px var(--vscode-font-family)'; ctx.textAlign='center';
          const label=String(n.label || n.id).slice(0, isPkg ? 20 : 16);
          ctx.fillText(label,n.x,n.y+(isPkg?3:28));
        }
        function roundRect(ctx,x,y,w,h,r){ ctx.beginPath(); ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
        function hit(x,y){ return graphState.nodes.find(n => Math.hypot(x-n.x,y-n.y) < (scope==='package'?44:24)); }
        function showTooltip(n, x, y){
          if (!n) { tip.style.display='none'; return; }
          const deps = graphState.edges.filter(e => e.from === n.id).length;
          const incoming = graphState.edges.filter(e => e.to === n.id).length;
          const fileCount = n.files ? n.files.length : 1;
          tip.innerHTML = '<strong>'+escapeHtml(n.label || n.id)+'</strong><br><span>'+escapeHtml(n.id)+'</span><br><span>'+fileCount+' file(s) · '+deps+' outgoing · '+incoming+' incoming</span>' + (isCycleNode(n.id) ? '<br><b class="dangerText">cycle participant</b>' : '');
          const pad = 10; const tw = 240; const th = 82;
          tip.style.left = Math.min(canvas.width - tw - pad, Math.max(pad, x + 14)) + 'px';
          tip.style.top = Math.min(canvas.height - th - pad, Math.max(pad, y + 14)) + 'px';
          tip.style.display='block';
        }
        function escapeHtml(value){return String(value||'').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
        canvas.addEventListener('mousemove', e => {
          const rect=canvas.getBoundingClientRect(); const x=(e.clientX-rect.left) * (canvas.width / rect.width); const y=(e.clientY-rect.top) * (canvas.height / rect.height);
          const n=hit(x,y); const next=n ? n.id : null; showTooltip(n,x,y);
          if(next !== hoverId){ hoverId=next; render(); if(n) showTooltip(n,x,y); }
        });
        canvas.addEventListener('mouseleave', () => { hoverId=null; tip.style.display='none'; render(); });
        canvas.addEventListener('click', e => { const rect=canvas.getBoundingClientRect(); const x=(e.clientX-rect.left)*(canvas.width/rect.width); const y=(e.clientY-rect.top)*(canvas.height/rect.height); const n=hit(x,y); if(!n) return; const files=Array.isArray(n.files)?n.files.filter(Boolean):[]; vscode.postMessage({command:'openFile', filePath:n.filePath || files[0], files}); });
        render();
      </script>
    `);
  }

  private shell(body: string): string {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8" /><style>
:root{--primary:#534AB7;--danger:#E24B4A;--warn:#BA7517;--bg:var(--vscode-editor-background);--fg:var(--vscode-foreground);--muted:var(--vscode-descriptionForeground);--border:var(--vscode-widget-border,rgba(255,255,255,.14));}
*{box-sizing:border-box}body{font-family:var(--vscode-font-family);color:var(--fg);background:var(--bg);margin:0;padding:12px;font-size:12px}.hero,.card{border:1px solid var(--border);border-radius:16px;padding:12px;background:var(--vscode-sideBar-background);margin-bottom:10px}.hero{display:flex;justify-content:space-between;gap:10px;align-items:flex-start;background:linear-gradient(135deg,rgba(83,74,183,.16),transparent)}.kicker{text-transform:uppercase;letter-spacing:.08em;font-size:10px;color:var(--muted)}.title{font-size:16px;font-weight:750;margin:4px 0}.muted{color:var(--muted);font-size:11px}.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:10px}.stat{border:1px solid var(--border);border-radius:12px;padding:9px;background:var(--vscode-sideBar-background)}.stat span{display:block;color:var(--muted);font-size:10px;text-transform:uppercase}.stat strong{font-size:18px}.danger-text,.dangerText{color:var(--danger)}button{cursor:pointer;border:0;border-radius:8px;padding:6px 10px;background:var(--primary);color:#fff}.toolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;border:1px solid var(--border);border-radius:12px;padding:8px;margin-bottom:10px}.pill{background:transparent;border:1px solid var(--border);color:var(--muted);border-radius:999px;padding:4px 10px}.pill.active{background:rgba(83,74,183,.18);color:var(--fg)}.sep{width:1px;height:18px;background:var(--border)}.canvasWrap{position:relative;border:1px solid var(--border);border-radius:16px;overflow:hidden;background:var(--bg)}canvas{width:100%;height:390px;display:block}.legend{display:flex;gap:12px;flex-wrap:wrap;margin-top:8px;color:var(--muted);font-size:11px}.dot{display:inline-block;width:10px;height:10px;border-radius:50%;vertical-align:-1px;margin-right:5px}.dot.normal{background:#2F7FD7}.dot.cycle{background:var(--danger)}.line{display:inline-block;width:20px;height:2px;background:rgba(136,135,128,.8);vertical-align:2px;margin-right:5px}.tooltip{display:none;position:absolute;border:1px solid var(--border);border-radius:10px;background:var(--vscode-editorWidget-background);padding:8px 10px;color:var(--fg);font-size:10px;pointer-events:none;z-index:2;width:240px;line-height:1.45;box-shadow:0 8px 24px rgba(0,0,0,.22)}.tooltip span{color:var(--muted)}.danger{border-color:rgba(226,75,74,.45)}
</style></head><body>${body}</body></html>`;
  }
}

function escapeHtml(value: unknown): string {
  return String(value ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function safeJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
