import * as vscode from 'vscode';
import { ICommand } from '../contracts/ICommand';
import { IExtensionDependencies } from '../contracts/IExtensionDependencies';
import { UIHelper } from '../helpers/UIHelper';

export class SetProviderCommand implements ICommand {
    readonly id = 'code-review.setProvider';

    constructor(
        private readonly dependencies: IExtensionDependencies
    ) { }

    register(context: vscode.ExtensionContext): void {
        const disposable = vscode.commands.registerCommand(
            this.id,
            async () => {
                const provider = await UIHelper.showQuickPick(
                    ['openai', 'ollama', 'mock'],
                    { title: 'Escolha o provider de IA' }
                );

                if (!provider) {
                    return;
                }

                await vscode.workspace
                    .getConfiguration('codeReview')
                    .update('provider', provider, vscode.ConfigurationTarget.Global);

                vscode.window.showInformationMessage(
                    `Provider alterado para: ${provider}`
                );
            }
        );

        context.subscriptions.push(disposable);
    }
}