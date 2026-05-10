import React, { useState } from 'react';
import { ReviewSessionsPanel } from './ReviewSessionsPanel';
import { Timeline } from '../molecules/Timeline';
import { loadCrudObject, saveCrudObject } from '../../utils/storage';

export function HistoryCenter({ state, t, onOpenReview, onUpdateStatus }) {
  const sessions = state?.sessions ?? [];
  const [titles, setTitles] = useState(() => loadCrudObject('codeReviewHistoryTitles'));
  const [selectedId, setSelectedId] = useState(state?.currentSession?.id ?? sessions[0]?.id ?? '');
  const [titleDraft, setTitleDraft] = useState('');

  const saveTitle = () => {
    if (!selectedId || !titleDraft.trim()) return;
    const next = { ...titles, [selectedId]: titleDraft.trim() };
    setTitles(next);
    saveCrudObject('codeReviewHistoryTitles', next);
  };

  const deleteTitle = () => {
    const next = { ...titles };
    delete next[selectedId];
    setTitles(next);
    saveCrudObject('codeReviewHistoryTitles', next);
  };

  return (
    <main className="center-panel simple">
      <header className="center-header">
        <div><span className="eyebrow">Code Review</span><h1>Histórico de revisões</h1><p>Linha do tempo de reviews, correções, revalidações e decisões de aprovação.</p></div>
      </header>
      <section className="history-toolbar" aria-label="Filtros do histórico">
        <button className="active">Todas</button>
        <button>Com ajuste</button>
        <button>Aprovadas</button>
        <button>Reabertas</button>
        <span>{sessions.length} sessões registradas</span>
      </section>
      <section className="history-title-crud sessions-panel">
        <div><strong>CRUD de título do histórico</strong><p className="muted">Nomeie as sessões para encontrar reviews por contexto de negócio, sprint ou PR.</p></div>
        <select value={selectedId} onChange={(event) => setSelectedId(event.target.value)}>
          {sessions.map((session) => <option key={session.id} value={session.id}>{titles[session.id] || session.sourceBranch}</option>)}
        </select>
        <input value={titleDraft} onChange={(event) => setTitleDraft(event.target.value)} placeholder="Título da revisão no histórico" />
        <button onClick={saveTitle} disabled={!selectedId || !titleDraft.trim()}>Salvar título</button>
        <button onClick={deleteTitle} disabled={!selectedId}>Excluir título</button>
      </section>
      <section className="history-layout">
        <ReviewSessionsPanel sessions={sessions} currentSession={state?.currentSession} currentUser={state?.currentUser} t={t} onOpenReview={onOpenReview} onUpdateStatus={onUpdateStatus} titles={titles} />
        <section className="review-workspace single history-detail">
          <div className="workspace-main">
            <h2>Timeline da sessão atual</h2>
            <Timeline session={state?.currentSession} t={t} />
          </div>
        </section>
      </section>
    </main>
  );
}
