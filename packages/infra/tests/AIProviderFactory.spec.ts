import { describe, it, expect } from 'vitest';
import { AIProviderFactory } from '../src/AIProviderFactory';
import { OpenAIProvider } from '../src/OpenAIProvider';
import { OllamaProvider } from '../src/OllamaProvider';
import { GeminiProvider } from '../src/GeminiProvider';
import { ClaudeProvider } from '../src/ClaudeProvider';
import { MockAIProvider } from '../src/MockAIProvider';

describe('AIProviderFactory', () => {
  it('should create OpenAIProvider', () => {
    const config: any = { id: '1', type: 'openai', label: 'OpenAI', enabled: true, model: 'gpt-4' };
    const provider = AIProviderFactory.create(config);
    expect(provider).toBeInstanceOf(OpenAIProvider);
  });

  it('should create OllamaProvider', () => {
    const config: any = { id: '2', type: 'ollama', label: 'Ollama', enabled: true, model: 'llama3', baseUrl: 'http://loc:11434' };
    const provider = AIProviderFactory.create(config);
    expect(provider).toBeInstanceOf(OllamaProvider);
  });

  it('should create GeminiProvider', () => {
    const config: any = { id: '3', type: 'gemini', label: 'Gemini', enabled: true, model: 'gemini-pro' };
    const provider = AIProviderFactory.create(config);
    expect(provider).toBeInstanceOf(GeminiProvider);
  });

  it('should create ClaudeProvider', () => {
    const config: any = { id: '4', type: 'claude', label: 'Claude', enabled: true, model: 'claude-3' };
    const provider = AIProviderFactory.create(config);
    expect(provider).toBeInstanceOf(ClaudeProvider);
  });

  it('should create OpenAIProvider for cloud type', () => {
    const config: any = { id: '5', type: 'cloud', label: 'Cloud', enabled: true, model: 'gpt-4' };
    const provider = AIProviderFactory.create(config);
    expect(provider).toBeInstanceOf(OpenAIProvider);
  });

  it('should create MockAIProvider for mock type', () => {
    const config: any = { id: '6', type: 'mock', label: 'Mock', enabled: true, model: 'mock' };
    const provider = AIProviderFactory.create(config);
    expect(provider).toBeInstanceOf(MockAIProvider);
  });

  it('should create MockAIProvider as default', () => {
    const config: any = { id: '7', type: 'unknown', label: 'Unknown', enabled: true, model: '?' };
    const provider = AIProviderFactory.create(config);
    expect(provider).toBeInstanceOf(MockAIProvider);
  });
});
