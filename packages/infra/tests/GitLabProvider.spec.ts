import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GitLabProvider } from '../src/GitLabProvider';
import { PRComment } from '../src/interfaces';

describe('GitLabProvider', () => {
  let provider: GitLabProvider;
  let mockHttpClient: any;
  const config = {
    baseUrl: 'https://gitlab.com',
    token: 'fake-token'
  };

  beforeEach(() => {
    mockHttpClient = {
      post: vi.fn(),
      get: vi.fn().mockResolvedValue({ data: {} })
    };
    provider = new GitLabProvider(config, mockHttpClient);
  });

  it('should fetch MR details and publish comments with position', async () => {
    const comments: PRComment[] = [
      { file: 'src/app.ts', line: 10, body: 'Fix this' }
    ];

    const mockMrDetails = {
      diff_refs: {
        base_sha: 'base123',
        head_sha: 'head123',
        start_sha: 'start123'
      }
    };

    mockHttpClient.get = vi.fn().mockResolvedValue({ data: mockMrDetails });
    mockHttpClient.post.mockResolvedValue({ data: { id: 'disc-1' } });

    await provider.publishComments('owner', 'repo', 123, comments);

    expect(mockHttpClient.get).toHaveBeenCalledWith(
      expect.stringContaining('projects/owner%2Frepo/merge_requests/123'),
      expect.any(Object)
    );

    expect(mockHttpClient.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: 'Fix this',
        position: expect.objectContaining({
          base_sha: 'base123',
          head_sha: 'head123',
          start_sha: 'start123',
          new_line: 10,
          new_path: 'src/app.ts',
          position_type: 'text'
        })
      }),
      expect.any(Object)
    );
  });

  it('should handle Basic Auth if credentials are provided', async () => {
    const basicAuthConfig = {
      baseUrl: 'https://gitlab.com',
      credentials: {
        username: 'user',
        password: 'pass'
      }
    };
    const basicAuthProvider = new GitLabProvider(basicAuthConfig, mockHttpClient);
    
    mockHttpClient.post.mockResolvedValue({ data: { id: 'disc-2' } });

    await basicAuthProvider.publishComments('owner', 'repo', 123, [{ file: 'f.ts', line: 1, body: 'b' }]);

    expect(mockHttpClient.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(Object),
      expect.objectContaining({
        headers: expect.objectContaining({
          'Authorization': expect.stringContaining('Basic')
        })
      })
    );
  });

  it('should throw error if API call fails', async () => {
    mockHttpClient.post.mockRejectedValue(new Error('Network Error'));

    await expect(provider.publishComments('o', 'r', 1, [{ file: 'f', line: 1, body: 'b' }]))
      .rejects.toThrow('[GitLab] Failed to publish comment: Network Error');
  });
});
