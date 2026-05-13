import * as vscode from 'vscode';
import { ICommandHandler } from '../contracts/ICommandHandler';
import { IExtensionDependencies } from '../contracts/IExtensionDependencies';
import { GitLabApiMergeRequestProvider } from '../providers/GitLabApiMergeRequestProvider';
import { UIHelper } from '../helpers/UIHelper';

export class SyncGitLabMRCommandHandler implements ICommandHandler {
    constructor(
        private readonly dependencies: IExtensionDependencies
    ) { }

    async execute(): Promise<void> {
        const { vscodeAdapter, reviewRepository, reviewViewProvider, context } = this.dependencies;

        try {
            const branch = await vscodeAdapter.getActiveBranch();
            
            reviewViewProvider.setLoading(`Searching for GitLab Merge Request for branch ${branch}...`);

            const provider = new GitLabApiMergeRequestProvider(context);
            
            // Ensure provider is configured
            const config = vscode.workspace.getConfiguration('codeReview.gitlab');
            if (!config.get('projectId')) {
                await provider.configure();
            }

            const mr = await provider.getPullRequestByBranch(branch);

            if (!mr) {
                vscode.window.showInformationMessage(`No open GitLab Merge Request found for branch ${branch}.`);
                reviewViewProvider.clear(`No MR found for ${branch}.`);
                return;
            }

            const confirm = await vscode.window.showInformationMessage(
                `Found Merge Request !${mr.number}: ${mr.title}. Sync with this session?`,
                { modal: false },
                'Sync'
            );

            if (confirm !== 'Sync') {
                reviewViewProvider.updateFindings(
                    reviewViewProvider.getCurrentSessionId() || 'none',
                    []
                );
                return;
            }

            // Get current session or create one
            let session = await reviewRepository.getSessionByBranch(branch);
            
            if (!session) {
                vscode.window.showWarningMessage('No active review session for this branch. Creating a new one.');
                session = {
                    id: Date.now().toString(),
                    branch,
                    findings: [],
                    comments: [],
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
            }

            // Extrair owner/repo do projectId para compatibilidade
            const projectId = config.get<string>('projectId') || '';
            let owner = 'project';
            let repo = projectId;

            if (projectId.includes('/')) {
                const parts = projectId.split('/');
                owner = parts[0];
                repo = parts.slice(1).join('/');
            }

            session.remote = {
                provider: 'gitlab',
                url: mr.url,
                number: mr.number,
                owner,
                repo
            };

            await reviewRepository.saveSession(session);

            reviewViewProvider.updateFindings(session.id, session.findings);
            
            vscode.window.showInformationMessage(`Session successfully synced with GitLab MR !${mr.number}.`);

        } catch (error: any) {
            const message = `Failed to sync with GitLab: ${error.message}`;
            reviewViewProvider.setError(message);
            vscode.window.showErrorMessage(message);
        }
    }
}
