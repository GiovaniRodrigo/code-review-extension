import React from 'react';

export function TextListPanel({ title, items }) {
  return (
    <section className="sessions-panel">
      <div className="section-title"><h2>{title}</h2></div>
      <div className="text-list">
        {items.length ? items.map((item) => <p key={item}>{item}</p>) : <p className="empty-state">Sem dados suficientes.</p>}
      </div>
    </section>
  );
}
