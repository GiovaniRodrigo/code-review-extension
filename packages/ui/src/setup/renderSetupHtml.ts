import { baseHtml } from '../shared/baseHtml';
import { Page } from '../components/Page';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import type { SetupState } from './SetupState';

export function renderSetupHtml(state: SetupState): string {
  return baseHtml({
    title: 'Code Review Setup',
    body: Page(`
      <h1 class="cr-title">Guided Setup</h1>
      ${Card(`
        <p>Current Step: <strong>${state.step}</strong></p>
        <div style="margin-top: 16px;">
          <!-- Implementation details for each step -->
          ${Button('Next Step', 'next')}
        </div>
      `)}
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
