import { baseHtml } from '../shared/baseHtml';
import { escapeHtml } from '../shared/escapeHtml';
import { Page } from '../components/Page';
import { Badge } from '../components/Badge';
import type { ReviewPanelState, ReviewFinding } from './ReviewPanelState';

export function renderReviewPanelHtml(state: ReviewPanelState): string {
  const counts = countFindings(state.findings);
  const loadingHtml = state.loading ? `<div class="cr-card" style="text-align:center;">Git Code Review is analyzing workspace...</div>` : '';

  if (!state.findings.length && !state.loading) {
    return baseHtml({
      title: 'Review Findings',
      styles: `.empty-actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:14px;justify-content:center;}`,
      body: Page(`
        <section class="cr-empty">
          <div class="cr-kicker">Findings</div>
          <h2 class="cr-title" style="margin-top:6px;">No review findings yet</h2>
          <p style="margin:6px 0 0;">Start a review, analyze the workspace or index RAG to add contextual findings for this branch.</p>
          <div class="empty-actions">
            <button class="cr-button" data-command="startReview">Start Review</button>
            <button class="cr-button secondary" data-command="analyzeWorkspace">Analyze Workspace</button>
            <button class="cr-button secondary" data-command="indexRag">Index RAG</button>
          </div>
        </section>
      `)
    });
  }

  const items = state.findings.map((finding) => renderFindingItem(state.sessionId, finding)).join('');

  return baseHtml({
    title: 'Review Findings',
    styles: `
      .findings-header { display:flex; justify-content:space-between; align-items:flex-start; gap:10px; }
      .finding-card { border:1px solid var(--m3-outline); border-radius: var(--m3-radius-md); overflow:hidden; margin-bottom:10px; background: var(--m3-surface-container); }
      .finding-head { padding:10px; display:flex; gap:10px; align-items:flex-start; cursor:pointer; }
      .finding-head:hover { background: color-mix(in srgb, var(--m3-surface-container-high) 72%, transparent); }
      .finding-body { padding:10px; border-top:1px solid var(--m3-outline-soft); background: color-mix(in srgb, var(--m3-surface) 45%, transparent); }
      .finding-title { font-weight:750; font-size:12px; line-height:1.35; margin-bottom:3px; }
      .finding-loc { font-family: var(--vscode-editor-font-family, monospace); font-size:10px; color:var(--m3-on-surface-muted); }
      .finding-tags { display:flex; gap:4px; flex-wrap:wrap; margin-top:5px; }
      .finding-tag { font-size:9px; padding:1px 6px; border-radius:999px; border:1px solid var(--m3-outline-soft); color:var(--m3-on-surface-muted); }
      .confidence { width:44px; flex:0 0 44px; text-align:center; }
      .confidence-bar { height:3px; border-radius:999px; background:var(--m3-outline); margin-top:4px; overflow:hidden; }
      .confidence-fill { height:100%; background:var(--gcr-primary); }
      .hitl { display:flex; gap:6px; flex-wrap:wrap; margin-top:10px; }
      .finding-action { font-size:10px; padding:4px 10px; }
      .discussion-thread { margin-top:8px; display:flex; flex-direction:column; gap:5px; }
      .comment { border-left:2px solid var(--gcr-primary); padding:5px 7px; background:rgba(83,74,183,.08); border-radius:6px; font-size:10px; }
      .hidden-by-filter { display:none; }
      .highlight { outline:2px solid var(--gcr-primary); }
    `,
    body: Page(`
      <section class="cr-card">
        <div class="findings-header">
          <div>
            <div class="cr-kicker">Branch: ${escapeHtml(state.branch)}</div>
            <h2 class="cr-title" style="margin:4px 0;">Findings</h2>
            <div class="cr-muted">${state.findings.length} finding(s) · ${counts.pending} pending · ${counts.approved} approved · ${counts.rejected} rejected</div>
          </div>
          <button class="cr-button secondary" type="button" data-review-action="revalidate">Revalidate</button>
        </div>
      </section>

      <section class="cr-card">
        <div class="cr-section-title">Severity</div>
        <div class="cr-tabs" id="severityFilters">
          ${filterButton('all', 'All', state.filter ?? 'all', state.findings.length)}
          ${filterButton('critical', 'Critical', state.filter ?? 'all', counts.critical)}
          ${filterButton('high', 'High', state.filter ?? 'all', counts.high)}
          ${filterButton('medium', 'Medium', state.filter ?? 'all', counts.medium)}
          ${filterButton('low', 'Low', state.filter ?? 'all', counts.low)}
          ${filterButton('info', 'Info', state.filter ?? 'all', counts.info)}
        </div>
        <div class="cr-section-title">Status</div>
        <div class="cr-tabs" id="statusFilters">
          <button class="cr-tab active" data-status="all">All</button>
          <button class="cr-tab" data-status="pending">Pending (${counts.pending})</button>
          <button class="cr-tab" data-status="approved">Approved (${counts.approved})</button>
          <button class="cr-tab" data-status="rejected">Rejected (${counts.rejected})</button>
        </div>
      </section>

      ${loadingHtml}
      <section id="findingsContainer">${items}</section>

      <section class="cr-card">
        <div class="cr-actions">
          <button class="cr-button secondary" data-command="generateQualityReport">Generate Quality Report</button>
          <button class="cr-button secondary" data-command="exportMarkdown">Export Markdown</button>
          <button class="cr-button secondary" data-command="exportPdf">Export PDF</button>
        </div>
      </section>
    `),
    script: `
      function postReviewMessage(message) {
        if (window.postCodeReviewMessage) return window.postCodeReviewMessage(message);
        const vscode = window.__codeReviewVsCodeApi;
        if (vscode) vscode.postMessage(message);
      }

      let severityFilter = '${escapeJs(state.filter ?? 'all')}';
      let statusFilter = 'all';

      function applyFilters() {
        document.querySelectorAll('.finding-card').forEach((item) => {
          const severityOk = severityFilter === 'all' || item.dataset.severity === severityFilter || (severityFilter === 'high' && item.dataset.severity === 'error');
          const statusOk = statusFilter === 'all' || item.dataset.status === statusFilter;
          item.classList.toggle('hidden-by-filter', !(severityOk && statusOk));
        });
        saveCurrentState();
      }

      document.addEventListener('click', (event) => {
        const severityButton = event.target.closest('[data-filter-severity]');
        if (severityButton) {
          document.querySelectorAll('[data-filter-severity]').forEach((btn) => btn.classList.remove('active'));
          severityButton.classList.add('active');
          severityFilter = severityButton.dataset.filterSeverity;
          applyFilters();
          return;
        }

        const statusButton = event.target.closest('[data-status]');
        if (statusButton) {
          document.querySelectorAll('[data-status]').forEach((btn) => btn.classList.remove('active'));
          statusButton.classList.add('active');
          statusFilter = statusButton.dataset.status;
          applyFilters();
          return;
        }

        const button = event.target.closest('[data-review-action]');
        if (!button || button.disabled) return;
        const action = button.dataset.reviewAction;
        const sessionId = button.dataset.sessionId;
        const findingId = button.dataset.findingId;

        if (action === 'approve') {
          button.disabled = true;
          button.textContent = 'Approved';
          postReviewMessage({ command: 'approve', sessionId, findingId });
          return;
        }
        if (action === 'focus') {
          document.querySelectorAll('.finding-card').forEach((item) => item.classList.remove('highlight'));
          const item = document.getElementById('item-' + findingId);
          if (item) item.classList.add('highlight');
          postReviewMessage({ command: 'focus', sessionId, findingId });
          return;
        }
        if (action === 'copy') return postReviewMessage({ command: 'copy', text: button.dataset.text || '' });
        if (action === 'reply') return postReviewMessage({ command: 'reply', sessionId, findingId });
        if (action === 'refactor') {
          button.disabled = true;
          button.textContent = 'Refactoring...';
          return postReviewMessage({ command: 'refactor', sessionId, findingId });
        }
        if (action === 'revalidate') return postReviewMessage({ command: 'revalidate' });
      });

      function saveCurrentState() {
        postReviewMessage({ command: 'saveState', state: { filter: severityFilter, collapsed: [] } });
      }
      applyFilters();
    `
  });
}

