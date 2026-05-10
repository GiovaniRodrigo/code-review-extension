import {
  AddReviewCommentInput,
  CreateValidationFindingInput,
  GitContext,
  PartialApprovalScope,
  ReviewCommentStatus,
  ReviewNavigationTarget,
  ReviewSession,
  ReviewSessionStatus,
  ValidationFindingStatus
} from '../domain';
import { DashboardState } from './interfaces';

export type StartReviewSelection = Partial<Pick<GitContext, 'currentBranch' | 'baseBranch' | 'pullRequestId' | 'changedFiles' | 'commits'>>;
export type AddCommentCommand = Omit<AddReviewCommentInput, 'now' | 'id'>;
export type CreateFindingCommand = Omit<CreateValidationFindingInput, 'now' | 'id'>;
export interface RegisterCorrectionCommand { author: string; commit: string; description: string }
export interface RevalidateFindingCommand { reviewer: string; result: ValidationFindingStatus; notes: string }
export interface CollaborationMessageCommand { author: string; body: string; threadId?: string }
export interface PartialApprovalCommand { scope: PartialApprovalScope; target: string; reviewer: string }
export interface ArchitectureValidationResult { session: ReviewSession; findings: ReviewSession['findings']; findingsCount: number }

export interface ReviewLifecycleUseCases {
  syncCurrentSessionWithGit(author: string, reviewer: string): Promise<ReviewSession | undefined>;
  startReview(author: string, reviewer: string, selection?: StartReviewSelection): Promise<ReviewSession>;
  openReview(id: string): Promise<ReviewSession>;
  deleteReview(id: string): Promise<void>;
  updateStatus(id: string, status: ReviewSessionStatus, user: string): Promise<ReviewSession>;
}

export interface ReviewFeedbackUseCases {
  navigate(id: string, target: ReviewNavigationTarget): Promise<ReviewSession>;
  addComment(id: string, input: AddCommentCommand): Promise<ReviewSession>;
  updateCommentStatus(id: string, commentId: string, status: ReviewCommentStatus, user: string): Promise<ReviewSession>;
  editComment(id: string, commentId: string, body: string, editor: string): Promise<ReviewSession>;
  createFinding(id: string, input: CreateFindingCommand): Promise<ReviewSession>;
  updateFindingStatus(id: string, findingId: string, status: ValidationFindingStatus, user: string, reason?: string): Promise<ReviewSession>;
  registerCorrection(id: string, findingId: string, input: RegisterCorrectionCommand): Promise<ReviewSession>;
  revalidate(id: string, findingId: string, input: RevalidateFindingCommand): Promise<ReviewSession>;
  runArchitectureValidation(id: string): Promise<ArchitectureValidationResult>;
}

export interface ReviewCollaborationUseCases {
  addCollaborationMessage(id: string, input: CollaborationMessageCommand): Promise<ReviewSession>;
  approvePartial(id: string, input: PartialApprovalCommand): Promise<ReviewSession>;
  refreshMergeDecision(id: string): Promise<ReviewSession>;
}

export interface ReviewDashboardUseCases {
  getDashboardState(user: string, language?: string): Promise<DashboardState>;
}

export interface ReviewPersistenceUseCases {
  exportLocalDatabase(): Promise<string>;
  createBackup(): Promise<string>;
  syncRemote(targetPath?: string): Promise<string>;
  exportAuditData(): Promise<string | undefined>;
}

export interface ReviewSessionUseCases extends
  ReviewLifecycleUseCases,
  ReviewFeedbackUseCases,
  ReviewCollaborationUseCases,
  ReviewDashboardUseCases,
  ReviewPersistenceUseCases {}
