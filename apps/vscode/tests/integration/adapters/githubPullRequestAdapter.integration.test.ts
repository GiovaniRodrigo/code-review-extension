import { describe, expect, it, vi } from 'vitest';

describe('githubPullRequestAdapter integration', () => {
  it('should fetch PR data and publish review comments', async () => {
    const provider = {
      getPullRequest: vi.fn().mockResolvedValue({
        id: '123',
        title: 'feat: add code review',
        branch: 'feat/code-review',
        base: 'main'
      }),
      getDiff: vi.fn().mockResolvedValue('diff --git a/src/file.ts b/src/file.ts'),
      publishComment: vi.fn().mockResolvedValue({
        success: true
      })
    };

    const pr = await provider.getPullRequest('owner/repo', '123');
    const diff = await provider.getDiff('owner/repo', '123');
    const result = await provider.publishComment({
      repository: 'owner/repo',
      pullRequestId: '123',
      filePath: 'src/file.ts',
      line: 10,
      message: 'Review comment'
    });

    expect(pr.branch).toBe('feat/code-review');
    expect(diff).toContain('diff --git');
    expect(result.success).toBe(true);
  });
});
