import * as vscode from 'vscode';
import { GitHubProvider, GitLabProvider, GitProvider } from '@code-review/infra';

export class GitProviderFactory {
    static async create(
        type: 'github' | 'gitlab',
        context: vscode.ExtensionContext
    ): Promise<GitProvider> {
        if (type === 'github') {
            const token = await context.secrets.get('codeReview.github.token');
            if (!token) {
                throw new Error('GitHub token not configured.');
            }
            return new GitHubProvider(token);
        }

        const config = vscode.workspace.getConfiguration('codeReview.gitlab');
        const baseUrl = config.get<string>('baseUrl') || 'https://gitlab.com';
        
        const token = await context.secrets.get('codeReview.gitlab.token');
        if (token) {
            return new GitLabProvider({ baseUrl, token });
        }

        const username = await context.secrets.get('codeReview.gitlab.username');
        const password = await context.secrets.get('codeReview.gitlab.password');

        if (username && password) {
            return new GitLabProvider({
                baseUrl,
                credentials: { username, password }
            });
        }

        throw new Error('GitLab credentials not configured.');
    }
}
