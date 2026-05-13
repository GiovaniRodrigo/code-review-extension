import * as vscode from 'vscode';
import { ICommand } from '../contracts/ICommand';
import { IExtensionDependencies } from '../contracts/IExtensionDependencies';
import { SetGitLabTokenCommandHandler } from '../command-handlers/SetGitLabTokenCommandHandler';

export class SetGitLabTokenCommand implements ICommand {
    readonly id = 'code-review.setGitLabToken';

    constructor(
        private readonly dependencies: IExtensionDependencies
    ) { }

    register(): void {
        const handler = new SetGitLabTokenCommandHandler(this.dependencies);

        const disposable = vscode.commands.registerCommand(
            this.id,
            () => handler.execute()
        );

        this.dependencies.context.subscriptions.push(disposable);
    }
}
