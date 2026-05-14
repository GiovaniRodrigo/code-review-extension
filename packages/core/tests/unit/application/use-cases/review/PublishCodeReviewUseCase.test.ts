import { describe, it, expect, vi } from 'vitest';
import { PublishCodeReviewUseCase } from '../../../../../src/application/use-cases/review/PublishCodeReviewUseCase';
import { VpsCodeReviewPublisherPort } from '../../../../../src/ports/vps/VpsCodeReviewPublisherPort';
import { ReviewSession } from '@code-review/domain';

describe('PublishCodeReviewUseCase', () => {
  it('should publish a review session', async () => {
    const mockPublisher = {
      publish: vi.fn().mockResolvedValue(undefined)
    } as unknown as VpsCodeReviewPublisherPort;
    const useCase = new PublishCodeReviewUseCase(mockPublisher);

    const mockSession = { id: 's1' } as ReviewSession;
    await useCase.execute(mockSession);

    expect(mockPublisher.publish).toHaveBeenCalledWith(mockSession);
  });
});
