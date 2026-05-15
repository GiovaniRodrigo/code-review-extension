import { AIProvider } from './interfaces';
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
    apiKey: string | (() => Promise<string>);
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
        );
      case 'openai':
        return new OpenAIProvider(config.openai?.apiKey || '');
      default:
        return new MockAIProvider();
    }
  }
}
