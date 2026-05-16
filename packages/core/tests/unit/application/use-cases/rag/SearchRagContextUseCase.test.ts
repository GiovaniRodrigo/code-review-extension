import { describe, expect, it, vi } from 'vitest';
import { SearchRagContextUseCase } from '../../../../../src/application/use-cases/rag/SearchRagContextUseCase';
import { SearchContextService } from '../../../../../src/application/rag/SearchContextService';

describe('SearchRagContextUseCase', () => {
  it('should call searchService.build', async () => {
    const mockService = {
      build: vi.fn().mockResolvedValue([])
    } as any;

    const useCase = new SearchRagContextUseCase(mockService);
    await useCase.execute('query');

    expect(mockService.build).toHaveBeenCalledWith('query');
  });
});
