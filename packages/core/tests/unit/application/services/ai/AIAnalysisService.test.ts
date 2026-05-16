import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AIAnalysisService } from '../../../../../src/application/services/ai/AIAnalysisService';
import { AIProviderPort } from '../../../../../src/ports/ai/AIProviderPort';

describe('AIAnalysisService', () => {
  let mockAI: any;
  let service: AIAnalysisService;

  beforeEach(() => {
    mockAI = {
      analyzeCode: vi.fn().mockResolvedValue({ 
          findings: [{ file: 'f.ts', line: 1, message: 'm', severity: 'info', category: 'code_smell', confidence: 0.9 }], 
          confidenceScore: 1.0 
      }),
      checkHealth: vi.fn().mockResolvedValue({ status: 'available' })
    };
    service = new AIAnalysisService(mockAI);
  });

  it('should call aiProvider with default mode', async () => {
    await service.analyze({ filePath: 'f.ts', code: 'c' });
    expect(mockAI.analyzeCode).toHaveBeenCalledWith(expect.objectContaining({
      mode: 'fast'
    }));
  });

  it('should support streaming findings', async () => {
    const onFinding = vi.fn();
    await service.analyze({ filePath: 'f.ts', code: 'c', onFinding });
    expect(onFinding).toHaveBeenCalledTimes(1);
  });

  it('should retry on failure', async () => {
    mockAI.analyzeCode
        .mockRejectedValueOnce(new Error('Transient'))
        .mockResolvedValueOnce({ findings: [], confidenceScore: 1.0 });

    const result = await service.analyze({ filePath: 'f.ts', code: 'c' });
    expect(mockAI.analyzeCode).toHaveBeenCalledTimes(2);
    expect(result.findings).toHaveLength(0);
  });

  it('should respect maxRetries config', async () => {
    const serviceWithNoRetry = new AIAnalysisService(mockAI, undefined, undefined, undefined, undefined, undefined, { maxRetries: 0 });
    mockAI.analyzeCode.mockRejectedValue(new Error('Fail'));
    
    await expect(serviceWithNoRetry.analyze({ filePath: 'f.ts', code: 'c' })).rejects.toThrow('Fail');
    expect(mockAI.analyzeCode).toHaveBeenCalledTimes(1);
  });

  it('should prune large files if they are not diffs', async () => {
      const largeCode = 'const x = 1;\n'.repeat(1000); // > 5000 chars
      const mockPruning = { prune: vi.fn().mockReturnValue('pruned') };
      const mockAst = { build: vi.fn().mockReturnValue({}) };
      
      const serviceWithPruning = new AIAnalysisService(mockAI, undefined, undefined, mockPruning as any, undefined, mockAst as any);
      await serviceWithPruning.analyze({ filePath: 'large.ts', code: largeCode });

      expect(mockPruning.prune).toHaveBeenCalled();
      expect(mockAI.analyzeCode).toHaveBeenCalledWith(expect.objectContaining({ code: 'pruned' }));
  });

  it('should mask data by default', async () => {
      const mockMasking = { mask: vi.fn().mockReturnValue('masked') };
      const serviceWithMasking = new AIAnalysisService(mockAI, undefined, undefined, undefined, mockMasking as any);
      
      await serviceWithMasking.analyze({ filePath: 'f.ts', code: 'secret@email.com', context: 'key: 123' });

      expect(mockMasking.mask).toHaveBeenCalledWith('secret@email.com');
      expect(mockMasking.mask).toHaveBeenCalledWith('key: 123');
  });

  it('should truncate excessive context', async () => {
      const longContext = 'a'.repeat(15000);
      await service.analyze({ filePath: 'f.ts', code: 'c', context: longContext });

      expect(mockAI.analyzeCode).toHaveBeenCalledWith(expect.objectContaining({
          context: expect.stringContaining('[truncated]')
      }));
      expect(mockAI.analyzeCode.mock.calls[0][0].context.length).toBeLessThan(11000);
  });

  it('should add reinforcement context if available', async () => {
      const mockReinforcement = { getReinforcementContext: vi.fn().mockResolvedValue(' some tip') };
      const serviceWithReinforcement = new AIAnalysisService(mockAI, undefined, mockReinforcement as any);
      
      await serviceWithReinforcement.analyze({ filePath: 'f.ts', code: 'c' });
      expect(mockAI.analyzeCode).toHaveBeenCalledWith(expect.objectContaining({
          context: expect.stringContaining('some tip')
      }));
  });

  it('should handle validation failure by returning empty findings', async () => {
      mockAI.analyzeCode.mockResolvedValue({ invalid: 'response' });
      const result = await service.analyze({ filePath: 'f.ts', code: 'c' });
      expect(result.findings).toHaveLength(0);
      expect(result.confidenceScore).toBe(0);
  });
});

