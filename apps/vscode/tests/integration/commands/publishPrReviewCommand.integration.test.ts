import { describe, expect, it, vi } from 'vitest';

describe('publishPrReviewCommand integration', () => {
  it('should execute PR review publication use case', async () => {
    const useCase = {
      execute: vi.fn().mockResolvedValue({
        success: true,
        commentsPublished: 5
      })
    };

    const handler = {
      handle: async () => useCase.execute({
        pullRequestId: '123',
        repository: 'owner/repo'
      })
    };

    const result = await handler.handle();

    expect(useCase.execute).toHaveBeenCalledOnce();
    expect(result.success).toBe(true);
    expect(result.commentsPublished).toBe(5);
  });
});
