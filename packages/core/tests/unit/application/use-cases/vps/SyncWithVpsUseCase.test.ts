import { describe, expect, it, vi } from 'vitest';
import { SyncWithVpsUseCase } from '../../../../../src/application/use-cases/vps/SyncWithVpsUseCase';
import { VpsSyncService } from '../../../../../src/application/services/vps/VpsSyncService';

describe('SyncWithVpsUseCase', () => {
  it('should call syncService.syncSession', async () => {
    const mockService = {
      syncSession: vi.fn().mockResolvedValue(undefined)
    } as unknown as VpsSyncService;

    const useCase = new SyncWithVpsUseCase(mockService);
    await useCase.execute('main');

    expect(mockService.syncSession).toHaveBeenCalledWith('main');
  });
});
