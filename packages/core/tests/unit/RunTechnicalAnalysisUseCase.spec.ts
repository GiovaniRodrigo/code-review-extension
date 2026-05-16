import { describe, expect, it, vi } from 'vitest';
import { RunTechnicalAnalysisUseCase } from '../../src/application/use-cases/review/RunTechnicalAnalysisUseCase';
import { IdeAdapterPort } from '../../src/ports/ide/IdeAdapterPort';

describe('RunTechnicalAnalysisUseCase', () => {
  it('should run technical analysis and return a report', async () => {
    const mockIdeAdapter = {
      getActiveFilePath: vi.fn().mockResolvedValue('test.ts'),
      getActiveFileContent: vi.fn().mockResolvedValue(`
        function tooManyParams(a, b, c, d, e, f) {
          return a + b + c + d + e + f;
        }
      `),
    } as unknown as IdeAdapterPort;

    const useCase = new RunTechnicalAnalysisUseCase(mockIdeAdapter);
    const report = await useCase.execute();

    expect(report.filePath).toBe('test.ts');
    expect(report.staticFindings).toHaveLength(1);
    expect(report.staticFindings[0].ruleId).toBe('too-many-params');
    expect(report.risk.score).toBeGreaterThan(0);
    expect(report.risk.methods).toHaveLength(1);
    expect(report.risk.methods[0].name).toBe('tooManyParams');
    expect(report.risk.methods[0].reasons).toContain('1 finding(s) inside this function');
  });

  it('should throw error if no file is active', async () => {
    const mockIdeAdapter = {
      getActiveFilePath: vi.fn().mockResolvedValue(null),
      getActiveFileContent: vi.fn().mockResolvedValue(null),
    } as unknown as IdeAdapterPort;

    const useCase = new RunTechnicalAnalysisUseCase(mockIdeAdapter);
    await expect(useCase.execute()).rejects.toThrow('No active file or content to analyze.');
  });
});
