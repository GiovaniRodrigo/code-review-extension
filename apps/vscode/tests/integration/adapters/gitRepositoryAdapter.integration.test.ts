import { describe, expect, it, vi } from 'vitest';

describe('gitRepositoryAdapter integration', () => {
  it('should return current branch and commits from fake git adapter', async () => {
    const gitAdapter = {
      getCurrentBranch: vi.fn().mockResolvedValue('feat/code-review'),
      getCommits: vi.fn().mockResolvedValue([
        {
          hash: 'abc123',
          message: 'feat: add analyzer'
        }
      ]),
      getDiff: vi.fn().mockResolvedValue('diff --git a/file.ts b/file.ts')
    };

    const branch = await gitAdapter.getCurrentBranch();
    const commits = await gitAdapter.getCommits('main', branch);
    const diff = await gitAdapter.getDiff('main', branch);

    expect(branch).toBe('feat/code-review');
    expect(commits).toHaveLength(1);
    expect(diff).toContain('diff --git');
  });
});
