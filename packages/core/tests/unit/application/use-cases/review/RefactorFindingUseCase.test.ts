import { describe, expect, it, vi } from 'vitest';
import { RefactorFindingUseCase } from '../../../../../src/application/use-cases/review/RefactorFindingUseCase';
import { AIAnalysisService } from '../../../../../src/application/services/ai/AIAnalysisService';
import { CodeReviewRepositoryPort } from '../../../../../src/ports/review/CodeReviewRepositoryPort';
import { IdeAdapterPort } from '../../../../../src/ports/ide/IdeAdapterPort';

describe('RefactorFindingUseCase', () => {
  it('should generate a refactoring and apply it', async () => {
    const mockRepo = {
      getSessionById: vi.fn().mockResolvedValue({ id: 's1', findings: [{ id: 'f1', line: 1 }] }),
      saveSession: vi.fn().mockResolvedValue(undefined)
    } as any;

    const mockAI = {
      generateRefactor: vi.fn().mockResolvedValue('new code')
    } as any;

    const mockIde = {
      getActiveFileContent: vi.fn().mockResolvedValue('old code'),
      applyFix: vi.fn().mockResolvedValue(undefined)
    } as any;

    const useCase = new RefactorFindingUseCase(mockRepo, mockAI, mockIde);
    await useCase.execute({ sessionId: 's1', findingId: 'f1' });

    expect(mockAI.generateRefactor).toHaveBeenCalled();
    expect(mockIde.applyFix).toHaveBeenCalled();
  });

  it('should throw error if session not found', async () => {
    const mockRepo = { getSessionById: vi.fn().mockResolvedValue(null) } as any;
    const useCase = new RefactorFindingUseCase(mockRepo, {} as any, {} as any);
    await expect(useCase.execute({ sessionId: '404', findingId: '1' })).rejects.toThrow('Session');
  });

  it('should throw error if AI fails to generate refactor', async () => {
    const mockRepo = { getSessionById: vi.fn().mockResolvedValue({ id: 's1', findings: [{ id: 'f1' }] }) } as any;
    const mockAI = { generateRefactor: vi.fn().mockResolvedValue('') } as any;
    const mockIde = { getActiveFileContent: vi.fn().mockResolvedValue('code') } as any;

    const useCase = new RefactorFindingUseCase(mockRepo, mockAI, mockIde);
    await expect(useCase.execute({ sessionId: 's1', findingId: 'f1' })).rejects.toThrow('AI could not generate');
  });
});
