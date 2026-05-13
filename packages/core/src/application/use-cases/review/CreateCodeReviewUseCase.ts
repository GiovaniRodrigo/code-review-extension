import { Finding, ReviewSession } from '@code-review/domain';
import { CodeReviewService } from '../../services/review/CodeReviewService';

export class CreateCodeReviewUseCase {
  constructor(private readonly service: CodeReviewService) {}

  execute(branch: string, findings: Finding[] = []): Promise<ReviewSession> {
    return this.service.create(branch, findings);
  }
}
