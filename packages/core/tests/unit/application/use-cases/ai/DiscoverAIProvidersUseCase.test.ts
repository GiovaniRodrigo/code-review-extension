import { describe, it, expect, vi } from 'vitest';
import { DiscoverAIProvidersUseCase } from '../../../../../src/application/use-cases/ai/DiscoverAIProvidersUseCase';
import { AIProviderDiscoveryService } from '../../../../../src/application/services/ai/AIProviderDiscoveryService';

describe('DiscoverAIProvidersUseCase', () => {
  it('should delegate to discovery service', async () => {
    const mockService = {
      discoverProviders: vi.fn().mockResolvedValue([])
    };
    const useCase = new DiscoverAIProvidersUseCase(mockService as any);
    
    await useCase.execute([], () => ({} as any));
    
    expect(mockService.discoverProviders).toHaveBeenCalled();
  });
});
