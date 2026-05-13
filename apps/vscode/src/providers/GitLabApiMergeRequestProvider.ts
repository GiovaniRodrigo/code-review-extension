import * as vscode from 'vscode';
import axios from 'axios';

import {
    PullRequestInfo,
    PullRequestProvider
} from './PullRequestProviderType';
import { UIHelper } from '../helpers/UIHelper';

export class GitLabApiMergeRequestProvider
    implements PullRequestProvider {

    constructor(
        private readonly context:
            vscode.ExtensionContext
    ) { }

    async listPullRequests(): Promise<PullRequestInfo[]> {
        const config = vscode.workspace.getConfiguration('codeReview.gitlab');
        const baseUrl = config.get<string>('baseUrl') || 'https://gitlab.com';
        const projectId = config.get<string>('projectId');

        if (!projectId) {
            throw new Error('GitLab Project ID is required to list Merge Requests.');
        }

        const headers = await this._getHeaders();
        const url = `${baseUrl}/api/v4/projects/${encodeURIComponent(projectId)}/merge_requests?state=opened`;

        const response = await axios.get(url, { headers });
        const mrs = response.data;

        return mrs.map((mr: any) => ({
            id: String(mr.id),
            number: mr.iid,
            title: mr.title,
            sourceBranch: mr.source_branch,
            targetBranch: mr.target_branch,
            url: mr.web_url,
            provider: 'gitlab-api'
        }));
    }

    async getPullRequestDiff(
        pr: PullRequestInfo
    ): Promise<string> {
        const config = vscode.workspace.getConfiguration('codeReview.gitlab');
        const baseUrl = config.get<string>('baseUrl') || 'https://gitlab.com';
        const projectId = config.get<string>('projectId');

        if (!projectId) {
            throw new Error('GitLab Project ID is required to get the diff.');
        }

        const headers = await this._getHeaders();
        const url = `${baseUrl}/api/v4/projects/${encodeURIComponent(projectId)}/merge_requests/${pr.number}.diff`;

        const response = await axios.get(url, { 
            headers, 
            responseType: 'text' 
        });

        return response.data;
    }

    async getPullRequestByBranch(
        branch: string
    ): Promise<PullRequestInfo | undefined> {
        const config = vscode.workspace.getConfiguration('codeReview.gitlab');
        const baseUrl = config.get<string>('baseUrl') || 'https://gitlab.com';
        const projectId = config.get<string>('projectId');

        if (!projectId) {
            throw new Error('GitLab Project ID is required to search for Merge Requests.');
        }

        const headers = await this._getHeaders();
        const url = `${baseUrl}/api/v4/projects/${encodeURIComponent(projectId)}/merge_requests?state=opened&source_branch=${encodeURIComponent(branch)}`;

        const response = await axios.get(url, { headers });
        const mrs = response.data;

        if (!mrs || mrs.length === 0) {
            return undefined;
        }

        const mr = mrs[0];

        return {
            id: String(mr.id),
            number: mr.iid,
            title: mr.title,
            sourceBranch: mr.source_branch,
            targetBranch: mr.target_branch,
            url: mr.web_url,
            provider: 'gitlab-api'
        };
    }

    private async _getHeaders(): Promise<Record<string, string>> {
        const token = await this.context.secrets.get('codeReview.gitlab.token');
        if (token) {
            return { 'PRIVATE-TOKEN': token };
        }

        const username = await this.context.secrets.get('codeReview.gitlab.username');
        const password = await this.context.secrets.get('codeReview.gitlab.password');

        if (username && password) {
            const auth = Buffer.from(`${username}:${password}`).toString('base64');
            return { 'Authorization': `Basic ${auth}` };
        }

        throw new Error('No GitLab credentials found. Please configure GitLab settings first.');
    }

    async configure(): Promise<void> {
        const config =
            vscode.workspace.getConfiguration('codeReview.gitlab');

        const authMode = await UIHelper.showQuickPick(
            [
                { label: 'Personal Access Token', value: 'token' },
                { label: 'Login e Senha', value: 'credentials' }
            ],
            { title: 'Selecione o modo de autenticação para GitLab' }
        );

        if (!authMode) {
            return;
        }

        if (authMode.value === 'token') {
            let token = await this.context.secrets.get('codeReview.gitlab.token');

            if (!token) {
                token = await UIHelper.showInputBox({
                    prompt: 'GitLab Personal Access Token',
                    password: true
                });

                if (!token) {
                    throw new Error('GitLab token is required.');
                }

                await this.context.secrets.store('codeReview.gitlab.token', token);
            }
        } else {
            let username = await this.context.secrets.get('codeReview.gitlab.username');
            let password = await this.context.secrets.get('codeReview.gitlab.password');

            if (!username) {
                username = await UIHelper.showInputBox({
                    prompt: 'GitLab Username'
                });

                if (!username) {
                    throw new Error('GitLab username is required.');
                }

                await this.context.secrets.store('codeReview.gitlab.username', username);
            }

            if (!password) {
                password = await UIHelper.showInputBox({
                    prompt: 'GitLab Password',
                    password: true
                });

                if (!password) {
                    throw new Error('GitLab password is required.');
                }

                await this.context.secrets.store('codeReview.gitlab.password', password);
            }
        }

        let baseUrl = config.get<string>('baseUrl');

        if (!baseUrl) {
            baseUrl =
                await UIHelper.showInputBox({
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
                await UIHelper.showInputBox({
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