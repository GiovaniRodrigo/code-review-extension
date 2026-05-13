import { CodeReviewRepositoryPort } from '../../../ports/review/CodeReviewRepositoryPort';

export class ApproveFindingUseCase {
  constructor(private readonly repository: CodeReviewRepositoryPort) {}

  async execute(sessionId: string, findingId: string): Promise<void> {
    const session = await this.repository.getSessionById(sessionId);

    if (!session) {
      throw new Error(`Review session not found: ${sessionId}`);
    }

    session.findings = session.findings.map(finding =>
      finding.id === findingId ? { ...finding, status: 'approved' } : finding
    );
    session.updatedAt = new Date();

    await this.repository.saveSession(session);
  }
}
