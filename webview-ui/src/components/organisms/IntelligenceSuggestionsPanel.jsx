import React from 'react';
import { Badge } from '../atoms/Badge';

export function IntelligenceSuggestionsPanel({ intelligence }) {
  const suggestions = intelligence?.suggestions ?? [];
  const recommendations = intelligence?.recommendations ?? [];

  return (
    <section className="sessions-panel">
      <div className="section-title">
        <div>
          <h2>Inteligência assistida</h2>
          <p className="muted">Sugestões locais baseadas em findings, histórico e reincidência.</p>
        </div>
      </div>
      <div className="intelligence-grid">
        {suggestions.length ? suggestions.slice(0, 4).map((suggestion) => (
          <article key={suggestion.id}>
            <Badge>{suggestion.type}</Badge>
            <h3>{suggestion.title}</h3>
            <p>{suggestion.description}</p>
          </article>
        )) : <p className="empty-state">Sem sugestões inteligentes ainda.</p>}
      </div>
      <div className="recommendation-strip">
        {recommendations.map((item) => <span key={item}>{item}</span>)}
      </div>
    </section>
  );
}
