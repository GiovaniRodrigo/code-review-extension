import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AnalyzePrUseCase } from '../../../../../src/application/use-cases/review/AnalyzePrUseCase';
import { AIAnalysisService } from '../../../../../src/application/services/ai/AIAnalysisService';
import { CodeReviewService } from '../../../../../src/application/services/review/CodeReviewService';

describe('AnalyzePrUseCase', () => {
  let mockIde: any;
  let mockAI: any;
  let mockReviewService: any;

  beforeEach(() => {
    mockIde = {
      getPullRequestDiff: vi.fn().mockResolvedValue('pr diff'),
      getActiveBranch: vi.fn().mockResolvedValue('main')
    };
    mockAI = {
      analyze: vi.fn().mockResolvedValue({
        findings: [{ file: 'b.ts', line: 10, message: 'bug', severity: 'error', confidence: 0.8 }]
      })
    };
    mockReviewService = {
      getByBranch: vi.fn().mockResolvedValue({ id: 's1', findings: [], branch: 'main' }),
      create: vi.fn().mockResolvedValue({ id: 's-new', findings: [], branch: 'main' }),
      update: vi.fn().mockResolvedValue(undefined)
    };
  });

  it('should analyze a pull request and return a session', async () => {
    const useCase = new AnalyzePrUseCase(mockIde, mockAI, mockReviewService);
    const result = await useCase.execute({ prNumber: 123, owner: 'o', repo: 'r' });

    expect(mockIde.getPullRequestDiff).toHaveBeenCalledWith(123);
    expect(mockAI.analyze).toHaveBeenCalled();
    expect(mockReviewService.update).toHaveBeenCalled();
    expect(result.findings).toHaveLength(1);
  });

  it('should create a session if one does not exist', async () => {
    mockReviewService.getByBranch.mockResolvedValue(null);
    const useCase = new AnalyzePrUseCase(mockIde, mockAI, mockReviewService);
    await useCase.execute({ prNumber: 123, owner: 'o', repo: 'r' });
    expect(mockReviewService.create).toHaveBeenCalled();
  });

  it('should throw error if diff cannot be retrieved', async () => {
    mockIde.getPullRequestDiff.mockResolvedValue(null);
    const useCase = new AnalyzePrUseCase(mockIde, mockAI, mockReviewService);
    await expect(useCase.execute({ prNumber: 123, owner: 'o', repo: 'r' })).rejects.toThrow('Could not retrieve diff');
  });

  it('should respect abort signal', async () => {
    const controller = new AbortController();
    const useCase = new AnalyzePrUseCase(mockIde, mockAI, mockReviewService);
    
    await useCase.execute({ prNumber: 123, owner: 'o', repo: 'r', signal: controller.signal });
    
    expect(mockAI.analyze).toHaveBeenCalledWith(expect.objectContaining({
        signal: controller.signal
    }));
  });
});

