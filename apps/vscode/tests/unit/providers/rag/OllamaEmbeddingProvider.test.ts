import { describe, expect, it, vi, beforeEach } from 'vitest';
import { OllamaEmbeddingProvider } from '../../../../src/services/rag/providers/OllamaEmbeddingProvider';

describe('OllamaEmbeddingProvider', () => {
  let provider: OllamaEmbeddingProvider;

  beforeEach(() => {
    vi.clearAllMocks();
    provider = new OllamaEmbeddingProvider();
    // @ts-ignore
    global.fetch = vi.fn();
  });

  it('should create provider', () => {
    expect(provider).toBeDefined();
  });

  it('should generate embedding successfully', async () => {
    const mockEmbedding = [0.1, 0.2, 0.3];
    vi.mocked(fetch).mockResolvedValue({
        json: vi.fn().mockResolvedValue({ embedding: mockEmbedding })
    } as any);

    const result = await provider.generateEmbedding('test text');

    expect(fetch).toHaveBeenCalledWith(
        'http://localhost:11434/api/embeddings',
        expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('test text')
        })
    );
    expect(result).toEqual(mockEmbedding);
  });

  it('should handle fetch error', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('connection failed'));

    await expect(provider.generateEmbedding('test')).rejects.toThrow('connection failed');
  });
});
