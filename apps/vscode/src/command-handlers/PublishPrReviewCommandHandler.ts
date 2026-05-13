import * as vscode from 'vscode';
import { PublishPRReviewUseCase } from '@code-review/core';
import { ICommandHandler } from '../contracts/ICommandHandler';
import { IExtensionDependencies } from '../contracts/IExtensionDependencies';
import { GitProviderFactory } from '../services/GitProviderFactory';

export class PublishPrReviewCommandHandler implements ICommandHandler {
    constructor(
        private readonly dependencies: IExtensionDependencies
    ) { }

    async execute(): Promise<void> {
        const { reviewViewProvider, reviewRepository, context } = this.dependencies;

        const sessionId = reviewViewProvider.getCurrentSessionId();
        if (!sessionId) {
            vscode.window.showErrorMessage('Nenhuma sessão de revisão ativa encontrada.');
            return;
        }

        // Recuperar a sessão para obter metadados (owner, repo, prNumber)
        const session = await reviewRepository.getSessionById(sessionId);
        if (!session) {
            vscode.window.showErrorMessage('Sessão não encontrada no repositório.');
            return;
        }

        // Tentar extrair metadados da sessão (se sincronizada) ou dos findings
        let owner = '';
        let repo = '';
        let prNumber: number | string = 0;
        let providerType: 'github' | 'gitlab' = 'github';

        if (session.remote) {
            owner = session.remote.owner;
            repo = session.remote.repo;
            prNumber = session.remote.number;
            providerType = session.remote.provider as any;
        } else {
            // Fallback para lógica antiga baseada em findings
            const finding = session.findings[0] as any;
            if (!finding || !finding.prNumber) {
                vscode.window.showErrorMessage('Esta sessão não parece estar vinculada a um Pull Request/Merge Request. Use o comando de sincronização primeiro.');
                return;
            }

            prNumber = finding.prNumber;
            providerType = finding.provider === 'gitlab-api' ? 'gitlab' : 'github';

            if (providerType === 'gitlab') {
                const config = vscode.workspace.getConfiguration('codeReview.gitlab');
                const projectId = config.get<string>('projectId') || '';
                if (projectId.includes('/')) {
                    const parts = projectId.split('/');
                    owner = parts[0];
                    repo = parts.slice(1).join('/');
                } else {
                    owner = 'project';
                    repo = projectId;
                }
            } else {
                // Lógica similar para GitHub (pode ser expandida se necessário)
            }
        }

        try {
            const gitProvider = await GitProviderFactory.create(providerType, context);
            const useCase = new PublishPRReviewUseCase(reviewRepository, gitProvider);

            reviewViewProvider.setLoading('Publicando comentários...');

            await useCase.execute({
                sessionId,
                owner,
                repo,
                prNumber: Number(prNumber)
            });

            reviewViewProvider.updateFindings(session.id, session.findings);
            vscode.window.showInformationMessage(`Review publicado com sucesso no ${providerType}!`);

        } catch (error: any) {
            const message = `Falha ao publicar review: ${error.message}`;
            reviewViewProvider.setError(message);
            vscode.window.showErrorMessage(message);
        }
    }
}
