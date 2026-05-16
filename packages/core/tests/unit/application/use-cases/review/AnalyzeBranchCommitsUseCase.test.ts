import { describe, expect, it, vi, beforeEach } from 'vitest';
import { AnalyzeBranchCommitsUseCase } from '../../../../../src/application/use-cases/review/AnalyzeBranchCommitsUseCase';
import { AIAnalysisService } from '../../../../../src/application/services/ai/AIAnalysisService';
import { CodeReviewService } from '../../../../../src/application/services/review/CodeReviewService';
import { IdeAdapterPort } from '../../../../../src/ports/ide/IdeAdapterPort';

describe('AnalyzeBranchCommitsUseCase', () => {
  let mockIde: any;
  let mockAI: any;
  let mockReviewService: any;

  beforeEach(() => {
    mockIde = {
      getActiveBranch: vi.fn().mockResolvedValue('feature-1'),
      getBranchDiff: vi.fn().mockResolvedValue('diff content')
    };
    mockAI = {
      analyze: vi.fn().mockResolvedValue({
        findings: [{ file: 'a.ts', line: 1, message: 'risk', severity: 'warning', confidence: 0.9 }]
      })
    };
    mockReviewService = {
      getByBranch: vi.fn().mockResolvedValue({ id: 's1', branch: 'feature-1', findings: [] }),
      create: vi.fn().mockResolvedValue({ id: 's-new', branch: 'feature-1', findings: [] }),
      update: vi.fn().mockResolvedValue(undefined)
    };
  });

  it('should analyze cumulative branch changes and update session', async () => {
    const onProgress = vi.fn();
    const useCase = new AnalyzeBranchCommitsUseCase(mockIde, mockAI, mockReviewService);
    const result = await useCase.execute({ baseBranch: 'main', onProgress });

    expect(result.findings).toHaveLength(1);
    expect(mockAI.analyze).toHaveBeenCalled();
    expect(mockReviewService.update).toHaveBeenCalled();
    expect(onProgress).toHaveBeenCalledWith(expect.stringContaining('Retrieving branch history'));
    expect(onProgress).toHaveBeenCalledWith(expect.stringContaining('Analyzing cumulative changes'));
  });

  it('should create a session if one does not exist', async () => {
    mockReviewService.getByBranch.mockResolvedValue(null);
    const useCase = new AnalyzeBranchCommitsUseCase(mockIde, mockAI, mockReviewService);
    await useCase.execute({ baseBranch: 'main' });
    expect(mockReviewService.create).toHaveBeenCalled();
  });

  it('should throw error if no diff is found', async () => {
    mockIde.getBranchDiff.mockResolvedValue('');
    const useCase = new AnalyzeBranchCommitsUseCase(mockIde, mockAI, mockReviewService);
    await expect(useCase.execute({ baseBranch: 'main' })).rejects.toThrow('No changes found');
  });

  it('should respect abort signal', async () => {
    const controller = new AbortController();
    const useCase = new AnalyzeBranchCommitsUseCase(mockIde, mockAI, mockReviewService);
    
    await useCase.execute({ baseBranch: 'main', signal: controller.signal });
    
    expect(mockAI.analyze).toHaveBeenCalledWith(expect.objectContaining({
        signal: controller.signal
    }));
  });

  it('should handle case where getBranchDiff is undefined on IDE adapter', async () => {
    const ideNoDiff = { getActiveBranch: vi.fn().mockResolvedValue('f1') };
    const useCase = new AnalyzeBranchCommitsUseCase(ideNoDiff as any, mockAI, mockReviewService);
    await expect(useCase.execute({ baseBranch: 'main' })).rejects.toThrow('No changes found');
  });
});

