import { ReviewSession, ReviewNavigationTarget, ValidationSeverity, ReviewCommentStatus, ValidationFindingStatus, navigateReviewSession, addReviewComment, updateReviewCommentStatus, editReviewComment, createValidationFinding, updateValidationFindingStatus, registerCorrectionAttempt, revalidateFinding, analyzeArchitectureRules } from '../domain';
import { ReviewSessionRepository, SourceFileProvider, AuditService } from './interfaces';

export class ReviewFeedbackService {
  constructor(
    private readonly repository: ReviewSessionRepository,
    private readonly sourceFileProvider?: SourceFileProvider,
    private readonly auditService?: AuditService
  ) {}

  async navigate(id: string, target: ReviewNavigationTarget): Promise<ReviewSession> {
    const session = await this.getExistingSession(id);
    const updated = navigateReviewSession(session, target);
    await this.saveAndAudit(updated);
    return updated;
  }

  async addComment(id: string, input: { body: string; author: string; file: string; line: number; commit?: string; threadId?: string; severity?: ValidationSeverity; status?: ReviewCommentStatus }): Promise<ReviewSession> {
    const session = await this.getExistingSession(id);
    const updated = addReviewComment(session, input);
    await this.saveAndAudit(updated);
    return updated;
  }

  async updateCommentStatus(id: string, commentId: string, status: ReviewCommentStatus, user: string): Promise<ReviewSession> {
    const session = await this.getExistingSession(id);
    const updated = updateReviewCommentStatus(session, commentId, status, user);
    await this.saveAndAudit(updated);
    return updated;
  }

  async editComment(id: string, commentId: string, body: string, editor: string): Promise<ReviewSession> {
    const session = await this.getExistingSession(id);
    const updated = editReviewComment(session, commentId, body, editor);
    await this.saveAndAudit(updated);
    return updated;
  }

  async createFinding(id: string, input: { rule: string; severity: ValidationSeverity; description: string; file: string; line: number; commit: string; responsible: string; }): Promise<ReviewSession> {
    const session = await this.getExistingSession(id);
    const updated = createValidationFinding(session, input);
    await this.saveAndAudit(updated);
    return updated;
  }

  async updateFindingStatus(id: string, findingId: string, status: ValidationFindingStatus, user: string, reason?: string): Promise<ReviewSession> {
    const session = await this.getExistingSession(id);
    const updated = updateValidationFindingStatus(session, findingId, status, user, reason);
    await this.saveAndAudit(updated);
    return updated;
  }

  async registerCorrection(id: string, findingId: string, input: { author: string; commit: string; description: string }): Promise<ReviewSession> {
    const session = await this.getExistingSession(id);
    const updated = registerCorrectionAttempt(session, findingId, input);
    await this.saveAndAudit(updated);
    return updated;
  }

  async revalidate(id: string, findingId: string, input: { reviewer: string; result: ValidationFindingStatus; notes: string }): Promise<ReviewSession> {
    const session = await this.getExistingSession(id);
    const updated = revalidateFinding(session, findingId, input);
    await this.saveAndAudit(updated);
    return updated;
  }

  async runArchitectureValidation(id: string): Promise<{ session: ReviewSession; findings: ReviewSession['findings']; findingsCount: number }> {
    const session = await this.getExistingSession(id);
    const sourceFiles = await this.sourceFileProvider?.readFiles(session.changedFiles) ?? [];
    const findings = analyzeArchitectureRules(sourceFiles);
    const commit = session.commits[0]?.split(' ')[0] ?? 'HEAD';

    const updated = findings.reduce((current, ruleFinding) => createValidationFinding(current, {
      rule: ruleFinding.rule,
      severity: ruleFinding.severity,
      description: `${ruleFinding.category}: ${ruleFinding.description}`,
      file: ruleFinding.file,
      line: ruleFinding.line,
      commit,
      responsible: current.reviewer
    }), session);

    await this.saveAndAudit(updated);
    return { session: updated, findings: updated.findings, findingsCount: findings.length };
  }

  private async getExistingSession(id: string): Promise<ReviewSession> {
    const session = await this.repository.getById(id);
    if (!session) throw new Error(`Review session nao encontrada: ${id}`);
    return session;
  }

  private async saveAndAudit(session: ReviewSession): Promise<void> {
    await this.repository.saveCurrent(session);
    await this.auditService?.registerSessionSnapshot(session);
  }
}
