import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AnalyzeCodeUseCase } from '../../src/AnalyzeCodeUseCase';
import { AIProvider, IDEAdapter, ReviewRepository } from '@code-review/infra';
import { ContextEngine } from '../../src/ContextEngine';

describe('AnalyzeCodeUseCase', () => {
  let mockAI: AIProvider;
  let mockIDE: IDEAdapter;
  let mockRepo: ReviewRepository;
  let mockContext: ContextEngine;

  beforeEach(() => {
    mockAI = {
      analyzeCode: vi.fn().mockResolvedValue({
        findings: [{ message: 'Fix this', line: 10 }],
        confidenceScore: 0.9
      })
    };
    mockIDE = {
      getActiveFileContent: vi.fn().mockResolvedValue('const x = 1;'),
      getActiveFilePath: vi.fn().mockResolvedValue('test.ts'),
      getActiveBranch: vi.fn().mockResolvedValue('main'),
      showFinding: vi.fn(),
      focusFinding: vi.fn(),
      applyFix: vi.fn(),
      showNotification: vi.fn()
    };
    mockRepo = {
      saveSession: vi.fn(),
      getSessionByBranch: vi.fn(),
      getSessionById: vi.fn(),
      getAllSessions: vi.fn().mockResolvedValue([]),
      deleteSession: vi.fn()
    };
    mockContext = {
      buildContext: vi.fn().mockResolvedValue('mock context')
    } as any;
  });

  it('should create a review session with findings from AI', async () => {
    const useCase = new AnalyzeCodeUseCase(mockAI, mockIDE, mockRepo, mockContext);
    const session = await useCase.execute();

    expect(session.findings).toHaveLength(1);
    expect(session.findings[0].message).toBe('Fix this');
    expect(session.findings[0].status).toBe('pending');
    expect(session.findings[0].severity).toBe('info');
    expect(session.findings[0].confidenceScore).toBe(0.9);
    expect(mockAI.analyzeCode).toHaveBeenCalledWith(expect.objectContaining({
      code: 'const x = 1;',
      filePath: 'test.ts',
      context: 'mock context'
    }));
    expect(mockRepo.saveSession).toHaveBeenCalled();
  });

  it('should classify missing severity through the severity engine', async () => {
    mockAI.analyzeCode = vi.fn().mockResolvedValue({
      findings: [{ message: 'Potential security risk: input is not sanitized', line: 12 }],
      confidenceScore: 0.9
    });

    const useCase = new AnalyzeCodeUseCase(mockAI, mockIDE, mockRepo, mockContext);
    const session = await useCase.execute();

    expect(session.findings[0].severity).toBe('error');
  });

  it('should fail when there is no active file', async () => {
    mockIDE.getActiveFilePath = vi.fn().mockResolvedValue('');

    const useCase = new AnalyzeCodeUseCase(mockAI, mockIDE, mockRepo, mockContext);

    await expect(useCase.execute()).rejects.toThrow('No active file selected for analysis. Please open a file in the editor and try again.');
    expect(mockAI.analyzeCode).not.toHaveBeenCalled();
  });

  it('should fail when the active file is empty', async () => {
    mockIDE.getActiveFileContent = vi.fn().mockResolvedValue('   ');

    const useCase = new AnalyzeCodeUseCase(mockAI, mockIDE, mockRepo, mockContext);

    await expect(useCase.execute()).rejects.toThrow('The active file is empty. Please add some code and try again.');
    expect(mockAI.analyzeCode).not.toHaveBeenCalled();
  });
});
