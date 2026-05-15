import { AIProviderConfig, AIProviderStatus, HealthStatusDTO, AIProviderPort } from '../../../ports/ai/AIProviderPort';

export interface ProviderDiscoveryResult {
  config: AIProviderConfig;
  status: HealthStatusDTO;
}

export class AIProviderDiscoveryService {
  async discoverProviders(configs: AIProviderConfig[], providerFactory: (config: AIProviderConfig) => AIProviderPort): Promise<ProviderDiscoveryResult[]> {
    const enabledConfigs = configs.filter(c => c.enabled);
    
    const results = await Promise.all(
      enabledConfigs.map(async (config) => {
        try {
          const provider = providerFactory(config);
          const status = await provider.checkHealth();
          return { config, status };
        } catch (error: any) {
          return {
            config,
            status: {
              status: 'unavailable' as AIProviderStatus,
              message: error.message
            }
          };
        }
      })
    );

    return results;
  }
}
