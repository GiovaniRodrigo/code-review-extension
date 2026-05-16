import { baseHtml } from '../shared/baseHtml';
import { escapeHtml } from '../shared/escapeHtml';
import { Page } from '../components/Page';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import type { ReviewPanelState, ReviewFinding } from './ReviewPanelState';

export function renderReviewPanelHtml(state: ReviewPanelState): string {
  const loadingHtml = state.loading ? `<div class="cr-card" style="text-align: center; margin-bottom: 12px;">AI is analyzing...</div>` : '';

  if (!state.findings.length && !state.loading) {
    return baseHtml({
      title: 'Review Findings',
      body: Page(`
        ${loadingHtml}
        <div class="cr-empty">No findings for this branch.</div>
      `)
    });
  }

  const findingsByFile = state.findings.reduce((acc: any, f: any) => {
    if (!acc[f.file]) acc[f.file] = [];
    acc[f.file].push(f);
    return acc;
  }, {});

  const sectionsHtml = Object.keys(findingsByFile).map(file => {
    const fileFindings = findingsByFile[file];
    const isCollapsed = state.collapsed?.includes(file);
    const itemsHtml = fileFindings.map((f: ReviewFinding) => {
      const confidence = f.confidenceScore !== undefined ? f.confidenceScore : 0.8;
      const confidencePercent = Math.round(confidence * 100);
      const confidenceColor = confidence >= 0.8 ? '#4caf50' : confidence >= 0.5 ? '#ff9800' : '#f44336';
      const confidenceLabel = confidence >= 0.8 ? 'High' : confidence >= 0.5 ? 'Medium' : 'Low';

      const discussionHtml = (f.discussion || []).map((c: any) => `
        <div style="font-size: 10px; margin-top: 5px; background: rgba(255,255,255,0.05); padding: 4px; border-radius: 4px;">
            <strong>${c.author === 'developer' ? 'You' : 'AI'}:</strong> ${escapeHtml(c.body)}
        </div>
      `).join('');

      return `
            <div class="finding-item" id="item-${f.id}" data-severity="${escapeHtml(f.severity)}" style="border-left: 3px solid ${getSeverityColor(f.severity)}; padding-left: 10px; margin-bottom: 10px; position: relative;">
                <div style="font-size: 10px; position: absolute; right: 5px; top: 0; opacity: 0.5;">#${f.id.substring(0, 4)}</div>
                <strong>${Badge(f.severity.toUpperCase())}</strong> ${escapeHtml(f.message)}<br/>
                <small class="cr-muted">Line ${f.line} | ${escapeHtml(f.status)}</small><br/>
                <div style="margin-top: 5px; font-size: 10px; display: flex; align-items: center; gap: 5px;">
                    <span title="AI Confidence: ${confidencePercent}%" style="background: ${confidenceColor}; width: 8px; height: 8px; border-radius: 50%; display: inline-block;"></span>
                    <span style="color: ${confidenceColor}; opacity: 0.8;">AI Confidence: ${confidenceLabel} (${confidencePercent}%)</span>
                </div>
                
                <div class="discussion-thread">${discussionHtml}</div>

                <div style="margin-top: 8px; display: flex; flex-wrap: wrap; gap: 6px;">
                    <button class="cr-button" onclick="approve('${state.sessionId}', '${f.id}')" ${f.status === 'approved' ? 'disabled' : ''} style="font-size: 10px; padding: 4px 10px;">Approve</button>
                    <button class="cr-button secondary" onclick="focusItem('${state.sessionId}', '${f.id}')" style="font-size: 10px; padding: 4px 10px;">Focus</button>
                    <button class="cr-button secondary" onclick="refactor('${state.sessionId}', '${f.id}')" style="font-size: 10px; padding: 4px 10px;">Refactor</button>
                    <button class="cr-button secondary" onclick="addComment('${state.sessionId}', '${f.id}')" style="font-size: 10px; padding: 4px 10px;">Reply</button>
                    <button class="cr-button secondary" onclick="copyFinding('${escapeHtml(f.message)}')" style="font-size: 10px; padding: 4px 10px;">Copy</button>
                </div>
            </div>
        `;
    }).join('');

    return `
          <details class="file-section" ${isCollapsed ? '' : 'open'} ontoggle="saveCurrentState()" style="margin-bottom: 8px; border: 1px solid var(--m3-outline); border-radius: var(--m3-radius-md); overflow: hidden;">
              <summary style="font-weight: bold; cursor: pointer; padding: 8px; background: var(--m3-surface-container);" data-file="${escapeHtml(file)}">${escapeHtml(file)} (${fileFindings.length})</summary>
              <div style="padding: 10px; background: var(--m3-surface);">${itemsHtml}</div>
          </details>
      `;
  }).join('');

  return baseHtml({
    title: 'Review Findings',
    styles: `
      .filter-btn { background: transparent; border: 1px solid var(--m3-outline); color: var(--m3-on-surface); cursor: pointer; padding: 4px 8px; font-size: 10px; border-radius: 999px; }
      .filter-btn.active { background: var(--m3-primary); color: var(--m3-on-primary); border-color: var(--m3-primary); }
      .highlight { background: rgba(255, 255, 0, 0.05); }
    `,
    body: Page(`
      <div style="margin-bottom: 12px; display: flex; justify-content: space-between; align-items: flex-start;">
        <div>
            <div style="font-weight: bold; font-size: 11px;">Branch: ${escapeHtml(state.branch)}</div>
            <div class="cr-muted">Approved: ${state.findings.filter((f: any) => f.status === 'approved').length}/${state.findings.length}</div>
        </div>
        <button class="cr-button" onclick="revalidate()" style="font-size: 10px; padding: 4px 10px;">Revalidate</button>
      </div>
      <div style="margin-bottom: 12px; display: flex; gap: 6px; flex-wrap: wrap;">
        <button class="filter-btn ${state.filter === 'all' ? 'active' : ''}" data-type="all" onclick="filter('all', this)">All</button>
        <button class="filter-btn ${state.filter === 'error' ? 'active' : ''}" data-type="error" onclick="filter('error', this)">Errors</button>
        <button class="filter-btn ${state.filter === 'warning' ? 'active' : ''}" data-type="warning" onclick="filter('warning', this)">Warnings</button>
        <button class="filter-btn ${state.filter === 'info' ? 'active' : ''}" data-type="info" onclick="filter('info', this)">Info</button>
      </div>
      ${loadingHtml}
      <div id="findings-container">
        ${sectionsHtml}
      </div>
    `),
    script: `
      const vscode = acquireVsCodeApi();
      
      window.addEventListener('load', () => {
          const activeFilter = document.querySelector('.filter-btn.active');
          if (activeFilter && activeFilter.dataset.type !== 'all') {
              filter(activeFilter.dataset.type, activeFilter);
          }
      });

      function approve(sessionId, findingId) {
        vscode.postMessage({ command: 'approve', sessionId, findingId });
      }
      function focusItem(sessionId, findingId) {
        document.querySelectorAll('.finding-item').forEach(i => i.classList.remove('highlight'));
        const item = document.getElementById('item-' + findingId);
        if (item) item.classList.add('highlight');
        vscode.postMessage({ command: 'focus', sessionId, findingId });
      }
      function copyFinding(text) {
        vscode.postMessage({ command: 'copy', text });
      }
      function revalidate() {
        vscode.postMessage({ command: 'revalidate' });
      }
      function addComment(sessionId, findingId) {
        const body = prompt('Enter your reply:');
        if (body) {
          vscode.postMessage({ command: 'addComment', sessionId, findingId, body });
        }
      }
      function refactor(sessionId, findingId) {
        vscode.postMessage({ command: 'refactor', sessionId, findingId });
      }
      function filter(severity, btn) {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        document.querySelectorAll('.finding-item').forEach(item => {
          if (severity === 'all' || item.dataset.severity === severity || (severity === 'error' && item.dataset.severity === 'critical')) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });

        document.querySelectorAll('.file-section').forEach(section => {
          const visibleItems = Array.from(section.querySelectorAll('.finding-item')).filter(i => i.style.display !== 'none');
          section.style.display = visibleItems.length > 0 ? 'block' : 'none';
        });
        saveCurrentState();
      }

      function saveCurrentState() {
          const state = {
              filter: document.querySelector('.filter-btn.active').dataset.type,
              collapsed: Array.from(document.querySelectorAll('.file-section:not([open]) summary')).map(s => s.dataset.file)
          };
          vscode.postMessage({ command: 'saveState', state });
      }
    `
  });
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical':
    case 'error': return '#f44336';
    case 'warning': return '#ff9800';
    default: return '#2196f3';
  }
}
