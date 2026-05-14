import { describe, expect, it, vi, beforeEach } from 'vitest';
import { BuildEmbeddingService } from '../../../../src/services/rag/BuildEmbeddingService';

describe('RagEmbeddingService', () => {
  let service: BuildEmbeddingService;
  let mockProvider: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockProvider = { generateEmbedding: vi.fn() };
    service = new BuildEmbeddingService(mockProvider);
  });

  it('should create service', () => {
    expect(service).toBeDefined();
  });

  it('should execute happy path', async () => {
    mockProvider.generateEmbedding.mockResolvedValue([0.1, 0.2]);
    
    const result = await service.build('test content');

    expect(result).toEqual([0.1, 0.2]);
    expect(mockProvider.generateEmbedding).toHaveBeenCalledWith('test content');
  });

  it('should return empty result', async () => {
    mockProvider.generateEmbedding.mockResolvedValue([]);

    const result = await service.build('');

    expect(result).toEqual([]);
  });

  it('should throw on provider failure', async () => {
    mockProvider.generateEmbedding.mockRejectedValue(new Error('provider failed'));

    await expect(service.build('test')).rejects.toThrow('provider failed');
  });
});
