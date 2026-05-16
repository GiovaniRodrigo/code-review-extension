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
      <h1 class="cr-title">RAG Status</h1>
      ${Card(`
        <div style="display: flex; flex-direction: column; gap: 8px;">
          <div><strong>Status:</strong> ${Badge(state.status)}</div>
          ${state.totalChunks !== undefined ? `<div><strong>Chunks:</strong> ${state.totalChunks}</div>` : ''}
          ${state.lastIndexed ? `<div><strong>Last Indexed:</strong> <span class="cr-muted">${state.lastIndexed}</span></div>` : ''}
          ${state.error ? Alert(`Error: ${state.error}`) : ''}
        </div>
      `)}
      <div style="margin-top: 16px; display: flex; gap: 8px;">
        ${Button('Index Repository', 'index')}
        ${Button('Clear Index', 'clear', 'secondary')}
      </div>
    `),
    script: `
      const vscode = acquireVsCodeApi();
      document.addEventListener('click', (e) => {
        const cmd = e.target.dataset.command;
        if (cmd) vscode.postMessage({ command: cmd });
      });
    `
  });
}
