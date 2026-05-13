import * as vscode from 'vscode';

import {
    PullRequestInfo,
    PullRequestProvider
} from './PullRequestProviderType';

export class GitHubApiPullRequestProvider
    implements PullRequestProvider {

    constructor(
        private readonly context:
            vscode.ExtensionContext
    ) { }

    async listPullRequests():
        Promise<PullRequestInfo[]> {

        return [];
    }

    async getPullRequestDiff(
        pr: PullRequestInfo
    ): Promise<string> {

        return '';
    }

    async configure(): Promise<void> {
        let token =
            await this.context.secrets.get(
                'codeReview.github.token'
            );

        if (!token) {
            token =
                await vscode.window.showInputBox({
                    prompt: 'GitHub Personal Access Token',
                    password: true,
                    ignoreFocusOut: true
                });

            if (!token) {
                throw new Error('GitHub token is required.');
            }

            await this.context.secrets.store(
                'codeReview.github.token',
                token
            );
        }

        const config =
            vscode.workspace.getConfiguration('codeReview.github');

        let owner = config.get<string>('owner');

        if (!owner) {
            owner = await vscode.window.showInputBox({
                prompt: 'GitHub repository owner'
            });

            if (!owner) {
                throw new Error('GitHub owner is required.');
            }

            await config.update(
                'owner',
                owner,
                vscode.ConfigurationTarget.Global
            );
        }

        let repo = config.get<string>('repo');

        if (!repo) {
            repo = await vscode.window.showInputBox({
                prompt: 'GitHub repository name'
            });

            if (!repo) {
                throw new Error('GitHub repo is required.');
            }

            await config.update(
                'repo',
                repo,
                vscode.ConfigurationTarget.Global
            );
        }
    }
}