import React from 'react';
import { RefreshCw, PlusCircle, Sparkles, MessageSquare, GitPullRequest, FileDown } from 'lucide-react';
import { Ring } from '../atoms/Ring';
import { SummaryCard } from '../molecules/SummaryCard';
import { Timeline } from '../molecules/Timeline';
import { Tooltip } from '../atoms/Tooltip';
import { SkeletonPanel } from '../atoms/SkeletonPanel';
import { EditionStatus } from '../molecules/EditionStatus';

export function DashboardCenter({ state, onStartReview, t, qualityLabel, vscodeApi }) {
  const metrics = state?.metrics ?? {};
  const session = state?.currentSession;
  const git = state?.git ?? {};
  const problemsCount = state?.vscode?.problems?.length ?? 0;
  const failedTests = state?.vscode?.tests?.failed ?? state?.vscode?.testFailures?.length ?? 0;
  const hasReviewData = Boolean(session);
  const score = hasReviewData ? metrics.qualityScore : undefined;

  return (
    <main className="center-panel dashboard-only">
      <header className="center-header">
        <div>
          <span className="eyebrow">Dashboard</span>
          <h1>{t('dashboard.title')}</h1>
          <p>{git.currentBranch ? `${git.currentBranch} ${t('common.update').toLowerCase()} ${git.baseBranch}` : t('dashboard.subtitle')}</p>
        </div>
        <div className="header-actions" data-tour="header-actions">
          <Tooltip label={t('dashboard.updateContext')}><button onClick={() => vscodeApi?.postMessage({ type: 'requestState' })}><RefreshCw size={16} /> {t('common.update')}</button></Tooltip>
          <Tooltip label={t('dashboard.newSessionHelp')}><button className="primary" data-tour="start-review" onClick={onStartReview}><PlusCircle size={16} /> {t('dashboard.newSession')}</button></Tooltip>
        </div>
      </header>
      {!state && <SkeletonPanel />}
      <EditionStatus state={state} />
      {!hasReviewData && (
        <section className="empty-state dashboard-empty">
          <strong>Nenhuma sessão real ativa</strong>
          <p>Os cards abaixo permanecem vazios até você criar ou abrir uma sessão de review. Não são exibidos scores, comentários ou problemas fictícios.</p>
        </section>
      )}
      <section className="dashboard-hero" data-tour="quality-summary">
        <div className="hero-score-card">
          <Ring score={score} />
          <div>
            <span className="eyebrow">{t('dashboard.hero.scoreLabel')}</span>
            <h2>{hasReviewData ? qualityLabel(metrics.qualityScore ?? 0, t) : 'Aguardando análise'}</h2>
            <p>{hasReviewData ? t('dashboard.hero.description') : 'Crie uma sessão e execute validações reais para calcular o score.'}</p>
          </div>
        </div>
        <div className="hero-status-grid">
          <div><Sparkles size={18} /><strong>{session?.status ?? 'Sem sessão'}</strong><span>{t('dashboard.hero.statusPR')}</span></div>
          <div><MessageSquare size={18} /><strong>{hasReviewData ? metrics.openCommentsCount ?? 0 : '—'}</strong><span>{t('dashboard.hero.openComments')}</span></div>
          <div><GitPullRequest size={18} /><strong>{git.changedFiles?.length ?? 0}</strong><span>{t('dashboard.hero.changedFiles')}</span></div>
        </div>
      </section>
      <section className="summary-grid">
        <SummaryCard title={t('dashboard.summary.score')} value={hasReviewData ? `${metrics.qualityScore ?? 0}/100` : '—'} label={hasReviewData ? t('dashboard.summary.quality') : 'Sem análise real'} color="green" />
        <SummaryCard title={t('dashboard.summary.status')} value={session?.status ?? 'Sem sessão'} label={t('dashboard.summary.decision')} color="blue" />
        <SummaryCard title={t('dashboard.summary.comments')} value={hasReviewData ? String(metrics.commentsCount ?? 0) : '—'} label={hasReviewData ? `${metrics.openCommentsCount ?? 0} ${t('dashboard.summary.open')}` : 'Nenhum comentário real'} color="yellow" />
        <SummaryCard title={t('dashboard.summary.blocks')} value={String(problemsCount + failedTests)} label={t('dashboard.summary.problemsTests')} color="red" />
      </section>
      <section className="review-workspace dashboard-focus">
        <div className="workspace-main">
          <h2>{t('dashboard.timeline')}</h2>
          <p className="muted">{hasReviewData ? t('dashboard.timelineDesc') : 'A timeline será preenchida por eventos reais da sessão.'}</p>
          <Timeline session={session} t={t} />
        </div>
        <aside className="workspace-side">
          <h3>{t('dashboard.nextActions')}</h3>
          <div className="actions vertical">
            <button onClick={() => vscodeApi?.postMessage({ type: 'requestState' })}><RefreshCw size={18} /> {t('dashboard.updateContext')}</button>
            <button onClick={() => vscodeApi?.postMessage({ type: 'exportReviewReport' })} disabled={!hasReviewData}><FileDown size={18} /> {t('dashboard.exportReport')}</button>
            <button className="primary" onClick={onStartReview}><PlusCircle size={18} /> {t('dashboard.newSession')}</button>
          </div>
        </aside>
      </section>
    </main>
  );
}
