import * as vscode from 'vscode';
import { AnalyzeWorkspaceDependenciesUseCase } from '@code-review/core';
import { TypeScriptDependencyGraphBuilder } from '@code-review/infra';
import { VSCodeContainer } from '../dependencies/buildContainer';

type ProductPanelAction = {
  command: string;
  title: string;
  args?: unknown[];
};

type SessionSummary = {
  branch: string;
  findings: number;
  approved: number;
  pending: number;
  rejected: number;
  high: number;
  medium: number;
  low: number;
};

type DependencyGraphWorkspaceState = {
  totalFiles: number;
  renderedFiles: number;
  cycles: { path: string[] }[];
  nodes: { id: string; filePath?: string; dependsOn: string[] }[];
  error?: string;
};

export function registerProductCommandSuite(
  context: vscode.ExtensionContext,
  container: VSCodeContainer
): void {
  container.commands.register('code-review.openWorkspace', () => openCodeReviewWorkspace(context, container));
  container.commands.register('code-review.openDashboard', () => openCodeReviewWorkspace(context, container, 'dashboard'));
  container.commands.register('code-review.openAiCodingGuard', () => openCodeReviewWorkspace(context, container, 'guard'));
  container.commands.register('code-review.aiCodingGuard.scanActiveDraft', async () => {
    const result = await scanActiveEditorForAiCodingGuard(context);
    await showAiCodingGuardScanNotification(context, result, 'manual-scan');
  });
  container.commands.register('code-review.aiCodingGuard.scanChangedFiles', () => scanOpenDocumentsWithAiCodingGuard(context));
  container.commands.register('code-review.aiCodingGuard.toggleAutoWatch', () => toggleAiCodingGuardAutoWatch(context));
  container.commands.register('code-review.runUiRegressionGate', () => openUiRegressionGate(context, container));
  container.commands.register('code-review.openRagContextExplorer', () => openRagContextExplorer(context, container));
  container.commands.register('code-review.openReviewSessionTimeline', () => openReviewSessionTimeline(context, container));
  container.commands.register('code-review.openProCommercialCenter', () => openProCommercialCenter(context));
  container.commands.register('code-review.openTeamSyncCenter', () => openTeamSyncCenter(context, container));
  container.commands.register('code-review.openEnterpriseReadinessReport', () => openEnterpriseReadinessReport(context));
  container.commands.register('code-review.openProviderSetup', () => openProviderSetup(context));
  container.commands.register('code-review.openRagManager', () => openRagManager(context, container));
  container.commands.register('code-review.openPRSummary', () => openPrSummaryWorkspace(context, container));
  container.commands.register('code-review.openQualityReport', () => openQualityReportWorkspace(context, container));
  container.commands.register('code-review.openReviewIntelligence', () => openReviewIntelligence(context, container));
  container.commands.register('code-review.openProjectChat', () => openCodeReviewWorkspace(context, container, 'chat'));
  container.commands.register('code-review.openDependencyGraph', () => openCodeReviewWorkspace(context, container, 'graph'));
  container.commands.register('code-review.viewPlans', () => openPlans(context));
  container.commands.register('code-review.configureLicense', () => configureLicense(context));
  container.commands.register('code-review.startProTrial', () => startProTrial(context));
  container.commands.register('code-review.openTeamDashboard', () => openTeamDashboard(context, container));
  container.commands.register('code-review.shareReviewSession', () => shareReviewSession(context, container));
  container.commands.register('code-review.manageReviewPolicies', () => manageReviewPolicies(context));
  container.commands.register('code-review.openCollaborationCenter', () => openCollaborationCenter(context, container));
  container.commands.register('code-review.openEnterpriseGovernance', () => openEnterpriseGovernance(context));
  container.commands.register('code-review.configureSso', () => configureSso(context));
  container.commands.register('code-review.configureRbac', () => configureRbac(context));
  container.commands.register('code-review.openAuditLogs', () => openAuditLogs(context));
  container.commands.register('code-review.exportAuditLogs', () => exportAuditLogs(context));
  container.commands.register('code-review.configureAIPolicies', () => configureAiPolicies(context));
  container.commands.register('code-review.prepareSelfHostedBundle', () => prepareSelfHostedBundle(context));
  registerAiCodingGuardAutoWatch(context);
}

async function getCurrentSessionSummary(container: VSCodeContainer): Promise<SessionSummary> {
  const branch = await container.ide.getActiveBranch().catch(() => 'workspace');
  const session = await container.repository.getSessionByBranch(branch).catch(() => null);
  const findings = session?.findings ?? [];
  const bySeverity = (severity: string) => findings.filter((finding: any) => String(finding.severity ?? '').toLowerCase() === severity).length;
  const byStatus = (status: string) => findings.filter((finding: any) => String(finding.status ?? '').toLowerCase() === status).length;

  return {
    branch,
    findings: findings.length,
    approved: byStatus('approved'),
    pending: byStatus('pending'),
    rejected: byStatus('rejected'),
    high: bySeverity('high') + bySeverity('critical'),
    medium: bySeverity('medium'),
    low: bySeverity('low') + bySeverity('info')
  };
}


async function getDependencyGraphWorkspaceState(container: VSCodeContainer): Promise<DependencyGraphWorkspaceState> {
  try {
    const useCase = new AnalyzeWorkspaceDependenciesUseCase(
      container.workspace,
      container.fileSystem,
      new TypeScriptDependencyGraphBuilder()
    );
    const report = await useCase.execute();
    return {
      totalFiles: Number(report.totalFiles || 0),
      renderedFiles: Number(report.renderedFiles || 0),
      cycles: Array.isArray(report.cycles) ? report.cycles.slice(0, 80) : [],
      nodes: Array.isArray(report.nodes) ? report.nodes.slice(0, 420) : []
    };
  } catch (error: any) {
    return {
      totalFiles: 0,
      renderedFiles: 0,
      cycles: [],
      nodes: [],
      error: error?.message || String(error)
    };
  }
}

async function openCodeReviewWorkspace(
  context: vscode.ExtensionContext,
  container: VSCodeContainer,
  initialTab: 'dashboard' | 'findings' | 'diagnostics' | 'chat' | 'provider' | 'guard' | 'graph' | 'reports' | 'team' | 'enterprise' = 'dashboard'
): Promise<void> {
  const session = await getCurrentSessionSummary(container).catch(() => ({
    branch: 'workspace',
    findings: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    high: 0,
    medium: 0,
    low: 0
  }));
  const config = vscode.workspace.getConfiguration('codeReview');
  const workspaceName = vscode.workspace.workspaceFolders?.[0]?.name ?? 'No workspace';
  const plan = config.get<string>('product.plan', 'community');
  const provider = config.get<string>('ai.activeProviderId', '') || config.get<string>('provider', 'mock') || 'mock';
  const score = calculateScore(session);
  const scoreLabel = score >= 80 ? 'Ready' : score >= 60 ? 'Needs attention' : 'Risk';
  const dependencyGraph = await getDependencyGraphWorkspaceState(container);
  const guardAutoWatchEnabled = config.get<boolean>('aiCodingGuard.autoWatch.enabled', true);
  const guardLastScan = context.workspaceState.get<any>('gitCodeReview.aiCodingGuard.lastScan', undefined);

  const panel = vscode.window.createWebviewPanel(
    'gitCodeReviewWorkspace',
    'Git Code Review Workspace',
    vscode.ViewColumn.One,
    { enableScripts: true, retainContextWhenHidden: true }
  );

  panel.webview.onDidReceiveMessage(async (message) => {
    const command = String(message.command || '');
    const allowed: Record<string, string> = {
      dashboard: 'code-review.openDashboard',
      guard: 'code-review.openAiCodingGuard',
      analyzeWorkspace: 'code-review.analyzeWorkspace',
      analyzeBranch: 'code-review.analyzeBranchCommits',
      analyzeFile: 'code-review.analyze',
      diagnostics: 'code-review.runDiagnostics',
      indexRag: 'code-review.indexRepositoryRag',
      clearRag: 'code-review.clearRepositoryRag',
      searchRag: 'code-review.searchRepositoryContext',
      provider: 'code-review.configureCloudProvider',
      providerTest: 'code-review.testAIProvider',
      ollama: 'code-review.setupOllama',
      prSummary: 'code-review.generatePRSummary',
      qualityReport: 'code-review.generateQualityReport',
      exportMarkdown: 'code-review.exportMarkdown',
      exportPdf: 'code-review.exportPdf',
      revalidate: 'code-review.revalidateSession',
      history: 'code-review.openReviewHistory',
      template: 'code-review.selectReviewTemplate',
      plans: 'code-review.viewPlans',
      trial: 'code-review.startProTrial',
      team: 'code-review.openTeamDashboard',
      policies: 'code-review.manageReviewPolicies',
      collaboration: 'code-review.openCollaborationCenter',
      enterprise: 'code-review.openEnterpriseGovernance',
      sso: 'code-review.configureSso',
      rbac: 'code-review.configureRbac',
      audit: 'code-review.openAuditLogs',
      aiPolicies: 'code-review.configureAIPolicies',
      selfHosted: 'code-review.prepareSelfHostedBundle',
      guardAutoScan: 'code-review.aiCodingGuard.scanActiveDraft',
      guardScanChanged: 'code-review.aiCodingGuard.scanChangedFiles',
      guardToggleWatch: 'code-review.aiCodingGuard.toggleAutoWatch'
    };
    if (command === 'openDependencyFile') {
      await openDependencyGraphFile(message);
      return;
    }
    if (command === 'guardScanActiveEditor') {
      const result = await scanActiveEditorForAiCodingGuard(context);
      await panel.webview.postMessage({ type: 'guardScanResult', result });
      return;
    }
    if (command === 'guardOpenDiff') {
      await openAiCodingGuardDraftDiff(context);
      return;
    }
    if (command === 'guardApproveDraft') {
      await recordAiCodingGuardDecision(context, 'approved');
      return;
    }
    if (command === 'guardRejectDraft') {
      await recordAiCodingGuardDecision(context, 'rejected');
      return;
    }
    if (command === 'guardAskAiToFix') {
      await vscode.window.showInformationMessage('AI Coding Guard: ask the active AI agent to rewrite the draft using the blocked findings as constraints.');
      return;
    }
    if (command === 'guardCreateFinding') {
      await recordAiCodingGuardDecision(context, 'finding-created');
      return;
    }
    if (allowed[command]) {
      await vscode.commands.executeCommand(allowed[command]);
      return;
    }
    if (command === 'focusSideBar') {
      await vscode.commands.executeCommand('workbench.view.extension.code-review');
    }
  }, undefined, context.subscriptions);

  panel.webview.html = renderWorkspaceShell({
    initialTab,
    workspaceName,
    branch: session.branch,
    score,
    scoreLabel,
    plan,
    provider,
    findings: session.findings,
    pending: session.pending,
    approved: session.approved,
    rejected: session.rejected,
    high: session.high,
    medium: session.medium,
    low: session.low,
    dependencyGraph,
    guardAutoWatchEnabled,
    guardLastScan
  });
}

type WorkspaceShellState = {
  initialTab: string;
  workspaceName: string;
  branch: string;
  score: number;
  scoreLabel: string;
  plan: string;
  provider: string;
  findings: number;
  pending: number;
  approved: number;
  rejected: number;
  high: number;
  medium: number;
  low: number;
  dependencyGraph: DependencyGraphWorkspaceState;
  guardAutoWatchEnabled: boolean;
  guardLastScan?: AiCodingGuardResult & { scannedAt?: string; source?: string };
};

