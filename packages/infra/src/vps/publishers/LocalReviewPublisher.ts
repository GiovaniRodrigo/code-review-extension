import { ReviewSession } from '@code-review/domain';
import type { VpsCodeReviewPublisherPort } from '../../../../core/src/ports/vps/VpsCodeReviewPublisherPort';

export class LocalReviewPublisher implements VpsCodeReviewPublisherPort {
  async publish(_session: ReviewSession): Promise<void> {}
}
