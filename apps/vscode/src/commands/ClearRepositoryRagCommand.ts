import * as vscode from 'vscode';
import { ICommand } from '../contracts/ICommand';
import { IExtensionDependencies } from '../contracts/IExtensionDependencies';

export class ClearRepositoryRagCommand implements ICommand {
    readonly id = 'code-review.clearRepositoryRag';

    constructor(
        private readonly dependencies: IExtensionDependencies
    ) { }

    register(context: vscode.ExtensionContext): void {
        const disposable = vscode.commands.registerCommand(
            this.id,
            async () => {
                await this.dependencies
                    .clearRepositoryRagCommandHandler
                    .execute();

                vscode.window.showInformationMessage(
                    'RAG limpo com sucesso.'
                );
            }
        );

        context.subscriptions.push(disposable);
    }
}