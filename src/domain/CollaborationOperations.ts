import { ReviewSession } from './ReviewSession';
import { extractMentions, PartialApprovalScope, PartialApproval } from './Collaboration';
import { appendHistory } from './ReviewHistory';
import { isReviewer } from './ReviewSessionLifecycle';
import { calculateMergeDecision } from './MergeDecision';

export function addCollaborationMessage(
  session: ReviewSession,
  input: { author: string; body: string; threadId?: string; now?: Date; id?: string }
): ReviewSession {
  if (!input.author.trim()) throw new Error('O autor da mensagem e obrigatorio.');
  if (!input.body.trim()) throw new Error('A mensagem colaborativa nao pode ser vazia.');

  const createdAt = (input.now ?? new Date()).toISOString();
  const id = input.id ?? `${session.id}-collab-${session.collaborationMessages.length + 1}`;
  const mentions = extractMentions(input.body);
  
  const message = {
    id,
    threadId: input.threadId ?? id,
    author: input.author.trim(),
    body: input.body.trim(),
    mentions,
    createdAt
  };

  const notifications = mentions.map((mention, index) => ({
    id: `${id}-mention-${index + 1}`,
    recipient: mention,
    message: `${message.author} mencionou voce na review ${session.sourceBranch}`,
    read: false,
    createdAt
  }));

  return {
    ...session,
    collaborationMessages: [...session.collaborationMessages, message],
    notifications: [...session.notifications, ...notifications],
    updatedAt: createdAt,
    history: appendHistory(session, 'COLLABORATION_MESSAGE_ADDED', `Mensagem colaborativa adicionada por ${message.author}`, createdAt)
  };
}

export function registerPartialApproval(
  session: ReviewSession,
  input: { scope: PartialApprovalScope; target: string; reviewer: string; now?: Date; id?: string }
): ReviewSession {
  if (!input.target.trim()) throw new Error('O alvo da aprovacao parcial e obrigatorio.');
  if (!input.reviewer.trim()) throw new Error('O reviewer da aprovacao parcial e obrigatorio.');
  if (!isReviewer(session, input.reviewer)) throw new Error('Apenas o reviewer oficial ou admin pode realizar aprovacoes parciais.');

  const createdAt = (input.now ?? new Date()).toISOString();
  const approval: PartialApproval = {
    id: input.id ?? `${session.id}-approval-${session.partialApprovals.length + 1}`,
    scope: input.scope,
    target: input.target.trim(),
    reviewer: input.reviewer.trim(),
    status: 'APPROVED',
    createdAt
  };

  const updatedSession = {
    ...session,
    partialApprovals: [...session.partialApprovals.filter((item) => !(item.scope === approval.scope && item.target === approval.target)), approval],
    updatedAt: createdAt,
    history: appendHistory(session, 'PARTIAL_APPROVAL_REGISTERED', `Aprovacao por ${approval.scope}: ${approval.target} realizada por ${input.reviewer}`, createdAt)
  };

  return {
    ...updatedSession,
    mergeDecision: calculateMergeDecision(updatedSession, new Date(createdAt))
  };
}

export function updateSessionMergeDecision(session: ReviewSession, now = new Date()): ReviewSession {
  const decision = calculateMergeDecision(session, now);
  const updatedAt = now.toISOString();

  return {
    ...session,
    mergeDecision: decision,
    updatedAt,
    history: appendHistory(session, 'MERGE_BLOCK_UPDATED', decision.blocked ? 'Merge bloqueado por pendencias de review' : 'Merge liberado para a sessao', updatedAt)
  };
}
