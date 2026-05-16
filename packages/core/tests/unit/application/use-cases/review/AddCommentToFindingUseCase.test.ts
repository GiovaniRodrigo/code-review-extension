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

  it('should throw error if session not found', async () => {
    const mockRepo = { getSessionById: vi.fn().mockResolvedValue(null) } as any;
    const useCase = new AddCommentToFindingUseCase(mockRepo);
    await expect(useCase.execute({ sessionId: '404', findingId: '1', author: 'ai', body: 'b' })).rejects.toThrow('not found');
  });

  it('should throw error if finding not found in session', async () => {
    const mockRepo = { getSessionById: vi.fn().mockResolvedValue({ findings: [] }) } as any;
    const useCase = new AddCommentToFindingUseCase(mockRepo);
    await expect(useCase.execute({ sessionId: '1', findingId: '404', author: 'ai', body: 'b' })).rejects.toThrow('not found in session');
  });
});
