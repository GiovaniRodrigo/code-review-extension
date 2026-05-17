import { baseHtml } from '../shared/baseHtml';
import { escapeHtml } from '../shared/escapeHtml';
import { Page } from '../components/Page';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';
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
        <div style="font-size: 10px; margin-bottom: 5px; border-bottom: 1px solid var(--m3-outline); padding-bottom: 2px;">
            <div style="display: flex; justify-content: space-between; opacity: 0.8;">
                <strong>${escapeHtml(l.action)}</strong>
                <span>${new Date(l.timestamp).toLocaleTimeString()}</span>
            </div>
            <div style="opacity: 0.6;">${escapeHtml(l.metadata?.file?.split('/').pop() || '')} ${escapeHtml(l.metadata?.message || '')}</div>
        </div>
    `).join('');

  return baseHtml({
    title: 'Code Review Dashboard',
    body: Page(`
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h1 class="cr-title" style="margin: 0;">Dashboard</h1>
        ${Button('Setup', 'setup', 'secondary')}
      </div>

      ${Card(`
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <div class="cr-title" style="margin: 0;">AI Provider</div>
            ${Badge(state.activeAIProvider ?? 'Not Configured', state.activeAIProvider ? 'success' : 'destructive')}
        </div>
        ${!state.activeAIProvider ? Button('Configure AI', 'setup', 'primary') : ''}
      `)}

      ${Card(`
        <div class="cr-title">Technical Debt Hotspots</div>
        ${heatHtml || EmptyState('No data yet. Run an analysis.')}
      `)}
      
      ${Card(`
        <div class="cr-title">Recent Audit Logs</div>
        <div style="max-height: 150px; overflow-y: auto;">
            ${logsHtml || EmptyState('No logs yet.')}
        </div>
      `)}
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        ${Card(`
            <div class="cr-title" style="font-size: 10px;">Coverage</div>
            <div style="font-size: 20px; font-weight: bold;">${state.coverage}%</div>
        `)}
        ${Card(`
            <div class="cr-title" style="font-size: 10px;">Testability</div>
            <div style="font-size: 20px; font-weight: bold; color: ${getTestabilityColor(state.testability.level)}">${state.testability.score}</div>
        `)}
      </div>
    `),
    script: `
      const vscode = acquireVsCodeApi();
      document.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (btn?.dataset.command) {
            vscode.postMessage({ command: btn.dataset.command });
        }
      });
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
