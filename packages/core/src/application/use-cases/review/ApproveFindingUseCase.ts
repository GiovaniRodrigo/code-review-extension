import { CodeReviewRepositoryPort } from '../../../ports/review/CodeReviewRepositoryPort';
import { IdeAdapterPort } from '../../../ports/ide/IdeAdapterPort';

export class ApproveFindingUseCase {
  constructor(
    private readonly repository: CodeReviewRepositoryPort,
    private readonly ide: IdeAdapterPort
  ) {}

  async execute(sessionId: string, findingId: string): Promise<void> {
    const session = await this.repository.getSessionById(sessionId);

    if (!session) {
      throw new Error(`Review session not found: ${sessionId}`);
    }

    let approvedFinding: any = null;

    session.findings = session.findings.map(finding => {
      if (finding.id === findingId) {
        approvedFinding = { ...finding, status: 'approved' };
        return approvedFinding;
      }
      return finding;
    });

    if (!approvedFinding) {
      throw new Error(`Finding not found in session: ${findingId}`);
    }

    session.updatedAt = new Date();

    await this.repository.saveSession(session);
    await this.ide.showFinding(approvedFinding);
  }
}
