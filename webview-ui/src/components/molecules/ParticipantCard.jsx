import React from 'react';
import { Badge } from '../atoms/Badge';

export function ParticipantCard({ name, role, state }) {
  return (
    <article className="participant-card">
      <strong>{name}</strong>
      <span>{role}</span>
      <Badge>{state}</Badge>
    </article>
  );
}
