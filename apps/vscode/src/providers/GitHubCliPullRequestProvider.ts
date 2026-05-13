import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

import {
    PullRequestInfo,
    PullRequestProvider
} from './PullRequestProviderType';

import { WorkspaceHelper }
    from '../helpers/WorkspaceHelper';
import { GitHubCliHelper } from '../helpers/GitHubCliHelper';

const execFileAsync =
    promisify(execFile);

export class GitHubCliPullRequestProvider
    implements PullRequestProvider {

    async listPullRequests(): Promise<PullRequestInfo[]> {

        const cwd =
            WorkspaceHelper.getWorkspacePath();

        const { stdout } =
            await execFileAsync(
                'gh',
                [
                    'pr',
                    'list',
                    '--json',
                    'number,title,headRefName,baseRefName,url'
                ],
                { cwd }
            );

        const prs =
            JSON.parse(stdout);

        return prs.map((pr: any) => ({
            id: String(pr.number),
            number: pr.number,
            title: pr.title,
            sourceBranch: pr.headRefName,
            targetBranch: pr.baseRefName,
            url: pr.url,
            provider: 'github-cli'
        }));
    }

    async getPullRequestDiff(
        pr: PullRequestInfo
    ): Promise<string> {

        const cwd =
            WorkspaceHelper.getWorkspacePath();

        const { stdout } =
            await execFileAsync(
                'gh',
                [
                    'pr',
                    'diff',
                    String(pr.number)
                ],
                {
                    cwd,
                    maxBuffer:
                        1024 * 1024 * 20
                }
            );

        return stdout;
    }

    async configure(): Promise<void> {
        // gh usa autenticação própria via terminal.
    }

    async validate(): Promise<void> {
        if (!(await GitHubCliHelper.isInstalled())) {
            throw new Error(
                'GitHub CLI (gh) not installed. Install it and run: gh auth login'
            );
        }

        if (!(await GitHubCliHelper.isAuthenticated())) {
            throw new Error(
                'GitHub CLI not authenticated. Run: gh auth login'
            );
        }
    }
}