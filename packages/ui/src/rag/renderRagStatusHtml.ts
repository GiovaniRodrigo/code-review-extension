import { baseHtml } from '../shared/baseHtml';
import { escapeHtml } from '../shared/escapeHtml';
import type { RagStatusState } from './RagStatusState';

export function renderRagStatusHtml(state: RagStatusState): string {
  return baseHtml({
    title: 'RAG Status',
    body: `
      <h1>RAG Status</h1>
      <section>
        <p><strong>Status:</strong> ${escapeHtml(state.status)}</p>
        ${state.totalChunks !== undefined ? `<p><strong>Chunks:</strong> ${state.totalChunks}</p>` : ''}
        ${state.lastIndexed ? `<p><strong>Last Indexed:</strong> ${escapeHtml(state.lastIndexed)}</p>` : ''}
        ${state.error ? `<p style="color: var(--vscode-errorForeground);"><strong>Error:</strong> ${escapeHtml(state.error)}</p>` : ''}
      </section>
      <section style="margin-top: 20px; display: flex; gap: 10px;">
        <button onclick="index()">Index Repository</button>
        <button onclick="clearIndex()">Clear Index</button>
      </section>
    `,
    script: `
      const vscode = acquireVsCodeApi();
      function index() { vscode.postMessage({ command: 'index' }); }
      function clearIndex() { vscode.postMessage({ command: 'clear' }); }
    `
  });
}
