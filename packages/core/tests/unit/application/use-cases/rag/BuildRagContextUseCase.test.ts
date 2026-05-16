import { describe, expect, it, vi } from 'vitest';
import { BuildRagContextUseCase } from '../../../../../src/application/use-cases/rag/BuildRagContextUseCase';
import { SearchContextService } from '../../../../../src/application/rag/SearchContextService';

describe('BuildRagContextUseCase', () => {
  it('should call searchService.build', async () => {
    const mockService = {
      build: vi.fn().mockResolvedValue([])
    } as any;

    const useCase = new BuildRagContextUseCase(mockService);
    await useCase.execute('query');

    expect(mockService.build).toHaveBeenCalledWith('query');
  });
});
