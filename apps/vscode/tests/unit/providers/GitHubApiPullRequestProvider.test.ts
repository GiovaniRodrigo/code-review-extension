import { describe, expect, it, vi, beforeEach } from 'vitest';
import * as vscode from 'vscode';
import { GitHubApiPullRequestProvider } from '../../../src/providers/GitHubApiPullRequestProvider';
import { UIHelper } from '../../../src/helpers/UIHelper';

vi.mock('../../../src/helpers/UIHelper');

describe('GitHubApiPullRequestProvider', () => {
  let mockContext: vscode.ExtensionContext;
  let provider: GitHubApiPullRequestProvider;

  beforeEach(() => {
    vi.clearAllMocks();
    mockContext = {
      secrets: {
        get: vi.fn(),
        store: vi.fn()
      }
    } as any;
    provider = new GitHubApiPullRequestProvider(mockContext);
  });

  it('should create provider', () => {
    expect(provider).toBeDefined();
  });

  it('should list pull requests (empty for now)', async () => {
    const prs = await provider.listPullRequests();
    expect(prs).toEqual([]);
  });

  it('should get pull request diff (empty for now)', async () => {
    const diff = await provider.getPullRequestDiff({ id: '1' } as any);
    expect(diff).toBe('');
  });

  it('should get pull request by branch', async () => {
    vi.spyOn(provider, 'listPullRequests').mockResolvedValue([
        { id: '1', sourceBranch: 'feat/test' } as any
    ]);
    
    const pr = await provider.getPullRequestByBranch('feat/test');
    expect(pr?.id).toBe('1');
  });

  it('should configure successfully with existing token and config', async () => {
    vi.mocked(mockContext.secrets.get).mockResolvedValue('fake-token');
    
    const mockConfig = {
        get: vi.fn().mockReturnValue('fake-value'),
        update: vi.fn().mockResolvedValue(undefined)
    };
    vi.mocked(vscode.workspace.getConfiguration).mockReturnValue(mockConfig as any);

    await provider.configure();

    expect(mockContext.secrets.get).toHaveBeenCalledWith('codeReview.github.token');
    expect(mockConfig.get).toHaveBeenCalledWith('owner');
    expect(mockConfig.get).toHaveBeenCalledWith('repo');
  });

  it('should prompt for token and store it if missing', async () => {
    vi.mocked(mockContext.secrets.get).mockResolvedValue(undefined);
    vi.mocked(UIHelper.showInputBox).mockResolvedValue('new-token');
    
    const mockConfig = {
        get: vi.fn().mockReturnValue('fake-value'),
        update: vi.fn().mockResolvedValue(undefined)
    };
    vi.mocked(vscode.workspace.getConfiguration).mockReturnValue(mockConfig as any);

    await provider.configure();

    expect(UIHelper.showInputBox).toHaveBeenCalledWith(expect.objectContaining({ prompt: 'GitHub Personal Access Token' }));
    expect(mockContext.secrets.store).toHaveBeenCalledWith('codeReview.github.token', 'new-token');
  });

  it('should throw error if token prompt is cancelled', async () => {
    vi.mocked(mockContext.secrets.get).mockResolvedValue(undefined);
    vi.mocked(UIHelper.showInputBox).mockResolvedValue(undefined);

    await expect(provider.configure()).rejects.toThrow('GitHub token is required.');
  });
});
