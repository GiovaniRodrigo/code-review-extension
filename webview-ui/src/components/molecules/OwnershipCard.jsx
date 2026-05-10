import React from 'react';

export function OwnershipCard({ name, role, count, description }) {
  return (
    <article className="ownership-card">
      <div><strong>{name}</strong><span>{role}</span></div>
      <b>{count}</b>
      <small>{description}</small>
    </article>
  );
}
