import { ReviewSession, ReviewNavigationTarget, ValidationSeverity, ReviewCommentStatus, ValidationFindingStatus, ReviewSessionStatus, PartialApprovalScope } from '../domain';
import { ReviewSessionRepository, GitService, SourceFileProvider, AuditService, DashboardState } from './interfaces';
import { ReviewLifecycleService } from './ReviewLifecycleService';
import { ReviewFeedbackService } from './ReviewFeedbackService';
import { ReviewCollaborationService } from './ReviewCollaborationService';
import { ReviewDashboardService } from './ReviewDashboardService';
import { ReviewPersistenceService } from './ReviewPersistenceService';

export class ReviewSessionService {
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
  async syncCurrentSessionWithGit(author: string, reviewer: string) {
    return this.lifecycle.syncCurrentSessionWithGit(author, reviewer);
  }

  async startReview(author: string, reviewer: string, selection?: any) {
    return this.lifecycle.startReview(author, reviewer, selection);
  }

  async openReview(id: string) {
    return this.lifecycle.openReview(id);
  }

  async deleteReview(id: string) {
    return this.lifecycle.deleteReview(id);
  }

  async updateStatus(id: string, status: ReviewSessionStatus, user: string) {
    return this.lifecycle.updateStatus(id, status, user);
  }

  // Feedback
  async navigate(id: string, target: ReviewNavigationTarget) {
    return this.feedback.navigate(id, target);
  }

  async addComment(id: string, input: any) {
    return this.feedback.addComment(id, input);
  }

  async updateCommentStatus(id: string, commentId: string, status: ReviewCommentStatus, user: string) {
    return this.feedback.updateCommentStatus(id, commentId, status, user);
  }

  async editComment(id: string, commentId: string, body: string, editor: string) {
    return this.feedback.editComment(id, commentId, body, editor);
  }

  async createFinding(id: string, input: any) {
    return this.feedback.createFinding(id, input);
  }

  async updateFindingStatus(id: string, findingId: string, status: ValidationFindingStatus, user: string, reason?: string) {
    return this.feedback.updateFindingStatus(id, findingId, status, user, reason);
  }

  async registerCorrection(id: string, findingId: string, input: any) {
    return this.feedback.registerCorrection(id, findingId, input);
  }

  async revalidate(id: string, findingId: string, input: any) {
    return this.feedback.revalidate(id, findingId, input);
  }

  async runArchitectureValidation(id: string) {
    return this.feedback.runArchitectureValidation(id);
  }

  // Collaboration
  async addCollaborationMessage(id: string, input: any) {
    return this.collaboration.addCollaborationMessage(id, input);
  }

  async approvePartial(id: string, input: { scope: PartialApprovalScope; target: string; reviewer: string }) {
    return this.collaboration.approvePartial(id, input);
  }

  async refreshMergeDecision(id: string) {
    return this.collaboration.refreshMergeDecision(id);
  }

  // Dashboard
  async getDashboardState(user: string, language?: string): Promise<DashboardState> {
    return this.dashboard.getDashboardState(user, language);
  }

  // Persistence
  async exportLocalDatabase() {
    return this.persistence.exportLocalDatabase();
  }

  async createBackup() {
    return this.persistence.createBackup();
  }

  async syncRemote(targetPath?: string) {
    return this.persistence.syncRemote(targetPath);
  }

  async exportAuditData() {
    return this.persistence.exportAuditData();
  }
}
