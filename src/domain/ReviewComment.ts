import { ValidationSeverity, ReviewCommentStatus } from './types';

export interface ReviewCommentVersion {
  body: string;
  editedAt: string;
  editor: string;
}

export interface ReviewComment {
  id: string;
  threadId: string;
  body: string;
  author: string;
  file: string;
  line: number;
  commit?: string;
  severity: ValidationSeverity;
  status: ReviewCommentStatus;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  history: ReviewCommentVersion[];
}

export interface AddReviewCommentInput {
  body: string;
  author: string;
  file: string;
  line: number;
  commit?: string;
  threadId?: string;
  severity?: ValidationSeverity;
  status?: ReviewCommentStatus;
  now?: Date;
  id?: string;
}

export function createReviewComment(sessionId: string, commentsCount: number, input: AddReviewCommentInput): ReviewComment {
  const updatedAt = (input.now ?? new Date()).toISOString();
  const id = input.id ?? `${sessionId}-comment-${commentsCount + 1}`;
  const threadId = input.threadId ?? id;

  return {
    id,
    threadId,
    body: input.body.trim(),
    author: input.author,
    file: input.file,
    line: input.line,
    commit: input.commit,
    severity: input.severity ?? 'MEDIUM',
    status: input.status ?? 'NEEDS_CHANGES',
    isPublic: true,
    createdAt: updatedAt,
    updatedAt,
    history: []
  };
}
