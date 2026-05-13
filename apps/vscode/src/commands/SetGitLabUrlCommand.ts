import * as vscode from 'vscode';
import { ICommand } from '../contracts/ICommand';
import { IExtensionDependencies } from '../contracts/IExtensionDependencies';
import { SetGitLabUrlCommandHandler } from '../command-handlers/SetGitLabUrlCommandHandler';

export class SetGitLabUrlCommand implements ICommand {
    readonly id = 'code-review.setGitLabUrl';

    constructor(
        private readonly dependencies: IExtensionDependencies
    ) { }

    register(): void {
        const handler = new SetGitLabUrlCommandHandler(this.dependencies);

        const disposable = vscode.commands.registerCommand(
            this.id,
            () => handler.execute()
        );

        this.dependencies.context.subscriptions.push(disposable);
    }
}
