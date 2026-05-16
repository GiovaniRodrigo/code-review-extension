import { describe, expect, it, vi } from 'vitest';
import { CheckAccessUseCase } from '../../../../../src/application/use-cases/vps/CheckAccessUseCase';
import { AccessControlProviderPort } from '../../../../../src/ports/vps/AccessControlProviderPort';

describe('CheckAccessUseCase', () => {
  it('should call accessProvider.canAccess', async () => {
    const mockProvider = {
      canAccess: vi.fn().mockResolvedValue(true)
    } as any;

    const useCase = new CheckAccessUseCase(mockProvider);
    const result = await useCase.execute('resource');

    expect(mockProvider.canAccess).toHaveBeenCalledWith('resource');
    expect(result).toBe(true);
  });
});
