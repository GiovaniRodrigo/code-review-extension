import { describe, expect, it, vi } from 'vitest';
import { ReinforcementService } from '../../../../../src/application/services/ai/ReinforcementService';

describe('ReinforcementService', () => {
  it('should index positive and negative findings', async () => {
    const mockStore = {
      add: vi.fn().mockResolvedValue(undefined),
      search: vi.fn().mockResolvedValue([])
    } as any;
    const mockEmbeddings = {
      generateEmbedding: vi.fn().mockResolvedValue([0.1])
    } as any;

    const service = new ReinforcementService(mockStore, mockEmbeddings);
    
    await service.learnFromFinding({ 
        id: '1', status: 'approved', message: 'good', file: 'a.ts', line: 1, severity: 'info' 
    } as any);

    expect(mockStore.add).toHaveBeenCalledWith(expect.objectContaining({
        id: 'reinforcement-1'
    }), [0.1]);
  });

  it('should retrieve reinforcement context', async () => {
    const mockStore = {
      search: vi.fn().mockResolvedValue([{ content: '[POSITIVE_EXAMPLE] good' }])
    } as any;
    const mockEmbeddings = {
      generateEmbedding: vi.fn().mockResolvedValue([0.1])
    } as any;

    const service = new ReinforcementService(mockStore, mockEmbeddings);
    const context = await service.getReinforcementContext('code');

    expect(context).toContain('Human-in-the-Loop Feedback');
    expect(context).toContain('good');
  });
});
