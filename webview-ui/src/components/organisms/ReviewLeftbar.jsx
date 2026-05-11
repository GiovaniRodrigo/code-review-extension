import React from 'react';
import { Home, AlertTriangle, Lightbulb, MessageSquare, GitPullRequest, GitCommit, CheckCircle2, BarChart3, Clock3, Settings, PanelLeftClose, HelpCircle, Building2 } from 'lucide-react';
import logo from '../../../../media/logo_128px.png';
import { RuleItem } from '../molecules/RuleItem';
import { EditionStatus } from '../molecules/EditionStatus';

export function ReviewLeftbar({ view, setView, state, onStartTour, onToggle, t }) {
  const session = state?.currentSession;
  const git = state?.git;
  const navBadges = buildNavigationBadges(state);
  const ruleGroups = buildRuleGroups(state);
  const sessionProgress = calculateSessionProgress(state);

  const nav = [
    ['dashboard', Home, t('navigation.labels.dashboard') || 'Dashboard', navBadges.dashboard],
    ['analysis', AlertTriangle, t('navigation.labels.analysis') || 'Diagnósticos', navBadges.analysis],
    ['intelligence', Lightbulb, t('navigation.labels.intelligence') || 'Inteligência', navBadges.intelligence],
    ['comments', MessageSquare, t('navigation.labels.comments') || 'Comentários', navBadges.comments],
    ['collaboration', GitPullRequest, t('navigation.labels.collaboration') || 'Colaboração', navBadges.collaboration],
    ['git-review', GitCommit, 'Git Review', navBadges.gitReview],
    ['conformities', CheckCircle2, t('navigation.labels.conformities') || 'Conformidades', navBadges.conformities],
    ['telemetry', BarChart3, t('navigation.labels.telemetry') || 'Telemetria', navBadges.telemetry],
    ['history', Clock3, t('navigation.labels.history') || 'Histórico', navBadges.history],
    ['enterprise', Building2, 'Enterprise', navBadges.enterprise],
    ['settings', Settings, t('navigation.labels.settings') || 'Configurações', '']
  ];

  return (
    <aside className="leftbar">
      <div className="brand">
        <div className="brand-icon">
          <img src={logo} alt="Code Review Logo" className="brand-logo" />
        </div>
        <div className="brand-text">
          <strong>Code Review</strong>
          <span>Governança arquitetural</span>
        </div>
        <button className="sidebar-toggle" title="Ocultar menu lateral esquerdo" onClick={onToggle}>
          <PanelLeftClose size={16} />
        </button>
      </div>

      <EditionStatus state={state} />

      <section className="review-state">
        <span>{t('dashboard.timeline') || 'Revisão atual'}</span>
        <strong>{session ? `${session.sourceBranch} · ${session.status}` : `${git?.currentBranch ?? 'sem branch'} · ${t('common.noData') || 'sem sessão'}`}</strong>
        <div className="progress"><i style={{ width: `${sessionProgress}%` }} /></div>
      </section>

      <nav className="nav-list">
        {nav.map(([key, Icon, label, badge]) => (
          <button key={key} data-tour={`nav-${key}`} className={view === key ? 'active' : ''} onClick={() => setView(key)}>
            <Icon size={18} />
            <span>{label}</span>
            {badge && <b>{badge}</b>}
          </button>
        ))}
      </nav>

      <button className="tour-start-button" data-tour="tour-help" onClick={onStartTour}>
        <HelpCircle size={18} />
        <span>Ver tutorial guiado</span>
      </button>

      <section className="rule-groups" data-tour="rule-groups">
        <h4>Categorias</h4>
        {ruleGroups.map((item) => (
          <RuleItem key={item.label} color={item.color} label={item.label} count={String(item.count)} />
        ))}
      </section>
    </aside>
  );
}

