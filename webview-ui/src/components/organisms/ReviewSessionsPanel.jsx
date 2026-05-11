import React from 'react';
import { FolderOpen } from 'lucide-react';

export function StatusControls({ session, currentUser, t, onUpdateStatus }) {
  const statuses = ['OPEN', 'IN_REVIEW', 'NEEDS_CHANGES', 'FIXED', 'APPROVED', 'REOPENED'];
  const canApprove = session?.reviewer === currentUser || currentUser === 'admin';

  return (
    <div className="status-controls" aria-label="Status da revisão">
      {statuses.map((status) => (
        <button
          key={status}
          disabled={status === 'APPROVED' && !canApprove}
          className={session.status === status ? 'active' : ''}
          onClick={() => onUpdateStatus?.({ id: session.id, status })}
        >
          {status}
        </button>
      ))}
    </div>
  );
}

export function ReviewSessionsPanel({ sessions = [], currentSession, currentUser, t, onOpenReview, onUpdateStatus, titles }) {
  return (
    <section className="sessions-panel">
      <div className="section-title">
        <div>
          <h2>{currentSession?.title || 'Histórico de revisões'}</h2>
          <p className="muted">{currentSession?.subtitle || 'Sessões criadas com título e subtítulo informados no início da revisão.'}</p>
        </div>
        {currentSession && <StatusControls session={currentSession} currentUser={currentUser} t={t} onUpdateStatus={onUpdateStatus} />}
      </div>
      <div className="sessions-list">
        {sessions.length ? sessions.map((session) => (
          <button
            key={session.id}
            className={currentSession?.id === session.id ? 'session-row active' : 'session-row'}
            onClick={() => onOpenReview?.({ id: session.id })}
          >
            <FolderOpen size={17} />
            <span>
              <strong>{session.title || titles[session.id] || session.sourceBranch}</strong>
              <small>{session.subtitle || `${session.sourceBranch} → ${session.targetBranch}`} · {session.history.length} eventos</small>
            </span>
            <b>{session.status}</b>
          </button>
        )) : <p className="empty-state">{t('common.noData')}</p>}
      </div>
    </section>
  );
}
