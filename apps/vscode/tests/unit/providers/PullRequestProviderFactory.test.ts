import { describe, expect, it } from 'vitest';
import { PullRequestProviderFactory } from '../../../src/providers/PullRequestProviderFactory';
import { GitHubCliPullRequestProvider } from '../../../src/providers/GitHubCliPullRequestProvider';
import { GitHubApiPullRequestProvider } from '../../../src/providers/GitHubApiPullRequestProvider';
import { GitLabApiMergeRequestProvider } from '../../../src/providers/GitLabApiMergeRequestProvider';
import { UrlPullRequestProvider } from '../../../src/providers/UrlPullRequestProvider';

describe('PullRequestProviderFactory', () => {
  const mockDeps = {
    context: {}
  } as any;

  it('should create github-cli provider', () => {
    const provider = PullRequestProviderFactory.create('github-cli', mockDeps);
    expect(provider).toBeInstanceOf(GitHubCliPullRequestProvider);
  });

  it('should create github-api provider', () => {
    const provider = PullRequestProviderFactory.create('github-api', mockDeps);
    expect(provider).toBeInstanceOf(GitHubApiPullRequestProvider);
  });

  it('should create gitlab-api provider', () => {
    const provider = PullRequestProviderFactory.create('gitlab-api', mockDeps);
    expect(provider).toBeInstanceOf(GitLabApiMergeRequestProvider);
  });

  it('should create url provider as default', () => {
    const provider = PullRequestProviderFactory.create('url' as any, mockDeps);
    expect(provider).toBeInstanceOf(UrlPullRequestProvider);
  });
});