function renderWorkspaceShell(state: WorkspaceShellState): string {
  const escapedInitial = escapeHtml(state.initialTab);
  const sampleFindings = [
    { sev: 'High', title: 'Potential unsafe data flow in changed files', file: 'src/application/review/*', tag: 'Security', conf: '0.88' },
    { sev: 'Medium', title: 'Review policy not explicitly documented for this branch', file: 'docs/review-policy.md', tag: 'Governance', conf: '0.74' },
    { sev: 'Low', title: 'RAG context can be refreshed before final decision', file: 'workspace index', tag: 'RAG', conf: '0.68' }
  ];
  const graphData = safeJson(state.dependencyGraph);
  const graphRenderedNodes = state.dependencyGraph.nodes.length;
  const graphRenderedEdges = state.dependencyGraph.nodes.reduce((sum, node) => sum + new Set(node.dependsOn || []).size, 0);
  const graphCycles = state.dependencyGraph.cycles.length;
  const guardLast = state.guardLastScan;
  const guardStatus = String(guardLast?.status || 'needs-review');
  const guardFindingCount = Array.isArray(guardLast?.findings) ? guardLast.findings.length : 0;
  const guardStatusLabel = guardStatus === 'clean' ? 'Clean' : guardStatus === 'blocked' ? 'Blocked' : guardStatus === 'warning' ? 'Warning' : 'Needs Review';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1.0" />
<title>Git Code Review Workspace</title>
<style>
:root{--primary:#534AB7;--primarySoft:rgba(83,74,183,.16);--success:#3B6D11;--warning:#BA7517;--danger:#E24B4A;--info:#2F7FD7;--bg:var(--vscode-editor-background);--fg:var(--vscode-foreground);--muted:var(--vscode-descriptionForeground);--border:var(--vscode-widget-border,rgba(255,255,255,.12));--panel:var(--vscode-sideBar-background);--panel2:var(--vscode-editorWidget-background);--radius:18px}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font-family:var(--vscode-font-family);font-size:13px}.app{display:grid;grid-template-columns:240px 1fr;min-height:100vh}.nav{border-right:1px solid var(--border);background:var(--panel);padding:14px 12px;display:flex;flex-direction:column;gap:12px}.brand{border:1px solid var(--border);border-radius:var(--radius);padding:14px;background:linear-gradient(135deg,var(--primarySoft),transparent)}.brand .kicker,.kicker{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:var(--muted)}.brand h1{font-size:18px;margin:4px 0 2px}.brand p{color:var(--muted);font-size:11px;line-height:1.45;margin:0}.score{width:58px;height:58px;border-radius:50%;border:3px solid ${state.score < 60 ? 'var(--danger)' : state.score < 80 ? 'var(--warning)' : 'var(--success)'};display:grid;place-items:center;font-size:19px;font-weight:800;color:${state.score < 60 ? 'var(--danger)' : state.score < 80 ? 'var(--warning)' : 'var(--success)'}}.brandTop{display:flex;justify-content:space-between;gap:10px}.tabs{display:flex;flex-direction:column;gap:4px}.tab{appearance:none;background:transparent;border:0;border-radius:12px;color:var(--muted);cursor:pointer;text-align:left;padding:9px 10px;display:flex;gap:8px;align-items:center;font:inherit}.tab:hover{background:rgba(255,255,255,.04);color:var(--fg)}.tab.active{background:var(--primarySoft);color:var(--fg)}.content{padding:22px;overflow:auto}.screen{display:none}.screen.active{display:block}.hero{border:1px solid var(--border);border-radius:24px;padding:18px;background:radial-gradient(circle at top right,rgba(226,75,74,.16),transparent 35%),linear-gradient(135deg,var(--primarySoft),transparent)}.hero h2{font-size:26px;margin:4px 0 4px}.muted{color:var(--muted)}.actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:14px}button.primary,button.secondary{border:0;border-radius:999px;padding:8px 14px;cursor:pointer;font-weight:650}button.primary{background:var(--primary);color:#fff}button.secondary{background:transparent;border:1px solid var(--border);color:var(--fg)}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:12px;margin-top:14px}.card{border:1px solid var(--border);border-radius:18px;background:var(--panel);padding:14px}.statLabel{font-size:10px;text-transform:uppercase;letter-spacing:.07em;color:var(--muted)}.statValue{font-size:23px;font-weight:800;margin-top:4px}.row{display:flex;gap:10px;align-items:center;padding:9px 0;border-bottom:1px solid var(--border)}.row:last-child{border-bottom:0}.dot{width:8px;height:8px;border-radius:50%;background:var(--muted);flex:0 0 auto}.ok{background:var(--success)}.warn{background:var(--warning)}.err{background:var(--danger)}.badge{display:inline-flex;border:1px solid var(--border);border-radius:999px;padding:2px 8px;font-size:10px;color:var(--muted)}.badge.high{color:var(--danger);background:rgba(226,75,74,.10);border-color:rgba(226,75,74,.25)}.badge.medium{color:var(--warning);background:rgba(186,117,23,.10);border-color:rgba(186,117,23,.25)}.badge.low{color:var(--info);background:rgba(47,127,215,.10);border-color:rgba(47,127,215,.25)}.finding{border:1px solid var(--border);border-radius:18px;background:var(--panel);padding:14px;margin-top:10px}.findingHead{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.filters{display:flex;gap:6px;flex-wrap:wrap;margin-top:12px}.filter{border:1px solid var(--border);border-radius:999px;background:transparent;color:var(--muted);padding:5px 10px}.filter.active{background:var(--primarySoft);color:var(--fg)}.chat{display:flex;flex-direction:column;gap:10px}.msg{max-width:760px;border:1px solid var(--border);border-radius:16px;padding:12px;line-height:1.55}.user{align-self:flex-end;background:var(--primarySoft)}.ai{background:var(--panel)}.providerGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:12px}.provider{border:1px solid var(--border);border-radius:18px;background:var(--panel);padding:14px}.provider.active{border-color:var(--primary);background:var(--primarySoft)}.graphToolbar{display:flex;align-items:center;gap:8px;flex-wrap:wrap;border:1px solid var(--border);border-radius:16px;padding:10px;margin-top:12px;background:var(--panel)}.graphToolbar label{display:inline-flex;gap:5px;align-items:center;color:var(--muted)}.graphBox{border:1px solid var(--border);border-radius:20px;background:var(--panel);height:500px;position:relative;overflow:hidden;margin-top:12px}.graphBox canvas{width:100%;height:100%;display:block;cursor:grab}.graphBox canvas.dragging{cursor:grabbing}.graphTooltip{position:absolute;display:none;z-index:3;pointer-events:none;max-width:310px;border:1px solid var(--border);border-radius:12px;background:var(--vscode-editorWidget-background);box-shadow:0 12px 34px rgba(0,0,0,.32);padding:10px 12px;font-size:12px;line-height:1.45}.graphTooltip strong{display:block;margin-bottom:4px}.graphTooltip span{display:block;color:var(--muted)}.graphLegend{display:flex;gap:12px;flex-wrap:wrap;color:var(--muted);font-size:11px;margin-top:8px}.node{position:absolute;transform:translate(-50%,-50%);border:1px solid #2F7FD7;background:rgba(47,127,215,.20);border-radius:14px;padding:8px 12px;font-size:11px}.node.cycle{border-color:var(--danger);background:rgba(226,75,74,.16)}.edge{position:absolute;height:1px;background:rgba(136,135,128,.65);transform-origin:left center}.edge.cycle{background:var(--danger);height:2px}.footer{margin-top:auto;color:var(--muted);font-size:11px}.table{width:100%;border-collapse:collapse;margin-top:12px}.table th,.table td{border-bottom:1px solid var(--border);padding:9px;text-align:left}.table th{font-size:10px;text-transform:uppercase;letter-spacing:.07em;color:var(--muted)}.guardPanel{border:1px solid var(--border);border-radius:20px;background:var(--panel);padding:14px;margin-top:12px}.guardAuto{border:1px solid var(--border);border-radius:18px;background:linear-gradient(135deg,rgba(83,74,183,.14),transparent);padding:14px;margin-top:12px}.guardAuto strong{display:block;margin-bottom:4px}.guardStatus{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--border);border-radius:999px;padding:6px 12px;font-weight:700}.guardStatus.clean{color:var(--success);background:rgba(59,109,17,.12)}.guardStatus.warning{color:var(--warning);background:rgba(186,117,23,.12)}.guardStatus.blocked{color:var(--danger);background:rgba(226,75,74,.12)}.guardFinding{border:1px solid var(--border);border-radius:16px;padding:12px;margin-top:10px;background:var(--panel2)}.guardFinding.high{border-color:rgba(226,75,74,.40)}.guardFinding.medium{border-color:rgba(186,117,23,.36)}.guardFinding.low{border-color:rgba(47,127,215,.32)}.draftBox{border:1px dashed var(--border);border-radius:18px;padding:14px;background:rgba(83,74,183,.07);margin-top:12px}.policyGrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:10px;margin-top:12px}.policyCard{border:1px solid var(--border);border-radius:16px;background:var(--panel);padding:12px}.policyCard strong{display:block;margin-bottom:5px}@media(max-width:820px){.app{grid-template-columns:1fr}.nav{position:sticky;top:0;z-index:2}.tabs{flex-direction:row;overflow:auto}.content{padding:14px}.hero h2{font-size:20px}}
</style>
</head>
<body>
<div class="app">
  <aside class="nav">
    <section class="brand">
      <div class="brandTop"><div><div class="kicker">For code reviewers</div><h1>Git Code Review</h1><p>Review workspace with Git context, HITL findings, local-first RAG and AI assistance.</p></div><div class="score">${state.score}</div></div>
    </section>
    <div class="actions" style="margin-top:0"><button class="secondary" data-command="dashboard" title="Open Dashboard">📊 Dashboard</button></div>
    <nav class="tabs">
      ${tab('dashboard','📊 Dashboard')}
      ${tab('findings','🔍 Findings')}
      ${tab('guard','🛡️ AI Coding Guard')}
      ${tab('diagnostics','⚙️ Diagnostics')}
      ${tab('chat','💬 Project Chat')}
      ${tab('provider','🔌 Provider Setup')}
      ${tab('graph','🧩 Dependency Graph')}
      ${tab('reports','📄 Reports')}
      ${tab('team','👥 Team')}
      ${tab('enterprise','🛡️ Enterprise')}
    </nav>
    <div class="footer">${escapeHtml(state.workspaceName)} · ${escapeHtml(state.plan)} · ${escapeHtml(state.provider)}</div>
  </aside>
  <main class="content">
    <section id="dashboard" class="screen">
      <div class="hero"><div class="kicker">Dashboard</div><h2>Review readiness</h2><p class="muted">Central workspace based on the wireframe. Use this full-screen panel for the main workflow instead of operating only from the narrow sidebar.</p><div class="actions">${action('analyzeWorkspace','Start safe workspace review','primary')}${action('diagnostics','Run Diagnostics')}${action('indexRag','Index RAG')}${action('provider','Configure Provider')}</div></div>
      <div class="grid">${stat('Quality score',String(state.score),state.scoreLabel)}${stat('Findings',String(state.findings),state.pending+' pending')}${stat('Approved',String(state.approved),'by reviewer')}${stat('RAG index','Local ready','context status')}${stat('Branch',escapeHtml(state.branch),'current review')}${stat('Plan',escapeHtml(state.plan),'active package')}</div>
      <div class="card"><div class="kicker">Review readiness</div>${ready('Workspace',state.workspaceName,'ok')}${ready('Git branch',state.branch,'ok')}${ready('AI provider',state.provider,state.provider==='mock'?'warn':'ok')}${ready('RAG provider','Local index available','ok')}${ready('Human-in-the-Loop','Reviewer decides every finding','ok')}</div>
    </section>
    <section id="findings" class="screen">
      <div class="hero"><div class="kicker">Findings</div><h2>Human-in-the-Loop review queue</h2><p class="muted">Filter findings by severity, status and category; approve, reject, reply, refactor or export.</p><div class="actions">${action('revalidate','Revalidate')}${action('qualityReport','Generate Quality Report')}${action('exportMarkdown','Export Markdown')}</div></div>
      <div class="filters"><button class="filter active">All</button><button class="filter">High ${state.high}</button><button class="filter">Medium ${state.medium}</button><button class="filter">Low ${state.low}</button><button class="filter">Pending ${state.pending}</button><button class="filter">Approved ${state.approved}</button></div>
      ${sampleFindings.map((f,i)=>findingCard(f,i)).join('')}
    </section>
    <section id="guard" class="screen">
      <div class="hero"><div class="kicker">AI Coding Guard</div><h2>Validate LLM-generated code before it reaches your files</h2><p class="muted">Auto Watch scans files as soon as AI-generated changes appear in the workspace. It flags nonconformities before a reviewer approves the draft.</p><div class="actions">${action('guardScanActiveEditor','Scan Active Draft','primary')}${action('guardScanChanged','Scan Open Changed Files')}${action('guardOpenDiff','Open Draft Diff')}${action('guardToggleWatch',state.guardAutoWatchEnabled ? 'Disable Auto Watch' : 'Enable Auto Watch')}${action('guardAskAiToFix','Ask AI to Fix')}${action('guardRejectDraft','Reject Draft')}</div></div>
      <div class="grid">${stat('Guard mode','Review Gate','blocks critical issues')}${stat('Auto Watch',state.guardAutoWatchEnabled ? 'Active' : 'Disabled','watches changed documents')}${stat('Last status',guardStatusLabel,guardFindingCount+' finding(s)')}${stat('Decision owner','Reviewer','Human-in-the-Loop')}</div>
      <div class="guardAuto"><strong>Auto Watch behavior</strong><p class="muted">When another AI agent writes or edits a file, Git Code Review scans the changed document, shows a notification if code is risky, updates the Guard status, and creates local guard findings. It cannot take control of another extension's permission prompt, but it warns as soon as the draft appears in the workspace.</p></div>
      <div class="draftBox"><div class="kicker">Draft diff preview</div><h3>LLM changes stay in draft until approved</h3><p class="muted">Use <strong>Open Draft Diff</strong> to compare the current file with a guarded draft. Critical issues remain blocked until the reviewer approves, rejects or asks the AI to fix the suggestion.</p></div>
      <div class="guardPanel"><div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap"><div><div class="kicker">Live findings</div><h3 style="margin:4px 0">Current scan result</h3><p class="muted">Auto Watch and manual scans validate generated code against architecture, security, testability and project-policy rules.</p></div><span id="guardStatus" class="guardStatus ${guardStatus === 'blocked' ? 'blocked' : guardStatus === 'clean' ? 'clean' : 'warning'}">${escapeHtml(guardStatusLabel)}${guardLast?.file ? ' · '+escapeHtml(guardLast.file) : ''}</span></div><div id="guardFindings">${renderInitialGuardFindings(guardLast)}</div></div>
      <div class="policyGrid"><div class="policyCard"><strong>Architecture</strong><span class="muted">Detects layer violations, business logic in controllers and dependency direction issues.</span></div><div class="policyCard"><strong>Security</strong><span class="muted">Flags unsafe SQL, hardcoded secrets, eval/new Function and risky authentication code.</span></div><div class="policyCard"><strong>Testability</strong><span class="muted">Warns when production code appears without nearby tests or is difficult to isolate.</span></div><div class="policyCard"><strong>Enterprise</strong><span class="muted">Ready for Team/Enterprise policy enforcement and audit logging.</span></div></div>
    </section>
    <section id="diagnostics" class="screen">
      <div class="hero"><div class="kicker">Product Diagnostics</div><h2>Environment checks</h2><p class="muted">Validate workspace, Git, AI provider, RAG and extension container before review.</p><div class="actions">${action('diagnostics','Run diagnostics','primary')}${action('indexRag','Fix RAG')}${action('provider','Fix provider')}</div></div>
      <div class="card">${ready('Plan & audience',state.plan+' · code reviewers','ok')}${ready('Workspace',state.workspaceName,'ok')}${ready('Git branch',state.branch,'ok')}${ready('AI provider',state.provider,state.provider==='mock'?'warn':'ok')}${ready('RAG provider','Ready; refresh recommended after large changes','warn')}${ready('Extension container','Use cases registered','ok')}</div>
    </section>
    <section id="chat" class="screen">
      <div class="hero"><div class="kicker">Project Chat</div><h2>Ask the codebase</h2><p class="muted">RAG-aware conversation for reviewers: ask about flows, files, findings and architectural impact.</p><div class="actions">${action('indexRag','Index Repository RAG')}${action('searchRag','Search Context')}</div></div>
      <div class="chat"><div class="msg user">Where is the reviewed change most risky?</div><div class="msg ai">The highest risk is concentrated in the current branch context. Review the High findings first, refresh RAG if files changed recently, then generate the Quality Report before approval.</div><div class="msg user">Explain the current review decision.</div><div class="msg ai">Score ${state.score} means ${escapeHtml(state.scoreLabel)}. Pending findings should be resolved or explicitly approved by the reviewer.</div></div>
    </section>
    <section id="provider" class="screen">
      <div class="hero"><div class="kicker">Guided Setup</div><h2>Configure AI provider</h2><p class="muted">Local-first by default. Cloud providers are Pro/Team/Enterprise productivity features.</p><div class="actions">${action('ollama','Setup Ollama')}${action('provider','Configure Cloud')}${action('providerTest','Test connection')}</div></div>
      <div class="providerGrid">${provider('Mock','Community','Offline fallback for demos and safe first use',state.provider==='mock')}${provider('Ollama','Community','Local AI through localhost without sending code to cloud',state.provider.includes('ollama'))}${provider('OpenAI','Pro','Cloud AI for summaries and reports',state.provider.includes('openai'))}${provider('Claude','Pro','Contextual review and long-form reports',state.provider.includes('claude'))}${provider('Gemini','Pro','Cloud provider alternative',state.provider.includes('gemini'))}${provider('Custom endpoint','Enterprise','Corporate gateway or OpenAI-compatible endpoint',state.provider.includes('custom'))}</div>
    </section>
    <section id="graph" class="screen">
      <div class="hero"><div class="kicker">Architecture view</div><h2>Dependency Graph</h2><p class="muted">Interactive dependency map using the same analysis data as the sidebar. Hover nodes for tooltip details and click a node to open the related file.</p><div class="actions">${action('focusSideBar','Open compact sidebar graph')}${action('analyzeWorkspace','Analyze workspace')}</div></div>
      <div class="grid">${stat('Scope','Package/File','interactive')}${stat('Cycles',String(graphCycles),'detected')}${stat('Rendered files',String(state.dependencyGraph.renderedFiles),'same source as sidebar')}${stat('Dependencies',String(graphRenderedEdges),'resolved imports')}</div>
      ${state.dependencyGraph.error ? `<div class="card"><strong>Graph warning</strong><p class="muted">${escapeHtml(state.dependencyGraph.error)}</p></div>` : ''}
      <div class="graphToolbar">
        <span class="statLabel">Scope</span>
        <button class="secondary" id="dgScopePackage" type="button">Package</button>
        <button class="secondary" id="dgScopeFile" type="button">File</button>
        <label><input type="checkbox" id="dgShowImports" checked /> Imports</label>
        <label><input type="checkbox" id="dgShowCycles" checked /> Cycles</label>
        <button class="secondary" id="dgReset" type="button">Reset</button>
      </div>
      <div class="graphBox" aria-label="Interactive dependency graph">
        <canvas id="dependencyGraphCanvas" width="1100" height="500"></canvas>
        <div class="graphTooltip" id="dependencyGraphTooltip"></div>
      </div>
      <div class="graphLegend"><span>🔵 Normal module</span><span>🔴 Cycle participant</span><span>→ Import direction</span><span>Click file node to open it; click package node to choose a file from that package.</span></div>
    </section>
    <section id="reports" class="screen"><div class="hero"><div class="kicker">Reports</div><h2>Review artifacts</h2><p class="muted">Generate professional outputs for PRs, audits and team communication.</p><div class="actions">${action('prSummary','Generate PR Summary','primary')}${action('qualityReport','Technical Quality Report')}${action('exportPdf','Export PDF')}${action('exportMarkdown','Export Markdown')}</div></div><table class="table"><tr><th>Artifact</th><th>Plan</th><th>Purpose</th></tr><tr><td>PR Summary</td><td>Pro</td><td>Pull request description and reviewer notes</td></tr><tr><td>Quality Report</td><td>Pro</td><td>Score, findings, severity and recommendations</td></tr><tr><td>Markdown Export</td><td>Community</td><td>Local portable review output</td></tr><tr><td>PDF Export</td><td>Pro</td><td>Shareable report for stakeholders</td></tr></table></section>
    <section id="team" class="screen"><div class="hero"><div class="kicker">Team Foundation</div><h2>Shared review workflows</h2><p class="muted">Team features prepare collaboration, shared sessions, review policies and dashboards.</p><div class="actions">${action('team','Open Team Dashboard')}${action('collaboration','Collaboration Center')}${action('policies','Manage Review Policies')}</div></div><div class="grid">${stat('Shared sessions','Ready','foundation')}${stat('Policies','Configurable','team rules')}${stat('Comments','Per finding','collaboration')}${stat('Dashboards','Team','metrics')}</div></section>
    <section id="enterprise" class="screen"><div class="hero"><div class="kicker">Enterprise Foundation</div><h2>Governance and control</h2><p class="muted">Enterprise-ready local foundation for SSO metadata, RBAC, audit logs, AI policies and self-hosted readiness.</p><div class="actions">${action('enterprise','Open Governance')}${action('sso','Configure SSO')}${action('rbac','Configure RBAC')}${action('audit','Audit Logs')}${action('aiPolicies','AI Policies')}${action('selfHosted','Self-hosted Bundle')}</div></div><div class="grid">${stat('SSO','Foundation','SAML/OIDC metadata')}${stat('RBAC','Foundation','roles and permissions')}${stat('Audit','Local logs','exportable')}${stat('Self-hosted','Readiness','bundle checklist')}</div></section>
  </main>
</div>
<script>
const vscode = acquireVsCodeApi();
const initial = '${escapedInitial}';
const dependencyGraphData = ${graphData};
let dependencyGraphScope = 'package';
let dependencyGraphHover = null;
let dependencyGraphModel = { nodes: [], edges: [] };

function openTab(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id===id));
  document.querySelectorAll('.tab').forEach(t=>t.classList.toggle('active',t.dataset.tab===id));
  if (id === 'graph') setTimeout(renderDependencyGraph, 0);
}
document.querySelectorAll('.tab').forEach(t=>t.addEventListener('click',()=>openTab(t.dataset.tab)));
document.addEventListener('click',e=>{const b=e.target.closest('[data-command]'); if(!b) return; vscode.postMessage({command:b.dataset.command});});
window.addEventListener('message', event => {
  const message = event.data || {};
  if (message.type === 'guardScanResult') renderAiCodingGuardResult(message.result || {});
});
function renderAiCodingGuardResult(result){
  const statusEl = document.getElementById('guardStatus');
  const list = document.getElementById('guardFindings');
  if(!statusEl || !list) return;
  const status = String(result.status || 'needs-review').toLowerCase();
  const findings = Array.isArray(result.findings) ? result.findings : [];
  const label = status === 'clean' ? 'Clean' : status === 'blocked' ? 'Blocked' : status === 'warning' ? 'Warning' : 'Needs Review';
  statusEl.className = 'guardStatus ' + (status === 'blocked' ? 'blocked' : status === 'clean' ? 'clean' : 'warning');
  statusEl.textContent = label + (result.file ? ' · ' + result.file : '');
  if(!findings.length){
    list.innerHTML = '<article class="guardFinding low"><span class="badge low">Clean</span><h3>No blocking nonconformities found</h3><p class="muted">The draft can proceed to reviewer approval.</p></article>';
    return;
  }
  list.innerHTML = findings.map((finding, index) => {
    const sev = String(finding.severity || 'Medium');
    const cls = sev.toLowerCase().includes('high') || sev.toLowerCase().includes('critical') ? 'high' : sev.toLowerCase().includes('low') || sev.toLowerCase().includes('info') ? 'low' : 'medium';
    return '<article class="guardFinding '+cls+'"><div style="display:flex;justify-content:space-between;gap:10px"><span class="badge '+cls+'">'+escapeGuardHtml(sev)+'</span><span class="badge">#'+(index+1)+'</span></div><h3>'+escapeGuardHtml(finding.title || 'Policy finding')+'</h3><p class="muted">'+escapeGuardHtml(finding.detail || '')+'</p><div class="muted"><strong>Rule:</strong> '+escapeGuardHtml(finding.rule || 'AI Coding Guard')+'</div><div class="actions">'+guardButton('guardAskAiToFix','Ask AI to Fix')+guardButton('guardCreateFinding','Create Finding')+guardButton('guardOpenDiff','Open Diff')+'</div></article>';
  }).join('');
}
function guardButton(command,label){ return '<button class="secondary" data-command="'+command+'">'+escapeGuardHtml(label)+'</button>'; }
function escapeGuardHtml(value){ return String(value || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

function graphRawNodes(){ return Array.isArray(dependencyGraphData.nodes) ? dependencyGraphData.nodes : []; }
function graphCycles(){ return Array.isArray(dependencyGraphData.cycles) ? dependencyGraphData.cycles : []; }
function graphParts(value){ return String(value || '').split(/[\\/]/).filter(Boolean); }
function graphShort(value){ const parts = graphParts(value); return parts[parts.length - 1] || String(value || 'module'); }
function graphPackageName(value){
  const parts = graphParts(value);
  if (!parts.length) return 'workspace';
  if ((parts[0] === 'packages' || parts[0] === 'apps') && parts[1]) return parts.slice(0, 2).join('/');
  if (parts[0] === 'app' && parts[1]) return parts.slice(0, 2).join('/');
  if (parts[0] === 'resources' && parts[1]) return parts.slice(0, Math.min(3, parts.length)).join('/');
  if ((parts[0] === 'src' || parts[0] === 'routes' || parts[0] === 'database') && parts[1]) return parts.slice(0, 2).join('/');
  return parts[0];
}
const dependencyGraphCycleFiles = new Set();
graphCycles().forEach(c => (Array.isArray(c.path) ? c.path : []).forEach(p => dependencyGraphCycleFiles.add(String(p))));
function dependencyGraphIsCycle(id){
  if (dependencyGraphScope === 'file') return dependencyGraphCycleFiles.has(String(id));
  return Array.from(dependencyGraphCycleFiles).some(p => graphPackageName(p) === id);
}
function dependencyGraphBuildModel(){
  const raw = graphRawNodes();
  if (dependencyGraphScope === 'file') {
    const degree = new Map();
    raw.forEach(n => {
      const deps = Array.from(new Set(n.dependsOn || []));
      degree.set(n.id, (degree.get(n.id) || 0) + deps.length);
      deps.forEach(d => degree.set(d, (degree.get(d) || 0) + 1));
    });
    const visible = raw
      .filter(n => (degree.get(n.id) || 0) > 0)
      .sort((a,b) => (degree.get(b.id) || 0) - (degree.get(a.id) || 0) || String(a.id).localeCompare(String(b.id)))
      .slice(0, 110);
    const visibleIds = new Set(visible.map(n => n.id));
    const nodes = visible.map(n => ({ id:n.id, label:graphShort(n.id), filePath:n.filePath || n.id, files:[n.filePath || n.id], degree:degree.get(n.id) || 0 }));
    const edges = [];
    visible.forEach(n => Array.from(new Set(n.dependsOn || [])).forEach(dep => { if (visibleIds.has(dep)) edges.push({ from:n.id, to:dep }); }));
    return { nodes, edges };
  }
  const packages = new Map();
  raw.forEach(n => {
    const key = graphPackageName(n.id);
    if (!packages.has(key)) packages.set(key, { id:key, label:key, files:[], deps:new Set(), degree:0 });
    packages.get(key).files.push(n.filePath || n.id);
  });
  raw.forEach(n => {
    const from = graphPackageName(n.id);
    const pkg = packages.get(from);
    if (!pkg) return;
    Array.from(new Set(n.dependsOn || [])).forEach(dep => {
      const to = graphPackageName(dep);
      if (to && to !== from && packages.has(to)) pkg.deps.add(to);
    });
  });
  const all = Array.from(packages.values());
  all.forEach(pkg => { pkg.degree = pkg.deps.size + all.filter(other => other.deps.has(pkg.id)).length; });
  const nodes = all.sort((a,b) => b.degree - a.degree || b.files.length - a.files.length || a.id.localeCompare(b.id)).slice(0, 80);
  const visible = new Set(nodes.map(n => n.id));
  const edges = [];
  nodes.forEach(n => Array.from(n.deps).forEach(dep => { if (visible.has(dep)) edges.push({ from:n.id, to:dep }); }));
  return { nodes, edges };
}
function dependencyGraphLayout(model){
  const canvas = document.getElementById('dependencyGraphCanvas');
  if (!canvas) return;
  const nodes = model.nodes;
  const edges = model.edges;
  const width = canvas.width, height = canvas.height;
  if (!nodes.length) return;
  const centerX = width / 2, centerY = height / 2;
  const radius = Math.min(width, height) * 0.36;
  nodes.forEach((n, i) => {
    const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
    const ring = radius * (0.72 + ((i % 4) * 0.08));
    n.x = centerX + Math.cos(angle) * ring;
    n.y = centerY + Math.sin(angle) * ring;
  });
  const byId = new Map(nodes.map(n => [n.id, n]));
  for (let iter = 0; iter < 120; iter++) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        let dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy || 0.01;
        const d = Math.sqrt(d2);
        dx /= d; dy /= d;
        const force = Math.min((dependencyGraphScope === 'package' ? 1600 : 900) / d2, 2.4);
        a.x += dx * force; a.y += dy * force; b.x -= dx * force; b.y -= dy * force;
      }
    }
    edges.forEach(e => {
      const a = byId.get(e.from), b = byId.get(e.to); if (!a || !b) return;
      const dx = b.x - a.x, dy = b.y - a.y;
      const d = Math.sqrt(dx * dx + dy * dy) || 1;
      const desired = dependencyGraphScope === 'package' ? 200 : 135;
      const force = (d - desired) * 0.008;
      a.x += dx / d * force; a.y += dy / d * force; b.x -= dx / d * force; b.y -= dy / d * force;
    });
    nodes.forEach(n => { n.x = Math.max(58, Math.min(width - 58, n.x)); n.y = Math.max(45, Math.min(height - 45, n.y)); });
  }
}
function renderDependencyGraph(){
  const canvas = document.getElementById('dependencyGraphCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const tip = document.getElementById('dependencyGraphTooltip');
  dependencyGraphModel = dependencyGraphBuildModel();
  dependencyGraphLayout(dependencyGraphModel);
  const nodes = dependencyGraphModel.nodes;
  const edges = dependencyGraphModel.edges;
  const byId = new Map(nodes.map(n => [n.id, n]));
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg') || '#1e1e1e';
  ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.strokeStyle = 'rgba(136,135,128,.10)'; ctx.lineWidth = 1;
  for(let x=0;x<canvas.width;x+=40){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,canvas.height);ctx.stroke();}
  for(let y=0;y<canvas.height;y+=40){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(canvas.width,y);ctx.stroke();}
  if (document.getElementById('dgShowImports')?.checked) {
    edges.forEach(e => {
      const a = byId.get(e.from), b = byId.get(e.to); if(!a || !b) return;
      const cycle = dependencyGraphIsCycle(a.id) && dependencyGraphIsCycle(b.id);
      if (cycle && !document.getElementById('dgShowCycles')?.checked) return;
      drawDependencyLink(ctx, a, b, cycle);
    });
  }
  if (!nodes.length) drawDependencyEmpty(ctx, canvas);
  nodes.forEach(n => drawDependencyNode(ctx, n, dependencyGraphIsCycle(n.id), dependencyGraphHover === n.id));
  if (dependencyGraphHover) {
    const n = nodes.find(node => node.id === dependencyGraphHover);
    if (n && tip && tip.style.display === 'block') {
      // tooltip position is handled by pointer movement; keep visual hover while re-rendering
    }
  }
}
function drawDependencyEmpty(ctx, canvas){ ctx.fillStyle = 'rgba(136,135,128,.85)'; ctx.textAlign='center'; ctx.font='13px var(--vscode-font-family)'; ctx.fillText('No internal dependencies detected after filters.', canvas.width/2, canvas.height/2); }
function drawDependencyLink(ctx, a, b, cycle){
  const dx=b.x-a.x, dy=b.y-a.y, len=Math.hypot(dx,dy)||1, ux=dx/len, uy=dy/len;
  const start=dependencyGraphScope==='package'?60:28, end=dependencyGraphScope==='package'?60:28;
  const sx=a.x+ux*start, sy=a.y+uy*start, ex=b.x-ux*end, ey=b.y-uy*end;
  ctx.strokeStyle=cycle?'#E24B4A':'rgba(136,135,128,.65)'; ctx.lineWidth=cycle?2.5:1.4;
  ctx.beginPath(); ctx.moveTo(sx,sy); ctx.lineTo(ex,ey); ctx.stroke();
  const angle=Math.atan2(ey-sy,ex-sx); ctx.fillStyle=ctx.strokeStyle; ctx.beginPath(); ctx.moveTo(ex,ey); ctx.lineTo(ex-Math.cos(angle-.45)*9, ey-Math.sin(angle-.45)*9); ctx.lineTo(ex-Math.cos(angle+.45)*9, ey-Math.sin(angle+.45)*9); ctx.closePath(); ctx.fill();
}
function drawDependencyNode(ctx,n,cycle,active){
  const isPkg = dependencyGraphScope === 'package';
  ctx.beginPath();
  if (isPkg) roundDependencyRect(ctx,n.x-64,n.y-24,128,48,14); else ctx.arc(n.x,n.y,18,0,Math.PI*2);
  ctx.fillStyle=cycle?'rgba(226,75,74,.22)':active?'rgba(83,74,183,.36)':'rgba(47,127,215,.25)'; ctx.fill();
  ctx.strokeStyle=cycle?'#E24B4A':active?'#8B80FF':'#2F7FD7'; ctx.lineWidth=active?2.4:1.2; ctx.stroke();
  ctx.fillStyle=getComputedStyle(document.documentElement).getPropertyValue('--fg') || '#ddd'; ctx.font=(isPkg?'12px':'10px')+' var(--vscode-font-family)'; ctx.textAlign='center'; ctx.textBaseline='middle';
  const label=String(n.label || n.id); ctx.fillText(label.length > (isPkg?24:16) ? label.slice(0,isPkg?23:15)+'…' : label, n.x, isPkg?n.y:n.y+34);
}
function roundDependencyRect(ctx,x,y,w,h,r){ ctx.moveTo(x+r,y); ctx.arcTo(x+w,y,x+w,y+h,r); ctx.arcTo(x+w,y+h,x,y+h,r); ctx.arcTo(x,y+h,x,y,r); ctx.arcTo(x,y,x+w,y,r); ctx.closePath(); }
function hitDependencyNode(x,y){ return dependencyGraphModel.nodes.find(n => Math.hypot(x-n.x,y-n.y) < (dependencyGraphScope==='package'?68:28)); }
function showDependencyTooltip(node,x,y){
  const canvas = document.getElementById('dependencyGraphCanvas');
  const tip = document.getElementById('dependencyGraphTooltip');
  if (!canvas || !tip || !node) { if(tip) tip.style.display='none'; return; }
  const outgoing = dependencyGraphModel.edges.filter(e => e.from === node.id).length;
  const incoming = dependencyGraphModel.edges.filter(e => e.to === node.id).length;
  const fileCount = Array.isArray(node.files) ? node.files.length : 1;
  const primaryFile = Array.isArray(node.files) && node.files.length ? node.files[0] : node.filePath;
  tip.innerHTML = '<strong>'+escapeDependencyHtml(node.label || node.id)+'</strong>'+
    '<span>'+escapeDependencyHtml(node.id)+'</span>'+
    '<span>'+fileCount+' file(s) · '+outgoing+' outgoing · '+incoming+' incoming</span>'+
    (primaryFile ? '<span>Click to open: '+escapeDependencyHtml(graphShort(primaryFile))+'</span>' : '')+
    (dependencyGraphIsCycle(node.id) ? '<span style="color:#E24B4A">cycle participant</span>' : '');
  const rect = canvas.getBoundingClientRect();
  const sx = rect.width ? rect.width / canvas.width : 1;
  const sy = rect.height ? rect.height / canvas.height : 1;
  const cssX = x * sx, cssY = y * sy;
  const tw = 310, th = 112, pad = 12;
  tip.style.left = Math.min(rect.width - tw - pad, Math.max(pad, cssX + 16)) + 'px';
  tip.style.top = Math.min(rect.height - th - pad, Math.max(pad, cssY + 16)) + 'px';
  tip.style.display='block';
}
function escapeDependencyHtml(value){ return String(value || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function dependencyGraphCanvasPoint(event){ const canvas = document.getElementById('dependencyGraphCanvas'); const rect = canvas.getBoundingClientRect(); return { canvas, x:(event.clientX-rect.left)*(canvas.width/rect.width), y:(event.clientY-rect.top)*(canvas.height/rect.height) }; }
function installDependencyGraphEvents(){
  const canvas = document.getElementById('dependencyGraphCanvas'); if (!canvas || canvas.dataset.ready === '1') return; canvas.dataset.ready = '1';
  document.getElementById('dgScopePackage')?.addEventListener('click',()=>{ dependencyGraphScope='package'; document.getElementById('dgScopePackage').classList.add('primary'); document.getElementById('dgScopeFile').classList.remove('primary'); dependencyGraphHover=null; renderDependencyGraph(); });
  document.getElementById('dgScopeFile')?.addEventListener('click',()=>{ dependencyGraphScope='file'; document.getElementById('dgScopeFile').classList.add('primary'); document.getElementById('dgScopePackage').classList.remove('primary'); dependencyGraphHover=null; renderDependencyGraph(); });
  document.getElementById('dgShowImports')?.addEventListener('change',renderDependencyGraph);
  document.getElementById('dgShowCycles')?.addEventListener('change',renderDependencyGraph);
  document.getElementById('dgReset')?.addEventListener('click',()=>{ dependencyGraphHover=null; renderDependencyGraph(); });
  canvas.addEventListener('mousemove',e=>{ const p=dependencyGraphCanvasPoint(e); const n=hitDependencyNode(p.x,p.y); const next=n?n.id:null; if(next!==dependencyGraphHover){ dependencyGraphHover=next; renderDependencyGraph(); } if(n) showDependencyTooltip(n,p.x,p.y); else document.getElementById('dependencyGraphTooltip').style.display='none'; });
  canvas.addEventListener('mouseleave',()=>{ dependencyGraphHover=null; document.getElementById('dependencyGraphTooltip').style.display='none'; renderDependencyGraph(); });
  canvas.addEventListener('click',e=>{ const p=dependencyGraphCanvasPoint(e); const n=hitDependencyNode(p.x,p.y); if(!n) return; const files=Array.isArray(n.files)?n.files.filter(Boolean):[]; vscode.postMessage({command:'openDependencyFile', filePath:n.filePath || files[0], files}); });
}
installDependencyGraphEvents();
document.getElementById('dgScopePackage')?.classList.add('primary');
openTab(initial || 'dashboard');
</script>
</body>
</html>`;
}


function renderInitialGuardFindings(result: WorkspaceShellState['guardLastScan']): string {
  const findings = Array.isArray(result?.findings) ? result.findings : [];
  if (!result) {
    return '<article class="guardFinding medium"><span class="badge medium">Medium</span><h3>No scan yet</h3><p class="muted">Open a generated draft. Auto Watch scans changed files automatically, or click <strong>Scan Active Draft</strong>.</p></article>';
  }
  if (!findings.length) {
    return '<article class="guardFinding low"><span class="badge low">Clean</span><h3>No blocking nonconformities found</h3><p class="muted">The last scanned draft can proceed to reviewer approval.</p></article>';
  }
  return findings.map((finding, index) => {
    const sev = String(finding.severity || 'Medium');
    const cls = /critical|high/i.test(sev) ? 'high' : /low|info/i.test(sev) ? 'low' : 'medium';
    return `<article class="guardFinding ${cls}"><div style="display:flex;justify-content:space-between;gap:10px"><span class="badge ${cls}">${escapeHtml(sev)}</span><span class="badge">#${index + 1}</span></div><h3>${escapeHtml(finding.title || 'Policy finding')}</h3><p class="muted">${escapeHtml(finding.detail || '')}</p><div class="muted"><strong>Rule:</strong> ${escapeHtml(finding.rule || 'AI Coding Guard')}</div></article>`;
  }).join('');
}

