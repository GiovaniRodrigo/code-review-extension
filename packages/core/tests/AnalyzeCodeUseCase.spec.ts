import { describe, it, expect, vi } from 'vitest';
import { AnalyzeCodeUseCase } from '../src/AnalyzeCodeUseCase';
import { AIProvider, IDEAdapter, ReviewRepository } from '@code-review/infra';

describe('AnalyzeCodeUseCase', () => {
  it('should create a review session with findings from AI', async () => {
    const mockAI: AIProvider = {
      analyzeCode: vi.fn().mockResolvedValue({
        findings: [{ message: 'Fix this', line: 10 }],
        confidenceScore: 0.9
      })
    };
    const mockIDE: IDEAdapter = {
      getActiveFileContent: vi.fn().mockResolvedValue('const x = 1;'),
      getActiveFilePath: vi.fn().mockResolvedValue('test.ts'),
      getActiveBranch: vi.fn().mockResolvedValue('main'),
      showFinding: vi.fn(),
      focusFinding: vi.fn(),
      applyFix: vi.fn(),
      showNotification: vi.fn()
    };
    const mockRepo: ReviewRepository = {
      saveSession: vi.fn(),
      getSessionByBranch: vi.fn(),
      getSessionById: vi.fn(),
      deleteSession: vi.fn()
    };

    const useCase = new AnalyzeCodeUseCase(mockAI, mockIDE, mockRepo);
    const session = await useCase.execute();

    expect(session.branch).toBe('main');
    expect(session.findings).toHaveLength(1);
    expect(session.findings[0].message).toBe('Fix this');
    expect(session.findings[0].status).toBe('pending');
    expect(session.findings[0].severity).toBe('info');
    expect(session.findings[0].confidenceScore).toBe(0.9);
    expect(session.comments).toEqual([]);
    expect(mockAI.analyzeCode).toHaveBeenCalledWith(expect.objectContaining({
      code: 'const x = 1;',
      filePath: 'test.ts'
    }));
    expect(mockRepo.saveSession).toHaveBeenCalled();
  });

  it('should classify missing severity through the severity engine', async () => {
    const mockAI: AIProvider = {
      analyzeCode: vi.fn().mockResolvedValue({
        findings: [{ message: 'Potential security risk: input is not sanitized', line: 12 }],
        confidenceScore: 0.9
      })
    };
    const mockIDE: IDEAdapter = {
      getActiveFileContent: vi.fn().mockResolvedValue('const x = req.query.x;'),
      getActiveFilePath: vi.fn().mockResolvedValue('test.ts'),
      getActiveBranch: vi.fn().mockResolvedValue('main'),
      showFinding: vi.fn(),
      focusFinding: vi.fn(),
      applyFix: vi.fn(),
      showNotification: vi.fn()
    };
    const mockRepo: ReviewRepository = {
      saveSession: vi.fn(),
      getSessionByBranch: vi.fn(),
      getSessionById: vi.fn(),
      deleteSession: vi.fn()
    };

    const useCase = new AnalyzeCodeUseCase(mockAI, mockIDE, mockRepo);
    const session = await useCase.execute();

    expect(session.findings[0].severity).toBe('error');
  });

  it('should fail when there is no active file', async () => {
    const mockAI: AIProvider = {
      analyzeCode: vi.fn()
    };
    const mockIDE: IDEAdapter = {
      getActiveFileContent: vi.fn().mockResolvedValue('const x = 1;'),
      getActiveFilePath: vi.fn().mockResolvedValue(''),
      getActiveBranch: vi.fn().mockResolvedValue('main'),
      showFinding: vi.fn(),
      focusFinding: vi.fn(),
      applyFix: vi.fn(),
      showNotification: vi.fn()
    };
    const mockRepo: ReviewRepository = {
      saveSession: vi.fn(),
      getSessionByBranch: vi.fn(),
      getSessionById: vi.fn(),
      deleteSession: vi.fn()
    };

    const useCase = new AnalyzeCodeUseCase(mockAI, mockIDE, mockRepo);

    await expect(useCase.execute()).rejects.toThrow('No active file selected for analysis');
    expect(mockAI.analyzeCode).not.toHaveBeenCalled();
  });

  it('should fail when the active file is empty', async () => {
    const mockAI: AIProvider = {
      analyzeCode: vi.fn()
    };
    const mockIDE: IDEAdapter = {
      getActiveFileContent: vi.fn().mockResolvedValue('   '),
      getActiveFilePath: vi.fn().mockResolvedValue('empty.ts'),
      getActiveBranch: vi.fn().mockResolvedValue('main'),
      showFinding: vi.fn(),
      focusFinding: vi.fn(),
      applyFix: vi.fn(),
      showNotification: vi.fn()
    };
    const mockRepo: ReviewRepository = {
      saveSession: vi.fn(),
      getSessionByBranch: vi.fn(),
      getSessionById: vi.fn(),
      deleteSession: vi.fn()
    };

    const useCase = new AnalyzeCodeUseCase(mockAI, mockIDE, mockRepo);

    await expect(useCase.execute()).rejects.toThrow('Active file is empty');
    expect(mockAI.analyzeCode).not.toHaveBeenCalled();
  });
});
