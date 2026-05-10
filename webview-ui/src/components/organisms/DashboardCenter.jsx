import React from 'react';
import { RefreshCw, Play, Sparkles, MessageSquare, GitPullRequest, FileDown } from 'lucide-react';
import { Ring } from '../atoms/Ring';
import { SummaryCard } from '../molecules/SummaryCard';
import { Timeline } from '../molecules/Timeline';
import { Tooltip } from '../atoms/Tooltip';
import { SkeletonPanel } from '../atoms/SkeletonPanel';

export function DashboardCenter({ state, onStartReview, t, qualityLabel, vscodeApi }) {
  const metrics = state?.metrics ?? {};
  const session = state?.currentSession;
  const git = state?.git ?? {};
  const problemsCount = state?.vscode?.problems?.length ?? 0;
  const failedTests = state?.vscode?.tests?.failed ?? state?.vscode?.testFailures?.length ?? 0;

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
          <Tooltip label={t('dashboard.runReview')}><button className="primary" data-tour="start-review" onClick={onStartReview}><Play size={16} /> {t('dashboard.runReview')}</button></Tooltip>
        </div>
      </header>
      {!state && <SkeletonPanel />}
      <section className="dashboard-hero" data-tour="quality-summary">
        <div className="hero-score-card">
          <Ring score={metrics.qualityScore ?? 100} />
          <div>
            <span className="eyebrow">{t('dashboard.hero.scoreLabel')}</span>
            <h2>{qualityLabel(metrics.qualityScore ?? 100, t)}</h2>
            <p>{t('dashboard.hero.description')}</p>
          </div>
        </div>
        <div className="hero-status-grid">
          <div><Sparkles size={18} /><strong>{session?.status ?? t('common.status.open')}</strong><span>{t('dashboard.hero.statusPR')}</span></div>
          <div><MessageSquare size={18} /><strong>{metrics.openCommentsCount ?? 0}</strong><span>{t('dashboard.hero.openComments')}</span></div>
          <div><GitPullRequest size={18} /><strong>{git.changedFiles?.length ?? 0}</strong><span>{t('dashboard.hero.changedFiles')}</span></div>
        </div>
      </section>
      <section className="summary-grid">
        <SummaryCard title={t('dashboard.summary.score')} value={`${metrics.qualityScore ?? 100}/100`} label={t('dashboard.summary.quality')} color="green" />
        <SummaryCard title={t('dashboard.summary.status')} value={session?.status ?? t('common.status.open')} label={t('dashboard.summary.decision')} color="blue" />
        <SummaryCard title={t('dashboard.summary.comments')} value={String(metrics.commentsCount ?? 0)} label={`${metrics.openCommentsCount ?? 0} ${t('dashboard.summary.open')}`} color="yellow" />
        <SummaryCard title={t('dashboard.summary.blocks')} value={String(problemsCount + failedTests)} label={t('dashboard.summary.problemsTests')} color="red" />
      </section>
      <section className="review-workspace dashboard-focus">
        <div className="workspace-main">
          <h2>{t('dashboard.timeline')}</h2>
          <p className="muted">{t('dashboard.timelineDesc')}</p>
          <Timeline session={session} t={t} />
        </div>
        <aside className="workspace-side">
          <h3>{t('dashboard.nextActions')}</h3>
          <div className="actions vertical">
            <button onClick={() => vscodeApi?.postMessage({ type: 'requestState' })}><RefreshCw size={18} /> {t('dashboard.updateContext')}</button>
            <button onClick={() => vscodeApi?.postMessage({ type: 'exportReviewReport' })}><FileDown size={18} /> {t('dashboard.exportReport')}</button>
            <button className="primary" onClick={onStartReview}><Play size={18} /> {t('dashboard.runReview')}</button>
          </div>
        </aside>
      </section>
    </main>
  );
}
