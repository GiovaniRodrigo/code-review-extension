import { describe, expect, it, vi } from 'vitest';
import { IndexRepositoryRagUseCase } from '../../../../../src/application/use-cases/rag/IndexRepositoryRagUseCase';
import { RagIndexingService } from '../../../../../src/application/services/rag/RagIndexingService';

describe('IndexRepositoryRagUseCase', () => {
  it('should call indexingService.indexRepository', async () => {
    const mockService = {
      indexRepository: vi.fn().mockResolvedValue(undefined)
    } as unknown as RagIndexingService;

    const useCase = new IndexRepositoryRagUseCase(mockService);
    await useCase.execute();

    expect(mockService.indexRepository).toHaveBeenCalled();
  });
});
