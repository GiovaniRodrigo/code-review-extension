import { describe, it, expect, vi } from 'vitest';
import { AIAnalysisService } from '../../../../../src/application/services/ai/AIAnalysisService';
import { AIProviderPort } from '../../../../../src/ports/ai/AIProviderPort';

describe('AIAnalysisService', () => {
  it('should call aiProvider with default mode', async () => {
    const mockAI = {
      analyzeCode: vi.fn().mockResolvedValue({ findings: [], confidenceScore: 1.0 })
    } as unknown as AIProviderPort;
    const service = new AIAnalysisService(mockAI);

    await service.analyze({ filePath: 'f.ts', code: 'c' });

    expect(mockAI.analyzeCode).toHaveBeenCalledWith(expect.objectContaining({
      mode: 'fast'
    }));
  });

  it('should call aiProvider with provided mode', async () => {
    const mockAI = {
      analyzeCode: vi.fn().mockResolvedValue({ findings: [], confidenceScore: 1.0 })
    } as unknown as AIProviderPort;
    const service = new AIAnalysisService(mockAI);

    await service.analyze({ filePath: 'f.ts', code: 'c', mode: 'audit' });

    expect(mockAI.analyzeCode).toHaveBeenCalledWith(expect.objectContaining({
      mode: 'audit'
    }));
  });
});
