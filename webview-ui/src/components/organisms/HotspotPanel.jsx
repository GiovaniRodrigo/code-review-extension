import React from 'react';
import { Badge } from '../atoms/Badge';

export function HotspotPanel({ title, items = [], compact = false }) {
  return (
    <section className={`sessions-panel hotspot-panel ${compact ? 'compact' : ''}`}>
      <div className="section-title">
        <div>
          <h2>{title}</h2>
          <p className="muted">Concentração de comentários, findings e severidade.</p>
        </div>
      </div>
      <div className="hotspot-list">
        {items.length ? items.map((item) => (
          <article key={`${item.kind}-${item.target}`}>
            <div className="hotspot-head">
              <strong>{item.target}</strong>
              <Badge>risco {item.riskScore}</Badge>
            </div>
            <div className="hotspot-meter"><i style={{ width: `${Math.min(100, (item.riskScore / 20) * 100)}%` }} /></div>
            <div className="hotspot-meta">
              <span>{item.comments} comentários</span>
              <span>{item.findings} findings</span>
              <span>{item.critical} críticos</span>
            </div>
          </article>
        )) : <p className="empty-state">Nenhum hotspot detectado ainda.</p>}
      </div>
    </section>
  );
}
