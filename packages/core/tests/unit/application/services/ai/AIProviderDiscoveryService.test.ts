import { describe, it, expect, vi } from 'vitest';
import { AIProviderDiscoveryService } from '../../../../../src/application/services/ai/AIProviderDiscoveryService';
import { AIProviderConfig, AIProviderPort } from '../../../../../src/ports/ai/AIProviderPort';

describe('AIProviderDiscoveryService', () => {
  it('should discover healthy providers and handle failures', async () => {
    const service = new AIProviderDiscoveryService();
    const configs: AIProviderConfig[] = [
      { id: 'p1', type: 'openai', label: 'P1', enabled: true, model: 'm1' },
      { id: 'p2', type: 'ollama', label: 'P2', enabled: true, model: 'm2' },
      { id: 'p3', type: 'gemini', label: 'P3', enabled: false, model: 'm3' }
    ];

    const mockP1: AIProviderPort = {
      analyzeCode: vi.fn(),
      checkHealth: vi.fn().mockResolvedValue({ status: 'available' })
    };

    const mockP2: AIProviderPort = {
      analyzeCode: vi.fn(),
      checkHealth: vi.fn().mockRejectedValue(new Error('Network Error'))
    };

    const factory = (config: AIProviderConfig) => {
      if (config.id === 'p1') return mockP1;
      if (config.id === 'p2') return mockP2;
      throw new Error('Unexpected');
    };

    const results = await service.discoverProviders(configs, factory);

    expect(results).toHaveLength(2); // Only enabled ones
    expect(results[0].config.id).toBe('p1');
    expect(results[0].status.status).toBe('available');
    
    expect(results[1].config.id).toBe('p2');
    expect(results[1].status.status).toBe('unavailable');
    expect(results[1].status.message).toBe('Network Error');
  });
});
