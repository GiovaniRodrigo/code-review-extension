import React, { useState } from 'react';
import { Severity } from '../atoms/Severity';
import { Badge } from '../atoms/Badge';

export function FindingItem({ session, finding, currentUser, t, onUpdateStatus, onRegisterCorrection, onRevalidate }) {
  const [correctionCommit, setCorrectionCommit] = useState(session?.commits?.[0]?.split(' ')[0] ?? 'HEAD');
  const [correctionDescription, setCorrectionDescription] = useState('Descreva o que foi corrigido e como o reviewer pode validar.');
  const canApprove = session?.reviewer === currentUser || currentUser === 'admin';
  const canCorrect = session?.author === currentUser || currentUser === 'admin';

  return (
    <article className="finding-item">
      <header>
        <div>
          <strong>{finding.rule}</strong>
          <small>{finding.file}:{finding.line} · {finding.commit}</small>
        </div>
        <Severity label={finding.severity === 'CRITICAL' ? 'Crítico' : finding.severity === 'HIGH' ? 'Erro' : finding.severity === 'MEDIUM' ? 'Aviso' : 'Sugestão'} />
      </header>
      <p>{finding.description}</p>
      <div className="finding-actions">
        {['NEEDS_CHANGES', 'FIXED', 'APPROVED', 'REOPENED'].map((status) => (
          <button
            key={status}
            disabled={status === 'APPROVED' && !canApprove}
            className={finding.status === status ? 'active' : ''}
            onClick={() => onUpdateStatus?.({ id: session.id, findingId: finding.id, status })}
          >
            {status}
          </button>
        ))}
      </div>
      <div className="developer-correction-box" data-tour="developer-correction">
        <strong>Correção do desenvolvedor</strong>
        <p className="muted">O dev informa commit/branch e evidência da correção. O finding muda para FIXED e fica aguardando revalidação.</p>
        <input value={correctionCommit} onChange={(event) => setCorrectionCommit(event.target.value)} placeholder="Commit ou branch da correção" />
        <textarea value={correctionDescription} onChange={(event) => setCorrectionDescription(event.target.value)} />
        <button disabled={!canCorrect || !correctionDescription.trim()} onClick={() => onRegisterCorrection?.({ id: session.id, findingId: finding.id, commit: correctionCommit || 'HEAD', description: correctionDescription })}>Mostrar correção para revalidação</button>
      </div>
      {!!finding.correctionAttempts?.length && <div className="correction-attempts">
        {finding.correctionAttempts.map((attempt) => (
          <div key={attempt.id}><strong>{attempt.commit}</strong><span>{attempt.description}</span><small>{attempt.author} · {new Date(attempt.createdAt).toLocaleString()}</small></div>
        ))}
      </div>}
      <div className="finding-actions">
        <button disabled={!canApprove} onClick={() => onRevalidate?.({ id: session.id, findingId: finding.id, result: 'APPROVED', notes: 'Revalidação aprovada.' })}>Aprovar revalidação</button>
        <button disabled={!canApprove} onClick={() => onRevalidate?.({ id: session.id, findingId: finding.id, result: 'REOPENED', notes: 'Reaberto após nova análise.' })}>Reabrir</button>
      </div>
      <div className="badge-row">
        <Badge>{finding.statusHistory.length} mudanças</Badge>
        <Badge>{finding.correctionAttempts.length} correções</Badge>
        <Badge>{finding.revalidations.length} revalidações</Badge>
      </div>
    </article>
  );
}
