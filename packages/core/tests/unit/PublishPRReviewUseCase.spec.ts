import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PublishPRReviewUseCase } from '../../src/PublishPRReviewUseCase';
import { ReviewRepository, GitProvider } from '@code-review/infra';
import { ReviewSession } from '@code-review/domain';

describe('PublishPRReviewUseCase', () => {
  let mockRepo: ReviewRepository;
  let mockGit: GitProvider;
  let useCase: PublishPRReviewUseCase;

  beforeEach(() => {
    mockRepo = {
      getSessionById: vi.fn(),
      saveSession: vi.fn(),
      getSessionByBranch: vi.fn(),
      getAllSessions: vi.fn(),
      deleteSession: vi.fn()
    };
    mockGit = {
      publishComments: vi.fn()
    };
    useCase = new PublishPRReviewUseCase(mockRepo, mockGit);
  });

  it('should publish approved findings as PR comments', async () => {
    const session: ReviewSession = {
      id: 's1',
      branch: 'feat',
      findings: [
        { id: 'f1', file: 'a.ts', line: 10, message: 'Bug', severity: 'error', status: 'approved' },
        { id: 'f2', file: 'b.ts', line: 20, message: 'Nit', severity: 'info', status: 'pending' }
      ],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    vi.mocked(mockRepo.getSessionById).mockResolvedValue(session);

    await useCase.execute({
      sessionId: 's1',
      owner: 'user',
      repo: 'repo',
      prNumber: 42
    });

    expect(mockGit.publishComments).toHaveBeenCalledWith(
      'user',
      'repo',
      42,
      expect.arrayContaining([
        expect.objectContaining({
          file: 'a.ts',
          line: 10,
          body: expect.stringContaining('Bug')
        })
      ])
    );
    expect(mockGit.publishComments).toHaveBeenCalledOnce();
  });

  it('should throw if no approved findings exist', async () => {
     const session: ReviewSession = {
      id: 's1',
      branch: 'feat',
      findings: [
        { id: 'f1', file: 'a.ts', line: 10, message: 'Bug', severity: 'error', status: 'pending' }
      ],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    vi.mocked(mockRepo.getSessionById).mockResolvedValue(session);

    await expect(useCase.execute({
      sessionId: 's1',
      owner: 'u',
      repo: 'r',
      prNumber: 1
    })).rejects.toThrow('No approved findings to publish');
  });
});
