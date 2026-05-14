import { describe, expect, it, vi, beforeEach } from 'vitest';
import { RepositoryIndexerService } from '../../../../src/services/rag/RepositoryIndexerService';

describe('RagIndexerService', () => {
  let service: RepositoryIndexerService;
  let mockChunker: any;
  let mockEmbeddings: any;
  let mockVectorStore: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockChunker = { chunkRepository: vi.fn() };
    mockEmbeddings = { build: vi.fn() };
    mockVectorStore = { insert: vi.fn() };
    
    service = new RepositoryIndexerService(
      mockChunker,
      mockEmbeddings,
      mockVectorStore
    );
  });

  it('should create service', () => {
    expect(service).toBeDefined();
  });

  it('should execute happy path', async () => {
    mockChunker.chunkRepository.mockResolvedValue([
      { id: '1', content: 'test', file: 'f.ts', language: 'ts', startLine: 1, endLine: 1 }
    ]);
    mockEmbeddings.build.mockResolvedValue([0.1]);
    mockVectorStore.insert.mockResolvedValue(undefined);

    await service.index();

    expect(mockChunker.chunkRepository).toHaveBeenCalled();
    expect(mockEmbeddings.build).toHaveBeenCalledWith('test');
    expect(mockVectorStore.insert).toHaveBeenCalledWith(expect.objectContaining({ id: '1' }));
  });

  it('should handle empty repository', async () => {
    mockChunker.chunkRepository.mockResolvedValue([]);

    await service.index();

    expect(mockEmbeddings.build).not.toHaveBeenCalled();
    expect(mockVectorStore.insert).not.toHaveBeenCalled();
  });

  it('should throw on chunker failure', async () => {
    mockChunker.chunkRepository.mockRejectedValue(new Error('chunk fail'));

    await expect(service.index()).rejects.toThrow('chunk fail');
  });
});
