import { ReviewSession } from '@code-review/domain';

export interface VpsCodeReviewPublisherPort {
  publish(session: ReviewSession): Promise<void>;
}
