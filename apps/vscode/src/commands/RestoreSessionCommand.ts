import * as vscode from 'vscode';
import { ICommand } from '../contracts/ICommand';
import { IExtensionDependencies } from '../contracts/IExtensionDependencies';
import { restoreCurrentBranchSession } from '../services/restoreCurrentBranchSession';

export class RestoreSessionCommand implements ICommand {
    readonly id = 'code-review.restoreSession';

    constructor(
        private readonly dependencies: IExtensionDependencies
    ) { }

    register(context: vscode.ExtensionContext): void {
        const disposable = vscode.commands.registerCommand(
            this.id,
            async () => {
                await restoreCurrentBranchSession(
                    this.dependencies.vscodeAdapter,
                    this.dependencies.reviewRepository,
                    this.dependencies.reviewViewProvider
                );
            }
        );

        context.subscriptions.push(disposable);
    }
}