function tab(id: string, label: string): string {
  return `<button class="tab" data-tab="${escapeHtml(id)}">${escapeHtml(label)}</button>`;
}

function action(command: string, label: string, variant = 'secondary'): string {
  return `<button class="${variant}" data-command="${escapeHtml(command)}">${escapeHtml(label)}</button>`;
}

function stat(label: string, value: string, sub: string): string {
  return `<div class="card"><div class="statLabel">${escapeHtml(label)}</div><div class="statValue">${value}</div><div class="muted">${escapeHtml(sub)}</div></div>`;
}

function ready(label: string, value: string, status: 'ok' | 'warn' | 'err'): string {
  return `<div class="row"><span class="dot ${status}"></span><div style="flex:1"><strong>${escapeHtml(label)}</strong><div class="muted">${escapeHtml(value)}</div></div><span class="badge">${status === 'ok' ? 'OK' : status === 'warn' ? 'Attention' : 'Blocked'}</span></div>`;
}

function provider(name: string, plan: string, detail: string, active: boolean): string {
  return `<div class="provider ${active ? 'active' : ''}"><div class="statLabel">${escapeHtml(plan)}</div><h3>${active ? '✓ ' : ''}${escapeHtml(name)}</h3><p class="muted">${escapeHtml(detail)}</p></div>`;
}

