import { describe, expect, it, vi } from 'vitest';
import { GenerateQualityReportUseCase } from '../../../../../src/application/use-cases/review/GenerateQualityReportUseCase';
import { CodeReviewRepositoryPort } from '../../../../../src/ports/review/CodeReviewRepositoryPort';

describe('GenerateQualityReportUseCase', () => {
  it('should generate a quality report with health score', async () => {
    const mockRepo = {
      getSessionByBranch: vi.fn().mockResolvedValue({
        branch: 'main',
        findings: [
          { severity: 'critical', file: 'a.ts', status: 'pending', message: 'crit' },
          { severity: 'warning', file: 'b.ts', status: 'pending', message: 'warn' }
        ]
      })
    } as any;

    const useCase = new GenerateQualityReportUseCase(mockRepo);
    const result = await useCase.execute('main');

    // 100 - (1 * 15) - (1 * 5) = 80
    expect(result.overallScore).toBe(80);
    expect(result.criticalFindings).toBe(1);
    expect(result.markdown).toContain('Technical Quality Report');
    expect(result.markdown).toContain('🟡 80/100');
  });

  it('should handle perfect score', async () => {
    const mockRepo = {
      getSessionByBranch: vi.fn().mockResolvedValue({
        branch: 'main',
        findings: []
      })
    } as any;

    const useCase = new GenerateQualityReportUseCase(mockRepo);
    const result = await useCase.execute('main');

    expect(result.overallScore).toBe(100);
    expect(result.markdown).toContain('🟢 100/100');
  });

  it('should handle very low score and floor it at 0', async () => {
    const mockRepo = {
      getSessionByBranch: vi.fn().mockResolvedValue({
        branch: 'main',
        findings: Array(10).fill({ severity: 'critical', file: 'a.ts', status: 'pending', message: 'crit' })
      })
    } as any;

    const useCase = new GenerateQualityReportUseCase(mockRepo);
    const result = await useCase.execute('main');

    // 100 - (10 * 15) = -50 -> floor to 0
    expect(result.overallScore).toBe(0);
    expect(result.markdown).toContain('🔴 0/100');
  });

  it('should sort findings by severity in the markdown', async () => {
    const mockRepo = {
      getSessionByBranch: vi.fn().mockResolvedValue({
        branch: 'main',
        findings: [
          { severity: 'info', file: 'info.ts', status: 'pending', message: 'i' },
          { severity: 'error', file: 'error.ts', status: 'pending', message: 'e' },
          { severity: 'warning', file: 'warning.ts', status: 'pending', message: 'w' }
        ]
      })
    } as any;

    const useCase = new GenerateQualityReportUseCase(mockRepo);
    const result = await useCase.execute('main');

    // Check order in markdown table
    const lines = result.markdown.split('\n').filter(l => l.includes('| `'));
    expect(lines[0]).toContain('ERROR');
    expect(lines[1]).toContain('WARNING');
    expect(lines[2]).toContain('INFO');
  });

  it('should throw error if session missing', async () => {
    const mockRepo = { getSessionByBranch: vi.fn().mockResolvedValue(null) } as any;
    const useCase = new GenerateQualityReportUseCase(mockRepo);
    await expect(useCase.execute('missing')).rejects.toThrow('No review session found');
  });

  it('should limit findings in report to 20', async () => {
      const mockRepo = {
        getSessionByBranch: vi.fn().mockResolvedValue({
          branch: 'main',
          findings: Array(30).fill({ severity: 'info', file: 'a.ts', status: 'pending', message: 'm' })
        })
      } as any;

      const useCase = new GenerateQualityReportUseCase(mockRepo);
      const result = await useCase.execute('main');

      const lines = result.markdown.split('\n').filter(l => l.includes('| `'));
      expect(lines.length).toBe(20);
  });
});

