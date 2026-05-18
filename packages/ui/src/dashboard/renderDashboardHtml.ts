import { baseHtml } from '../shared/baseHtml';
import { escapeHtml } from '../shared/escapeHtml';
import { Page } from '../components/Page';
import { Badge } from '../components/Badge';
import type { DashboardState, DashboardHeatItem, DashboardLogEntry } from './DashboardState';

export function renderDashboardHtml(state: DashboardState): string {
  const score = clampScore(state.qualityScore ?? calculateQualityScore(state));
  const quality = qualityMeta(score);
  const findingTotal = state.sessionSummary?.findings ?? state.heat.length;
  const approved = state.sessionSummary?.approved ?? 0;
  const pending = state.sessionSummary?.pending ?? Math.max(0, findingTotal - approved);
  const plan = normalizePlan(state.plan);

  const hotspotRows = state.heat.slice(0, 6).map((h: DashboardHeatItem) => `
    <div class="cr-row">
      <span class="cr-dot ${h.score >= 70 ? 'err' : h.score >= 35 ? 'warn' : 'ok'}"></span>
      <div style="min-width:0; flex:1;">
        <div style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${escapeAttr(h.file)}">${escapeHtml(h.file.split('/').pop() || h.file)}</div>
        <div class="cr-muted" style="font-size:10px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${escapeHtml(h.file)}</div>
      </div>
      ${Badge(`${h.score} pts`, h.score >= 70 ? 'destructive' : h.score >= 35 ? 'warning' : 'success')}
    </div>
  `).join('');

  const logRows = state.logs.slice(0, 5).map((l: DashboardLogEntry) => `
    <div class="cr-row">
      <span class="cr-dot info"></span>
      <div style="min-width:0;flex:1;">
        <div>${escapeHtml(l.action)}</div>
        <div class="cr-muted" style="font-size:10px;">${formatTime(l.timestamp)} ${escapeHtml(l.metadata?.file?.split('/').pop() || l.metadata?.message || '')}</div>
      </div>
    </div>
  `).join('');

  return baseHtml({
    title: 'Git Code Review Dashboard',
    styles: `
      .gcr-hero { border: 1px solid var(--m3-outline); border-radius: var(--m3-radius-xl); padding: 16px; background: radial-gradient(circle at top right, ${quality.bg}, transparent 44%), linear-gradient(135deg, rgba(83,74,183,.18), rgba(255,255,255,.02)); box-shadow: 0 10px 30px rgba(0,0,0,.12); }
      .gcr-score { width: 84px; height: 84px; border-radius: 50%; display: grid; place-items: center; border: 4px solid ${quality.color}; color: ${quality.color}; font-size: 24px; font-weight: 850; box-shadow: inset 0 0 0 6px rgba(255,255,255,.03); }
      .gcr-hero-top { display:flex; align-items:center; justify-content:space-between; gap:14px; }
      .gcr-metric-row { display:grid; grid-template-columns: repeat(4, minmax(0,1fr)); gap:8px; margin-top:12px; }
      @media (max-width: 420px) { .gcr-metric-row { grid-template-columns: repeat(2, minmax(0,1fr)); } .gcr-score { width:70px;height:70px;font-size:20px; } }
      .gcr-module { display:flex; justify-content:space-between; gap:10px; padding:8px 0; border-bottom:1px solid var(--m3-outline-soft); }
      .gcr-module:last-child { border-bottom:0; }
    `,
    body: Page(`
      <section class="gcr-hero">
        <div class="gcr-hero-top">
          <div style="min-width:0;">
            <div class="cr-kicker">For ${escapeHtml(state.targetAudience ?? 'code reviewers')}</div>
            <h1 class="cr-title" style="font-size:20px;margin:4px 0;">Git Code Review</h1>
            <div class="cr-muted">Review workspace with Git context, HITL findings, local-first RAG and AI assistance.</div>
          </div>
          <div class="gcr-score" title="Quality Score">${score}</div>
        </div>
        <div class="cr-actions" style="margin-top:14px;">
          <button class="cr-button" data-command="startReview">Start Review</button>
          <button class="cr-button secondary" data-command="openWorkspace">Open Dashboard</button>
          <button class="cr-button secondary" data-command="analyzeWorkspace">Analyze Workspace</button>
          <button class="cr-button secondary" data-command="indexRag">Index RAG</button>
          <button class="cr-button secondary" data-command="runDiagnostics">Diagnostics</button>
        </div>
      </section>

      <section class="gcr-metric-row">
        ${stat('Quality score', String(score), quality.label)}
        ${stat('Findings', String(findingTotal), `${pending} pending`)}
        ${stat('Approved', String(approved), 'by reviewer')}
        ${stat('RAG index', escapeHtml(state.ragStatus ?? 'Local ready'), 'context status')}
      </section>

      <section class="cr-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:8px;">
          <div>
            <div class="cr-title" style="margin:0;">Review readiness</div>
            <div class="cr-muted">${escapeHtml(state.workspaceName ?? 'Current workspace')} · ${escapeHtml(state.sessionSummary?.branch ?? 'current branch')}</div>
          </div>
          ${Badge(state.reviewStatus ?? quality.status, quality.variant)}
        </div>
        ${readinessLine('Workspace', state.workspaceName ?? 'No workspace', state.workspaceName ? 'ok' : 'err')}
        ${readinessLine('Git branch', state.sessionSummary?.branch ?? 'Detect on start', state.sessionSummary?.branch ? 'ok' : 'warn')}
        ${readinessLine('AI provider', state.activeAIProvider ?? 'Mock', state.activeAIProvider && state.activeAIProvider !== 'mock' ? 'ok' : 'warn')}
        ${readinessLine('RAG provider', state.ragStatus ?? 'Local ready', (state.ragStatus ?? '').toLowerCase().includes('ready') ? 'ok' : 'warn')}
        ${readinessLine('Plan', plan, plan === 'community' ? 'info' : 'ok')}
      </section>

      <section class="cr-card">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:10px;margin-bottom:8px;">
          <div>
            <div class="cr-title" style="margin:0;">Provider & Pro foundation</div>
            <div class="cr-muted">Local-first by default. Cloud AI, reports and PDF exports for Pro workflows.</div>
          </div>
          ${Badge(plan === 'community' ? 'Community' : plan.toUpperCase(), plan === 'community' ? 'warning' : 'success')}
        </div>
        <div class="cr-grid-2">
          ${miniStatus('Cloud AI', state.proStatus?.cloudProviderConfigured ? 'Configured' : 'Not configured')}
          ${miniStatus('Template', state.reviewTemplate ?? 'general')}
          ${miniStatus('PR Summary', state.proStatus?.prSummaryAvailable ? 'Ready' : 'Setup')}
          ${miniStatus('PDF Export', state.proStatus?.pdfExportAvailable ? 'Ready' : 'Setup')}
        </div>
        <div class="cr-actions" style="margin-top:12px;">
          <button class="cr-button secondary" data-command="configureCloudProvider">Configure Cloud</button>
          <button class="cr-button secondary" data-command="testAIProvider">Test Provider</button>
          <button class="cr-button secondary" data-command="selectReviewTemplate">Template</button>
          <button class="cr-button secondary" data-command="showProUpgrade">Plans</button>
        </div>
      </section>

      <section class="cr-card">
        <div class="cr-title">Local Review Session</div>
        <div class="cr-muted" style="margin-bottom:10px;">${state.sessionSummary ? `${escapeHtml(state.sessionSummary.branch)} · ${escapeHtml(String(state.sessionSummary.updatedAt ?? 'saved locally'))}` : 'No local session yet. Start Review creates one.'}</div>
        <div class="cr-grid-2">
          ${miniStatus('Findings', String(findingTotal))}
          ${miniStatus('Approved', String(approved))}
          ${miniStatus('Pending', String(pending))}
          ${miniStatus('Storage', 'Local')}
        </div>
        <div class="cr-actions" style="margin-top:12px;">
          <button class="cr-button secondary" data-command="restoreSession">Restore</button>
          <button class="cr-button secondary" data-command="revalidateSession">Revalidate</button>
          <button class="cr-button secondary" data-command="exportMarkdown">Export Markdown</button>
          <button class="cr-button secondary" data-command="exportPdf">Export PDF</button>
          <button class="cr-button secondary" data-command="openReviewHistory">History</button>
        </div>
      </section>

      <section class="cr-card">
        <div class="cr-title">Product modules</div>
        ${moduleLine('Dashboard', 'Review readiness, active plan, provider, RAG and quality score', 'Ready')}
        ${moduleLine('Product Diagnostics', 'Workspace, Git, provider, RAG and extension container checks', 'Ready')}
        ${moduleLine('Findings', 'Human-reviewed technical findings with severity and confidence', 'Ready')}
        ${moduleLine('Project Chat', 'RAG-assisted questions about the codebase', state.ragStatus ? 'Ready' : 'Index')}
        ${moduleLine('Dependency Graph', 'Architecture visualization with dependency hotspots', 'Ready')}
        ${moduleLine('Enterprise Governance', 'SSO, RBAC, audit logs and AI policies foundation', 'Foundation')}
      </section>

      <section class="cr-card">
        <div class="cr-title">Technical debt hotspots</div>
        ${hotspotRows || `<div class="cr-empty">No hotspots yet. Run Start Review or Analyze Workspace.</div>`}
      </section>

      <section class="cr-card">
        <div class="cr-title">Recent review activity</div>
        ${logRows || `<div class="cr-empty">No activity yet. Start a review to create the first session.</div>`}
      </section>
    `)
  });
}

