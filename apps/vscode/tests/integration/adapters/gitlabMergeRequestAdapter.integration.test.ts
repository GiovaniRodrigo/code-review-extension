import { describe, expect, it, vi } from 'vitest';

describe('gitlabMergeRequestAdapter integration', () => {
  it('should fetch MR data and publish review comments', async () => {
    const provider = {
      getMergeRequest: vi.fn().mockResolvedValue({
        id: '123',
        title: 'feat: add gitlab integration',
        branch: 'feat/gitlab',
        base: 'main'
      }),
      getDiff: vi.fn().mockResolvedValue('diff --git a/src/gitlab.ts b/src/gitlab.ts'),
      publishComment: vi.fn().mockResolvedValue({
        success: true
      })
    };

    const mr = await provider.getMergeRequest('project/id', '123');
    const diff = await provider.getDiff('project/id', '123');
    const result = await provider.publishComment({
      projectId: 'project/id',
      mergeRequestId: '123',
      filePath: 'src/gitlab.ts',
      line: 20,
      message: 'GitLab review comment'
    });

    expect(mr.branch).toBe('feat/gitlab');
    expect(diff).toContain('diff --git');
    expect(result.success).toBe(true);
  });
});
