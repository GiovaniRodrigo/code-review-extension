import { ReviewSession, TechnicalComment } from '@code-review/domain';
import { IDEAdapter, ReviewRepository } from '@code-review/infra';

export class ValidateFindingUseCase {
  constructor(
    private repository: ReviewRepository,
    private ideAdapter?: IDEAdapter
  ) {}

  async execute(sessionId: string, findingId: string, status: 'approved' | 'rejected'): Promise<ReviewSession> {
    const session = await this.repository.getSessionById(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const finding = session.findings.find(f => f.id === findingId);
    if (!finding) {
      throw new Error(`Finding ${findingId} not found in session ${sessionId}`);
    }

    finding.status = status;

    if (status === 'approved') {
      session.comments = session.comments || [];
      const existingComment = session.comments.find(comment => comment.findingId === finding.id);
      if (!existingComment) {
        const comment: TechnicalComment = {
          id: `${finding.id}-comment`,
          findingId: finding.id,
          file: finding.file,
          line: finding.line,
          body: this._buildCommentBody(finding.message, finding.suggestedFix),
          status: 'open',
          createdAt: new Date()
        };
        session.comments.push(comment);
      }

      await this.ideAdapter?.showFinding(finding);
    }

    session.updatedAt = new Date();

    await this.repository.saveSession(session);
    console.log(`Finding ${findingId} in session ${sessionId} updated to ${status}`);
    return session;
  }

  private _buildCommentBody(message: string, suggestedFix?: string): string {
    if (!suggestedFix) {
      return message;
    }

    return `${message}\n\nSuggested fix:\n${suggestedFix}`;
  }
}
