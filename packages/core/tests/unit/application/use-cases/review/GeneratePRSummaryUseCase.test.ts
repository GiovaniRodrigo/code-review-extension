import { describe, expect, it, vi, beforeEach } from 'vitest';
import { GeneratePRSummaryUseCase } from '../../../../../src/application/use-cases/review/GeneratePRSummaryUseCase';
import { AIProviderPort } from '../../../../../src/ports/ai/AIProviderPort';
import { CodeReviewRepositoryPort } from '../../../../../src/ports/review/CodeReviewRepositoryPort';
import { IdeAdapterPort } from '../../../../../src/ports/ide/IdeAdapterPort';

describe('GeneratePRSummaryUseCase', () => {
  let mockRepo: any;
  let mockIde: any;
  let mockAI: any;

  beforeEach(() => {
    mockRepo = {
      getSessionByBranch: vi.fn().mockResolvedValue({ 
        findings: [
          { status: 'approved', file: 'a.ts', line: 1, message: 'good fix' },
          { status: 'pending', file: 'b.ts', line: 2, message: 'ignore me' }
        ] 
      })
    };
    mockIde = {
      getBranchDiff: vi.fn().mockResolvedValue('branch diff content')
    };
    mockAI = {
      analyzeCode: vi.fn().mockResolvedValue({
        findings: [{ message: '# Title\n## Description' }]
      })
    };
  });

  it('should generate a markdown summary for a PR including approved findings', async () => {
    const useCase = new GeneratePRSummaryUseCase(mockRepo, mockAI, mockIde);
    const result = await useCase.execute('feat-1');

    expect(result.markdown).toContain('# Title');
    expect(mockIde.getBranchDiff).toHaveBeenCalledWith('main');
    expect(mockAI.analyzeCode).toHaveBeenCalledWith(expect.objectContaining({
        code: expect.stringContaining('good fix')
    }));
    expect(mockAI.analyzeCode).not.toHaveBeenCalledWith(expect.objectContaining({
        code: expect.stringContaining('ignore me')
    }));
  });

  it('should use provided baseBranch', async () => {
    const useCase = new GeneratePRSummaryUseCase(mockRepo, mockAI, mockIde);
    await useCase.execute('feat-1', 'develop');
    expect(mockIde.getBranchDiff).toHaveBeenCalledWith('develop');
  });

  it('should handle missing diff and findings gracefully', async () => {
      mockRepo.getSessionByBranch.mockResolvedValue(null);
      mockIde.getBranchDiff.mockResolvedValue(undefined);
      mockAI.analyzeCode.mockResolvedValue({ findings: [] });

      const useCase = new GeneratePRSummaryUseCase(mockRepo, mockAI, mockIde);
      const result = await useCase.execute('feat-1');

      expect(result.markdown).toBe('Could not generate summary.');
  });

  it('should handle case where getBranchDiff is not on IDE adapter', async () => {
    const ideNoDiff = {};
    const useCase = new GeneratePRSummaryUseCase(mockRepo, mockAI, ideNoDiff as any);
    const result = await useCase.execute('feat-1');
    expect(result.markdown).toContain('# Title');
  });
});

