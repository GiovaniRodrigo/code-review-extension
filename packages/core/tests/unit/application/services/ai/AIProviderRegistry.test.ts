import { describe, it, expect, vi } from 'vitest';
import { AIProviderRegistry } from '../../../../../src/application/services/ai/AIProviderRegistry';
import { AIProviderPort } from '../../../../../src/ports/ai/AIProviderPort';

describe('AIProviderRegistry', () => {
  it('should register and switch active providers', async () => {
    const registry = new AIProviderRegistry();
    const mockP1: AIProviderPort = {
      analyzeCode: vi.fn().mockResolvedValue({ findings: [], confidenceScore: 1 }),
      checkHealth: vi.fn().mockResolvedValue({ status: 'available' })
    };

    registry.register('p1', mockP1);
    
    // Should throw if no active set
    await expect(registry.analyzeCode({ code: '', filePath: '' })).rejects.toThrow('No active AI provider selected');

    registry.setActiveProvider('p1');
    const result = await registry.analyzeCode({ code: '', filePath: '' });
    expect(result.confidenceScore).toBe(1);
    
    const health = await registry.checkHealth();
    expect(health.status).toBe('available');
  });

  it('should throw when setting active provider not registered', () => {
    const registry = new AIProviderRegistry();
    expect(() => registry.setActiveProvider('ghost')).toThrow('not registered');
  });

  it('should throw if active provider was removed or missing from map internally', () => {
    const registry = new AIProviderRegistry();
    (registry as any).activeProviderId = 'stale';
    expect(() => (registry as any).getActiveProvider()).toThrow('not found');
  });
});
