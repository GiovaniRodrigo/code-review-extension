import { AIProvider, AIProviderRegistry } from '@code-review/infra';
import { MockAIProvider } from './MockAIProvider';
import { OllamaProvider } from './OllamaProvider';
import { OpenAIProvider } from './OpenAIProvider';

export interface AIProviderConfig {
  provider: 'mock' | 'ollama' | 'openai';
  ollama?: {
    baseUrl: string;
    model: string;
  };
  openai?: {
    apiKey: string;
    model: string;
  };
}

export class AIProviderFactory {
  static create(config: AIProviderConfig): AIProvider {
    switch (config.provider) {
      case 'mock':
        return new MockAIProvider();
      case 'ollama':
        return new OllamaProvider(
          config.ollama?.baseUrl || 'http://localhost:11434',
          config.ollama?.model || 'llama3'
        ) as any; // Cast because of interface mismatch if any
      case 'openai':
        // OpenAIProvider in current code doesn't implement AIProvider interface directly but has compatible method
        return new OpenAIProvider(config.openai?.apiKey || '') as any;
      default:
        return new MockAIProvider();
    }
  }
}
