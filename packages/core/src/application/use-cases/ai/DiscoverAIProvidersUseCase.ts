import { AIProviderConfig, AIProviderPort } from '../../../ports/ai/AIProviderPort';
import { AIProviderDiscoveryService, ProviderDiscoveryResult } from '../../services/ai/AIProviderDiscoveryService';

export class DiscoverAIProvidersUseCase {
  constructor(
    private readonly discoveryService: AIProviderDiscoveryService
  ) {}

  async execute(configs: AIProviderConfig[], providerFactory: (config: AIProviderConfig) => AIProviderPort): Promise<ProviderDiscoveryResult[]> {
    return this.discoveryService.discoverProviders(configs, providerFactory);
  }
}
