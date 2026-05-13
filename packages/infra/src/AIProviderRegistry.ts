import { AIProvider } from './interfaces';

export class AIProviderRegistry {
  private providers = new Map<string, AIProvider>();
  private defaultProviderName: string | null = null;

  register(name: string, provider: AIProvider, isDefault = false): void {
    this.providers.set(name, provider);
    if (isDefault || !this.defaultProviderName) {
      this.defaultProviderName = name;
    }
  }

  getProvider(name?: string): AIProvider {
    const targetName = name || this.defaultProviderName;
    if (!targetName) {
      throw new Error('No AI providers registered');
    }

    const provider = this.providers.get(targetName);
    if (!provider) {
      throw new Error(`AI Provider "${targetName}" not found`);
    }

    return provider;
  }

  listProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}
