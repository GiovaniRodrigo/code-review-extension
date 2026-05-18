import * as vscode from 'vscode';
import { HeatmapService, AuditLogService, AIProviderRegistry } from '@code-review/core';
import { renderDashboardHtml, DashboardState } from '@code-review/ui';

export class DashboardProvider implements vscode.WebviewViewProvider {
  static readonly viewType = 'code-review.dashboard';

  private _view?: vscode.WebviewView;

  constructor(
    private readonly heatmapService?: HeatmapService,
    private readonly auditLog?: AuditLogService,
    private readonly aiRegistry?: AIProviderRegistry,
    private readonly repository?: { getSessionByBranch(branch: string): Promise<any | null> },
    private readonly ide?: { getActiveBranch(): Promise<string> }
  ) {}

  resolveWebviewView(webviewView: vscode.WebviewView): void {
    this._view = webviewView;
    webviewView.webview.options = { enableScripts: true };

    webviewView.webview.onDidReceiveMessage(async (message) => {
        if (message.command === 'setup') { await vscode.commands.executeCommand('code-review.setup'); }
        if (message.command === 'startReview') { await vscode.commands.executeCommand('code-review.startReview'); }
        if (message.command === 'openWorkspace') { await vscode.commands.executeCommand('code-review.openDashboard'); }
        if (message.command === 'analyzeWorkspace') { await vscode.commands.executeCommand('code-review.analyzeWorkspace'); }
        if (message.command === 'indexRag') { await vscode.commands.executeCommand('code-review.indexRepositoryRag'); }
        if (message.command === 'runDiagnostics') { await vscode.commands.executeCommand('code-review.runDiagnostics'); }
        if (message.command === 'setupOllama') { await vscode.commands.executeCommand('code-review.setupOllama'); }
        if (message.command === 'exportMarkdown') { await vscode.commands.executeCommand('code-review.exportMarkdown'); }
        if (message.command === 'exportPdf') { await vscode.commands.executeCommand('code-review.exportPdf'); }
        if (message.command === 'configureCloudProvider') { await vscode.commands.executeCommand('code-review.configureCloudProvider'); }
        if (message.command === 'testAIProvider') { await vscode.commands.executeCommand('code-review.testAIProvider'); }
        if (message.command === 'selectReviewTemplate') { await vscode.commands.executeCommand('code-review.selectReviewTemplate'); }
        if (message.command === 'showProUpgrade') { await vscode.commands.executeCommand('code-review.showProUpgrade'); }
        if (message.command === 'openReviewHistory') { await vscode.commands.executeCommand('code-review.openReviewHistory'); }
        if (message.command === 'restoreSession') { await vscode.commands.executeCommand('code-review.restoreSession'); }
        if (message.command === 'revalidateSession') { await vscode.commands.executeCommand('code-review.revalidateSession'); }
        this.refresh();
    });

    this.refresh();
  }

  async refresh(): Promise<void> {
    if (!this._view) return;
    
    const heat = this.heatmapService ? await this.heatmapService.calculateHeatmap() : [];
    const logs = this.auditLog ? await this.auditLog.getLogs({}) : [];
    
    let activeProviderId = '';
    try {
        activeProviderId = (this.aiRegistry as any)?.activeProviderId || '';
    } catch (e) {
        console.debug('[DASHBOARD] Could not get active provider ID', e);
    }

    const config = vscode.workspace.getConfiguration('codeReview');
    const workspaceName = vscode.workspace.workspaceFolders?.[0]?.name || 'No workspace';
    let activeBranch = workspaceName;
    try {
        activeBranch = this.ide ? await this.ide.getActiveBranch() : workspaceName;
    } catch {
        activeBranch = workspaceName;
    }
    let session: any | null = null;
    try {
        session = this.repository ? await this.repository.getSessionByBranch(activeBranch) : null;
    } catch {
        session = null;
    }
    const normalizedHeat = heat.map(h => ({ file: h.file, score: h.score }));
    const score = calculateDashboardQualityScore(normalizedHeat, Boolean(activeProviderId));
    const reviewStatus = score >= 75
        ? 'Ready for review'
        : score >= 60
          ? 'Needs reviewer attention'
          : 'Risk detected — review required';

    const state: DashboardState = {
        coverage: 0,
        mutationScore: 0,
        testability: { score: 0, level: 'unknown' },
        gatesPassed: false,
        buildStatus: 'unknown',
        heat: normalizedHeat,
        logs: logs.reverse().slice(0, 10).map(l => ({
            action: l.action,
            timestamp: l.timestamp,
            metadata: l.metadata
        })),
        activeAIProvider: activeProviderId || 'mock',
        plan: config.get<string>('product.plan', 'community'),
        targetAudience: config.get<string>('product.targetAudience', 'code reviewers'),
        ragStatus: 'Local ready',
        reviewStatus,
        reviewTemplate: config.get<string>('review.template', 'general'),
        proStatus: {
            cloudProviderConfigured: Boolean(config.get<string>('ai.activeProviderId', '') && config.get<string>('ai.activeProviderId', '') !== 'mock'),
            pdfExportAvailable: true,
            qualityReportAvailable: true,
            prSummaryAvailable: true
        },
        workspaceName,
        qualityScore: score,
        sessionSummary: session ? {
            branch: session.branch,
            findings: session.findings?.length || 0,
            approved: (session.findings || []).filter((finding: any) => finding.status === 'approved').length,
            pending: (session.findings || []).filter((finding: any) => finding.status === 'pending').length,
            updatedAt: session.updatedAt ? new Date(session.updatedAt).toLocaleString() : undefined
        } : undefined
    };

    this._view.webview.html = renderDashboardHtml(state);
  }
}


function calculateDashboardQualityScore(heat: Array<{ file: string; score: number }>, hasActiveProvider: boolean): number {
  const heatPenalty = Math.min(35, heat.reduce((sum, item) => sum + Math.min(item.score, 100), 0) / 25);
  const providerBonus = hasActiveProvider ? 5 : 0;
  return Math.max(0, Math.min(100, Math.round(80 - heatPenalty + providerBonus)));
}
