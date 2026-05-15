import { ReviewSession } from '@code-review/domain';
import { CodeReviewService } from '../../services/review/CodeReviewService';

export class GetCodeReviewUseCase {
  constructor(private readonly service: CodeReviewService) {}

  async execute(branch: string): Promise<ReviewSession | null> {
    return this.service.getByBranch(branch);
  }
}
