import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GitHubProvider } from '../src/GitHubProvider';
import { PRComment } from '../src/interfaces';

describe('GitHubProvider', () => {
  let provider: GitHubProvider;
  let mockHttpClient: any;
  const token = 'fake-token';

  beforeEach(() => {
    mockHttpClient = {
      post: vi.fn(),
      get: vi.fn().mockResolvedValue({ data: {} })
    };
    provider = new GitHubProvider(token, mockHttpClient);
  });

  it('should fetch PR details and publish comments with position', async () => {
    const comments: PRComment[] = [
      { file: 'src/app.ts', line: 10, body: 'Fix this' }
    ];

    const mockPrDetails = {
      head: {
        sha: 'head123'
      }
    };

    mockHttpClient.get.mockResolvedValue({ data: mockPrDetails });
    mockHttpClient.post.mockResolvedValue({ data: { id: 'comment-1' } });

    await provider.publishComments('owner', 'repo', 123, comments);

    expect(mockHttpClient.get).toHaveBeenCalledWith(
      expect.stringContaining('repos/owner/repo/pulls/123'),
      expect.any(Object)
    );

    expect(mockHttpClient.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: 'Fix this',
        commit_id: 'head123',
        path: 'src/app.ts',
        line: 10,
        side: 'RIGHT'
      }),
      expect.any(Object)
    );
  });

  it('should throw error if API call fails', async () => {
    mockHttpClient.post.mockRejectedValue(new Error('GitHub Error'));

    await expect(provider.publishComments('o', 'r', 1, [{ file: 'f', line: 1, body: 'b' }]))
      .rejects.toThrow('[GitHub] Failed to publish comment: GitHub Error');
  });
});
