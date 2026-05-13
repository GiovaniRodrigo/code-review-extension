import * as vscode from 'vscode';
import { ICommandHandler } from '../contracts/ICommandHandler';
import { IExtensionDependencies } from '../contracts/IExtensionDependencies';
import { PullRequestProviderFactory } from '../providers/PullRequestProviderFactory';
import { PullRequestProviderType } from '../providers/PullRequestProviderType';

export class SyncRemotePRCommandHandler implements ICommandHandler {
    constructor(
        private readonly dependencies: IExtensionDependencies
    ) { }

    async execute(): Promise<void> {
        const { vscodeAdapter, reviewRepository, reviewViewProvider, context } = this.dependencies;

        try {
            const branch = await vscodeAdapter.getActiveBranch();
            
            // Determinar o provider a partir da config ou perguntar
            const config = vscode.workspace.getConfiguration('codeReview');
            let providerType = config.get<PullRequestProviderType>('prProvider');

            if (!providerType || providerType === 'url') {
                const selected = await vscode.window.showQuickPick(
                    [
                        { label: 'GitLab API', value: 'gitlab-api' },
                        { label: 'GitHub API', value: 'github-api' }
                    ],
                    { title: 'Selecione o provedor para sincronização' }
                );

                if (!selected) { return; }
                providerType = selected.value as PullRequestProviderType;
                
                await config.update('prProvider', providerType, vscode.ConfigurationTarget.Global);
            }

            reviewViewProvider.setLoading(`Buscando Pull/Merge Request para a branch ${branch}...`);

            const provider = PullRequestProviderFactory.create(providerType, context);
            
            if (provider.configure) {
                // Checar se as configurações básicas existem
                const isConfigured = this._checkIfConfigured(providerType);
                if (!isConfigured) {
                    await provider.configure();
                }
            }

            if (!provider.getPullRequestByBranch) {
                throw new Error(`O provedor ${providerType} não suporta busca por branch.`);
            }

            const pr = await provider.getPullRequestByBranch(branch);

            if (!pr) {
                vscode.window.showInformationMessage(`Nenhum PR/MR aberto encontrado para a branch ${branch}.`);
                reviewViewProvider.clear(`Nenhum PR/MR encontrado para ${branch}.`);
                return;
            }

            const confirm = await vscode.window.showInformationMessage(
                `Encontrado ${pr.provider === 'gitlab-api' ? 'Merge Request !' : 'Pull Request #'}${pr.number}: ${pr.title}. Sincronizar com esta sessão?`,
                { modal: false },
                'Sincronizar'
            );

            if (confirm !== 'Sincronizar') {
                reviewViewProvider.updateFindings(
                    reviewViewProvider.getCurrentSessionId() || 'none',
                    []
                );
                return;
            }

            // Get current session or create one
            let session = await reviewRepository.getSessionByBranch(branch);
            
            if (!session) {
                vscode.window.showWarningMessage('Nenhuma sessão de review ativa para esta branch. Criando uma nova.');
                session = {
                    id: Date.now().toString(),
                    branch,
                    findings: [],
                    comments: [],
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
            }

            // Extrair owner/repo dependendo do provedor
            const { owner, repo } = this._getOwnerAndRepo(providerType);

            session.remote = {
                provider: providerType.includes('gitlab') ? 'gitlab' : 'github',
                url: pr.url,
                number: pr.number,
                owner,
                repo
            };

            await reviewRepository.saveSession(session);

            reviewViewProvider.updateFindings(session.id, session.findings);
            
            vscode.window.showInformationMessage(`Sessão sincronizada com sucesso com ${session.remote.provider} ${session.remote.number}.`);

        } catch (error: any) {
            const message = `Falha na sincronização: ${error.message}`;
            reviewViewProvider.setError(message);
            vscode.window.showErrorMessage(message);
        }
    }

    private _checkIfConfigured(type: PullRequestProviderType): boolean {
        if (type === 'gitlab-api') {
            return !!vscode.workspace.getConfiguration('codeReview.gitlab').get('projectId');
        }
        if (type === 'github-api') {
            return !!vscode.workspace.getConfiguration('codeReview.github').get('repo');
        }
        return true;
    }

    private _getOwnerAndRepo(type: PullRequestProviderType): { owner: string, repo: string } {
        if (type === 'gitlab-api') {
            const projectId = vscode.workspace.getConfiguration('codeReview.gitlab').get<string>('projectId') || '';
            if (projectId.includes('/')) {
                const parts = projectId.split('/');
                return { owner: parts[0], repo: parts.slice(1).join('/') };
            }
            return { owner: 'project', repo: projectId };
        }
        
        const githubConfig = vscode.workspace.getConfiguration('codeReview.github');
        return {
            owner: githubConfig.get<string>('owner') || 'owner',
            repo: githubConfig.get<string>('repo') || 'repo'
        };
    }
}
