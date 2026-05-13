import * as vscode from 'vscode';
import { ICommandHandler } from '../contracts/ICommandHandler';
import { IExtensionDependencies } from '../contracts/IExtensionDependencies';
import { UIHelper } from '../helpers/UIHelper';

export class SetGitLabUrlCommandHandler implements ICommandHandler {
    constructor(
        private readonly dependencies: IExtensionDependencies
    ) { }

    async execute(): Promise<void> {
        const config = vscode.workspace.getConfiguration('codeReview.gitlab');
        const currentUrl = config.get<string>('baseUrl') || 'https://gitlab.com';

        const url = await UIHelper.showInputBox({
            prompt: 'Insira a URL base do GitLab',
            value: currentUrl,
            placeHolder: 'https://gitlab.com ou https://gitlab.sua-empresa.com'
        });

        if (url === undefined) {
            return;
        }

        await config.update('baseUrl', url, vscode.ConfigurationTarget.Global);

        vscode.window.showInformationMessage(`URL do GitLab atualizada para: ${url}`);
    }
}
