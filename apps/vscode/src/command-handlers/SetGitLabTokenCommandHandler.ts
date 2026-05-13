import * as vscode from 'vscode';
import { ICommandHandler } from '../contracts/ICommandHandler';
import { IExtensionDependencies } from '../contracts/IExtensionDependencies';
import { UIHelper } from '../helpers/UIHelper';

export class SetGitLabTokenCommandHandler implements ICommandHandler {
    constructor(
        private readonly dependencies: IExtensionDependencies
    ) { }

    async execute(): Promise<void> {
        const { context } = this.dependencies;

        const token = await UIHelper.showInputBox({
            prompt: 'Insira seu GitLab Private Token',
            password: true,
            placeHolder: 'glpat-...'
        });

        if (token === undefined) {
            return;
        }

        if (token === '') {
            await context.secrets.delete('codeReview.gitlab.token');
            vscode.window.showInformationMessage('Token do GitLab removido.');
            return;
        }

        await context.secrets.store('codeReview.gitlab.token', token);
        vscode.window.showInformationMessage('Token do GitLab salvo com sucesso.');
    }
}
