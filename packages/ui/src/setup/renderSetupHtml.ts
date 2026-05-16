import { baseHtml } from '../shared/baseHtml';
import { escapeHtml } from '../shared/escapeHtml';
import type { SetupState } from './SetupState';

export function renderSetupHtml(state: SetupState): string {
  return baseHtml({
    title: 'Code Review Setup',
    body: `
      <h1>Guided Setup</h1>
      <p>Current Step: <strong>${escapeHtml(state.step)}</strong></p>
      <section>
        <!-- Implementation details for each step -->
        <button onclick="next()">Next Step</button>
      </section>
    `,
    script: `
      const vscode = acquireVsCodeApi();
      function next() { vscode.postMessage({ command: 'next' }); }
    `
  });
}
