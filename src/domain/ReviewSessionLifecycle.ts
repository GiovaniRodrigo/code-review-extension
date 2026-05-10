import { GitContext, ReviewSessionStatus } from './types';
import { ReviewSession } from './ReviewSession';
import { appendHistory } from './ReviewHistory';

export interface CreateReviewSessionInput {
  git: GitContext;
  author: string;
  reviewer: string;
  now?: Date;
  id?: string;
}

export function isReviewer(session: ReviewSession, user: string): boolean {
  return session.reviewer === user || user === 'admin';
}

export function isAuthor(session: ReviewSession, user: string): boolean {
  return session.author === user || user === 'admin';
}

export function createReviewSession(input: CreateReviewSessionInput): ReviewSession {
  if (!input.git.currentBranch) {
    throw new Error('A branch origem e obrigatoria para criar uma review session.');
  }

  if (!input.git.baseBranch) {
    throw new Error('A branch destino e obrigatoria para criar uma review session.');
  }

  if (!input.author) {
    throw new Error('O autor e obrigatorio para criar uma review session.');
  }

  if (!input.reviewer) {
    throw new Error('O reviewer e obrigatorio para criar uma review session.');
  }

  const now = (input.now ?? new Date()).toISOString();
  const branchSlug = input.git.pullRequestId?.trim()
    ? `pr-${input.git.pullRequestId.trim()}`
    : input.git.currentBranch.replace(/[^a-zA-Z0-9._-]+/g, '-').replace(/^-+|-+$/g, '');
  const id = input.id ?? `review-${branchSlug || 'session'}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  return {
    id,
    sourceBranch: input.git.currentBranch,
    targetBranch: input.git.baseBranch,
    author: input.author,
    reviewer: input.reviewer,
    status: 'OPEN',
    createdAt: now,
    updatedAt: now,
    pullRequestId: input.git.pullRequestId,
    changedFiles: input.git.changedFiles,
    commits: input.git.commits,
    comments: [],
    findings: [],
    collaborationMessages: [],
    notifications: [],
    partialApprovals: [],
    mergeDecision: { blocked: false, reasons: [], updatedAt: now },
    history: [
      {
        id: `${id}-created`,
        type: 'SESSION_CREATED',
        message: `Review criada para ${input.git.currentBranch} -> ${input.git.baseBranch}`,
        createdAt: now
      }
    ]
  };
}

export function updateReviewSessionStatus(
  session: ReviewSession,
  status: ReviewSessionStatus,
  user: string,
  now = new Date()
): ReviewSession {
  if (session.status === status) {
    return session;
  }

  if (status === 'APPROVED' && !isReviewer(session, user)) {
    throw new Error('Apenas o reviewer oficial ou admin pode aprovar a review session.');
  }

  const updatedAt = now.toISOString();

  return {
    ...session,
    status,
    updatedAt,
    history: appendHistory(session, 'STATUS_CHANGED', `Status alterado de ${session.status} para ${status} por ${user}`, updatedAt)
  };
}

export function updateReviewSessionGitContext(
  session: ReviewSession,
  git: GitContext,
  now = new Date()
): ReviewSession {
  const updatedAt = now.toISOString();

  return {
    ...session,
    sourceBranch: git.currentBranch,
    targetBranch: git.baseBranch,
    pullRequestId: git.pullRequestId,
    changedFiles: git.changedFiles,
    commits: git.commits,
    updatedAt,
    history: appendHistory(session, 'GIT_CONTEXT_REFRESHED', `Contexto Git atualizado para ${git.currentBranch} -> ${git.baseBranch}`, updatedAt)
  };
}
