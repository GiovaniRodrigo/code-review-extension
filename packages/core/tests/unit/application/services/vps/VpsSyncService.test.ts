import { describe, expect, it, vi } from 'vitest';
import { VpsSyncService } from '../../../../../src/application/services/vps/VpsSyncService';

describe('VpsSyncService', () => {
  it('should sync local and remote sessions (newer local wins)', async () => {
    const localSession = { branch: 'main', updatedAt: new Date(2000, 1, 2), findings: [] };
    const remoteSession = { branch: 'main', updatedAt: new Date(2000, 1, 1), findings: [] };

    const mockRepo = {
      getSessionByBranch: vi.fn().mockResolvedValue(localSession),
      saveSession: vi.fn()
    } as any;
    const mockPort = {
      pullSession: vi.fn().mockResolvedValue(remoteSession),
      pushSession: vi.fn()
    } as any;

    const service = new VpsSyncService(mockPort, mockRepo);
    await service.syncSession('main');

    expect(mockPort.pushSession).toHaveBeenCalled();
  });

  it('should sync local and remote sessions (newer remote wins)', async () => {
    const localSession = { branch: 'main', updatedAt: new Date(2000, 1, 1), findings: [] };
    const remoteSession = { branch: 'main', updatedAt: new Date(2000, 1, 2), findings: [] };

    const mockRepo = {
      getSessionByBranch: vi.fn().mockResolvedValue(localSession),
      saveSession: vi.fn()
    } as any;
    const mockPort = {
      pullSession: vi.fn().mockResolvedValue(remoteSession),
      pushSession: vi.fn()
    } as any;

    const service = new VpsSyncService(mockPort, mockRepo);
    await service.syncSession('main');

    expect(mockRepo.saveSession).toHaveBeenCalled();
  });
});
