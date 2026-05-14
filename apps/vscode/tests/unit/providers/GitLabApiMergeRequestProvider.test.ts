import { describe, expect, it, vi, beforeEach } from 'vitest';
import * as vscode from 'vscode';
import axios from 'axios';
import { GitLabApiMergeRequestProvider } from '../../../src/providers/GitLabApiMergeRequestProvider';
import { UIHelper } from '../../../src/helpers/UIHelper';

vi.mock('../../../src/helpers/UIHelper');
vi.mock('axios');

describe('GitLabApiMergeRequestProvider', () => {
  let mockContext: vscode.ExtensionContext;
  let provider: GitLabApiMergeRequestProvider;

  beforeEach(() => {
    vi.clearAllMocks();
    mockContext = {
      secrets: {
        get: vi.fn(),
        store: vi.fn()
      }
    } as any;
    provider = new GitLabApiMergeRequestProvider(mockContext);
  });

  it('should create provider', () => {
    expect(provider).toBeDefined();
  });

  it('should list merge requests', async () => {
    const mockConfig = {
        get: vi.fn().mockReturnValue('123'),
        update: vi.fn()
    };
    vi.mocked(vscode.workspace.getConfiguration).mockReturnValue(mockConfig as any);
    vi.mocked(mockContext.secrets.get).mockResolvedValue('fake-token');
    
    const mockMrs = [{ id: 1, iid: 101, title: 'MR 1', source_branch: 'feat/1', target_branch: 'main', web_url: 'http://1' }];
    vi.mocked(axios.get).mockResolvedValue({ data: mockMrs });

    const mrs = await provider.listPullRequests();

    expect(mrs).toHaveLength(1);
    expect(mrs[0].id).toBe('1');
    expect(mrs[0].number).toBe(101);
  });

  it('should get merge request diff', async () => {
    const mockConfig = {
        get: vi.fn().mockReturnValue('123'),
        update: vi.fn()
    };
    vi.mocked(vscode.workspace.getConfiguration).mockReturnValue(mockConfig as any);
    vi.mocked(mockContext.secrets.get).mockResolvedValue('fake-token');
    
    const mockDiff = 'diff content';
    vi.mocked(axios.get).mockResolvedValue({ data: mockDiff });

    const diff = await provider.getPullRequestDiff({ number: 101 } as any);

    expect(diff).toBe(mockDiff);
  });

  it('should throw error if projectId is missing when listing', async () => {
    const mockConfig = {
        get: vi.fn().mockReturnValue(undefined)
    };
    vi.mocked(vscode.workspace.getConfiguration).mockReturnValue(mockConfig as any);

    await expect(provider.listPullRequests()).rejects.toThrow('GitLab Project ID is required');
  });

  it('should handle authentication via token', async () => {
    const mockConfig = { get: vi.fn().mockReturnValue('123') };
    vi.mocked(vscode.workspace.getConfiguration).mockReturnValue(mockConfig as any);
    vi.mocked(mockContext.secrets.get).mockResolvedValue('fake-token');
    vi.mocked(axios.get).mockResolvedValue({ data: [] });

    await provider.listPullRequests();

    expect(axios.get).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ headers: { 'PRIVATE-TOKEN': 'fake-token' } })
    );
  });
});
