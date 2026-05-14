import { describe, it, expect, vi } from 'vitest';
import { BuildEmbeddingService } from '../../../../src/application/rag/BuildEmbeddingService';

describe('BuildEmbeddingService', () => {
  it('should instantiate', () => {
    const mockProvider = { generateEmbedding: vi.fn() };
    const service = new BuildEmbeddingService(mockProvider as any);
    expect(service).toBeDefined();
  });
});
