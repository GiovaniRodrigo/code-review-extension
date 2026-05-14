import { describe, expect, it, vi, beforeEach } from 'vitest';
import axios from 'axios';
import { UrlPullRequestProvider } from '../../../src/providers/UrlPullRequestProvider';
import { UIHelper } from '../../../src/helpers/UIHelper';

vi.mock('../../../src/helpers/UIHelper');
vi.mock('axios');

describe('UrlPullRequestProvider', () => {
  let provider: UrlPullRequestProvider;

  beforeEach(() => {
    vi.clearAllMocks();
    provider = new UrlPullRequestProvider();
  });

  it('should configure with a valid URL', async () => {
    const url = 'https://github.com/org/repo/pull/123';
    vi.mocked(UIHelper.showInputBox).mockResolvedValue(url);

    await provider.configure();

    const prs = await provider.listPullRequests();
    expect(prs).toHaveLength(1);
    expect(prs[0].url).toBe(url);
    expect(prs[0].number).toBe('123');
  });

  it('should throw error if configure is cancelled', async () => {
    vi.mocked(UIHelper.showInputBox).mockResolvedValue(undefined);
    await expect(provider.configure()).rejects.toThrow('PR/MR URL is required.');
  });

  it('should validate successfully for github/gitlab URLs', async () => {
    vi.mocked(UIHelper.showInputBox).mockResolvedValue('https://github.com/org/repo/pull/123');
    await provider.configure();
    await expect(provider.validate()).resolves.toBeUndefined();

    vi.mocked(UIHelper.showInputBox).mockResolvedValue('https://gitlab.com/org/repo/merge_requests/456');
    await provider.configure();
    await expect(provider.validate()).resolves.toBeUndefined();
  });

  it('should throw error if URL is not github or gitlab', async () => {
    vi.mocked(UIHelper.showInputBox).mockResolvedValue('https://other.com/pr/123');
    await provider.configure();
    await expect(provider.validate()).rejects.toThrow('Only GitHub and GitLab URLs are supported.');
  });

  it('should fetch diff using axios', async () => {
    const url = 'https://github.com/org/repo/pull/123';
    vi.mocked(UIHelper.showInputBox).mockResolvedValue(url);
    await provider.configure();

    vi.mocked(axios.get).mockResolvedValue({ data: 'diff content' });

    const diff = await provider.getPullRequestDiff({ url } as any);

    expect(axios.get).toHaveBeenCalledWith(`${url}.diff`, expect.any(Object));
    expect(diff).toBe('diff content');
  });
});
