import { describe, expect, it, vi } from 'vitest';
import { AuthenticateWithVpsUseCase } from '../../../../../src/application/use-cases/vps/AuthenticateWithVpsUseCase';
import { VpsSyncPort } from '../../../../../src/ports/vps/VpsSyncPort';

describe('AuthenticateWithVpsUseCase', () => {
  it('should call syncPort.authenticate', async () => {
    const mockPort = {
      authenticate: vi.fn().mockResolvedValue(undefined)
    } as unknown as VpsSyncPort;

    const useCase = new AuthenticateWithVpsUseCase(mockPort);
    await useCase.execute();

    expect(mockPort.authenticate).toHaveBeenCalled();
  });
});
