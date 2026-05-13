import { ReviewSession } from '@code-review/domain';
import { VpsCodeReviewPublisherPort } from '../../../ports/vps/VpsCodeReviewPublisherPort';

export class PublishCodeReviewUseCase {
  constructor(private readonly publisher: VpsCodeReviewPublisherPort) {}

  execute(session: ReviewSession): Promise<void> {
    return this.publisher.publish(session);
  }
}
