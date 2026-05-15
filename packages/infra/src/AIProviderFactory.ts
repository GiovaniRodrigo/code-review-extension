import { AIProviderConfig } from '@code-review/core';
import { AIProvider } from './interfaces';
import { MockAIProvider } from './MockAIProvider';
import { OllamaProvider } from './OllamaProvider';
import { OpenAIProvider } from './OpenAIProvider';
import { GeminiProvider } from './GeminiProvider';
import { ClaudeProvider } from './ClaudeProvider';

export class AIProviderFactory {
  static create(config: AIProviderConfig): AIProvider {
    switch (config.type) {
      case 'mock':
        return new MockAIProvider();
      case 'ollama':
        return new OllamaProvider(
          config.baseUrl || 'http://localhost:11434',
          config.model || 'llama3'
        );
      case 'openai':
        return new OpenAIProvider(
          config.apiKey || '',
          config.model || 'gpt-4o-mini'
        );
      case 'gemini':
        return new GeminiProvider(
          config.apiKey || '',
          config.model || 'gemini-flash-latest'
        );
      case 'claude':
        return new ClaudeProvider(
          config.apiKey || '',
          config.model || 'claude-3-5-sonnet-20240620'
        );
      case 'cloud':
        return new OpenAIProvider(
          config.apiKey || '',
          config.model
        );
      default:
        return new MockAIProvider();
    }
  }
}