function findingCard(f: { sev: string; title: string; file: string; tag: string; conf: string }, index: number): string {
  const sevClass = f.sev.toLowerCase() === 'high' ? 'high' : f.sev.toLowerCase() === 'medium' ? 'medium' : 'low';
  return `<article class="finding"><div class="findingHead"><div><span class="badge ${sevClass}">${escapeHtml(f.sev)}</span><h3>${escapeHtml(f.title)}</h3><div class="muted">${escapeHtml(f.file)} · ${escapeHtml(f.tag)} · AI confidence ${escapeHtml(f.conf)}</div></div><span class="badge">#${index + 1}</span></div><p class="muted">Reviewer action required before this finding appears in final reports.</p><div class="actions">${action('qualityReport','Approve')}${action('revalidate','Reply')}${action('analyzeFile','Focus')}${action('exportMarkdown','Copy')}</div></article>`;
}

function createPanel(
  context: vscode.ExtensionContext,
  title: string,
  body: string,
  actions: ProductPanelAction[] = []
): vscode.WebviewPanel {
  const panel = vscode.window.createWebviewPanel(
    'gitCodeReviewProductPage',
    title,
    vscode.ViewColumn.One,
    { enableScripts: true, retainContextWhenHidden: true }
  );

  panel.webview.onDidReceiveMessage(async (message) => {
    const action = actions.find(item => item.command === message.command) ?? actions.find(item => item.command === message.action);
    if (!action) return;
    await vscode.commands.executeCommand(action.command, ...(action.args ?? []));
  }, undefined, context.subscriptions);

  panel.webview.html = renderPage(title, body, actions);
  return panel;
}

