import React from 'react';
import { Shield } from 'lucide-react';

export function IntelligenceRiskPanel({ risks = [] }) {
  return (
    <section className="sessions-panel intelligence-risk">
      <div className="section-title">
        <div>
          <h2>Análise de risco arquitetural</h2>
          <p className="muted">Interpretação dos sinais combinados da sessão atual e do histórico local.</p>
        </div>
      </div>
      <div className="risk-list">
        {risks.length ? risks.map((risk) => (
          <article key={risk}>
            <Shield size={18} />
            <p>{risk}</p>
          </article>
        )) : <p className="empty-state">Sem dados suficientes para risco arquitetural.</p>}
      </div>
    </section>
  );
}
