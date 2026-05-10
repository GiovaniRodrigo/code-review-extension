import React, { useState, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { SummaryCard } from '../molecules/SummaryCard';
import { Badge } from '../atoms/Badge';
import { ParticipantCard } from '../molecules/ParticipantCard';
import { OwnershipCard } from '../molecules/OwnershipCard';
import { ThreadMessage } from '../molecules/ThreadMessage';
import { TextListPanel } from '../molecules/TextListPanel';

export function CollaborationPanel({ session, currentUser, t, onSendMessage, onApprovePartial, onRefreshMergeDecision }) {
  const [message, setMessage] = useState('Pode validar este módulo @dev?');
  const [mention, setMention] = useState(session?.author ?? 'dev');
  const [threadTarget, setThreadTarget] = useState(session?.comments?.[0]?.threadId ?? 'review-geral');
  const firstFile = session?.changedFiles?.[0] ?? '';
  const moduleName = firstFile ? firstFile.split('/').slice(0, 2).join('/') || firstFile : 'módulo atual';
  const comments = session?.comments ?? [];
  const findings = session?.findings ?? [];
  const messages = session?.collaborationMessages ?? [];
  const notifications = session?.notifications ?? [];
  const participants = buildCollaborationParticipants(session, t);
  const pendingByPerson = buildPendingByPerson(session, t);
  const waitingDev = comments.filter((comment) => ['OPEN', 'NEEDS_CHANGES'].includes(comment.status ?? 'NEEDS_CHANGES')).length + findings.filter((finding) => ['NEEDS_CHANGES', 'REOPENED'].includes(finding.status ?? 'NEEDS_CHANGES')).length;
  const waitingReviewer = comments.filter((comment) => comment.status === 'RESOLVED').length + findings.filter((finding) => finding.status === 'FIXED').length;
  const blocked = Boolean(session?.mergeDecision?.blocked) || comments.some((comment) => comment.severity === 'CRITICAL' && !['RESOLVED', 'APPROVED'].includes(comment.status ?? ''));
  const workflowState = blocked ? t('collaboration.workflowState.blocked') : waitingDev > 0 ? t('collaboration.workflowState.waitingDev') : waitingReviewer > 0 ? t('collaboration.workflowState.waitingReviewer') : t('collaboration.workflowState.ready');
  const threadOptions = Array.from(new Set(['review-geral', ...comments.map((comment) => comment.threadId || `${comment.file}:${comment.line}`), ...messages.map((item) => item.threadId)])).filter(Boolean);
  const selectedThreadMessages = messages.filter((item) => (item.threadId || item.id) === threadTarget);
  const assigneeOptions = Array.from(new Set([session?.author, session?.reviewer, 'dev', 'reviewer', ...comments.map((comment) => comment.author)])).filter(Boolean);
  const canApprove = session?.reviewer === currentUser || currentUser === 'admin';

  useEffect(() => {
    if (session?.author && mention === 'dev') setMention(session.author);
  }, [session?.author]);

  const sendMessage = () => {
    if (!session || !message.trim()) return;
    const body = message.includes('@') ? message : `@${mention} ${message}`;
    onSendMessage?.({ id: session.id, body, threadId: threadTarget });
    setMessage('');
  };

  return (
    <section className="sessions-panel collaboration-workspace">
      <div className="section-title">
        <div>
          <h2>{t('collaboration.title')}</h2>
          <p className="muted">{t('collaboration.subtitle')}</p>
        </div>
        <span className={blocked ? 'merge blocked' : 'merge'}>{workflowState}</span>
      </div>

      <section className="collaboration-status-grid">
        <SummaryCard title={t('collaboration.summary.waitingDev')} value={String(waitingDev)} label={t('collaboration.summary.pendingCorrections')} color={waitingDev ? 'yellow' : 'green'} />
        <SummaryCard title={t('collaboration.summary.waitingReviewer')} value={String(waitingReviewer)} label={t('collaboration.summary.pendingValidations')} color={waitingReviewer ? 'blue' : 'green'} />
        <SummaryCard title={t('collaboration.summary.blocks')} value={String(session?.mergeDecision?.reasons?.length ?? (blocked ? 1 : 0))} label={t('collaboration.summary.preventMerge')} color={blocked ? 'red' : 'green'} />
        <SummaryCard title={t('collaboration.summary.notifications')} value={String(notifications.filter((item) => !item.read).length)} label={t('collaboration.summary.unreadMentions')} color="blue" />
      </section>

      <section className="collaboration-layout">
        <aside className="collaboration-side">
          <section className="sessions-panel nested-panel">
            <div className="section-title"><h2>{t('collaboration.roles')}</h2></div>
            <div className="participant-list">
              {participants.map((person) => (
                <ParticipantCard key={`${person.role}-${person.name}`} name={person.name} role={person.role} state={person.state} />
              ))}
            </div>
          </section>

          <section className="sessions-panel nested-panel">
            <div className="section-title"><h2>{t('collaboration.pendingByPerson')}</h2></div>
            <div className="ownership-list">
              {pendingByPerson.length ? pendingByPerson.map((item) => (
                <OwnershipCard key={item.name} name={item.name} role={item.role} count={item.count} description={item.description} />
              )) : <p className="empty-state">Sem pendências atribuídas.</p>}
            </div>
          </section>
        </aside>

        <section className="collaboration-main">
          <div className="collab-form collaboration-message-form">
            <select value={threadTarget} onChange={(event) => setThreadTarget(event.target.value)} aria-label="Thread alvo">
              {threadOptions.map((thread) => <option key={thread} value={thread}>{thread}</option>)}
            </select>
            <select value={mention} onChange={(event) => setMention(event.target.value)} aria-label="Pessoa mencionada">
              {assigneeOptions.map((person) => <option key={person} value={person}>{person}</option>)}
            </select>
            <input value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Mensagem com @menção" />
            <button disabled={!session || !message.trim()} onClick={sendMessage}><MessageSquare size={16} /> {t('common.save')}</button>
          </div>

          <div className="workflow-actions collaboration-actions">
            <button disabled={!session || !firstFile || !canApprove} onClick={() => onApprovePartial?.({ id: session.id, scope: 'file', target: firstFile })}>{t('collaboration.approveFile')}</button>
            <button disabled={!session || !firstFile || !canApprove} onClick={() => onApprovePartial?.({ id: session.id, scope: 'module', target: moduleName })}>{t('collaboration.approveModule')}</button>
            <button disabled={!session || !canApprove} onClick={() => onRefreshMergeDecision?.({ id: session.id })}>{t('collaboration.updateBlock')}</button>
          </div>

          <section className="sessions-panel nested-panel">
            <div className="section-title"><h2>{t('collaboration.threads')}</h2><Badge>{threadTarget}</Badge></div>
            <div className="thread-board">
              {comments.filter((comment) => (comment.threadId || `${comment.file}:${comment.line}`) === threadTarget).map((comment) => (
                <ThreadMessage key={comment.id} author={comment.author || 'reviewer'} info={`${comment.file}:${comment.line} · ${comment.severity} · ${comment.status}`} body={comment.body} isReviewerMessage={true} />
              ))}
              {selectedThreadMessages.length ? selectedThreadMessages.map((item) => (
                <ThreadMessage key={item.id} author={item.author} info={item.mentions?.length ? `menciona ${item.mentions.map((m) => `@${m}`).join(', ')}` : 'mensagem geral'} body={item.body} />
              )) : <p className="empty-state">Sem respostas colaborativas nessa thread.</p>}
            </div>
          </section>
        </section>
      </section>

      <section className="collab-grid collaboration-evidence-grid">
        <TextListPanel title="Comentários aguardando resposta" items={comments.filter((comment) => !['RESOLVED', 'APPROVED'].includes(comment.status ?? '')).map((comment) => `${comment.file}:${comment.line} · ${comment.status} · responsável: ${session?.author ?? 'dev'}`)} />
        <TextListPanel title="Bloqueios de merge" items={(session?.mergeDecision?.reasons ?? []).length ? session.mergeDecision.reasons : (blocked ? ['Comentário crítico aberto ou validação pendente.'] : [])} />
        <TextListPanel title="Aprovações parciais" items={(session?.partialApprovals ?? []).map((approval) => `${approval.reviewer} aprovou ${approval.scope}: ${approval.target}`)} />
      </section>
    </section>
  );
}

function buildCollaborationParticipants(session, t) {
  if (!session) return [];
  const reviewer = session.reviewer || 'reviewer';
  const author = session.author || 'dev';
  const mentioned = Array.from(new Set((session.notifications ?? []).map((item) => item.recipient))).filter((name) => ![reviewer, author].includes(name));
  return [
    { name: reviewer, role: t('common.reviewer'), state: session.mergeDecision?.blocked ? 'validando bloqueios' : 'apto a aprovar' },
    { name: author, role: t('common.developer'), state: (session.comments ?? []).some((comment) => !['RESOLVED', 'APPROVED'].includes(comment.status ?? '')) ? 'corrigir pendências' : 'sem pendências' },
    ...mentioned.map((name) => ({ name, role: 'Mencionado', state: 'aguardando resposta' }))
  ];
}

function buildPendingByPerson(session, t) {
  if (!session) return [];
  const rows = [];
  const author = session.author || 'dev';
  const reviewer = session.reviewer || 'reviewer';
  const devPending = (session.comments ?? []).filter((comment) => ['OPEN', 'NEEDS_CHANGES'].includes(comment.status ?? 'NEEDS_CHANGES')).length
    + (session.findings ?? []).filter((finding) => ['NEEDS_CHANGES', 'REOPENED'].includes(finding.status ?? 'NEEDS_CHANGES')).length;
  const reviewerPending = (session.comments ?? []).filter((comment) => comment.status === 'RESOLVED').length
    + (session.findings ?? []).filter((finding) => finding.status === 'FIXED').length;
  if (devPending) rows.push({ name: author, role: t('common.developer'), count: devPending, description: 'itens aguardando correção ou resposta' });
  if (reviewerPending) rows.push({ name: reviewer, role: t('common.reviewer'), count: reviewerPending, description: 'itens aguardando revalidação' });
  (session.notifications ?? []).filter((item) => !item.read).forEach((item) => rows.push({ name: item.recipient, role: 'Mencionado', count: 1, description: item.message }));
  return rows;
}