function renderPage(title: string, body: string, actions: ProductPanelAction[]): string {
  const buttons = actions.map(action => `<button data-command="${escapeHtml(action.command)}">${escapeHtml(action.title)}</button>`).join('');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1.0" />
<title>${escapeHtml(title)}</title>
<style>
  :root { color-scheme: light dark; }
  body { font-family: var(--vscode-font-family); color: var(--vscode-foreground); background: var(--vscode-editor-background); margin: 0; padding: 20px; }
  h1 { font-size: 22px; margin: 0 0 6px; }
  h2 { font-size: 16px; margin: 22px 0 8px; }
  h3 { font-size: 13px; margin: 14px 0 6px; }
  p { line-height: 1.55; color: var(--vscode-descriptionForeground); }
  .hero { border: 1px solid var(--vscode-panel-border); border-radius: 14px; padding: 16px; background: color-mix(in srgb, var(--vscode-button-background) 10%, transparent); }
  .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); gap: 10px; margin: 14px 0; }
  .card { border: 1px solid var(--vscode-panel-border); border-radius: 12px; padding: 12px; background: var(--vscode-sideBar-background); }
  .label { font-size: 10px; text-transform: uppercase; letter-spacing: .08em; color: var(--vscode-descriptionForeground); }
  .value { font-size: 20px; font-weight: 700; margin-top: 4px; }
  table { border-collapse: collapse; width: 100%; margin: 12px 0; }
  th, td { border-bottom: 1px solid var(--vscode-panel-border); padding: 8px; text-align: left; vertical-align: top; }
  th { font-size: 11px; color: var(--vscode-descriptionForeground); text-transform: uppercase; letter-spacing: .06em; }
  code { background: var(--vscode-textCodeBlock-background); padding: 2px 4px; border-radius: 4px; }
  .actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
  button { cursor: pointer; background: var(--vscode-button-background); color: var(--vscode-button-foreground); border: 0; border-radius: 8px; padding: 7px 12px; }
  .muted { color: var(--vscode-descriptionForeground); }
  .ok { color: #3fb950; }
  .warn { color: #d29922; }
</style>
</head>
<body>
  <div class="hero">
    <div class="label">Git Code Review</div>
    <h1>${escapeHtml(title)}</h1>
    <p>Workspace de governança de code review para code reviewers dentro do VS Code.</p>
    <div class="actions">${buttons}</div>
  </div>
  ${body}
  <script>
    const vscode = acquireVsCodeApi();
    document.addEventListener('click', event => {
      const button = event.target.closest('button[data-command]');
      if (!button) return;
      vscode.postMessage({ command: button.dataset.command });
    });
  </script>
</body>
</html>`;
}

async function openProviderSetup(context: vscode.ExtensionContext): Promise<void> {
  const config = vscode.workspace.getConfiguration('codeReview');
  const active = config.get<string>('ai.activeProviderId', '') || config.get<string>('provider', 'mock');
  createPanel(context, 'Provider Setup', `
    <div class="grid">
      ${providerCard('Mock', 'Community', 'Fallback offline para demos, testes e primeiro uso sem cloud.', active === 'mock')}
      ${providerCard('Ollama', 'Community', 'IA local via http://localhost:11434, sem enviar código para cloud.', active.includes('ollama'))}
      ${providerCard('OpenAI', 'Pro', 'Provider cloud para PR Summary, Quality Report e revisão avançada.', active.includes('openai'))}
      ${providerCard('Claude', 'Pro', 'Provider cloud para análise contextual e relatórios profissionais.', active.includes('claude'))}
      ${providerCard('Gemini', 'Pro', 'Provider cloud alternativo para fluxos Pro e Team.', active.includes('gemini'))}
      ${providerCard('Custom endpoint', 'Enterprise', 'Endpoint OpenAI-compatible ou gateway corporativo.', active.includes('custom'))}
    </div>
    <h2>Critérios de pronto</h2>
    <table><tr><th>Check</th><th>Status esperado</th></tr>
      <tr><td>Provider selecionado</td><td>Dashboard deve refletir provider ativo</td></tr>
      <tr><td>Chaves API</td><td>Armazenadas via SecretStorage</td></tr>
      <tr><td>Fallback</td><td>Mock/Ollama disponível se cloud falhar</td></tr>
    </table>
  `, [
    { command: 'code-review.setProvider', title: 'Select Provider' },
    { command: 'code-review.setupOllama', title: 'Setup Ollama' },
    { command: 'code-review.configureCloudProvider', title: 'Configure Cloud' },
    { command: 'code-review.testAIProvider', title: 'Test Connection' }
  ]);
}

async function openRagManager(context: vscode.ExtensionContext, container: VSCodeContainer): Promise<void> {
  const workspace = container.workspace.getWorkspacePath?.() ?? 'No workspace';
  createPanel(context, 'RAG Manager', `
    <div class="grid">
      <div class="card"><div class="label">Workspace</div><div class="value">${escapeHtml(workspace.split(/[\\/]/).pop() || workspace)}</div><p>Contexto usado pelo Project Chat, PR Summary e análise de findings.</p></div>
      <div class="card"><div class="label">Modo</div><div class="value">Local-first</div><p>Indexação local com opção futura de sincronização Team/Enterprise.</p></div>
      <div class="card"><div class="label">Status</div><div class="value warn">Reindexável</div><p>Execute reindexação após alterações relevantes no projeto.</p></div>
    </div>
    <h2>Roadmap entregue</h2>
    <table><tr><th>Versão</th><th>Capacidade</th></tr>
      <tr><td>2.7.0</td><td>Gerenciamento visual de RAG, busca de contexto e integração com Project Chat.</td></tr>
      <tr><td>3.1.0</td><td>Preparação para contexto compartilhado por equipe.</td></tr>
      <tr><td>4.0.0</td><td>Políticas corporativas para uso de contexto e providers.</td></tr>
    </table>
  `, [
    { command: 'code-review.indexRepositoryRag', title: 'Index Repository' },
    { command: 'code-review.searchRepositoryContext', title: 'Search Context' },
    { command: 'code-review.clearRepositoryRag', title: 'Clear Index' },
    { command: 'code-review.openProjectChat', title: 'Open Project Chat' }
  ]);
}

async function openPrSummaryWorkspace(context: vscode.ExtensionContext, container: VSCodeContainer): Promise<void> {
  const session = await getCurrentSessionSummary(container);
  createPanel(context, 'PR Summary Workspace', `
    ${summaryCards(session)}
    <h2>Resumo esperado</h2>
    <table><tr><th>Seção</th><th>Conteúdo</th></tr>
      <tr><td>Resumo da mudança</td><td>Objetivo do PR e arquivos impactados.</td></tr>
      <tr><td>Riscos técnicos</td><td>Findings High/Medium, áreas sensíveis e pendências.</td></tr>
      <tr><td>Checklist do reviewer</td><td>Itens objetivos para validar antes de aprovar.</td></tr>
      <tr><td>Notas HITL</td><td>Decisões humanas preservadas na sessão.</td></tr>
    </table>
  `, [
    { command: 'code-review.generatePRSummary', title: 'Generate PR Summary' },
    { command: 'code-review.openQualityReport', title: 'Open Quality Report' }
  ]);
}

async function openQualityReportWorkspace(context: vscode.ExtensionContext, container: VSCodeContainer): Promise<void> {
  const session = await getCurrentSessionSummary(container);
  const score = calculateScore(session);
  createPanel(context, 'Technical Quality Report', `
    ${summaryCards(session)}
    <div class="grid">
      <div class="card"><div class="label">Quality Score</div><div class="value">${score}</div><p>${score >= 75 ? 'Aprovável com atenção aos findings pendentes.' : 'Requer revisão antes da aprovação.'}</p></div>
      <div class="card"><div class="label">Decision Signal</div><div class="value">${score >= 75 ? 'Reviewable' : 'Blocked'}</div><p>A decisão final continua pertencendo ao code reviewer.</p></div>
    </div>
    <h2>Seções do relatório</h2>
    <table><tr><th>Seção</th><th>Valor</th></tr>
      <tr><td>Score</td><td>Nota geral calculada pelos findings da sessão.</td></tr>
      <tr><td>Severidade</td><td>Distribuição por Critical/High/Medium/Low.</td></tr>
      <tr><td>HITL</td><td>Aprovado, rejeitado e pendente.</td></tr>
      <tr><td>Recomendações</td><td>Ações sugeridas para estabilizar a mudança.</td></tr>
    </table>
  `, [
    { command: 'code-review.generateQualityReport', title: 'Generate Quality Report' },
    { command: 'code-review.exportPdf', title: 'Export PDF' },
    { command: 'code-review.exportMarkdown', title: 'Export Markdown' }
  ]);
}

async function openReviewIntelligence(context: vscode.ExtensionContext, container: VSCodeContainer): Promise<void> {
  const session = await getCurrentSessionSummary(container);
  createPanel(context, 'Review Intelligence', `
    ${summaryCards(session)}
    <h2>Insights locais</h2>
    <table><tr><th>Métrica</th><th>Uso</th></tr>
      <tr><td>Score médio da sessão</td><td>Apoia decisão de aprovação ou bloqueio.</td></tr>
      <tr><td>Reincidência</td><td>Indica findings persistentes após revalidação.</td></tr>
      <tr><td>Categorias mais frequentes</td><td>Ajuda o reviewer a focar segurança, arquitetura ou performance.</td></tr>
      <tr><td>Tempo estimado economizado</td><td>Ajuda no valor percebido do plano Pro.</td></tr>
    </table>
    <h2>Implementado até 2.9.0</h2>
    <p>Histórico local, relatórios, inteligência de revisão, PR Summary e exportações foram agrupados nesta área.</p>
  `, [
    { command: 'code-review.openReviewHistory', title: 'Review History' },
    { command: 'code-review.revalidateSession', title: 'Revalidate' },
    { command: 'code-review.openQualityReport', title: 'Quality Report' },
    { command: 'code-review.openPRSummary', title: 'PR Summary' }
  ]);
}

async function openPlans(context: vscode.ExtensionContext): Promise<void> {
  const plan = vscode.workspace.getConfiguration('codeReview').get<string>('product.plan', 'community');
  createPanel(context, 'Plans & Packaging', `
    <div class="grid">
      ${planCard('Community', 'Free local-first review for individual code reviewers.', plan === 'community')}
      ${planCard('Pro', 'Cloud AI, PR Summary, Quality Report, PDF export and advanced productivity.', plan === 'pro')}
      ${planCard('Team', 'Shared sessions, collaboration, policies and team dashboards.', plan === 'team')}
      ${planCard('Enterprise', 'SSO, RBAC, audit logs, AI governance and self-hosted options.', plan === 'enterprise')}
    </div>
    <h2>Regra de monetização</h2>
    <p>Community gera adoção. Pro gera receita inicial. Team gera expansão. Enterprise gera contratos maiores.</p>
  `, [
    { command: 'code-review.startProTrial', title: 'Start Pro Trial' },
    { command: 'code-review.configureLicense', title: 'Configure License' },
    { command: 'code-review.openTeamDashboard', title: 'Team Dashboard' },
    { command: 'code-review.openEnterpriseGovernance', title: 'Enterprise Governance' }
  ]);
}

async function configureLicense(context: vscode.ExtensionContext): Promise<void> {
  const selected = await vscode.window.showQuickPick([
    { label: 'Community', value: 'community', detail: 'Free local-first plan' },
    { label: 'Pro', value: 'pro', detail: 'Professional reviewer productivity' },
    { label: 'Team', value: 'team', detail: 'Shared sessions and team policies' },
    { label: 'Enterprise', value: 'enterprise', detail: 'SSO, RBAC, audit and governance' }
  ], { title: 'Git Code Review — Configure License Plan' });
  if (!selected) return;
  await vscode.workspace.getConfiguration('codeReview').update('product.plan', selected.value, vscode.ConfigurationTarget.Global);
  await audit(context, 'license.plan.updated', { plan: selected.value });
  vscode.window.showInformationMessage(`Git Code Review plan set to ${selected.label}.`);
}

async function startProTrial(context: vscode.ExtensionContext): Promise<void> {
  const now = new Date();
  const endsAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);
  await vscode.workspace.getConfiguration('codeReview').update('product.plan', 'pro', vscode.ConfigurationTarget.Global);
  await context.globalState.update('gitCodeReview.proTrial', { startedAt: now.toISOString(), endsAt: endsAt.toISOString() });
  await audit(context, 'trial.pro.started', { endsAt: endsAt.toISOString() });
  vscode.window.showInformationMessage(`Pro trial started. Ends at ${endsAt.toLocaleDateString()}.`);
}

async function openTeamDashboard(context: vscode.ExtensionContext, container: VSCodeContainer): Promise<void> {
  const session = await getCurrentSessionSummary(container);
  createPanel(context, 'Team Dashboard', `
    ${summaryCards(session)}
    <div class="grid">
      <div class="card"><div class="label">Shared Sessions</div><div class="value">Local-ready</div><p>Export/import e estrutura preparada para sync cloud.</p></div>
      <div class="card"><div class="label">Policies</div><div class="value">Configurable</div><p>Padrões de revisão por equipe.</p></div>
      <div class="card"><div class="label">Roles</div><div class="value">Admin / Reviewer / Viewer</div><p>Base para RBAC Team/Enterprise.</p></div>
    </div>
    <h2>Implementado até 3.1.0</h2>
    <table><tr><th>Capacidade</th><th>Status</th></tr>
      <tr><td>Sessões compartilháveis</td><td>Exportação local pronta</td></tr>
      <tr><td>Políticas de review</td><td>Configuração local pronta</td></tr>
      <tr><td>Dashboard de equipe</td><td>Tela operacional pronta</td></tr>
      <tr><td>Sync em tempo real</td><td>Requer backend Team</td></tr>
    </table>
  `, [
    { command: 'code-review.shareReviewSession', title: 'Export Shared Session' },
    { command: 'code-review.manageReviewPolicies', title: 'Manage Policies' },
    { command: 'code-review.configureRbac', title: 'Configure Roles' }
  ]);
}

async function shareReviewSession(context: vscode.ExtensionContext, container: VSCodeContainer): Promise<void> {
  const branch = await container.ide.getActiveBranch().catch(() => 'workspace');
  const session = await container.repository.getSessionByBranch(branch).catch(() => null);
  if (!session) {
    vscode.window.showWarningMessage('No review session found for current branch. Run Start Review first.');
    return;
  }
  const uri = await vscode.window.showSaveDialog({
    defaultUri: await getSafeDefaultSaveUri(context, `git-code-review-session-${safeName(branch)}.json`),
    filters: { JSON: ['json'] },
    title: 'Export shared Git Code Review session'
  });
  if (!uri) return;
  await vscode.workspace.fs.writeFile(uri, Buffer.from(JSON.stringify({ exportedAt: new Date().toISOString(), session }, null, 2), 'utf8'));
  await audit(context, 'team.session.exported', { branch, file: uri.fsPath });
  vscode.window.showInformationMessage('Review session exported for Team collaboration.');
}

async function manageReviewPolicies(context: vscode.ExtensionContext): Promise<void> {
  const current = context.workspaceState.get<Record<string, boolean>>('gitCodeReview.teamPolicies', {});
  const picked = await vscode.window.showQuickPick([
    { label: 'Require reviewer approval for High findings', key: 'requireHighApproval' },
    { label: 'Block approval when Quality Score is below 60', key: 'blockLowScore' },
    { label: 'Require RAG reindex before PR Summary', key: 'requireFreshRag' },
    { label: 'Require Security template for auth/payment changes', key: 'requireSecurityTemplate' }
  ], { canPickMany: true, title: 'Team Review Policies' });
  if (!picked) return;
  const next: Record<string, boolean> = {};
  for (const item of picked) next[item.key] = true;
  await context.workspaceState.update('gitCodeReview.teamPolicies', { ...current, ...next });
  await audit(context, 'team.policies.updated', { policies: Object.keys(next) });
  vscode.window.showInformationMessage('Team review policies saved locally.');
}

async function openCollaborationCenter(context: vscode.ExtensionContext, container: VSCodeContainer): Promise<void> {
  const session = await getCurrentSessionSummary(container);
  createPanel(context, 'Collaboration Center', `
    ${summaryCards(session)}
    <h2>Team collaboration workflow</h2>
    <table><tr><th>Etapa</th><th>Resultado</th></tr>
      <tr><td>Export shared session</td><td>Gera artefato JSON para troca entre reviewers.</td></tr>
      <tr><td>Policies</td><td>Padroniza critérios mínimos de revisão.</td></tr>
      <tr><td>RBAC base</td><td>Prepara papéis Admin, Reviewer e Viewer.</td></tr>
      <tr><td>Cloud sync</td><td>Preparado como evolução backend.</td></tr>
    </table>
  `, [
    { command: 'code-review.openTeamDashboard', title: 'Team Dashboard' },
    { command: 'code-review.shareReviewSession', title: 'Export Shared Session' },
    { command: 'code-review.manageReviewPolicies', title: 'Manage Policies' }
  ]);
}

async function openEnterpriseGovernance(context: vscode.ExtensionContext): Promise<void> {
  const ssoProvider = context.workspaceState.get<string>('gitCodeReview.enterprise.ssoProvider', 'not configured');
  const rbacRole = context.workspaceState.get<string>('gitCodeReview.enterprise.rbacRole', 'reviewer');
  createPanel(context, 'Enterprise Governance', `
    <div class="grid">
      <div class="card"><div class="label">SSO</div><div class="value">${escapeHtml(ssoProvider)}</div><p>SAML/OIDC metadata local-ready.</p></div>
      <div class="card"><div class="label">RBAC</div><div class="value">${escapeHtml(rbacRole)}</div><p>Admin, Reviewer e Viewer.</p></div>
      <div class="card"><div class="label">Audit</div><div class="value">Enabled</div><p>Audit trail local para ações de governança.</p></div>
      <div class="card"><div class="label">AI Policies</div><div class="value">Configurable</div><p>Controle de providers e cloud usage.</p></div>
    </div>
    <h2>Implementado até 4.0.0</h2>
    <table><tr><th>Capacidade</th><th>Status</th></tr>
      <tr><td>SSO/OIDC/SAML</td><td>Configuração e documentação local-ready; validação real depende do IdP.</td></tr>
      <tr><td>RBAC</td><td>Roles locais para gating de ações.</td></tr>
      <tr><td>Audit logs</td><td>Registro local/exportável.</td></tr>
      <tr><td>AI governance</td><td>Políticas locais para bloquear cloud ou exigir provider aprovado.</td></tr>
      <tr><td>Self-hosted</td><td>Checklist e bundle de preparação.</td></tr>
    </table>
  `, [
    { command: 'code-review.configureSso', title: 'Configure SSO' },
    { command: 'code-review.configureRbac', title: 'Configure RBAC' },
    { command: 'code-review.openAuditLogs', title: 'Audit Logs' },
    { command: 'code-review.configureAIPolicies', title: 'AI Policies' },
    { command: 'code-review.prepareSelfHostedBundle', title: 'Self-hosted Bundle' }
  ]);
}

async function configureSso(context: vscode.ExtensionContext): Promise<void> {
  const provider = await vscode.window.showQuickPick(['disabled', 'saml', 'oidc'], { title: 'Enterprise SSO Provider' });
  if (!provider) return;
  const issuer = provider === 'disabled' ? '' : await vscode.window.showInputBox({ title: 'SSO Issuer / Metadata URL', ignoreFocusOut: true });
  await context.workspaceState.update('gitCodeReview.enterprise.ssoProvider', provider);
  await context.secrets.store('enterprise-sso-issuer', issuer ?? '');
  await audit(context, 'enterprise.sso.updated', { provider });
  vscode.window.showInformationMessage(`Enterprise SSO set to ${provider}.`);
}

async function configureRbac(context: vscode.ExtensionContext): Promise<void> {
  const role = await vscode.window.showQuickPick(['admin', 'reviewer', 'viewer'], { title: 'Enterprise RBAC role for this workspace' });
  if (!role) return;
  await context.workspaceState.update('gitCodeReview.enterprise.rbacRole', role);
  await audit(context, 'enterprise.rbac.updated', { role });
  vscode.window.showInformationMessage(`RBAC role set to ${role}.`);
}

async function openAuditLogs(context: vscode.ExtensionContext): Promise<void> {
  const logs = context.globalState.get<any[]>('gitCodeReview.auditLogs', []);
  const rows = logs.slice(-50).reverse().map(log => `<tr><td>${escapeHtml(log.timestamp)}</td><td>${escapeHtml(log.action)}</td><td><code>${escapeHtml(JSON.stringify(log.metadata ?? {}))}</code></td></tr>`).join('');
  createPanel(context, 'Audit Logs', `
    <p>Registro local das ações relevantes de Team e Enterprise.</p>
    <table><tr><th>Quando</th><th>Ação</th><th>Metadados</th></tr>${rows || '<tr><td colspan="3">No audit records yet.</td></tr>'}</table>
  `, [
    { command: 'code-review.exportAuditLogs', title: 'Export Audit Logs' },
    { command: 'code-review.openEnterpriseGovernance', title: 'Governance' }
  ]);
}

async function exportAuditLogs(context: vscode.ExtensionContext): Promise<void> {
  const logs = context.globalState.get<any[]>('gitCodeReview.auditLogs', []);
  const uri = await vscode.window.showSaveDialog({
    defaultUri: await getSafeDefaultSaveUri(context, 'git-code-review-audit-logs.json'),
    filters: { JSON: ['json'] },
    title: 'Export Git Code Review audit logs'
  });
  if (!uri) return;
  await vscode.workspace.fs.writeFile(uri, Buffer.from(JSON.stringify({ exportedAt: new Date().toISOString(), logs }, null, 2), 'utf8'));
  vscode.window.showInformationMessage('Audit logs exported.');
}

async function configureAiPolicies(context: vscode.ExtensionContext): Promise<void> {
  const picked = await vscode.window.showQuickPick([
    { label: 'Allow local-only providers', key: 'localOnly' },
    { label: 'Allow approved cloud providers', key: 'approvedCloud' },
    { label: 'Block custom endpoints', key: 'blockCustomEndpoints' },
    { label: 'Require masking before cloud AI', key: 'requireMasking' },
    { label: 'Require Human-in-the-Loop approval', key: 'requireHitl' }
  ], { canPickMany: true, title: 'Enterprise AI Policies' });
  if (!picked) return;
  const policies = picked.map(item => item.key);
  await context.workspaceState.update('gitCodeReview.enterpriseAiPolicies', policies);
  await audit(context, 'enterprise.aiPolicies.updated', { policies });
  vscode.window.showInformationMessage('Enterprise AI policies saved locally.');
}

async function prepareSelfHostedBundle(context: vscode.ExtensionContext): Promise<void> {
  const uri = await vscode.window.showSaveDialog({
    defaultUri: await getSafeDefaultSaveUri(context, 'git-code-review-self-hosted-readiness.md'),
    filters: { Markdown: ['md'] },
    title: 'Create Git Code Review self-hosted readiness document'
  });
  if (!uri) return;
  const content = `# Git Code Review Self-hosted Readiness\n\n## Scope\n\n- VS Code extension package\n- Enterprise SSO metadata\n- RBAC role mapping\n- Audit log export\n- AI provider policy\n- Private cloud / VPC deployment checklist\n\n## Notes\n\nThis package prepares Enterprise deployment governance. Real SSO, billing, tenant management and cloud sync require the Enterprise backend.\n`;
  await vscode.workspace.fs.writeFile(uri, Buffer.from(content, 'utf8'));
  await audit(context, 'enterprise.selfHostedBundle.prepared', { file: uri.fsPath });
  vscode.window.showInformationMessage('Self-hosted readiness document created.');
}


async function openUiRegressionGate(context: vscode.ExtensionContext, container: VSCodeContainer): Promise<void> {
  const session = await getCurrentSessionSummary(container).catch(() => ({
    branch: 'workspace', findings: 0, approved: 0, pending: 0, rejected: 0, high: 0, medium: 0, low: 0
  }));
  createPanel(context, 'UI Regression Gate', `
    ${summaryCards(session)}
    <h2>4.0.6 Stability & UI Regression</h2>
    <div class="grid">
      <div class="card"><div class="label">Dashboard</div><div class="value ok">Pinned</div><p>Dashboard command, Activity Bar view and workspace tab are guarded.</p></div>
      <div class="card"><div class="label">Primary flow</div><div class="value ok">Visual</div><p>Start Review opens the central workspace instead of relying only on Command Palette.</p></div>
      <div class="card"><div class="label">Runtime paths</div><div class="value ok">Safe</div><p>Exports use workspace or extension storage; no writes to root paths.</p></div>
      <div class="card"><div class="label">Views</div><div class="value ok">Registered</div><p>Dashboard, Findings, Chat, RAG and Graph remain contributed views.</p></div>
    </div>
    <h2>Regression checklist</h2>
    <table><tr><th>Check</th><th>Expected result</th></tr>
      <tr><td>Open Dashboard</td><td>Dashboard tab opens in central workspace.</td></tr>
      <tr><td>Start Review</td><td>Visual workspace opens with Dashboard selected.</td></tr>
      <tr><td>Sidebar views</td><td>All primary views remain available.</td></tr>
      <tr><td>Export actions</td><td>Reports save to safe user-selected paths.</td></tr>
    </table>
  `, [
    { command: 'code-review.openDashboard', title: 'Open Dashboard' },
    { command: 'code-review.openWorkspace', title: 'Open Workspace' },
    { command: 'code-review.runDiagnostics', title: 'Run Diagnostics' }
  ]);
}

async function openRagContextExplorer(context: vscode.ExtensionContext, container: VSCodeContainer): Promise<void> {
  const branch = await container.ide.getActiveBranch().catch(() => 'workspace');
  const workspaceName = vscode.workspace.workspaceFolders?.[0]?.name ?? 'No workspace';
  createPanel(context, 'RAG Context Explorer', `
    <div class="grid">
      <div class="card"><div class="label">Workspace</div><div class="value" style="font-size:16px">${escapeHtml(workspaceName)}</div><p>Context source for Project Chat and AI review.</p></div>
      <div class="card"><div class="label">Branch</div><div class="value" style="font-size:16px">${escapeHtml(branch)}</div><p>Context is interpreted in the active Git branch.</p></div>
      <div class="card"><div class="label">Mode</div><div class="value">Incremental</div><p>Designed for reindexing changed files without blocking the reviewer.</p></div>
      <div class="card"><div class="label">Traceability</div><div class="value ok">Sources</div><p>Project Chat should cite files used as context.</p></div>
    </div>
    <h2>4.1.0 RAG + Project Chat</h2>
    <table><tr><th>Capability</th><th>Status</th></tr>
      <tr><td>Context discovery</td><td>Index and search repository context from the workspace.</td></tr>
      <tr><td>Chat grounding</td><td>Project Chat flow is linked to active branch and RAG status.</td></tr>
      <tr><td>Finding questions</td><td>Reviewer can ask about findings through Project Chat.</td></tr>
      <tr><td>Source traceability</td><td>Reports and chat screens include file/source oriented language.</td></tr>
    </table>
  `, [
    { command: 'code-review.indexRepositoryRag', title: 'Index Repository RAG' },
    { command: 'code-review.searchRepositoryContext', title: 'Search Context' },
    { command: 'code-review.openProjectChat', title: 'Open Project Chat' }
  ]);
}

async function openReviewSessionTimeline(context: vscode.ExtensionContext, container: VSCodeContainer): Promise<void> {
  const sessions = await container.repository.getAllSessions().catch(() => [] as any[]);
  const rows = sessions
    .slice()
    .sort((a: any, b: any) => new Date(b.updatedAt ?? b.createdAt ?? 0).getTime() - new Date(a.updatedAt ?? a.createdAt ?? 0).getTime())
    .slice(0, 30)
    .map((session: any) => {
      const findings = Array.isArray(session.findings) ? session.findings : [];
      const approved = findings.filter((finding: any) => finding.status === 'approved').length;
      const pending = findings.filter((finding: any) => finding.status !== 'approved').length;
      return `<tr><td>${escapeHtml(session.branch || 'workspace')}</td><td>${findings.length}</td><td>${approved}</td><td>${pending}</td><td>${escapeHtml(formatDate(session.updatedAt || session.createdAt))}</td></tr>`;
    })
    .join('');
  createPanel(context, 'Review Session Timeline', `
    <h2>4.2.0 Review Session Complete</h2>
    <p>Local session history for reviewers. Use it to continue a review after reload, inspect previous findings and prepare future cloud sync.</p>
    <table><tr><th>Branch</th><th>Findings</th><th>Approved</th><th>Pending</th><th>Updated</th></tr>${rows || '<tr><td colspan="5">No local sessions yet. Run Start Review or Analyze Workspace first.</td></tr>'}</table>
    <div class="grid">
      <div class="card"><div class="label">Persistence</div><div class="value ok">Local</div><p>Session data is stored by branch through the repository abstraction.</p></div>
      <div class="card"><div class="label">Review state</div><div class="value ok">HITL</div><p>Approved, pending and rejected states are shown by session.</p></div>
      <div class="card"><div class="label">Cloud-ready</div><div class="value warn">Prepared</div><p>Timeline structure is ready for future Pro/Team sync.</p></div>
    </div>
  `, [
    { command: 'code-review.openReviewHistory', title: 'Open Local History' },
    { command: 'code-review.restoreSession', title: 'Restore Current Branch' },
    { command: 'code-review.exportMarkdown', title: 'Export Markdown' }
  ]);
}

async function openProCommercialCenter(context: vscode.ExtensionContext): Promise<void> {
  const plan = vscode.workspace.getConfiguration('codeReview').get<string>('product.plan', 'community');
  const trial = context.globalState.get<any>('gitCodeReview.proTrial');
  createPanel(context, 'Pro Commercial Center', `
    <div class="grid">
      <div class="card"><div class="label">Current plan</div><div class="value">${escapeHtml(plan)}</div><p>Community remains local-first. Pro unlocks cloud productivity.</p></div>
      <div class="card"><div class="label">Trial</div><div class="value">${trial?.endsAt ? 'Active' : 'Available'}</div><p>${trial?.endsAt ? `Ends at ${escapeHtml(formatDate(trial.endsAt))}` : 'Start a local Pro trial to evaluate paid workflows.'}</p></div>
      <div class="card"><div class="label">Commercial MVP</div><div class="value">PR + Reports</div><p>Pro monetizes PR Summary, Technical Quality Report, PDF and cloud AI.</p></div>
    </div>
    <h2>4.3.0 Pro Commercial MVP</h2>
    <table><tr><th>Feature</th><th>Plan</th><th>Status</th></tr>
      <tr><td>Cloud AI configuration</td><td>Pro</td><td>Extension-ready</td></tr>
      <tr><td>PR Summary</td><td>Pro</td><td>Available</td></tr>
      <tr><td>Technical Quality Report</td><td>Pro</td><td>Available</td></tr>
      <tr><td>PDF Export</td><td>Pro</td><td>Available locally</td></tr>
      <tr><td>Billing backend</td><td>Pro</td><td>Requires SaaS backend</td></tr>
    </table>
  `, [
    { command: 'code-review.viewPlans', title: 'View Plans' },
    { command: 'code-review.startProTrial', title: 'Start Pro Trial' },
    { command: 'code-review.configureLicense', title: 'Configure License' },
    { command: 'code-review.configureCloudProvider', title: 'Configure Cloud AI' }
  ]);
}

async function openTeamSyncCenter(context: vscode.ExtensionContext, container: VSCodeContainer): Promise<void> {
  const session = await getCurrentSessionSummary(container).catch(() => ({
    branch: 'workspace', findings: 0, approved: 0, pending: 0, rejected: 0, high: 0, medium: 0, low: 0
  }));
  createPanel(context, 'Team Sync Center', `
    ${summaryCards(session)}
    <h2>4.4.0 Team MVP</h2>
    <p>Team collaboration is implemented as local/exportable workflow foundations. Real-time shared sessions require a Team backend.</p>
    <table><tr><th>Capability</th><th>Status</th></tr>
      <tr><td>Shared session export</td><td>Available as JSON artifact.</td></tr>
      <tr><td>Review policies</td><td>Configurable in workspace state.</td></tr>
      <tr><td>Collaboration center</td><td>Available as reviewer workspace.</td></tr>
      <tr><td>Realtime multi-user sync</td><td>Backend required.</td></tr>
    </table>
  `, [
    { command: 'code-review.shareReviewSession', title: 'Export Shared Session' },
    { command: 'code-review.manageReviewPolicies', title: 'Review Policies' },
    { command: 'code-review.openCollaborationCenter', title: 'Collaboration Center' }
  ]);
}

async function openEnterpriseReadinessReport(context: vscode.ExtensionContext): Promise<void> {
  const logs = context.globalState.get<any[]>('gitCodeReview.auditLogs', []);
  const ssoProvider = context.workspaceState.get<string>('gitCodeReview.enterprise.ssoProvider', 'not configured');
  const rbacRole = context.workspaceState.get<string>('gitCodeReview.enterprise.rbacRole', 'reviewer');
  createPanel(context, 'Enterprise Readiness Report', `
    <div class="grid">
      <div class="card"><div class="label">SSO</div><div class="value" style="font-size:16px">${escapeHtml(ssoProvider)}</div><p>SAML/OIDC metadata foundation.</p></div>
      <div class="card"><div class="label">RBAC role</div><div class="value">${escapeHtml(rbacRole)}</div><p>Local role gate for enterprise workflows.</p></div>
      <div class="card"><div class="label">Audit records</div><div class="value">${logs.length}</div><p>Exportable local audit trail.</p></div>
      <div class="card"><div class="label">Self-hosted</div><div class="value warn">Checklist</div><p>Bundle preparation command available.</p></div>
    </div>
    <h2>5.0.0 Enterprise Real — remaining backend scope</h2>
    <table><tr><th>Capability</th><th>Extension status</th><th>Backend requirement</th></tr>
      <tr><td>SSO</td><td>Configuration UI</td><td>IdP validation and tenant auth</td></tr>
      <tr><td>RBAC</td><td>Local roles</td><td>User/org permission service</td></tr>
      <tr><td>Audit</td><td>Local/exportable logs</td><td>Central immutable audit store</td></tr>
      <tr><td>Self-hosted</td><td>Readiness document</td><td>Deployable backend package</td></tr>
    </table>
  `, [
    { command: 'code-review.openEnterpriseGovernance', title: 'Enterprise Governance' },
    { command: 'code-review.configureSso', title: 'Configure SSO' },
    { command: 'code-review.configureRbac', title: 'Configure RBAC' },
    { command: 'code-review.exportAuditLogs', title: 'Export Audit Logs' }
  ]);
}


type AiCodingGuardFinding = {
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  title: string;
  detail: string;
  rule: string;
};

type AiCodingGuardResult = {
  status: 'clean' | 'warning' | 'blocked' | 'needs-review';
  file: string;
  findings: AiCodingGuardFinding[];
};


const AI_CODING_GUARD_OUTPUT_SCHEME_ALLOWLIST = new Set(['file', 'untitled']);
const AI_CODING_GUARD_DEFAULT_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.php', '.vue', '.py', '.go', '.java', '.cs', '.rb', '.json', '.md', '.yml', '.yaml']);
let aiCodingGuardAutoWatchRegistered = false;

function registerAiCodingGuardAutoWatch(context: vscode.ExtensionContext): void {
  if (aiCodingGuardAutoWatchRegistered) return;
  aiCodingGuardAutoWatchRegistered = true;

  const status = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 98);
  status.name = 'AI Coding Guard';
  status.command = 'code-review.openAiCodingGuard';
  status.text = '$(shield) AI Guard';
  status.tooltip = 'AI Coding Guard Auto Watch is active for generated/changed code.';
  status.show();
  context.subscriptions.push(status);

  const pending = new Map<string, ReturnType<typeof setTimeout>>();
  const schedule = (document: vscode.TextDocument, reason: string, delay = 900) => {
    if (!isAiCodingGuardAutoWatchEnabled()) {
      updateAiCodingGuardStatusBar(status, 'disabled', 0);
      return;
    }
    if (!shouldScanAiCodingGuardDocument(document)) return;
    const key = document.uri.toString();
    const existing = pending.get(key);
    if (existing) clearTimeout(existing);
    pending.set(key, setTimeout(() => {
      pending.delete(key);
      void scanDocumentWithAiCodingGuardAutoWatch(context, document, reason, status).catch(error => {
        console.warn('[AI Coding Guard] auto-watch scan failed', error);
      });
    }, delay));
  };

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument(event => {
      const scanUnsaved = vscode.workspace.getConfiguration('codeReview').get<boolean>('aiCodingGuard.autoWatch.scanUnsaved', true);
      if (!scanUnsaved) return;
      if (!event.contentChanges.length) return;
      schedule(event.document, 'document-change', 1200);
    }),
    vscode.workspace.onDidSaveTextDocument(document => schedule(document, 'document-save', 10)),
    vscode.window.onDidChangeActiveTextEditor(editor => {
      if (!editor) return;
      const scanActive = vscode.workspace.getConfiguration('codeReview').get<boolean>('aiCodingGuard.autoWatch.scanActiveEditor', true);
      if (!scanActive) return;
      schedule(editor.document, 'active-editor', 700);
    })
  );

  updateAiCodingGuardStatusBar(status, 'needs-review', 0);
}

