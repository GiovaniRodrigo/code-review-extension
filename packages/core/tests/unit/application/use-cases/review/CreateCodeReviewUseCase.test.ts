import { describe, it, expect, vi } from 'vitest';
import { CreateCodeReviewUseCase } from '../../../../../src/application/use-cases/review/CreateCodeReviewUseCase';
import { CodeReviewService } from '../../../../../src/application/services/review/CodeReviewService';
import { CodeReviewRepositoryPort } from '../../../../../src/ports/review/CodeReviewRepositoryPort';

describe('CreateCodeReviewUseCase', () => {
  it('should create a review session', async () => {
    const mockRepo = {
      saveSession: vi.fn().mockResolvedValue(undefined)
    } as unknown as CodeReviewRepositoryPort;
    const service = new CodeReviewService(mockRepo);
    const useCase = new CreateCodeReviewUseCase(service);

    const session = await useCase.execute('feat/test', []);

    expect(session.branch).toBe('feat/test');
    expect(mockRepo.saveSession).toHaveBeenCalledWith(session);
  });
});
