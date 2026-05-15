import { describe, expect, it, vi } from 'vitest';
import { GetCodeReviewUseCase } from '../../../../../src/application/use-cases/review/GetCodeReviewUseCase';
import { CodeReviewService } from '../../../../../src/application/services/review/CodeReviewService';

describe('GetCodeReviewUseCase', () => {
  it('deve delegar a busca para o service', async () => {
    const service = { getByBranch: vi.fn() } as unknown as CodeReviewService;
    const useCase = new GetCodeReviewUseCase(service);
    const branch = 'feat/test';
    const mockSession = { branch };
    vi.mocked(service.getByBranch).mockResolvedValue(mockSession as any);

    const result = await useCase.execute(branch);

    expect(result).toBe(mockSession);
    expect(service.getByBranch).toHaveBeenCalledWith(branch);
  });
});
