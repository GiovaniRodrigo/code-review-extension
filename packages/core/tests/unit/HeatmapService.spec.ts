import { describe, it, expect, beforeEach } from 'vitest';
import { HeatmapService } from '../../src/HeatmapService';
import { InMemoryReviewRepository } from '../../../infra/src/InMemoryReviewRepository';
import { ReviewSession, Finding } from '@code-review/domain';

describe('HeatmapService', () => {
  let repository: InMemoryReviewRepository;
  let service: HeatmapService;

  beforeEach(() => {
    repository = new InMemoryReviewRepository();
    service = new HeatmapService(repository);
  });

  it('should calculate empty heatmap when no sessions exist', async () => {
    const heatmap = await service.calculateHeatmap();
    expect(heatmap).toEqual([]);
  });

  it('should aggregate findings from multiple sessions', async () => {
    const session1: ReviewSession = {
      id: '1',
      branch: 'main',
      findings: [
        { id: 'f1', file: 'src/app.ts', line: 10, message: 'err', severity: 'error', status: 'approved' },
        { id: 'f2', file: 'src/utils.ts', line: 5, message: 'warn', severity: 'warning', status: 'pending' }
      ],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const session2: ReviewSession = {
      id: '2',
      branch: 'feature',
      findings: [
        { id: 'f3', file: 'src/app.ts', line: 20, message: 'info', severity: 'info', status: 'approved' }
      ],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await repository.saveSession(session1);
    await repository.saveSession(session2);

    const heatmap = await service.calculateHeatmap();

    expect(heatmap).toHaveLength(2);
    
    const appHeat = heatmap.find(h => h.file === 'src/app.ts');
    expect(appHeat?.findingCount).toBe(2);
    expect(appHeat?.severityDistribution.error).toBe(1);
    expect(appHeat?.severityDistribution.info).toBe(1);
    expect(appHeat?.score).toBe(22); // 20 (error) + 2 (info)

    const utilsHeat = heatmap.find(h => h.file === 'src/utils.ts');
    expect(utilsHeat?.findingCount).toBe(1);
    expect(utilsHeat?.score).toBe(8); // 8 (warning)
  });

  it('should sort files by heat score descending', async () => {
     const session: ReviewSession = {
      id: '1',
      branch: 'main',
      findings: [
        { id: 'f1', file: 'cold.ts', line: 1, message: 'info', severity: 'info', status: 'approved' },
        { id: 'f2', file: 'hot.ts', line: 1, message: 'err', severity: 'error', status: 'approved' }
      ],
      comments: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await repository.saveSession(session);
    const heatmap = await service.calculateHeatmap();

    expect(heatmap[0].file).toBe('hot.ts');
    expect(heatmap[1].file).toBe('cold.ts');
  });
});
