import { Finding, ReviewSession } from '@code-review/domain';
import { CodeReviewRepositoryPort } from '../../../ports/review/CodeReviewRepositoryPort';

export class CodeReviewService {
  constructor(private readonly repository: CodeReviewRepositoryPort) {}

  async create(branch: string, findings: Finding[] = []): Promise<ReviewSession> {
    const now = new Date();
    const session: ReviewSession = {
      id: `${branch}-${now.getTime()}`,
      branch,
      findings,
      comments: [],
      createdAt: now,
      updatedAt: now
    };

    await this.repository.saveSession(session);
    return session;
  }
}
