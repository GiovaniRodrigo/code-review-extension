import React from 'react';
import { Badge } from '../atoms/Badge';

export function CorrelationPanel({ correlations = [] }) {
  return (
    <section className="sessions-panel correlation-panel">
      <div className="section-title">
        <div>
          <h2>Correlação entre comentários e sinais técnicos</h2>
          <p className="muted">Relaciona comentários públicos com findings e sinais altos/críticos por arquivo.</p>
        </div>
      </div>
      <div className="correlation-list">
        {correlations.length ? correlations.map((item) => (
          <article key={item.target}>
            <header>
              <strong>{item.target}</strong>
              <Badge>{item.criticalSignals} sinais fortes</Badge>
            </header>
            <p>{item.interpretation}</p>
            <div className="correlation-metrics">
              <span>{item.comments} comentários</span>
              <span>{item.openComments} abertos</span>
              <span>{item.findings} findings</span>
            </div>
          </article>
        )) : <p className="empty-state">Sem correlações suficientes ainda.</p>}
      </div>
    </section>
  );
}
