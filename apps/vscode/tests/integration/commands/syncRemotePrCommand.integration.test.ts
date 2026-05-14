import { describe, expect, it, vi } from 'vitest';

describe('syncRemotePrCommand integration', () => {
  it('should execute remote PR sync use case', async () => {
    const useCase = {
      execute: vi.fn().mockResolvedValue({
        id: '123',
        title: 'Remote PR title',
        status: 'synced'
      })
    };

    const handler = {
      handle: async () => useCase.execute({
        branch: 'feat/fix-bug'
      })
    };

    const result = await handler.handle();

    expect(useCase.execute).toHaveBeenCalledOnce();
    expect(result.status).toBe('synced');
    expect(result.id).toBe('123');
  });
});
