import * as vscode from 'vscode';
import { ICommandHandler } from '../contracts/ICommandHandler';
import { IExtensionDependencies } from '../contracts/IExtensionDependencies';
import { UIHelper } from '../helpers/UIHelper';

export class SetGitLabCredentialsCommandHandler implements ICommandHandler {
    constructor(
        private readonly dependencies: IExtensionDependencies
    ) { }

    async execute(): Promise<void> {
        const { context } = this.dependencies;

        const username = await UIHelper.showInputBox({
            prompt: 'Insira seu usuário do GitLab',
            placeHolder: 'usuario'
        });

        if (username === undefined) {
            return;
        }

        const password = await UIHelper.showInputBox({
            prompt: 'Insira sua senha do GitLab',
            password: true
        });

        if (password === undefined) {
            return;
        }

        // Salvar username na config
        await vscode.workspace
            .getConfiguration('codeReview.gitlab')
            .update('username', username, vscode.ConfigurationTarget.Global);

        // Salvar password nos secrets
        await context.secrets.store('codeReview.gitlab.password', password);

        vscode.window.showInformationMessage('Credenciais do GitLab salvas com sucesso.');
    }
}
