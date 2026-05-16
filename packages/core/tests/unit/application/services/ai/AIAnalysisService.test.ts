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

  it('should support streaming findings', async () => {
    const mockAI = {
      analyzeCode: vi.fn().mockImplementation(async (input) => {
        if (input.onFinding) {
          input.onFinding({ message: 'finding 1', line: 1, file: 'f.ts', severity: 'info', category: 'code_smell', confidence: 0.9 });
        }
        return { findings: [{ message: 'finding 1', line: 1, file: 'f.ts', severity: 'info', category: 'code_smell', confidence: 0.9 }], confidenceScore: 1.0 };
      })
    } as unknown as AIProviderPort;
    const service = new AIAnalysisService(mockAI);
    const onFinding = vi.fn();

    await service.analyze({ filePath: 'f.ts', code: 'c', onFinding });

    expect(onFinding).toHaveBeenCalledTimes(1);
    expect(onFinding).toHaveBeenCalledWith(expect.objectContaining({
      message: 'finding 1'
    }));
  });
});
