import { ReviewSession } from './ReviewSession';
import { AddReviewCommentInput, createReviewComment, ReviewCommentStatus } from './ReviewComment';
import { appendHistory } from './ReviewHistory';
import { ReviewSessionStatus } from './types';
import { isReviewer } from './ReviewSessionLifecycle';

export function addReviewComment(session: ReviewSession, input: AddReviewCommentInput): ReviewSession {
  if (!input.body.trim()) throw new Error('O comentario nao pode ser vazio.');
  if (!input.author.trim()) throw new Error('O autor do comentario e obrigatorio.');
  if (!input.file.trim()) throw new Error('O arquivo do comentario e obrigatorio.');
  if (!Number.isInteger(input.line) || input.line < 1) throw new Error('A linha do comentario deve ser maior que zero.');

  const updatedAt = (input.now ?? new Date()).toISOString();
  const comment = createReviewComment(session.id, session.comments.length, input);

  const updatedSession = {
    ...session,
    comments: [...session.comments, comment],
    updatedAt,
    history: appendHistory(session, 'COMMENT_ADDED', `Comentario adicionado em ${input.file}:${input.line}`, updatedAt)
  };

  return recalculateReviewSessionStatus(updatedSession);
}

export function updateReviewCommentStatus(
  session: ReviewSession,
  commentId: string,
  status: ReviewCommentStatus,
  user: string,
  now = new Date()
): ReviewSession {
  const existing = session.comments.find((item) => item.id === commentId);
  if (!existing) throw new Error(`Comentario nao encontrado: ${commentId}`);

  if (status === 'APPROVED' && !isReviewer(session, user)) {
    throw new Error('Apenas o reviewer oficial ou admin pode aprovar um comentario.');
  }

  const updatedAt = now.toISOString();

  const updatedSession = {
    ...session,
    comments: session.comments.map((item) => item.id === commentId ? { ...item, status, updatedAt } : item),
    updatedAt,
    history: appendHistory(session, 'COMMENT_STATUS_CHANGED', `Status do comentario alterado em ${existing.file}:${existing.line} para ${status} por ${user}`, updatedAt)
  };

  return recalculateReviewSessionStatus(updatedSession);
}

export function editReviewComment(
  session: ReviewSession,
  commentId: string,
  body: string,
  editor: string,
  now = new Date()
): ReviewSession {
  if (!body.trim()) throw new Error('O comentario nao pode ser vazio.');

  const comment = session.comments.find((item) => item.id === commentId);
  if (!comment) throw new Error(`Comentario nao encontrado: ${commentId}`);

  if (comment.author !== editor && editor !== 'admin') {
    throw new Error('Apenas o autor original ou admin pode editar este comentario.');
  }

  const updatedAt = now.toISOString();

  return {
    ...session,
    comments: session.comments.map((item) => {
      if (item.id !== commentId) return item;
      return {
        ...item,
        body: body.trim(),
        updatedAt,
        history: [...item.history, { body: item.body, editedAt: updatedAt, editor }]
      };
    }),
    updatedAt,
    history: appendHistory(session, 'COMMENT_EDITED', `Comentario editado em ${comment.file}:${comment.line}`, updatedAt)
  };
}

export function recalculateReviewSessionStatus(session: ReviewSession): ReviewSession {
  const openComments = session.comments.filter((comment) => comment.status !== 'RESOLVED' && comment.status !== 'APPROVED');
  const hasCritical = openComments.some((comment) => comment.severity === 'CRITICAL');
  const hasBlocking = openComments.some((comment) => comment.severity === 'HIGH' || comment.status === 'NEEDS_CHANGES');

  const nextStatus: ReviewSessionStatus = openComments.length === 0
    ? 'APPROVED'
    : hasCritical
      ? 'REOPENED'
      : hasBlocking
        ? 'NEEDS_CHANGES'
        : 'IN_REVIEW';

  return {
    ...session,
    status: nextStatus
  };
}
