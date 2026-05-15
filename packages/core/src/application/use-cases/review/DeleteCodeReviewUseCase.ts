import { CodeReviewRepositoryPort } from '../../../ports/review/CodeReviewRepositoryPort';

export class DeleteCodeReviewUseCase {
  constructor(private readonly repository: CodeReviewRepositoryPort) {}

  async execute(branch: string): Promise<void> {
    const session = await this.repository.getSessionByBranch(branch);
    if (session) {
      await this.repository.deleteSession(session.id);
    }
  }
}
