import { baseHtml } from '../shared/baseHtml';
import { Page } from '../components/Page';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Alert } from '../components/Alert';
import type { RagStatusState } from './RagStatusState';

export function renderRagStatusHtml(state: RagStatusState): string {
  return baseHtml({
    title: 'RAG Status',
    body: Page(`
      <h1 class="cr-title">RAG Operational Panel</h1>
      ${Card(`
        <div style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <strong>Status:</strong> 
            ${Badge(state.status, state.status === 'idle' ? 'success' : state.status === 'indexing' ? 'warning' : 'destructive')}
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <div class="cr-muted" style="font-size: 10px; text-transform: uppercase;">Total Documents</div>
              <div style="font-size: 18px; font-weight: bold;">${state.totalFiles ?? 0}</div>
            </div>
            <div>
              <div class="cr-muted" style="font-size: 10px; text-transform: uppercase;">Total Chunks</div>
              <div style="font-size: 18px; font-weight: bold;">${state.totalChunks ?? 0}</div>
            </div>
          </div>

          <div style="border-top: 1px solid var(--vscode-widget-border); padding-top: 8px;">
            <div style="font-size: 11px; margin-bottom: 4px;">
                <strong>Provider:</strong> <span class="cr-muted">${state.embeddingProvider ?? 'Default (Local)'}</span>
            </div>
            <div style="font-size: 11px;">
                <strong>Last Indexed:</strong> <span class="cr-muted">${state.lastIndexed ?? 'Never'}</span>
            </div>
          </div>

          ${state.error ? Alert(`<strong>RAG Error:</strong><br/>${state.error}`, 'destructive') : ''}
        </div>
      `)}

      <div style="margin-top: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
        ${Button('Index Repository', 'index')}
        ${Button('Clear Index', 'clear', 'secondary')}
        ${Button('Search Context', 'search', 'secondary')}
        ${Button('Configure RAG', 'configure', 'secondary')}
      </div>
    `),
    script: `
      const vscode = acquireVsCodeApi();
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;
        
        const cmd = btn.dataset.command;
        if (cmd) {
            vscode.postMessage({ command: cmd });
        }
      });
    `
  });
}
