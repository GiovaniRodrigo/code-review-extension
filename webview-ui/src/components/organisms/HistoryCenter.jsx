import React, { useState } from 'react';
import { ReviewSessionsPanel } from './ReviewSessionsPanel';
import { Timeline } from '../molecules/Timeline';

export function HistoryCenter({ state, t, onOpenReview, onUpdateStatus }) {
  const sessions = state?.sessions ?? [];
  const [statusFilter, setStatusFilter] = useState('ALL');
  const filteredSessions = statusFilter === 'ALL' ? sessions : sessions.filter((session) => session.status === statusFilter);

  return (
    <main className="center-panel simple">
      <header className="center-header">
        <div><span className="eyebrow">Code Review</span><h1>Histórico de revisões</h1><p>Linha do tempo de reviews, correções, revalidações e decisões de aprovação.</p></div>
      </header>
      <section className="history-toolbar" aria-label="Filtros do histórico">
        <button className={statusFilter === 'ALL' ? 'active' : ''} onClick={() => setStatusFilter('ALL')}>Todas</button>
        <button className={statusFilter === 'NEEDS_CHANGES' ? 'active' : ''} onClick={() => setStatusFilter('NEEDS_CHANGES')}>Com ajuste</button>
        <button className={statusFilter === 'APPROVED' ? 'active' : ''} onClick={() => setStatusFilter('APPROVED')}>Aprovadas</button>
        <button className={statusFilter === 'REOPENED' ? 'active' : ''} onClick={() => setStatusFilter('REOPENED')}>Reabertas</button>
        <span>{filteredSessions.length} de {sessions.length} sessões registradas</span>
      </section>
      <section className="review-pipeline-preview">
        <strong>Título e subtítulo da sessão</strong>
        <span>Essas informações agora são definidas na criação da revisão e exibidas no menu Histórico.</span>
        <small>Isso evita textos técnicos como history.title/history.subtitle na interface.</small>
      </section>
      <section className="history-layout">
        <ReviewSessionsPanel sessions={filteredSessions} currentSession={state?.currentSession} currentUser={state?.currentUser} t={t} onOpenReview={onOpenReview} onUpdateStatus={onUpdateStatus} titles={{}} />
        <section className="review-workspace single history-detail">
          <div className="workspace-main">
            <h2>{state?.currentSession?.title || 'Timeline da sessão atual'}</h2>
            {state?.currentSession?.subtitle && <p className="muted">{state.currentSession.subtitle}</p>}
            <Timeline session={state?.currentSession} t={t} />
          </div>
        </section>
      </section>
    </main>
  );
}
