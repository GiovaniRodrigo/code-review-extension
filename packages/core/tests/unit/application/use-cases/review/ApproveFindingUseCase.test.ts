import { describe, it, expect, vi } from 'vitest';
import { ApproveFindingUseCase } from '../../../../../src/application/use-cases/review/ApproveFindingUseCase';
import { CodeReviewRepositoryPort } from '../../../../../src/ports/review/CodeReviewRepositoryPort';
import { IdeAdapterPort } from '../../../../../src/ports/ide/IdeAdapterPort';

describe('ApproveFindingUseCase', () => {
  it('should approve a finding and show it in the IDE', async () => {
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

    const mockIde = {
      showFinding: vi.fn().mockResolvedValue(undefined)
    } as unknown as IdeAdapterPort;

    const useCase = new ApproveFindingUseCase(mockRepo, mockIde);
    await useCase.execute('session-1', 'finding-1');

    expect(mockSession.findings[0].status).toBe('approved');
    expect(mockRepo.saveSession).toHaveBeenCalledWith(mockSession);
    expect(mockIde.showFinding).toHaveBeenCalledWith(expect.objectContaining({
      id: 'finding-1',
      status: 'approved'
    }));
  });

  it('should throw error if session not found', async () => {
    const mockRepo = {
      getSessionById: vi.fn().mockResolvedValue(null)
    } as unknown as CodeReviewRepositoryPort;

    const mockIde = {} as IdeAdapterPort;

    const useCase = new ApproveFindingUseCase(mockRepo, mockIde);
    await expect(useCase.execute('invalid', 'finding-1'))
      .rejects.toThrow('Review session not found: invalid');
  });

  it('should throw error if finding not found', async () => {
    const mockRepo = {
      getSessionById: vi.fn().mockResolvedValue({ id: 's1', findings: [] })
    } as any;

    const useCase = new ApproveFindingUseCase(mockRepo, {} as any);
    await expect(useCase.execute('s1', 'f1'))
      .rejects.toThrow('Finding not found in session: f1');
  });
});
