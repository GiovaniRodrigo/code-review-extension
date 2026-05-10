import { ReviewSession, PartialApprovalScope, addCollaborationMessage, registerPartialApproval, updateSessionMergeDecision } from '../domain';
import { ReviewSessionRepository, AuditService } from './interfaces';

export class ReviewCollaborationService {
  constructor(
    private readonly repository: ReviewSessionRepository,
    private readonly auditService?: AuditService
  ) {}

  async addCollaborationMessage(id: string, input: { author: string; body: string; threadId?: string }): Promise<ReviewSession> {
    const session = await this.getExistingSession(id);
    const updated = addCollaborationMessage(session, input);
    await this.saveAndAudit(updated);
    return updated;
  }

  async approvePartial(id: string, input: { scope: PartialApprovalScope; target: string; reviewer: string }): Promise<ReviewSession> {
    const session = await this.getExistingSession(id);
    const updated = registerPartialApproval(session, input);
    await this.saveAndAudit(updated);
    return updated;
  }

  async refreshMergeDecision(id: string): Promise<ReviewSession> {
    const session = await this.getExistingSession(id);
    const updated = updateSessionMergeDecision(session);
    await this.saveAndAudit(updated);
    return updated;
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
