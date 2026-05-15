import { AIProviderPort } from '../../../ports/ai/AIProviderPort';
import { AIAnalysisRequestDTO, AIAnalysisResponseDTO } from '../../dto/ai/AIAnalysisDTO';

export class AIProviderRegistry implements AIProviderPort {
  private providers: Map<string, AIProviderPort> = new Map();
  private activeProviderId?: string;

  register(id: string, provider: AIProviderPort): void {
    this.providers.set(id, provider);
  }

  setActiveProvider(id: string): void {
    if (!this.providers.has(id)) {
      throw new Error(`Provider ${id} not registered`);
    }
    this.activeProviderId = id;
  }

  private getActiveProvider(): AIProviderPort {
    if (!this.activeProviderId) {
      throw new Error('No active AI provider selected');
    }
    const provider = this.providers.get(this.activeProviderId);
    if (!provider) {
      throw new Error(`Active provider ${this.activeProviderId} not found`);
    }
    return provider;
  }

  async analyzeCode(input: AIAnalysisRequestDTO): Promise<AIAnalysisResponseDTO> {
    return this.getActiveProvider().analyzeCode(input);
  }

  async checkHealth(): Promise<any> {
    return this.getActiveProvider().checkHealth();
  }
}
