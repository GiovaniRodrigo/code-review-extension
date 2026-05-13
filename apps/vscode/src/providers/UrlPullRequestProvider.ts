import * as vscode from 'vscode';
import axios from 'axios';

import {
    PullRequestInfo,
    PullRequestProvider
} from './PullRequestProviderType';
import { UIHelper } from '../helpers/UIHelper';

export class UrlPullRequestProvider implements PullRequestProvider {
    private pr?: PullRequestInfo;

    async configure(): Promise<void> {
        const url = await UIHelper.showInputBox({
            prompt: 'Pull Request / Merge Request URL',
            placeHolder: 'https://github.com/org/repo/pull/123'
        });

        if (!url) {
            throw new Error('PR/MR URL is required.');
        }

        this.pr = this.createPullRequestInfo(url.trim());
    }

    async validate(): Promise<void> {
        if (!this.pr?.url) {
            throw new Error('PR/MR URL is required.');
        }

        if (
            !this.pr.url.includes('github.com') &&
            !this.pr.url.includes('gitlab.com')
        ) {
            throw new Error('Only GitHub and GitLab URLs are supported.');
        }
    }

    async listPullRequests(): Promise<PullRequestInfo[]> {
        return this.pr ? [this.pr] : [];
    }

    async getPullRequestDiff(pr: PullRequestInfo): Promise<string> {
        const diffUrl = this.buildDiffUrl(pr.url);

        const response = await axios.get(diffUrl, {
            responseType: 'text',
            headers: {
                Accept: 'text/plain'
            }
        });

        return response.data;
    }

    private createPullRequestInfo(url: string): PullRequestInfo {
        return {
            id: url,
            number: this.extractNumber(url),
            title: this.isGitLabUrl(url)
                ? 'External Merge Request'
                : 'External Pull Request',
            sourceBranch: 'unknown',
            targetBranch: 'unknown',
            url,
            provider: 'url'
        };
    }

    private buildDiffUrl(url: string): string {
        const normalizedUrl = url.replace(/\/$/, '');

        if (this.isGitHubUrl(normalizedUrl)) {
            return `${normalizedUrl}.diff`;
        }

        if (this.isGitLabUrl(normalizedUrl)) {
            return `${normalizedUrl}.diff`;
        }

        throw new Error('Unsupported PR/MR URL.');
    }

    private extractNumber(url: string): string {
        return (
            url.match(/\/pull\/(\d+)/)?.[1] ||
            url.match(/\/merge_requests\/(\d+)/)?.[1] ||
            'unknown'
        );
    }

    private isGitHubUrl(url: string): boolean {
        return url.includes('github.com');
    }

    private isGitLabUrl(url: string): boolean {
        return url.includes('gitlab.com');
    }
}