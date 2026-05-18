import { baseHtml } from '../shared/baseHtml';
import { escapeHtml } from '../shared/escapeHtml';
import { Page } from '../components/Page';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import type { RagStatusState } from './RagStatusState';

export function renderRagStatusHtml(state: RagStatusState): string {
  const statusVariant = state.status === 'idle' ? 'success' : state.status === 'indexing' ? 'warning' : 'destructive';
  return baseHtml({
    title: 'RAG Operational Panel',
    styles: `
      .rag-hero { border:1px solid var(--m3-outline); border-radius:var(--m3-radius-xl); padding:14px; background:linear-gradient(135deg, rgba(83,74,183,.14), transparent); }
      .rag-progress { height:6px; border-radius:999px; background:var(--m3-outline); overflow:hidden; }
      .rag-progress > div { height:100%; background:var(--gcr-primary); width:${state.status === 'indexing' ? '65' : state.totalChunks ? '100' : '0'}%; }
    `,
    body: Page(`
      <section class="rag-hero">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;">
          <div>
            <div class="cr-kicker">Context engine</div>
            <h2 class="cr-title" style="margin:4px 0;">RAG Operational Panel</h2>
            <div class="cr-muted">Local-first repository context for Project Chat, PR summaries and review findings.</div>
          </div>
          ${Badge(state.status, statusVariant)}
        </div>
        <div class="cr-actions" style="margin-top:12px;">
          <button class="cr-button" data-command="index">Index Repository</button>
          <button class="cr-button secondary" data-command="search">Search Context</button>
          <button class="cr-button secondary" data-command="clear">Clear Index</button>
          <button class="cr-button secondary" data-command="configure">Configure</button>
        </div>
      </section>

      ${Card(`
        <div class="cr-grid-2">
          ${metric('Total documents', String(state.totalFiles ?? 0))}
          ${metric('Total chunks', String(state.totalChunks ?? 0))}
        </div>
        <div style="margin-top:12px;">
          <div class="cr-section-title">Index freshness</div>
          <div class="rag-progress"><div></div></div>
          <div class="cr-muted" style="font-size:11px;margin-top:6px;">Last indexed: ${escapeHtml(state.lastIndexed ?? 'Never')}</div>
        </div>
      `)}

      ${Card(`
        <div class="cr-title">Provider</div>
        ${row('Embedding provider', state.embeddingProvider ?? 'Default local')}
        ${row('Storage mode', 'Local workspace')}
        ${row('Used by', 'Project Chat · PR Summary · Findings context')}
      `)}

      ${state.error ? `<section class="cr-card" style="border-color:rgba(226,75,74,.35);"><div class="cr-title" style="color:var(--gcr-danger);">RAG error</div><div class="cr-muted">${escapeHtml(state.error)}</div></section>` : ''}
    `)
  });
}

function metric(label: string, value: string): string {
  return `<div class="cr-stat"><div class="cr-stat-label">${escapeHtml(label)}</div><div class="cr-stat-value">${escapeHtml(value)}</div></div>`;
}
function row(label: string, value: string): string {
  return `<div class="cr-row"><span class="cr-dot info"></span><span style="flex:1;">${escapeHtml(label)}</span><span class="cr-muted" style="font-size:11px;text-align:right;">${escapeHtml(value)}</span></div>`;
}
