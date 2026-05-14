import { describe, it, expect, vi } from 'vitest';
import { SyncRepositoryUseCase } from '../../../../../src/application/use-cases/sync/SyncRepositoryUseCase';
import { RepositorySyncService } from '../../../../../src/application/services/sync/RepositorySyncService';

describe('SyncRepositoryUseCase', () => {
  it('should call service sync', async () => {
    const mockService = {
      sync: vi.fn().mockResolvedValue({ success: true })
    } as unknown as RepositorySyncService;
    const useCase = new SyncRepositoryUseCase(mockService);

    const input = { branch: 'main' } as any;
    await useCase.execute(input);

    expect(mockService.sync).toHaveBeenCalledWith(input);
  });
});