function renderFindingItem(sessionId: string, f: ReviewFinding): string {
  const id = f.id || '';
  const severity = normalizeSeverity(f.severity);
  const confidence = f.confidenceScore !== undefined ? f.confidenceScore : 0.8;
  const confidencePercent = Math.round(confidence * 100);
  const confidenceLabel = confidence >= 0.8 ? 'High' : confidence >= 0.5 ? 'Medium' : 'Low';
  const tags = inferTags(f).map(tag => `<span class="finding-tag">${escapeHtml(tag)}</span>`).join('');
  const discussionHtml = (f.discussion || []).map((c: any) => `
    <div class="comment"><strong>${escapeHtml(c.author === 'developer' ? 'You' : c.author)}:</strong> ${escapeHtml(c.body)}</div>
  `).join('');

  return `
    <article class="finding-card" id="item-${escapeAttr(id)}" data-severity="${escapeAttr(severity)}" data-status="${escapeAttr(f.status || 'pending')}" style="border-left:3px solid ${severityColor(severity)};">
      <div class="finding-head">
        <div class="confidence">
          ${Badge(severity.toUpperCase(), severityBadge(severity))}
          <div class="cr-muted" style="font-size:9px;margin-top:3px;">${confidencePercent}%</div>
          <div class="confidence-bar"><div class="confidence-fill" style="width:${confidencePercent}%"></div></div>
        </div>
        <div style="min-width:0;flex:1;">
          <div class="finding-title">${escapeHtml(f.message)}</div>
          <div class="finding-loc">${escapeHtml(f.file)} · line ${escapeHtml(String(f.line))}</div>
          <div class="finding-tags">${tags}</div>
        </div>
        <div class="cr-muted" style="font-size:10px;">#${escapeHtml(id.substring(0, 4))}</div>
      </div>
      <div class="finding-body">
        <div class="cr-muted" style="line-height:1.5;">AI Confidence: ${escapeHtml(confidenceLabel)} (${confidencePercent}%). The reviewer remains responsible for approving, rejecting or requesting changes.</div>
        <div class="discussion-thread">${discussionHtml}</div>
        <div class="hitl">
          <button class="cr-button finding-action" type="button" data-review-action="approve" data-session-id="${escapeAttr(sessionId)}" data-finding-id="${escapeAttr(id)}" ${f.status === 'approved' ? 'disabled' : ''}>${f.status === 'approved' ? 'Approved' : 'Approve'}</button>
          <button class="cr-button secondary finding-action" type="button" data-review-action="focus" data-session-id="${escapeAttr(sessionId)}" data-finding-id="${escapeAttr(id)}">Focus</button>
          <button class="cr-button secondary finding-action" type="button" data-review-action="refactor" data-session-id="${escapeAttr(sessionId)}" data-finding-id="${escapeAttr(id)}">Refactor</button>
          <button class="cr-button secondary finding-action" type="button" data-review-action="reply" data-session-id="${escapeAttr(sessionId)}" data-finding-id="${escapeAttr(id)}">Reply</button>
          <button class="cr-button secondary finding-action" type="button" data-review-action="copy" data-text="${escapeAttr(f.message)}">Copy</button>
        </div>
      </div>
    </article>
  `;
}

