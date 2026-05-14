import { describe, expect, it, vi, beforeEach } from 'vitest';
import { SearchContextService } from '../../../../src/services/rag/SearchContextService';

describe('RagContextService', () => {
  let service: SearchContextService;
  let mockEmbeddings: any;
  let mockVectorStore: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockEmbeddings = { generateEmbedding: vi.fn() };
    mockVectorStore = { similaritySearch: vi.fn() };
    
    service = new SearchContextService(
      mockEmbeddings,
      mockVectorStore
    );
  });

  it('should create service', () => {
    expect(service).toBeDefined();
  });

  it('should execute happy path', async () => {
    mockEmbeddings.generateEmbedding.mockResolvedValue([0.1]);
    mockVectorStore.similaritySearch.mockResolvedValue([{ content: 'context' }]);

    const results = await service.search('query', 5);

    expect(results).toHaveLength(1);
    expect(mockEmbeddings.generateEmbedding).toHaveBeenCalledWith('query');
    expect(mockVectorStore.similaritySearch).toHaveBeenCalledWith([0.1], 5);
  });

  it('should return empty result', async () => {
    mockEmbeddings.generateEmbedding.mockResolvedValue([0.1]);
    mockVectorStore.similaritySearch.mockResolvedValue([]);

    const results = await service.search('query');

    expect(results).toEqual([]);
  });

  it('should throw on embedding failure', async () => {
    mockEmbeddings.generateEmbedding.mockRejectedValue(new Error('api fail'));

    await expect(service.search('query')).rejects.toThrow('api fail');
  });
});
