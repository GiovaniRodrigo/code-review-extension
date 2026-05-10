import React from 'react';
import { RefreshCw, Play } from 'lucide-react';
import { SummaryCard } from '../molecules/SummaryCard';
import { FindingsTable } from './FindingsTable';
import { VSCodeContextPanel } from './VSCodeContextPanel';
import { ValidationFindingsPanel } from './ValidationFindingsPanel';
import { ArchitectureRulesPanel } from './ArchitectureRulesPanel';
import { CommentsPanel } from './CommentsPanel';

export function DiagnosticsCenter({
  state,
  onStartReview,
  t,
  vscodeApi,
  onOpenDiff,
  onOpenFile,
  onRunVSCodeTests,
  onCreateFinding,
  onUpdateFindingStatus,
  onRegisterCorrection,
  onRevalidate,
  onAddComment,
  onEditComment,
  onUpdateCommentStatus
}) {
  const session = state?.currentSession;

  return (
    <main className="center-panel diagnostics-only">
      <header className="center-header">
        <div>
          <span className="eyebrow">Diagnósticos</span>
          <h1>{t('diagnostics.title')}</h1>
          <p>{t('diagnostics.subtitle')}</p>
        </div>
        <div className="header-actions">
          <button onClick={() => vscodeApi?.postMessage({ type: 'requestState' })}><RefreshCw size={16} /> {t('common.update')}</button>
          <button className="primary" onClick={onStartReview}><Play size={16} /> {t('common.revalidate')}</button>
        </div>
      </header>
      <section className="summary-grid">
        <SummaryCard title={t('diagnostics.summary.findings')} value={String(state?.metrics?.findingsCount ?? session?.comments?.length ?? 0)} label={t('diagnostics.summary.technicalItems')} color="red" />
        <SummaryCard title={t('diagnostics.summary.problems')} value={String(state?.vscode?.problems?.length ?? 0)} label={t('diagnostics.summary.vscode')} color="yellow" />
        <SummaryCard title={t('diagnostics.summary.tests')} value={String(state?.vscode?.tests?.failed ?? 0)} label={t('diagnostics.summary.failing')} color="red" />
        <SummaryCard title={t('diagnostics.summary.files')} value={String(state?.git?.changedFiles?.length ?? 0)} label={t('diagnostics.summary.changed')} color="blue" />
      </section>
      <section className="review-workspace">
        <div className="workspace-main">
          <h2>{t('diagnostics.table.title')}</h2>
          <p className="muted">{t('diagnostics.table.subtitle')}</p>
          <div data-tour="findings-table">
            <FindingsTable session={session} git={state?.git} vscodeContext={state?.vscode} t={t} onOpenDiff={onOpenDiff} />
          </div>
          <VSCodeContextPanel vscodeContext={state?.vscode} t={t} onRunTests={onRunVSCodeTests} onOpenFile={onOpenFile} />
          <ValidationFindingsPanel
            session={session}
            git={state?.git}
            currentUser={state?.currentUser}
            t={t}
            onCreateFinding={onCreateFinding}
            onUpdateFindingStatus={onUpdateFindingStatus}
            onRegisterCorrection={onRegisterCorrection}
            onRevalidate={onRevalidate}
          />
          <ArchitectureRulesPanel session={session} t={t} onRunValidation={() => vscodeApi?.postMessage({ type: 'runArchitectureValidation', payload: { id: session?.id } })} />
        </div>
        <aside className="workspace-side">
          <h3>{t('diagnostics.commentsTitle')}</h3>
          <CommentsPanel
            session={session}
            currentUser={state?.currentUser}
            t={t}
            onAddComment={onAddComment}
            onOpenFile={onOpenFile}
            onOpenDiff={onOpenDiff}
            onEditComment={onEditComment}
            onUpdateStatus={onUpdateCommentStatus}
          />
        </aside>
      </section>
    </main>
  );
}