function countFindings(findings: ReviewFinding[]) {
  const bySeverity = (name: string) => findings.filter(f => normalizeSeverity(f.severity) === name).length;
  const byStatus = (name: string) => findings.filter(f => String(f.status || 'pending').toLowerCase() === name).length;
  return {
    critical: bySeverity('critical'), high: bySeverity('high'), medium: bySeverity('medium'), low: bySeverity('low'), info: bySeverity('info'),
    approved: byStatus('approved'), rejected: byStatus('rejected'), pending: byStatus('pending')
  };
}

function filterButton(type: string, label: string, active: string, count: number): string {
  return `<button class="cr-tab ${active === type ? 'active' : ''}" data-filter-severity="${escapeAttr(type)}">${escapeHtml(label)} (${count})</button>`;
}
function normalizeSeverity(severity: string): string {
  const value = String(severity || 'info').toLowerCase();
  if (value === 'error') return 'high';
  if (['critical', 'high', 'medium', 'low', 'info', 'warning'].includes(value)) return value === 'warning' ? 'medium' : value;
  return 'info';
}
function severityBadge(severity: string): 'success' | 'warning' | 'destructive' {
  if (severity === 'critical' || severity === 'high') return 'destructive';
  if (severity === 'medium') return 'warning';
  return 'success';
}
function severityColor(severity: string): string {
  if (severity === 'critical' || severity === 'high') return 'var(--gcr-danger)';
  if (severity === 'medium') return 'var(--gcr-warning)';
  return 'var(--gcr-info)';
}
function inferTags(f: ReviewFinding): string[] {
  const message = `${f.message} ${f.file}`.toLowerCase();
  const tags = [normalizeSeverity(f.severity)];
  if (message.includes('sql') || message.includes('security') || message.includes('password')) tags.push('Security');
  if (message.includes('solid') || message.includes('responsibility')) tags.push('SOLID');
  if (message.includes('performance') || message.includes('slow')) tags.push('Performance');
  if (message.includes('test')) tags.push('Testability');
  if (message.includes('architecture') || message.includes('ddd')) tags.push('Architecture');
  return Array.from(new Set(tags)).slice(0, 4);
}
function escapeAttr(value: unknown): string { return escapeHtml(value); }
function escapeJs(value: string): string { return value.replace(/\\/g, '\\\\').replace(/'/g, "\\'"); }
