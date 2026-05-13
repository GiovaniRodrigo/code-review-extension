import * as vscode from 'vscode';
import { ICommand } from '../contracts/ICommand';
import { IExtensionDependencies } from '../contracts/IExtensionDependencies';
import { SetGitLabCredentialsCommandHandler } from '../command-handlers/SetGitLabCredentialsCommandHandler';

export class SetGitLabCredentialsCommand implements ICommand {
    readonly id = 'code-review.setGitLabCredentials';

    constructor(
        private readonly dependencies: IExtensionDependencies
    ) { }

    register(): void {
        const handler = new SetGitLabCredentialsCommandHandler(this.dependencies);

        const disposable = vscode.commands.registerCommand(
            this.id,
            () => handler.execute()
        );

        this.dependencies.context.subscriptions.push(disposable);
    }
}
