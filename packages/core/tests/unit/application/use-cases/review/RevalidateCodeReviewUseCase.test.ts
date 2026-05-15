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
    } as any;

    const aiService = new AIAnalysisService(mockAiProvider);
    const reviewService = new CodeReviewService(mockRepo);
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
});
