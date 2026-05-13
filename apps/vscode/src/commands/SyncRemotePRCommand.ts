import * as vscode from 'vscode';
import { ICommand } from '../contracts/ICommand';
import { IExtensionDependencies } from '../contracts/IExtensionDependencies';
import { SyncRemotePRCommandHandler } from '../command-handlers/SyncRemotePRCommandHandler';

export class SyncRemotePRCommand implements ICommand {
    readonly id = 'code-review.syncRemotePR';

    constructor(
        private readonly dependencies: IExtensionDependencies
    ) { }

    register(): void {
        const handler = new SyncRemotePRCommandHandler(this.dependencies);

        const disposable = vscode.commands.registerCommand(
            this.id,
            () => handler.execute()
        );

        this.dependencies.context.subscriptions.push(disposable);
    }
}
