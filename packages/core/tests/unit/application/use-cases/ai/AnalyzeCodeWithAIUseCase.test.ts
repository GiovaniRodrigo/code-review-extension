import { describe, it, expect, vi } from 'vitest';
import { AnalyzeCodeWithAIUseCase } from '../../../../../src/application/use-cases/ai/AnalyzeCodeWithAIUseCase';
import { AIAnalysisService } from '../../../../../src/application/services/ai/AIAnalysisService';

describe('AnalyzeCodeWithAIUseCase', () => {
  it('should call analysisService', async () => {
    const mockService = {
      analyze: vi.fn().mockResolvedValue({ findings: [] })
    } as unknown as AIAnalysisService;
    const useCase = new AnalyzeCodeWithAIUseCase(mockService);

    const input = { filePath: 'f.ts', content: 'c', instructions: 'i' };
    await useCase.execute(input);

    expect(mockService.analyze).toHaveBeenCalledWith(input);
  });
});
