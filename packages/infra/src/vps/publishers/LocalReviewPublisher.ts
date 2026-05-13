import { ReviewSession } from '@code-review/domain';
import { VpsCodeReviewPublisherPort } from '@code-review/core';

export class LocalReviewPublisher implements VpsCodeReviewPublisherPort {
  async publish(_session: ReviewSession): Promise<void> {}
}
