import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { SummaryCard } from '../molecules/SummaryCard';
import { Badge } from '../atoms/Badge';

export function ConformitiesCenter({ state, t }) {
  const comments = state?.currentSession?.comments ?? [];
  const resolved = comments.filter((comment) => ['RESOLVED', 'APPROVED'].includes(comment.status)).length;
  const total = comments.length || 1;
  const adherence = Math.round((resolved / total) * 100);
  const conformities = [
    ['Public Comments', 'Comments linked to file, line, and commit.', comments.length ? 'With evidence' : 'Waiting for comments'],
    ['Traceable Score', 'Score derived from severity, status, and Problems/Tests.', 'Active'],
    ['VS Code Integration', 'Reading Problems, opening file and diff.', 'Active'],
    ['Reviewer/Dev Flow', 'Session status driven by comments.', state?.currentSession?.status ?? 'OPEN'],
    ['Auditable History', 'Sessions, events, and changes are recorded.', `${state?.sessions?.length ?? 0} sessions`]
  ];

  return (
    <main className="center-panel simple conformities-only">
      <header className="center-header">
        <div>
          <span className="eyebrow">Conformidades</span>
          <h1>Boas Práticas Atendidas</h1>
          <p>Esta tela mostra aderências e evidências positivas. Problemas, erros e violações ficam em Diagnósticos.</p>
        </div>
      </header>
      <section className="summary-grid">
        <SummaryCard title="Aderência" value={`${adherence}%`} label="comentários resolvidos/aprovados" color="green" />
        <SummaryCard title="Evidências" value={String(conformities.length)} label="práticas mapeadas" color="blue" />
        <SummaryCard title="Resolvidos" value={String(resolved)} label="comentários concluídos" color="green" />
        <SummaryCard title="Status" value={state?.currentSession?.status ?? 'OPEN'} label="sessão atual" color="yellow" />
      </section>
      <section className="sessions-panel">
        <div className="section-title">
          <div>
            <h2>Evidências de conformidade</h2>
            <p className="muted">Lista positiva de práticas atendidas ou prontas para auditoria.</p>
          </div>
        </div>
        <div className="conformity-list">
          {conformities.map(([title, description, status]) => (
            <article className="conformity-item" key={title}>
              <CheckCircle2 size={18} />
              <div><strong>{title}</strong><p>{description}</p></div>
              <Badge>{status}</Badge>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
