import { describe, expect, it, vi, beforeEach } from 'vitest';
import { GitHubCliPullRequestProvider } from '../../../src/providers/GitHubCliPullRequestProvider';
import { WorkspaceHelper } from '../../../src/helpers/WorkspaceHelper';
import { GitHubCliHelper } from '../../../src/helpers/GitHubCliHelper';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

vi.mock('../../../src/helpers/WorkspaceHelper');
vi.mock('../../../src/helpers/GitHubCliHelper');
vi.mock('node:child_process', () => ({
    execFile: Object.assign(vi.fn(), {
        [Symbol.for('nodejs.util.promisify.custom')]: vi.fn()
    })
}));

const mockExecFileAsync = (execFile as any)[Symbol.for('nodejs.util.promisify.custom')];

describe('GitHubCliPullRequestProvider', () => {
  let provider: GitHubCliPullRequestProvider;

  beforeEach(() => {
    vi.clearAllMocks();
    provider = new GitHubCliPullRequestProvider();
  });

  it('should create provider', () => {
    expect(provider).toBeDefined();
  });

  it('should list pull requests using gh cli', async () => {
    vi.mocked(WorkspaceHelper.getWorkspacePath).mockReturnValue('/fake/path');
    const mockPrs = [{ number: 1, title: 'PR 1', headRefName: 'feat/1', baseRefName: 'main', url: 'http://1' }];
    
    mockExecFileAsync.mockResolvedValue({ stdout: JSON.stringify(mockPrs), stderr: '' });

    const prs = await provider.listPullRequests();

    expect(prs).toHaveLength(1);
    expect(prs[0].id).toBe('1');
    expect(prs[0].sourceBranch).toBe('feat/1');
  });

  it('should get pull request diff using gh cli', async () => {
    vi.mocked(WorkspaceHelper.getWorkspacePath).mockReturnValue('/fake/path');
    const mockDiff = 'diff content';
    
    mockExecFileAsync.mockResolvedValue({ stdout: mockDiff, stderr: '' });

    const diff = await provider.getPullRequestDiff({ number: 1 } as any);

    expect(diff).toBe(mockDiff);
  });

  it('should validate successfully if gh is installed and authenticated', async () => {
    vi.mocked(GitHubCliHelper.isInstalled).mockResolvedValue(true);
    vi.mocked(GitHubCliHelper.isAuthenticated).mockResolvedValue(true);

    await expect(provider.validate()).resolves.toBeUndefined();
  });

  it('should throw error if gh is not installed', async () => {
    vi.mocked(GitHubCliHelper.isInstalled).mockResolvedValue(false);

    await expect(provider.validate()).rejects.toThrow('GitHub CLI (gh) not installed');
  });

  it('should throw error if gh is not authenticated', async () => {
    vi.mocked(GitHubCliHelper.isInstalled).mockResolvedValue(true);
    vi.mocked(GitHubCliHelper.isAuthenticated).mockResolvedValue(false);

    await expect(provider.validate()).rejects.toThrow('GitHub CLI not authenticated');
  });
});
