import { describe, it, expect, vi } from 'vitest';
import { OllamaEmbeddingProvider } from '../../../../src/rag/providers/OllamaEmbeddingProvider';
import { OpenAIEmbeddingProvider } from '../../../../src/rag/providers/OpenAIEmbeddingProvider';

describe('RAG Embedding Providers Smoke Tests', () => {
  it('OllamaEmbeddingProvider should generate embedding', async () => {
    const provider = new OllamaEmbeddingProvider();
    global.fetch = vi.fn().mockResolvedValue({
        json: () => Promise.resolve({ embedding: [0.1] })
    });
    const result = await provider.generateEmbedding('test');
    expect(result).toEqual([0.1]);
  });

  it('OpenAIEmbeddingProvider should handle missing key', async () => {
    const mockSecrets = { get: vi.fn().mockResolvedValue(undefined) };
    const provider = new OpenAIEmbeddingProvider(mockSecrets as any);
    await expect(provider.generateEmbedding('test')).rejects.toThrow('OpenAI API key não configurada.');
  });

  it('OpenAIEmbeddingProvider should be instantiable with secrets', () => {
    const mockSecrets = { get: vi.fn() };
    const provider = new OpenAIEmbeddingProvider(mockSecrets as any);
    expect(provider).toBeDefined();
  });
});
