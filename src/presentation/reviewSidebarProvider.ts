import * as vscode from 'vscode';
import { ReviewSessionUseCases } from '../application/useCases';

export class ReviewSidebarProvider implements vscode.WebviewViewProvider {
  static readonly viewType = 'giovaniCodeReview.sidebar';

  constructor(private readonly service: ReviewSessionUseCases) {}

  async resolveWebviewView(webviewView: vscode.WebviewView): Promise<void> {
    const state = await this.service.getDashboardState(vscode.env.machineId, vscode.env.language);
    const session = state.currentSession;
    const t = state.translations;
    const edition = state.editionPresentation;

    webviewView.webview.options = { enableScripts: false };
    webviewView.webview.html = `<!doctype html>
<html lang="pt-BR">
<body style="font-family: var(--vscode-font-family); color: var(--vscode-foreground); padding: 12px;">
  <h2 style="font-size: 16px;">Code Review</h2>
  <section style="border: 1px solid var(--vscode-sideBarSectionHeader-border); border-radius: 10px; padding: 10px; margin-bottom: 12px; background: var(--vscode-sideBar-background);">
    <strong style="display:block; text-transform: uppercase;">${escapeHtml(edition.badge)}</strong>
    <span style="display:block; margin-top: 4px; color: var(--vscode-descriptionForeground);">${escapeHtml(edition.headline)}</span>
    <span style="display:block; margin-top: 4px; color: var(--vscode-descriptionForeground);">${escapeHtml(edition.aiStatus)}</span>
    <span style="display:block; margin-top: 4px; color: var(--vscode-descriptionForeground);">${escapeHtml(edition.syncStatus)}</span>
  </section>
  <p><strong>Branch:</strong> ${escapeHtml(state.git.currentBranch)}</p>
  <p><strong>${escapeHtml(t.dashboard.summary.decision)}:</strong> ${escapeHtml(state.git.baseBranch)}</p>
  <p><strong>Status:</strong> ${escapeHtml(session?.status ?? t.common.noData)}</p>
  <p><strong>${escapeHtml(t.dashboard.hero.changedFiles)}:</strong> ${state.git.changedFiles.length}</p>
</body>
</html>`;
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
