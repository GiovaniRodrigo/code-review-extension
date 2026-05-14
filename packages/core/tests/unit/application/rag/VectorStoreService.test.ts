import { describe, it, expect, vi } from 'vitest';
import { VectorStoreService } from '../../../../src/application/rag/VectorStoreService';

describe('VectorStoreService', () => {
  it('should delegate to vector store port', async () => {
    const mockStore = {
        insert: vi.fn(),
        clear: vi.fn(),
        similaritySearch: vi.fn().mockResolvedValue([])
    };
    const service = new VectorStoreService(mockStore as any);
    
    await service.insert({ id: '1' } as any);
    expect(mockStore.insert).toHaveBeenCalled();
    
    await service.clear();
    expect(mockStore.clear).toHaveBeenCalled();
    
    await service.search([0.1], 5);
    expect(mockStore.similaritySearch).toHaveBeenCalledWith([0.1], 5);
  });
});