function isAiCodingGuardAutoWatchEnabled(): boolean {
  return vscode.workspace.getConfiguration('codeReview').get<boolean>('aiCodingGuard.autoWatch.enabled', true);
}

function updateAiCodingGuardStatusBar(status: vscode.StatusBarItem, state: AiCodingGuardResult['status'] | 'disabled', findings: number): void {
  if (state === 'disabled') {
    status.text = '$(shield) AI Guard: Off';
    status.tooltip = 'AI Coding Guard Auto Watch is disabled.';
    status.backgroundColor = undefined;
    return;
  }
  if (state === 'blocked') {
    status.text = `$(shield) AI Guard: Blocked ${findings}`;
    status.tooltip = `${findings} generated-code nonconformity finding(s). Click to open AI Coding Guard.`;
    status.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
    return;
  }
  if (state === 'warning') {
    status.text = `$(shield) AI Guard: Warn ${findings}`;
    status.tooltip = `${findings} generated-code warning(s). Click to open AI Coding Guard.`;
    status.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    return;
  }
  if (state === 'clean') {
    status.text = '$(shield-check) AI Guard: Clean';
    status.tooltip = 'No blocking generated-code nonconformities in the last scan.';
    status.backgroundColor = undefined;
    return;
  }
  status.text = '$(shield) AI Guard';
  status.tooltip = 'AI Coding Guard is watching changed files.';
  status.backgroundColor = undefined;
}

