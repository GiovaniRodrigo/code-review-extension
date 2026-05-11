import { ReviewSessionStatus, ReviewHistoryEntry, ReviewNavigationTarget } from './types';
import { ReviewComment } from './ReviewComment';
import { ValidationFinding } from './ValidationFinding';
import { CollaborationMessage, CollaborationNotification, PartialApproval } from './Collaboration';
import { MergeDecision } from './MergeDecision';

export interface ReviewSession {
  id: string;
  sourceBranch: string;
  targetBranch: string;
  title: string;
  subtitle: string;
  author: string;
  reviewer: string;
  status: ReviewSessionStatus;
  createdAt: string;
  updatedAt: string;
  pullRequestId?: string;
  changedFiles: string[];
  commits: string[];
  activeNavigation?: ReviewNavigationTarget;
  comments: ReviewComment[];
  findings: ValidationFinding[];
  collaborationMessages: CollaborationMessage[];
  notifications: CollaborationNotification[];
  partialApprovals: PartialApproval[];
  mergeDecision: MergeDecision;
  history: ReviewHistoryEntry[];
}
