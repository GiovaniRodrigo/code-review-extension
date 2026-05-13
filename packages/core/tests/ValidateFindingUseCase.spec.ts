import { describe, it, expect, vi } from 'vitest';
import { ValidateFindingUseCase } from '../src/ValidateFindingUseCase';
import { ReviewRepository } from '@code-review/infra';
import { ReviewSession } from '@code-review/domain';

describe('ValidateFindingUseCase', () => {
  it('should update the status of a finding to approved', async () => {
    const mockSession: ReviewSession = {
      id: 'session-1',
      branch: 'main',
      findings: [
        {
          id: 'finding-1',
          file: 'test.ts',
          line: 1,
          message: 'Error',
          severity: 'error',
          status: 'pending'
        }
      ],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const mockRepo: ReviewRepository = {
      saveSession: vi.fn(),
      getSessionByBranch: vi.fn(),
      getSessionById: vi.fn().mockResolvedValue(mockSession),
      deleteSession: vi.fn()
    };

    const useCase = new ValidateFindingUseCase(mockRepo);
    const session = await useCase.execute('session-1', 'finding-1', 'approved');

    expect(mockSession.findings[0].status).toBe('approved');
    expect(session.comments).toHaveLength(1);
    expect(session.comments[0]).toEqual(expect.objectContaining({
      findingId: 'finding-1',
      file: 'test.ts',
      line: 1,
      body: 'Error',
      status: 'open'
    }));
    expect(mockRepo.saveSession).toHaveBeenCalledWith(mockSession);
  });

  it('should not create a technical comment when rejecting a finding', async () => {
    const mockSession: ReviewSession = {
      id: 'session-1',
      branch: 'main',
      findings: [
        {
          id: 'finding-1',
          file: 'test.ts',
          line: 1,
          message: 'Error',
          severity: 'error',
          status: 'pending'
        }
      ],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const mockRepo: ReviewRepository = {
      saveSession: vi.fn(),
      getSessionByBranch: vi.fn(),
      getSessionById: vi.fn().mockResolvedValue(mockSession),
      deleteSession: vi.fn()
    };

    const useCase = new ValidateFindingUseCase(mockRepo);
    const session = await useCase.execute('session-1', 'finding-1', 'rejected');

    expect(session.findings[0].status).toBe('rejected');
    expect(session.comments).toEqual([]);
  });

  it('should show an approved finding through the IDE adapter', async () => {
    const mockSession: ReviewSession = {
      id: 'session-1',
      branch: 'main',
      findings: [
        {
          id: 'finding-1',
          file: 'test.ts',
          line: 1,
          message: 'Error',
          severity: 'error',
          status: 'pending'
        }
      ],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const mockRepo: ReviewRepository = {
      saveSession: vi.fn(),
      getSessionByBranch: vi.fn(),
      getSessionById: vi.fn().mockResolvedValue(mockSession),
      deleteSession: vi.fn()
    };
    const mockIDE: IDEAdapter = {
      getActiveFileContent: vi.fn(),
      getActiveFilePath: vi.fn(),
      getActiveBranch: vi.fn(),
      showFinding: vi.fn(),
      focusFinding: vi.fn(),
      applyFix: vi.fn(),
      showNotification: vi.fn()
    };

    const useCase = new ValidateFindingUseCase(mockRepo, mockIDE);
    await useCase.execute('session-1', 'finding-1', 'approved');

    expect(mockIDE.showFinding).toHaveBeenCalledWith(mockSession.findings[0]);
  });

  it('should throw error if session does not exist', async () => {
    const mockRepo: ReviewRepository = {
      saveSession: vi.fn(),
      getSessionByBranch: vi.fn(),
      getSessionById: vi.fn().mockResolvedValue(null),
      deleteSession: vi.fn()
    };

    const useCase = new ValidateFindingUseCase(mockRepo);
    await expect(useCase.execute('invalid', 'finding-1', 'approved'))
      .rejects.toThrow('Session invalid not found');
  });

  it('should throw error if finding does not exist in session', async () => {
    const mockSession: ReviewSession = {
      id: 'session-1',
      branch: 'main',
      findings: [],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const mockRepo: ReviewRepository = {
      saveSession: vi.fn(),
      getSessionByBranch: vi.fn(),
      getSessionById: vi.fn().mockResolvedValue(mockSession),
      deleteSession: vi.fn()
    };

    const useCase = new ValidateFindingUseCase(mockRepo);
    await expect(useCase.execute('session-1', 'invalid-finding', 'approved'))
      .rejects.toThrow('Finding invalid-finding not found in session session-1');
  });
});