function buildNavigationBadges(state) {
  const session = state?.currentSession;
  const comments = session?.comments ?? [];
  const findings = session?.findings ?? [];
  const metrics = state?.metrics ?? {};
  const openComments = comments.filter((comment) => !['RESOLVED', 'APPROVED'].includes(comment.status ?? '')).length;
  const openFindings = findings.filter((finding) => finding.status !== 'APPROVED').length;
  const unreadNotifications = (session?.notifications ?? []).filter((item) => !item.read).length;
  const suggestions = state?.intelligence?.suggestions?.length ?? 0;
  const qualityScore = metrics.qualityScore ?? calculateLocalQualityScore(comments, findings);
  const conformityScore = calculateConformityScore(session);

  return {
    dashboard: `${qualityScore}`,
    analysis: openFindings + openComments ? String(openFindings + openComments) : '',
    intelligence: suggestions ? String(suggestions) : '',
    comments: comments.length ? String(comments.length) : '',
    collaboration: unreadNotifications ? String(unreadNotifications) : '',
    gitReview: state?.git?.changedFiles?.length ? String(state.git.changedFiles.length) : '',
    conformities: `${conformityScore}%`,
    telemetry: `${qualityScore}%`,
    history: state?.sessions?.length ? String(state.sessions.length) : '',
    enterprise: state?.enterprise?.workflow?.activeGate === 'blocked' ? 'gate' : 'ok'
  };
}

function buildRuleGroups(state) {
  const findings = state?.currentSession?.findings ?? [];
  const byRule = (label) => findings.filter((finding) => `${finding.rule} ${finding.description ?? ''}`.toLowerCase().includes(label.toLowerCase())).length;
  const testsFailed = state?.vscode?.tests?.failed ?? state?.vscode?.testFailures?.length ?? 0;

  return [
    { color: 'red', label: 'SOLID', count: byRule('solid') + byRule('srp') + byRule('ocp') + byRule('lsp') + byRule('isp') + byRule('dip') },
    { color: 'red', label: 'Clean Architecture', count: byRule('clean architecture') + byRule('camada') + byRule('dependência') },
    { color: 'yellow', label: 'DDD', count: byRule('ddd') + byRule('bounded') + byRule('entidade') },
    { color: 'blue', label: 'Performance', count: state?.performance?.cacheEnabled ? 1 : 0 },
    { color: 'green', label: 'Testes', count: testsFailed }
  ];
}

function calculateSessionProgress(state) {
  const session = state?.currentSession;
  if (!session) return state?.git?.currentBranch ? 18 : 0;
  if (session.status === 'APPROVED') return 100;

  const comments = session.comments ?? [];
  const findings = session.findings ?? [];
  const total = comments.length + findings.length;
  if (!total) return 55;

  const done = comments.filter((comment) => ['RESOLVED', 'APPROVED'].includes(comment.status ?? '')).length
    + findings.filter((finding) => finding.status === 'APPROVED').length;
  return Math.max(20, Math.min(98, Math.round((done / total) * 100)));
}

function calculateConformityScore(session) {
  if (!session) return 0;
  const comments = session.comments ?? [];
  const findings = session.findings ?? [];
  const total = comments.length + findings.length;
  if (!total) return session.status === 'APPROVED' ? 100 : 0;
  const resolved = comments.filter((comment) => ['RESOLVED', 'APPROVED'].includes(comment.status ?? '')).length
    + findings.filter((finding) => finding.status === 'APPROVED').length;
  return Math.round((resolved / total) * 100);
}

function calculateLocalQualityScore(comments, findings) {
  const weights = { LOW: 3, MEDIUM: 7, HIGH: 12, CRITICAL: 20 };
  const commentPenalty = comments
    .filter((comment) => !['RESOLVED', 'APPROVED'].includes(comment.status ?? ''))
    .reduce((total, comment) => total + (weights[comment.severity ?? 'MEDIUM'] ?? 7), 0);
  const findingPenalty = findings
    .filter((finding) => finding.status !== 'APPROVED')
    .reduce((total, finding) => total + (weights[finding.severity ?? 'MEDIUM'] ?? 7), 0);

  return Math.max(0, 100 - commentPenalty - findingPenalty);
}
