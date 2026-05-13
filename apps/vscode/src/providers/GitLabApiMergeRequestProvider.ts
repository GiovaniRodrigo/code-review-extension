import * as vscode from 'vscode';

import {
    PullRequestInfo,
    PullRequestProvider
} from './PullRequestProviderType';

export class GitLabApiMergeRequestProvider
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
                'codeReview.gitlab.token'
            );

        if (!token) {
            token =
                await vscode.window.showInputBox({
                    prompt: 'GitLab Personal Access Token',
                    password: true,
                    ignoreFocusOut: true
                });

            if (!token) {
                throw new Error('GitLab token is required.');
            }

            await this.context.secrets.store(
                'codeReview.gitlab.token',
                token
            );
        }

        const config =
            vscode.workspace.getConfiguration('codeReview.gitlab');

        let baseUrl =
            config.get<string>('baseUrl');

        if (!baseUrl) {
            baseUrl =
                await vscode.window.showInputBox({
                    prompt: 'GitLab Base URL',
                    value: 'https://gitlab.com'
                });

            if (!baseUrl) {
                throw new Error('GitLab Base URL is required.');
            }

            await config.update(
                'baseUrl',
                baseUrl,
                vscode.ConfigurationTarget.Global
            );
        }

        let projectId =
            config.get<string>('projectId');

        if (!projectId) {
            projectId =
                await vscode.window.showInputBox({
                    prompt: 'GitLab Project ID'
                });

            if (!projectId) {
                throw new Error('GitLab Project ID is required.');
            }

            await config.update(
                'projectId',
                projectId,
                vscode.ConfigurationTarget.Global
            );
        }
    }
}