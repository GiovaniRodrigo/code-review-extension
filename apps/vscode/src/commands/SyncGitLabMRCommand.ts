import * as vscode from 'vscode';
import { ICommand } from '../contracts/ICommand';
import { IExtensionDependencies } from '../contracts/IExtensionDependencies';
import { SyncGitLabMRCommandHandler } from '../command-handlers/SyncGitLabMRCommandHandler';

export class SyncGitLabMRCommand implements ICommand {
    readonly id = 'code-review.syncGitLabMR';

    constructor(
        private readonly dependencies: IExtensionDependencies
    ) { }

    register(): void {
        const handler = new SyncGitLabMRCommandHandler(this.dependencies);

        const disposable = vscode.commands.registerCommand(
            this.id,
            () => handler.execute()
        );

        this.dependencies.context.subscriptions.push(disposable);
    }
}
