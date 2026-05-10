import React from 'react';

export function SummaryCard({ title, value, label, color }) {
  return (
    <div className={`summary-card accent-${color}`}>
      <span>{title}</span>
      <strong className={color}>{value}</strong>
      <p>{label}</p>
    </div>
  );
}
