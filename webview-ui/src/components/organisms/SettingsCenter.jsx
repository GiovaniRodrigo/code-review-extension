import React from 'react';
import { FileDown, Shield, XCircle, RefreshCw } from 'lucide-react';
import { SummaryCard } from '../molecules/SummaryCard';

export function SettingsCenter({ state, t, vscodeApi }) {
  const performance = state?.performance ?? {};
  const integrations = state?.integrations ?? [];

  return (
    <main className="center-panel simple">
      <header className="center-header">
        <div>
          <span className="eyebrow">Persistência, performance e integrações</span>
          <h1>{t('settings.title')}</h1>
          <p>{t('settings.subtitle')}</p>
        </div>
        <div className="header-actions" data-tour="persistence-actions">
          <button data-tour="export-database" onClick={() => vscodeApi?.postMessage({ type: 'exportLocalDatabase' })}><FileDown size={16} /> {t('settings.actions.localDatabase')}</button>
          <button onClick={() => vscodeApi?.postMessage({ type: 'createBackup' })}><Shield size={16} /> Backup</button>
          <button disabled={!state?.currentSession} onClick={() => vscodeApi?.postMessage({ type: 'deleteReviewSession', payload: { id: state.currentSession.id } })}><XCircle size={16} /> Remover sessão</button>
          <button className="primary" onClick={() => vscodeApi?.postMessage({ type: 'syncRemote' })}><RefreshCw size={16} /> Sync remoto</button>
        </div>
      </header>
      <section className="summary-grid">
        <SummaryCard title={t('settings.summary.cache')} value={performance.cacheEnabled ? 'Ativo' : 'Inativo'} label="TTL local" color="green" />
        <SummaryCard title={t('settings.summary.lazyLoading')} value={String(performance.lazySessionLimit ?? 0)} label="sessões por carga" color="blue" />
        <SummaryCard title={t('settings.summary.batch')} value={String(performance.incrementalBatchSize ?? 0)} label="render incremental" color="yellow" />
        <SummaryCard title={t('settings.summary.async')} value={performance.asyncProcessingEnabled ? 'Ativo' : 'Inativo'} label="processamento" color="green" />
      </section>
      <section className="sessions-panel">
        <div className="section-title">
          <div>
            <h2>{t('settings.integrations.title')}</h2>
            <p className="muted">{t('settings.integrations.subtitle')}</p>
          </div>
        </div>
        <div className="integration-grid">
          {integrations.map((item) => (
            <article className="integration-card actionable" key={item.id}>
              <strong>{item.name}</strong>
              <span>{item.status}</span>
              <p>{item.description}</p>
              <div className="integration-actions">
                <button onClick={() => vscodeApi?.postMessage({ type: 'openSettingsJson' })}>Abrir settings.json</button>
                <button onClick={() => vscodeApi?.postMessage({ type: 'syncRemote' })}>Testar vínculo</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
