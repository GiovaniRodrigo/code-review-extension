import { describe, expect, it, vi } from 'vitest';
import { DeleteCodeReviewUseCase } from '../../../../../src/application/use-cases/review/DeleteCodeReviewUseCase';
import { CodeReviewRepositoryPort } from '../../../../../src/ports/review/CodeReviewRepositoryPort';

describe('DeleteCodeReviewUseCase', () => {
  it('deve deletar uma sessão se ela existir', async () => {
    const repository = { 
      getSessionByBranch: vi.fn(),
      deleteSession: vi.fn() 
    } as unknown as CodeReviewRepositoryPort;
    const useCase = new DeleteCodeReviewUseCase(repository);
    const branch = 'feat/test';
    const mockSession = { id: 'session-id' };
    vi.mocked(repository.getSessionByBranch).mockResolvedValue(mockSession as any);

    await useCase.execute(branch);

    expect(repository.getSessionByBranch).toHaveBeenCalledWith(branch);
    expect(repository.deleteSession).toHaveBeenCalledWith('session-id');
  });

  it('não deve chamar deleteSession se a sessão não existir', async () => {
    const repository = { 
      getSessionByBranch: vi.fn(),
      deleteSession: vi.fn() 
    } as unknown as CodeReviewRepositoryPort;
    const useCase = new DeleteCodeReviewUseCase(repository);
    const branch = 'feat/test';
    vi.mocked(repository.getSessionByBranch).mockResolvedValue(null);

    await useCase.execute(branch);

    expect(repository.getSessionByBranch).toHaveBeenCalledWith(branch);
    expect(repository.deleteSession).not.toHaveBeenCalled();
  });
});
