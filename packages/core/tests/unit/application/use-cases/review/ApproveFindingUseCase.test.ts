import { describe, it, expect, vi } from 'vitest';
import { ApproveFindingUseCase } from '../../../../../src/application/use-cases/review/ApproveFindingUseCase';
import { CodeReviewRepositoryPort } from '../../../../../src/ports/review/CodeReviewRepositoryPort';

describe('ApproveFindingUseCase', () => {
  it('should approve a finding in a session', async () => {
    const mockSession = {
      id: 'session-1',
      findings: [
        { id: 'finding-1', status: 'pending' }
      ],
      updatedAt: new Date()
    };

    const mockRepo = {
      getSessionById: vi.fn().mockResolvedValue(mockSession),
      saveSession: vi.fn()
    } as unknown as CodeReviewRepositoryPort;

    const useCase = new ApproveFindingUseCase(mockRepo);
    await useCase.execute('session-1', 'finding-1');

    expect(mockSession.findings[0].status).toBe('approved');
    expect(mockRepo.saveSession).toHaveBeenCalledWith(mockSession);
  });

  it('should throw error if session not found', async () => {
    const mockRepo = {
      getSessionById: vi.fn().mockResolvedValue(null)
    } as unknown as CodeReviewRepositoryPort;

    const useCase = new ApproveFindingUseCase(mockRepo);
    await expect(useCase.execute('invalid', 'finding-1'))
      .rejects.toThrow('Review session not found: invalid');
  });
});
