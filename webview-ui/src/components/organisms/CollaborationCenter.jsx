import React from 'react';
import { CollaborationPanel } from './CollaborationPanel';

export function CollaborationCenter({ state, t, ...props }) {
  return (
    <main className="center-panel simple">
      <header className="center-header">
        <div><span className="eyebrow">{t('collaboration.title')}</span><h1>{t('collaboration.title')}</h1><p>{t('collaboration.subtitle')}</p></div>
      </header>
      <CollaborationPanel session={state?.currentSession} currentUser={state?.currentUser} t={t} {...props} />
    </main>
  );
}
