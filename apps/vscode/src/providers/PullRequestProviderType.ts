export type PullRequestProviderType =
    | 'url'
    | 'github-cli'
    | 'github-api'
    | 'gitlab-api';

export interface PullRequestInfo {
    id: string;
    number: number | string;
    title: string;
    sourceBranch: string;
    targetBranch: string;
    url: string;
    provider: PullRequestProviderType;
}

export interface PullRequestProvider {
    configure?(): Promise<void>;
    validate?(): Promise<void>;

    listPullRequests(): Promise<PullRequestInfo[]>;

    getPullRequestDiff(
        pr: PullRequestInfo
    ): Promise<string>;

    getPullRequestByBranch?(
        branch: string
    ): Promise<PullRequestInfo | undefined>;
}