function shouldScanAiCodingGuardDocument(document: vscode.TextDocument): boolean {
  if (!AI_CODING_GUARD_OUTPUT_SCHEME_ALLOWLIST.has(document.uri.scheme)) return false;
  if (document.isClosed) return false;
  const text = document.getText();
  const maxChars = vscode.workspace.getConfiguration('codeReview').get<number>('aiCodingGuard.autoWatch.maxChars', 180000);
  if (text.length > maxChars) return false;
  const lower = document.uri.fsPath.toLowerCase();
  const ignored = ['node_modules/', 'node_modules\\', '/dist/', '\\dist\\', '/build/', '\\build\\', '/coverage/', '\\coverage\\', '.lock', 'package-lock.json', 'pnpm-lock.yaml', 'yarn.lock', '.map'];
  if (ignored.some(part => lower.includes(part))) return false;
  const ext = lower.match(/\.[a-z0-9]+$/)?.[0] || '';
  if (ext && !AI_CODING_GUARD_DEFAULT_EXTENSIONS.has(ext)) return false;
  return /\b(eval|new\s+Function|SELECT\s+.+\$\{|DB::raw|whereRaw|api[_-]?key|secret|password|token|RepositoryImpl|console\.log\()/i.test(text)
    || /\b(class|function|export\s+function|public\s+function)\b/.test(text);
}

async function scanDocumentWithAiCodingGuardAutoWatch(
  context: vscode.ExtensionContext,
  document: vscode.TextDocument,
  reason: string,
  statusBar: vscode.StatusBarItem
): Promise<AiCodingGuardResult> {
  const file = vscode.workspace.asRelativePath(document.uri, false);
  const result = await scanTextForAiCodingGuard(context, document.getText(), file, `auto-watch:${reason}`);
  updateAiCodingGuardStatusBar(statusBar, result.status, result.findings.length);
  if (result.status === 'blocked' || result.status === 'warning') {
    await maybeNotifyAiCodingGuardAutoWatch(context, result, reason);
  }
  return result;
}

async function scanTextForAiCodingGuard(
  context: vscode.ExtensionContext,
  text: string,
  file: string,
  source: string
): Promise<AiCodingGuardResult> {
  const result = analyzeDraftWithAiCodingGuard(text, file);
  const record = { ...result, scannedAt: new Date().toISOString(), source };
  await context.workspaceState.update('gitCodeReview.aiCodingGuard.lastScan', record);
  if (result.findings.length) {
    const existing = context.workspaceState.get<any[]>('gitCodeReview.aiCodingGuard.autoFindings', []);
    const next = [record, ...existing].slice(0, 50);
    await context.workspaceState.update('gitCodeReview.aiCodingGuard.autoFindings', next);
  }
  await audit(context, 'ai-coding-guard.scan', { file, status: result.status, findings: result.findings.length, source });
  return result;
}

async function maybeNotifyAiCodingGuardAutoWatch(
  context: vscode.ExtensionContext,
  result: AiCodingGuardResult,
  reason: string
): Promise<void> {
  const notify = vscode.workspace.getConfiguration('codeReview').get<boolean>('aiCodingGuard.autoWatch.notify', true);
  if (!notify) return;
  const fingerprint = `${result.file}:${result.status}:${result.findings.map(f => f.title).join('|')}`;
  const lastFingerprint = context.workspaceState.get<string>('gitCodeReview.aiCodingGuard.lastNotificationFingerprint', '');
  if (lastFingerprint === fingerprint) return;
  await context.workspaceState.update('gitCodeReview.aiCodingGuard.lastNotificationFingerprint', fingerprint);
  const top = result.findings.slice(0, 3).map(f => `${f.severity}: ${f.title}`).join(' · ');
  const message = `AI Coding Guard ${result.status === 'blocked' ? 'blocked' : 'flagged'} generated code in ${result.file}: ${top}`;
  const action = await vscode.window.showWarningMessage(message, 'Open Guard', 'View Diff', 'Ask AI to Fix', 'Approve Anyway');
  if (action === 'Open Guard') await vscode.commands.executeCommand('code-review.openAiCodingGuard');
  if (action === 'View Diff') await vscode.commands.executeCommand('code-review.openAiCodingGuard').then(() => openAiCodingGuardDraftDiff(context));
  if (action === 'Ask AI to Fix') await vscode.window.showInformationMessage('AI Coding Guard: ask the AI agent to rewrite the draft using the listed blocked findings as constraints.');
  if (action === 'Approve Anyway') await recordAiCodingGuardDecision(context, `approved-anyway:${reason}`);
}

async function showAiCodingGuardScanNotification(context: vscode.ExtensionContext, result: AiCodingGuardResult, source: string): Promise<void> {
  if (result.status === 'clean') {
    await vscode.window.showInformationMessage(`AI Coding Guard: clean scan for ${result.file}.`);
    return;
  }
  await maybeNotifyAiCodingGuardAutoWatch(context, result, source);
}

async function scanOpenDocumentsWithAiCodingGuard(context: vscode.ExtensionContext): Promise<void> {
  const docs = vscode.workspace.textDocuments.filter(shouldScanAiCodingGuardDocument).slice(0, 25);
  if (!docs.length) {
    await vscode.window.showInformationMessage('AI Coding Guard: no open changed/generated code documents were eligible for scanning.');
    return;
  }
  let blocked = 0;
  let warnings = 0;
  for (const doc of docs) {
    const result = await scanTextForAiCodingGuard(context, doc.getText(), vscode.workspace.asRelativePath(doc.uri, false), 'manual-open-documents');
    if (result.status === 'blocked') blocked += 1;
    if (result.status === 'warning') warnings += 1;
  }
  await vscode.window.showInformationMessage(`AI Coding Guard scanned ${docs.length} open document(s): ${blocked} blocked, ${warnings} warning.`);
  if (blocked || warnings) await vscode.commands.executeCommand('code-review.openAiCodingGuard');
}

async function toggleAiCodingGuardAutoWatch(context: vscode.ExtensionContext): Promise<void> {
  const config = vscode.workspace.getConfiguration('codeReview');
  const current = config.get<boolean>('aiCodingGuard.autoWatch.enabled', true);
  await config.update('aiCodingGuard.autoWatch.enabled', !current, vscode.ConfigurationTarget.Workspace);
  await audit(context, 'ai-coding-guard.toggle-auto-watch', { enabled: !current });
  await vscode.window.showInformationMessage(`AI Coding Guard Auto Watch ${!current ? 'enabled' : 'disabled'}.`);
}

async function scanActiveEditorForAiCodingGuard(context: vscode.ExtensionContext): Promise<AiCodingGuardResult> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) {
    return { status: 'needs-review', file: 'no active editor', findings: [{ severity: 'Medium', title: 'No active generated draft found', detail: 'Open the file or draft generated by the LLM before running AI Coding Guard.', rule: 'Guard requires an active editor' }] };
  }
  const document = editor.document;
  const selection = editor.selection && !editor.selection.isEmpty ? document.getText(editor.selection) : '';
  const text = selection || document.getText();
  return scanTextForAiCodingGuard(context, text, vscode.workspace.asRelativePath(document.uri, false), 'manual');
}

