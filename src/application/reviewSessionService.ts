import { ReviewCommentStatus, ReviewNavigationTarget, ReviewSession, ReviewSessionStatus, ValidationFindingStatus } from '../domain';
import { ReviewSessionRepository, GitService, SourceFileProvider, AuditService, DashboardState } from './interfaces';
import {
  AddCommentCommand,
  ArchitectureValidationResult,
  CollaborationMessageCommand,
  CreateFindingCommand,
  PartialApprovalCommand,
  RegisterCorrectionCommand,
  RevalidateFindingCommand,
  ReviewSessionUseCases,
  StartReviewSelection
} from './useCases';
import { ReviewLifecycleService } from './ReviewLifecycleService';
import { ReviewFeedbackService } from './ReviewFeedbackService';
import { ReviewCollaborationService } from './ReviewCollaborationService';
import { ReviewDashboardService } from './ReviewDashboardService';
import { ReviewPersistenceService } from './ReviewPersistenceService';

export class ReviewSessionService implements ReviewSessionUseCases {
  private readonly lifecycle: ReviewLifecycleService;
  private readonly feedback: ReviewFeedbackService;
  private readonly collaboration: ReviewCollaborationService;
  private readonly dashboard: ReviewDashboardService;
  private readonly persistence: ReviewPersistenceService;

  constructor(
    repository: ReviewSessionRepository,
    gitService: GitService,
    sourceFileProvider?: SourceFileProvider,
    auditService?: AuditService
  ) {
    this.lifecycle = new ReviewLifecycleService(repository, gitService, auditService);
    this.feedback = new ReviewFeedbackService(repository, sourceFileProvider, auditService);
    this.collaboration = new ReviewCollaborationService(repository, auditService);
    this.dashboard = new ReviewDashboardService(repository, gitService);
    this.persistence = new ReviewPersistenceService(repository, auditService);
  }

  // Lifecycle
  async syncCurrentSessionWithGit(author: string, reviewer: string): Promise<ReviewSession | undefined> {
    return this.lifecycle.syncCurrentSessionWithGit(author, reviewer);
  }

  async startReview(author: string, reviewer: string, selection?: StartReviewSelection): Promise<ReviewSession> {
    return this.lifecycle.startReview(author, reviewer, selection);
  }

  async openReview(id: string): Promise<ReviewSession> {
    return this.lifecycle.openReview(id);
  }

  async deleteReview(id: string): Promise<void> {
    return this.lifecycle.deleteReview(id);
  }

  async updateStatus(id: string, status: ReviewSessionStatus, user: string): Promise<ReviewSession> {
    return this.lifecycle.updateStatus(id, status, user);
  }

  // Feedback
  async navigate(id: string, target: ReviewNavigationTarget): Promise<ReviewSession> {
    return this.feedback.navigate(id, target);
  }

  async addComment(id: string, input: AddCommentCommand): Promise<ReviewSession> {
    return this.feedback.addComment(id, input);
  }

  async updateCommentStatus(id: string, commentId: string, status: ReviewCommentStatus, user: string): Promise<ReviewSession> {
    return this.feedback.updateCommentStatus(id, commentId, status, user);
  }

  async editComment(id: string, commentId: string, body: string, editor: string): Promise<ReviewSession> {
    return this.feedback.editComment(id, commentId, body, editor);
  }

  async createFinding(id: string, input: CreateFindingCommand): Promise<ReviewSession> {
    return this.feedback.createFinding(id, input);
  }

  async updateFindingStatus(id: string, findingId: string, status: ValidationFindingStatus, user: string, reason?: string): Promise<ReviewSession> {
    return this.feedback.updateFindingStatus(id, findingId, status, user, reason);
  }

  async registerCorrection(id: string, findingId: string, input: RegisterCorrectionCommand): Promise<ReviewSession> {
    return this.feedback.registerCorrection(id, findingId, input);
  }

  async revalidate(id: string, findingId: string, input: RevalidateFindingCommand): Promise<ReviewSession> {
    return this.feedback.revalidate(id, findingId, input);
  }

  async runArchitectureValidation(id: string): Promise<ArchitectureValidationResult> {
    return this.feedback.runArchitectureValidation(id);
  }

  // Collaboration
  async addCollaborationMessage(id: string, input: CollaborationMessageCommand): Promise<ReviewSession> {
    return this.collaboration.addCollaborationMessage(id, input);
  }

  async approvePartial(id: string, input: PartialApprovalCommand): Promise<ReviewSession> {
    return this.collaboration.approvePartial(id, input);
  }

  async refreshMergeDecision(id: string): Promise<ReviewSession> {
    return this.collaboration.refreshMergeDecision(id);
  }

  // Dashboard
  async getDashboardState(user: string, language?: string): Promise<DashboardState> {
    return this.dashboard.getDashboardState(user, language);
  }

  // Persistence
  async exportLocalDatabase(): Promise<string> {
    return this.persistence.exportLocalDatabase();
  }

  async createBackup(): Promise<string> {
    return this.persistence.createBackup();
  }

  async syncRemote(targetPath?: string): Promise<string> {
    return this.persistence.syncRemote(targetPath);
  }

  async exportAuditData(): Promise<string | undefined> {
    return this.persistence.exportAuditData();
  }
}
