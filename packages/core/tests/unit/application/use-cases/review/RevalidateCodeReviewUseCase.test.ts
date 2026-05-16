import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RevalidateCodeReviewUseCase } from '../../../../../src/application/use-cases/review/RevalidateCodeReviewUseCase';
import { AIAnalysisService } from '../../../../../src/application/services/ai/AIAnalysisService';
import { CodeReviewService } from '../../../../../src/application/services/review/CodeReviewService';
import { CodeReviewRepositoryPort } from '../../../../../src/ports/review/CodeReviewRepositoryPort';
import { AIProviderPort } from '../../../../../src/ports/ai/AIProviderPort';

describe('RevalidateCodeReviewUseCase', () => {
  let useCase: RevalidateCodeReviewUseCase;
  let mockAiProvider: AIProviderPort;
  let mockRepo: CodeReviewRepositoryPort;
  let aiService: AIAnalysisService;
  let reviewService: CodeReviewService;

  beforeEach(() => {
    mockAiProvider = {
      analyzeCode: vi.fn().mockResolvedValue({
        findings: [
          { file: 'a.ts', line: 1, message: 'old error', severity: 'error', confidence: 1.0, category: 'code_smell' },
          { file: 'a.ts', line: 2, message: 'new error', severity: 'warning', confidence: 0.8, category: 'code_smell' }
        ],
        confidenceScore: 0.9
      })
    };

    const sessions = new Map();
    mockRepo = {
      getSessionByBranch: vi.fn().mockImplementation(branch => [...sessions.values()].find(s => s.branch === branch)),
      saveSession: vi.fn().mockImplementation(s => sessions.set(s.id, s)),
      getSessionById: vi.fn().mockImplementation(id => sessions.get(id)),
      createSession: vi.fn().mockImplementation((branch, findings) => {
          const s = { id: 's-new', branch, findings, updatedAt: new Date() };
          sessions.set(s.id, s);
          return s;
      }),
      updateSession: vi.fn().mockImplementation(s => sessions.set(s.id, s)),
    } as any;

    aiService = new AIAnalysisService(mockAiProvider);
    reviewService = new CodeReviewService(mockRepo);
    useCase = new RevalidateCodeReviewUseCase(aiService, reviewService);
  });

  it('deve preservar findings aprovados que ainda existem no resultado da IA', async () => {
    // 1. Criar sessão inicial com um aprovado
    const branch = 'main';
    const initialSession = {
      id: 's1',
      branch,
      findings: [
        { id: 'f1', file: 'a.ts', line: 1, message: 'old error', severity: 'error', status: 'approved' }
      ],
      updatedAt: new Date()
    };
    await mockRepo.saveSession(initialSession as any);

    // 2. Revalidar
    const result = await useCase.execute({
      branch,
      code: 'code',
      filePath: 'a.ts'
    });

    // 3. O finding 'f1' deve continuar aprovado (matched by file, line, message)
    const approved = result.findings.find(f => f.message === 'old error');
    expect(approved?.status).toBe('approved');
    expect(approved?.id).toBe('f1');

    // 4. O novo finding deve estar pendente
    const newFinding = result.findings.find(f => f.message === 'new error');
    expect(newFinding?.status).toBe('pending');
  });

  it('should create a new session if one does not exist', async () => {
      const result = await useCase.execute({
          branch: 'new-branch',
          code: 'code',
          filePath: 'b.ts'
      });
      expect(result.branch).toBe('new-branch');
      expect(result.id).toContain('new-branch');
      expect(result.findings).toHaveLength(2);
      expect(mockRepo.saveSession).toHaveBeenCalled();
  });

  it('should support streaming findings through onFinding callback', async () => {
      const onFinding = vi.fn();
      
      // AI service analyze calls onFinding internally if we pass it.
      // But RevalidateUseCase wraps it.
      
      await useCase.execute({
          branch: 'main',
          code: 'code',
          filePath: 'a.ts',
          onFinding
      });

      // AIProvider returns 2 findings. AIAnalysisService calls onFinding for each if supported.
      // RevalidateCodeReviewUseCase passes its own wrapper to analysisService.analyze.
      // Wait, AIAnalysisService only supports streaming if analyzeCode supports it or it emulates it.
      
      // Let's assume AIAnalysisService.analyze calls input.onFinding if provided.
      // In this case, we have 2 findings.
      expect(onFinding).toHaveBeenCalledTimes(2);
      expect(onFinding).toHaveBeenCalledWith(expect.objectContaining({
          message: 'old error'
      }));
  });

  it('should deduplicate identical findings from AI', async () => {
    mockAiProvider.analyzeCode = vi.fn().mockResolvedValue({
        findings: [
          { file: 'a.ts', line: 1, message: 'duplicate', severity: 'error', confidence: 1.0, category: 'code_smell' },
          { file: 'a.ts', line: 1, message: 'duplicate', severity: 'error', confidence: 1.0, category: 'code_smell' }
        ],
        confidenceScore: 0.9
    });

    const result = await useCase.execute({ branch: 'main', code: 'c', filePath: 'a.ts' });
    expect(result.findings).toHaveLength(1);
  });

  it('should limit findings to MAX_FINDINGS (100)', async () => {
    const manyFindings = Array(120).fill({}).map((_, i) => ({
        file: 'a.ts', line: i, message: `m${i}`, severity: 'info', confidence: 1.0, category: 'code_smell'
    }));
    mockAiProvider.analyzeCode = vi.fn().mockResolvedValue({ findings: manyFindings, confidenceScore: 0.8 });

    const result = await useCase.execute({ branch: 'main', code: 'c', filePath: 'a.ts' });
    expect(result.findings.length).toBe(100);
  });

  it('should fallback to full code if pruning fails', async () => {
      const mockAI = { analyze: vi.fn().mockResolvedValue({ findings: [] }) } as any;
      const mockReviewService = { getByBranch: vi.fn().mockResolvedValue({ findings: [] }), update: vi.fn() } as any;
      const mockPruning = { prune: vi.fn().mockImplementation(() => { throw new Error('Prune error'); }) } as any;
      const mockAst = { build: vi.fn().mockResolvedValue({}) } as any;

      const useCase = new RevalidateCodeReviewUseCase(mockAI, mockReviewService, mockPruning, mockAst);
      await useCase.execute({ branch: 'main', code: 'test', filePath: 'f.ts', targetLines: [1] });

      expect(mockAI.analyze).toHaveBeenCalledWith(expect.objectContaining({ code: 'test' }));
  });

  it('should use pruning service when targetLines are provided', async () => {
      const mockAI = { analyze: vi.fn().mockResolvedValue({ findings: [] }) } as any;
      const mockReviewService = { getByBranch: vi.fn().mockResolvedValue({ findings: [] }), update: vi.fn() } as any;
      const mockPruning = { prune: vi.fn().mockReturnValue('pruned code') } as any;
      const mockAst = { build: vi.fn().mockResolvedValue({}) } as any;

      const useCase = new RevalidateCodeReviewUseCase(mockAI, mockReviewService, mockPruning, mockAst);
      await useCase.execute({ branch: 'main', code: 'full code', filePath: 'f.ts', targetLines: [10] });

      expect(mockPruning.prune).toHaveBeenCalledWith(expect.objectContaining({ targetLines: [10] }));
      expect(mockAI.analyze).toHaveBeenCalledWith(expect.objectContaining({ code: 'pruned code' }));
  });
});
