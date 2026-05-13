import type { RepositorySyncFactoryPort } from '../../../../core/src/ports/sync/RepositorySyncFactoryPort';
import type { RepositorySyncPort } from '../../../../core/src/ports/sync/RepositorySyncPort';
import { BitbucketSyncProvider } from '../providers/BitbucketSyncProvider';
import { GitHubSyncProvider } from '../providers/GitHubSyncProvider';
import { GitLabSyncProvider } from '../providers/GitLabSyncProvider';
import { LocalGitSyncProvider } from '../providers/LocalGitSyncProvider';
import { SelfHostedGitSyncProvider } from '../providers/SelfHostedGitSyncProvider';

export class RepositorySyncProviderFactory implements RepositorySyncFactoryPort {
  create(provider: string): RepositorySyncPort {
    if (provider === 'github') return new GitHubSyncProvider();
    if (provider === 'gitlab') return new GitLabSyncProvider();
    if (provider === 'bitbucket') return new BitbucketSyncProvider();
    if (provider === 'self-hosted') return new SelfHostedGitSyncProvider();
    return new LocalGitSyncProvider();
  }
}