function analyzeDraftWithAiCodingGuard(text: string, file: string): AiCodingGuardResult {
  const findings: AiCodingGuardFinding[] = [];
  const normalized = text || '';
  const lowerFile = file.toLowerCase();
  const add = (finding: AiCodingGuardFinding) => findings.push(finding);
  if (/\b(eval|new\s+Function)\s*\(/.test(normalized)) add({ severity: 'High', title: 'Dynamic code execution detected', detail: 'The generated draft uses eval/new Function. This can execute arbitrary code and should be rewritten before applying.', rule: 'Security: no dynamic execution' });
  if (/(DB::raw|->raw\(|\.raw\(|SELECT\s+.+\$\{|SELECT\s+.+\+\s*|whereRaw\s*\()/i.test(normalized)) add({ severity: 'High', title: 'Unsafe raw query or SQL interpolation', detail: 'The draft appears to build a raw query or interpolate values into SQL. Use parameter binding or query builder APIs.', rule: 'Security: parameterized database access' });
  if (/(api[_-]?key|secret|password|token)\s*[:=]\s*['\"][^'\"]{8,}['\"]/i.test(normalized)) add({ severity: 'Critical', title: 'Possible hardcoded secret', detail: 'The generated code contains a token/password/secret-like literal. Move secrets to secure configuration or secret storage.', rule: 'Security: no hardcoded secrets' });
  if (/controller/i.test(lowerFile) && /(DB::|::create\(|->save\(|dispatch\(|Mail::|Http::|Storage::)/.test(normalized)) add({ severity: 'Medium', title: 'Controller may contain business/application logic', detail: 'The draft mixes orchestration, persistence or infrastructure calls inside a controller. Move rules to application/domain services.', rule: 'Architecture: keep controllers thin' });
  if (/domain/i.test(lowerFile) && /(infrastructure|http|axios|fetch\(|DB::|Eloquent|RepositoryImpl)/i.test(normalized)) add({ severity: 'High', title: 'Domain layer depends on infrastructure details', detail: 'The draft introduces an infrastructure dependency into a domain file. Depend on abstractions instead.', rule: 'Architecture: dependency direction' });
  if (!/(test|spec|\.stories\.|factory|fixture)/i.test(lowerFile) && /\b(class|function|export\s+function|public\s+function)\b/.test(normalized)) add({ severity: 'Low', title: 'Generated production code may need tests', detail: 'The draft appears to add executable production behavior. Add or update tests before approving.', rule: 'Testability: new behavior requires coverage' });
  if (normalized.split(/\n/).length > 180) add({ severity: 'Medium', title: 'Generated draft is too large for safe review', detail: 'Large AI-generated patches are hard to validate. Split into smaller changes before applying.', rule: 'Maintainability: small reviewable changes' });
  const hasBlocking = findings.some(finding => finding.severity === 'Critical' || finding.severity === 'High');
  const hasMedium = findings.some(finding => finding.severity === 'Medium');
  return { status: hasBlocking ? 'blocked' : hasMedium || findings.length ? 'warning' : 'clean', file, findings };
}

async function openAiCodingGuardDraftDiff(context: vscode.ExtensionContext): Promise<void> {
  const editor = vscode.window.activeTextEditor;
  if (!editor) { await vscode.window.showInformationMessage('AI Coding Guard: open a generated draft or target file before creating a draft diff.'); return; }
  const original = editor.document.getText();
  const fileName = safeName(vscode.workspace.asRelativePath(editor.document.uri, false)).replace(/-$/, '') || 'draft.txt';
  const guardDir = vscode.Uri.joinPath(context.globalStorageUri, 'ai-coding-guard');
  await vscode.workspace.fs.createDirectory(guardDir);
  const originalUri = vscode.Uri.joinPath(guardDir, `original-${fileName}`);
  const draftUri = vscode.Uri.joinPath(guardDir, `guarded-draft-${fileName}`);
  const result = analyzeDraftWithAiCodingGuard(original, vscode.workspace.asRelativePath(editor.document.uri, false));
  const banner = ['/*',' AI Coding Guard Draft Preview',` Status: ${result.status}`,` Findings: ${result.findings.length}`,' This is a preview artifact. Approve in Git Code Review before applying risky changes.','*/',''].join('\n');
  await vscode.workspace.fs.writeFile(originalUri, Buffer.from(original, 'utf8'));
  await vscode.workspace.fs.writeFile(draftUri, Buffer.from(banner + original, 'utf8'));
  await audit(context, 'ai-coding-guard.open-diff', { file: editor.document.uri.fsPath, status: result.status });
  await vscode.commands.executeCommand('vscode.diff', originalUri, draftUri, 'AI Coding Guard Draft Diff');
}

async function recordAiCodingGuardDecision(context: vscode.ExtensionContext, decision: string): Promise<void> {
  const last = context.workspaceState.get<any>('gitCodeReview.aiCodingGuard.lastScan', null);
  const decisions = context.workspaceState.get<any[]>('gitCodeReview.aiCodingGuard.decisions', []);
  const record = { decision, file: last?.file ?? vscode.window.activeTextEditor?.document.uri.fsPath ?? 'unknown', status: last?.status ?? 'needs-review', findings: Array.isArray(last?.findings) ? last.findings.length : 0, decidedAt: new Date().toISOString() };
  await context.workspaceState.update('gitCodeReview.aiCodingGuard.decisions', [record, ...decisions].slice(0, 100));
  await audit(context, `ai-coding-guard.${decision}`, record);
  await vscode.window.showInformationMessage(`AI Coding Guard: draft ${decision}.`);
}

function formatDate(value: unknown): string {
  if (!value) return '-';
  const date = new Date(value as any);
  return Number.isNaN(date.getTime()) ? String(value) : date.toISOString();
}


async function getSafeDefaultSaveUri(context: vscode.ExtensionContext, fileName: string): Promise<vscode.Uri> {
  const safeFileName = safeName(fileName).replace(/-json$/, '.json').replace(/-md$/, '.md') || fileName;
  const workspace = vscode.workspace.workspaceFolders?.[0]?.uri;
  if (workspace) {
    return vscode.Uri.joinPath(workspace, safeFileName);
  }

  await vscode.workspace.fs.createDirectory(context.globalStorageUri);
  return vscode.Uri.joinPath(context.globalStorageUri, safeFileName);
}

async function audit(context: vscode.ExtensionContext, action: string, metadata: Record<string, unknown>): Promise<void> {
  const logs = context.globalState.get<any[]>('gitCodeReview.auditLogs', []);
  logs.push({ timestamp: new Date().toISOString(), action, metadata });
  await context.globalState.update('gitCodeReview.auditLogs', logs.slice(-500));
}


async function openDependencyGraphFile(message: any): Promise<void> {
  const files = Array.isArray(message.files)
    ? message.files.map((file: unknown) => String(file || '')).filter(Boolean)
    : [];
  let filePath = typeof message.filePath === 'string' ? message.filePath : '';

  if (!filePath && files.length === 1) {
    filePath = files[0];
  }

  if (!filePath && files.length > 1) {
    const selected = await vscode.window.showQuickPick(
      files.map(file => ({
        label: file.split(/[\\/]/).pop() || file,
        description: file,
        filePath: file
      })),
      { title: 'Open dependency graph file' }
    );
    filePath = selected?.filePath || '';
  }

  if (!filePath) {
    vscode.window.showInformationMessage('No file is attached to this dependency node.');
    return;
  }

  try {
    const doc = await vscode.workspace.openTextDocument(vscode.Uri.file(filePath));
    await vscode.window.showTextDocument(doc, { preview: false });
  } catch (error: any) {
    vscode.window.showWarningMessage(`Could not open dependency graph file: ${error?.message || String(error)}`);
  }
}

function summaryCards(session: SessionSummary): string {
  return `<div class="grid">
    <div class="card"><div class="label">Branch</div><div class="value" style="font-size:15px">${escapeHtml(session.branch)}</div></div>
    <div class="card"><div class="label">Findings</div><div class="value">${session.findings}</div></div>
    <div class="card"><div class="label">Approved</div><div class="value">${session.approved}</div></div>
    <div class="card"><div class="label">Pending</div><div class="value">${session.pending}</div></div>
  </div>`;
}

function calculateScore(session: SessionSummary): number {
  return Math.max(0, Math.min(100, 90 - session.high * 12 - session.medium * 5 - session.pending * 2 + session.approved));
}

function providerCard(name: string, plan: string, detail: string, active: boolean): string {
  return `<div class="card" style="border-color:${active ? 'var(--vscode-focusBorder)' : 'var(--vscode-panel-border)'}"><div class="label">${escapeHtml(plan)}</div><div class="value" style="font-size:16px">${active ? '✓ ' : ''}${escapeHtml(name)}</div><p>${escapeHtml(detail)}</p></div>`;
}

function planCard(name: string, detail: string, active: boolean): string {
  return `<div class="card" style="border-color:${active ? 'var(--vscode-focusBorder)' : 'var(--vscode-panel-border)'}"><div class="label">${active ? 'Active plan' : 'Plan'}</div><div class="value" style="font-size:17px">${escapeHtml(name)}</div><p>${escapeHtml(detail)}</p></div>`;
}

function safeName(value: string): string {
  return value.replace(/[^a-z0-9._-]+/gi, '-').replace(/^-+|-+$/g, '') || 'workspace';
}

function safeJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
