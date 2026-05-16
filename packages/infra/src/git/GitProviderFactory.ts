import { GitHubProvider } from '../GitHubProvider';
import { GitLabProvider, GitLabAuthConfig } from '../GitLabProvider';
import { GitProviderPort } from '@code-review/core';

export class GitProviderFactory {
  static createGitHub(token: string): GitProviderPort {
    return new GitHubProvider(token) as unknown as GitProviderPort;
  }

  static createGitLab(config: GitLabAuthConfig): GitProviderPort {
    return new GitLabProvider(config) as unknown as GitProviderPort;
  }
}
