export const REVIEW_SESSION_STATUSES = [
  'OPEN',
  'IN_REVIEW',
  'NEEDS_CHANGES',
  'FIXED',
  'APPROVED',
  'REOPENED'
] as const;

export type ReviewSessionStatus = (typeof REVIEW_SESSION_STATUSES)[number];

export const VALIDATION_FINDING_STATUSES = ['NEEDS_CHANGES', 'FIXED', 'APPROVED', 'REOPENED'] as const;
export const VALIDATION_SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;
export const REVIEW_COMMENT_STATUSES = ['OPEN', 'NEEDS_CHANGES', 'RESOLVED', 'APPROVED'] as const;

export type ValidationFindingStatus = (typeof VALIDATION_FINDING_STATUSES)[number];
export type ValidationSeverity = (typeof VALIDATION_SEVERITIES)[number];
export type ReviewCommentStatus = (typeof REVIEW_COMMENT_STATUSES)[number];

export interface ReviewHistoryEntry {
  id: string;
  type:
    | 'SESSION_CREATED'
    | 'STATUS_CHANGED'
    | 'GIT_CONTEXT_REFRESHED'
    | 'NAVIGATION_CHANGED'
    | 'COMMENT_ADDED'
    | 'COMMENT_EDITED'
    | 'COMMENT_STATUS_CHANGED'
    | 'FINDING_CREATED'
    | 'FINDING_STATUS_CHANGED'
    | 'CORRECTION_REGISTERED'
    | 'FINDING_REVALIDATED'
    | 'COLLABORATION_MESSAGE_ADDED'
    | 'PARTIAL_APPROVAL_REGISTERED'
    | 'MERGE_BLOCK_UPDATED';
  message: string;
  createdAt: string;
}

export type ReviewNavigationKind = 'commit' | 'diff' | 'file' | 'comment' | 'validation';

export interface ReviewNavigationTarget {
  kind: ReviewNavigationKind;
  ref: string;
  file?: string;
  line?: number;
}

export interface GitContext {
  currentBranch: string;
  baseBranch: string;
  pullRequestId?: string;
  changedFiles: string[];
  commits: string[];
}


export function isReviewSessionStatus(value: unknown): value is ReviewSessionStatus {
  return typeof value === 'string' && REVIEW_SESSION_STATUSES.includes(value as ReviewSessionStatus);
}

export function isValidationFindingStatus(value: unknown): value is ValidationFindingStatus {
  return typeof value === 'string' && VALIDATION_FINDING_STATUSES.includes(value as ValidationFindingStatus);
}

export function isValidationSeverity(value: unknown): value is ValidationSeverity {
  return typeof value === 'string' && VALIDATION_SEVERITIES.includes(value as ValidationSeverity);
}

export function isReviewCommentStatus(value: unknown): value is ReviewCommentStatus {
  return typeof value === 'string' && REVIEW_COMMENT_STATUSES.includes(value as ReviewCommentStatus);
}
