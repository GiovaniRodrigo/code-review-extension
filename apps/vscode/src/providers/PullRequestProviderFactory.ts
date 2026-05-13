import { IExtensionDependencies }
    from '../contracts/IExtensionDependencies';

import {
    PullRequestProvider,
    PullRequestProviderType
} from '../providers/PullRequestProviderType';

import { GitHubCliPullRequestProvider }
    from '../providers/GitHubCliPullRequestProvider';

import { GitHubApiPullRequestProvider }
    from '../providers/GitHubApiPullRequestProvider';

import { GitLabApiMergeRequestProvider }
    from '../providers/GitLabApiMergeRequestProvider';

import { UrlPullRequestProvider }
    from '../providers/UrlPullRequestProvider';

export class PullRequestProviderFactory {

    static create(
        type: PullRequestProviderType,
        dependencies: IExtensionDependencies
    ): PullRequestProvider {

        if (type === 'github-cli') {
            return new GitHubCliPullRequestProvider();
        }

        if (type === 'github-api') {
            return new GitHubApiPullRequestProvider(
                dependencies.context
            );
        }

        if (type === 'gitlab-api') {
            return new GitLabApiMergeRequestProvider(
                dependencies.context
            );
        }

        return new UrlPullRequestProvider();
    }
}