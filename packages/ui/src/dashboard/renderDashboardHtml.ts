import { baseHtml } from '../shared/baseHtml';
import { escapeHtml } from '../shared/escapeHtml';
import type { DashboardState, DashboardHeatItem, DashboardLogEntry } from './DashboardState';

export function renderDashboardHtml(state: DashboardState): string {
  const heatHtml = state.heat.slice(0, 5).map((h: DashboardHeatItem) => `
        <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 3px;">
            <span title="${escapeHtml(h.file)}" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 150px;">
                ${escapeHtml(h.file.split('/').pop())}
            </span>
            <span style="color: ${getHeatColor(h.score)}; font-weight: bold;">${h.score} pts</span>
        </div>
    `).join('');

  const logsHtml = state.logs.map((l: DashboardLogEntry) => `
        <div style="font-size: 10px; margin-bottom: 5px; border-bottom: 1px solid #333; padding-bottom: 2px;">
            <div style="display: flex; justify-content: space-between; opacity: 0.8;">
                <strong>${escapeHtml(l.action)}</strong>
                <span>${new Date(l.timestamp).toLocaleTimeString()}</span>
            </div>
            <div style="opacity: 0.6;">${escapeHtml(l.metadata?.file?.split('/').pop() || '')} ${escapeHtml(l.metadata?.message || '')}</div>
        </div>
    `).join('');

  return baseHtml({
    title: 'Code Review Dashboard',
    styles: `
      .card { background: var(--vscode-sideBar-background); padding: 10px; margin-bottom: 10px; border: 1px solid var(--vscode-widget-border); }
      .title { font-size: 10px; text-transform: uppercase; opacity: 0.7; margin-bottom: 5px; }
      .score { font-size: 20px; font-weight: bold; }
      .status-success { color: #4caf50; }
      .status-error { color: #f44336; }
    `,
    body: `
      <div class="card">
        <div class="title">Technical Debt Hotspots</div>
        ${heatHtml || '<div style="opacity: 0.5; font-size: 11px;">No data yet. Run an analysis.</div>'}
      </div>
      
      <div class="card">
        <div class="title">Recent Audit Logs</div>
        <div style="max-height: 150px; overflow-y: auto;">
            ${logsHtml || '<div style="opacity: 0.5; font-size: 11px;">No logs yet.</div>'}
        </div>
      </div>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div class="card">
            <div class="title">Coverage</div>
            <div class="score">${state.coverage}%</div>
        </div>
        <div class="card">
            <div class="title">Testability</div>
            <div class="score" style="color: ${getTestabilityColor(state.testability.level)}">${state.testability.score}</div>
        </div>
      </div>

      <div class="card">
        <div class="title">Quality Gates</div>
        <div class="score ${state.gatesPassed ? 'status-success' : 'status-error'}">
            ${state.gatesPassed ? 'PASSED' : 'FAILED'}
        </div>
      </div>
    `
  });
}

function getHeatColor(score: number): string {
  if (score > 100) return '#f44336';
  if (score > 50) return '#ff9800';
  return '#4caf50';
}

function getTestabilityColor(level: string): string {
  if (level === 'easy') return '#4caf50';
  if (level === 'moderate') return '#ff9800';
  return '#f44336';
}
