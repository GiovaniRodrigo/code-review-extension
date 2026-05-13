import * as vscode from 'vscode';
import { ICommand } from '../contracts/ICommand';
import { IExtensionDependencies } from '../contracts/IExtensionDependencies';

export class IndexRepositoryRagCommand implements ICommand {
    readonly id = 'code-review.indexRepositoryRag';

    constructor(
        private readonly dependencies: IExtensionDependencies
    ) { }

    register(context: vscode.ExtensionContext): void {
        const disposable = vscode.commands.registerCommand(
            this.id,
            async () => {
                await this.dependencies
                    .indexRepositoryRagCommandHandler
                    .execute();
            }
        );

        context.subscriptions.push(disposable);
    }
}