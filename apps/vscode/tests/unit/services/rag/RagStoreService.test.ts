import { describe, expect, it, vi, beforeEach } from 'vitest';
import { VectorStoreService } from '../../../../src/services/rag/VectorStoreService';

describe('RagStoreService', () => {
  let service: VectorStoreService;
  let mockStore: any;

  beforeEach(() => {
    vi.clearAllMocks();
    mockStore = {
      insert: vi.fn(),
      clear: vi.fn(),
      similaritySearch: vi.fn()
    };
    service = new VectorStoreService(mockStore);
  });

  it('should create service', () => {
    expect(service).toBeDefined();
  });

  it('should execute happy path (insert)', async () => {
    mockStore.insert.mockResolvedValue(undefined);
    const chunk = { id: '1', embedding: [0.1], content: 'test', metadata: {} };
    
    await service.insert(chunk as any);

    expect(mockStore.insert).toHaveBeenCalledWith(chunk);
  });

  it('should return empty result (search)', async () => {
    mockStore.similaritySearch.mockResolvedValue([]);
    
    const results = await service.search([0.1], 5);

    expect(results).toEqual([]);
    expect(mockStore.similaritySearch).toHaveBeenCalledWith([0.1], 5);
  });

  it('should throw on store failure', async () => {
    mockStore.clear.mockRejectedValue(new Error('clear failed'));

    await expect(service.clear()).rejects.toThrow('clear failed');
  });
});
