import { describe, expect, it, vi } from 'vitest';
import { ClearRepositoryRagUseCase } from '../../../../../src/application/use-cases/rag/ClearRepositoryRagUseCase';
import { RagIndexingService } from '../../../../../src/application/services/rag/RagIndexingService';

describe('ClearRepositoryRagUseCase', () => {
  it('should call indexingService.clear', async () => {
    const mockService = {
      clear: vi.fn().mockResolvedValue(undefined)
    } as any;

    const useCase = new ClearRepositoryRagUseCase(mockService);
    await useCase.execute();

    expect(mockService.clear).toHaveBeenCalled();
  });
});