function stat(label: string, value: string, sub: string): string {
  return `<div class="cr-stat"><div class="cr-stat-label">${escapeHtml(label)}</div><div class="cr-stat-value">${value}</div><div class="cr-muted" style="font-size:10px;">${escapeHtml(sub)}</div></div>`;
}

function readinessLine(label: string, value: string, status: 'ok' | 'warn' | 'err' | 'info'): string {
  return `<div class="cr-row"><span class="cr-dot ${status}"></span><span style="flex:1;">${escapeHtml(label)}</span><span class="cr-muted" style="font-size:11px;text-align:right;">${escapeHtml(value)}</span></div>`;
}

function miniStatus(label: string, value: string): string {
  return `<div class="cr-stat"><div class="cr-stat-label">${escapeHtml(label)}</div><div style="font-weight:700;margin-top:4px;">${escapeHtml(value)}</div></div>`;
}

function moduleLine(name: string, detail: string, status: string): string {
  return `<div class="gcr-module"><div><strong>${escapeHtml(name)}</strong><div class="cr-muted" style="font-size:10px;">${escapeHtml(detail)}</div></div>${Badge(status, status === 'Ready' ? 'success' : 'warning')}</div>`;
}

function calculateQualityScore(state: DashboardState): number {
  const heatPenalty = Math.min(35, state.heat.reduce((sum, h) => sum + Math.min(h.score, 100), 0) / 25);
  const providerBonus = state.activeAIProvider ? 5 : 0;
  const activityBonus = state.logs.length ? 5 : 0;
  return 80 - heatPenalty + providerBonus + activityBonus;
}

function clampScore(score: number): number { return Math.max(0, Math.min(100, Math.round(score))); }
function normalizePlan(plan?: string): string { return String(plan ?? 'community').toLowerCase(); }
function formatTime(value: Date | string): string { try { return new Date(value).toLocaleTimeString(); } catch { return ''; } }
function escapeAttr(value: unknown): string { return escapeHtml(value); }

function qualityMeta(score: number): { label: string; status: string; color: string; bg: string; variant: 'success' | 'warning' | 'destructive' } {
  if (score >= 85) return { label: 'Excellent', status: 'Ready for review', color: 'var(--gcr-success)', bg: 'rgba(99,153,34,.22)', variant: 'success' };
  if (score >= 70) return { label: 'Good', status: 'Ready with attention', color: 'var(--gcr-primary)', bg: 'rgba(83,74,183,.22)', variant: 'success' };
  if (score >= 55) return { label: 'Attention', status: 'Needs reviewer attention', color: 'var(--gcr-warning)', bg: 'rgba(186,117,23,.22)', variant: 'warning' };
  return { label: 'Risk', status: 'Risk detected — review required', color: 'var(--gcr-danger)', bg: 'rgba(226,75,74,.22)', variant: 'destructive' };
}
