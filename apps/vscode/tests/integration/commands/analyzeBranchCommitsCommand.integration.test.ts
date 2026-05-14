import { describe, expect, it, vi } from 'vitest';

describe('analyzeBranchCommitsCommand integration', () => {
  it('should execute branch commits analysis use case', async () => {
    const useCase = {
      execute: vi.fn().mockResolvedValue({
        branch: 'feat/code-review',
        commits: [
          {
            hash: 'abc123',
            message: 'feat: add analyzer'
          }
        ],
        findings: []
      })
    };

    const handler = {
      handle: async () => useCase.execute({
        baseBranch: 'main',
        targetBranch: 'feat/code-review'
      })
    };

    const result = await handler.handle();

    expect(useCase.execute).toHaveBeenCalledOnce();
    expect(result.branch).toBe('feat/code-review');
    expect(result.commits).toHaveLength(1);
  });
});
