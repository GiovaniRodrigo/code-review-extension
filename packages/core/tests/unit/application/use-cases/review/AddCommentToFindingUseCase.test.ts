import { describe, expect, it, vi } from 'vitest';
import { AddCommentToFindingUseCase } from '../../../../../src/application/use-cases/review/AddCommentToFindingUseCase';
import { CodeReviewRepositoryPort } from '../../../../../src/ports/review/CodeReviewRepositoryPort';

describe('AddCommentToFindingUseCase', () => {
  it('should add a comment to a finding and update the session', async () => {
    const mockSession = {
      id: 'session-1',
      branch: 'main',
      findings: [
        { id: 'finding-1', file: 'a.ts', line: 1, message: 'msg', severity: 'info', status: 'pending' }
      ],
      updatedAt: new Date()
    };

    const mockRepo = {
      getSessionById: vi.fn().mockResolvedValue(mockSession),
      saveSession: vi.fn().mockResolvedValue(undefined)
    } as unknown as CodeReviewRepositoryPort;

    const useCase = new AddCommentToFindingUseCase(mockRepo);
    const result = await useCase.execute({
      sessionId: 'session-1',
      findingId: 'finding-1',
      author: 'developer',
      body: 'I will fix this.'
    });

    expect(result.findings[0].discussion).toHaveLength(1);
    expect(result.findings[0].discussion?.[0].body).toBe('I will fix this.');
    expect(mockRepo.saveSession).toHaveBeenCalled();
  });
});
