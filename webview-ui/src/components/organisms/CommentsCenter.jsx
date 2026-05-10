import React from 'react';
import { FileDown, RefreshCw } from 'lucide-react';
import { CommentsPanel } from './CommentsPanel';

export function CommentsCenter({ state, t, vscodeApi, ...props }) {
  const session = state?.currentSession;

  return (
    <main className="center-panel simple comments-only">
      <header className="center-header">
        <div>
          <span className="eyebrow">Code Review</span>
          <h1>Comentários da revisão</h1>
          <p>Discussão pública vinculada a arquivo, linha, commit e decisão da sessão.</p>
        </div>
        <div className="header-actions">
          <button disabled={!session} onClick={() => vscodeApi?.postMessage({ type: 'exportReviewReport' })}><FileDown size={16} /> Exportar discussão</button>
          <button disabled={!session} className="primary" onClick={() => vscodeApi?.postMessage({ type: 'refreshMergeDecision', payload: { id: session?.id } })}><RefreshCw size={16} /> Recalcular score/status</button>
        </div>
      </header>
      <CommentsPanel session={session} currentUser={state?.currentUser} t={t} full {...props} />
    </main>
  );
}
