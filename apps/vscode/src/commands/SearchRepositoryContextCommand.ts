import * as vscode from 'vscode';
import { ICommand } from '../contracts/ICommand';
import { IExtensionDependencies } from '../contracts/IExtensionDependencies';
import { SearchRepositoryContextCommandHandler } from '../command-handlers/SearchRepositoryContextCommandHandler';

export class SearchRepositoryContextCommand implements ICommand {
    readonly id = 'code-review.searchRepositoryContext';

    constructor(
        private readonly dependencies: IExtensionDependencies
    ) { }

    register(context: vscode.ExtensionContext): void {
        const handler = new SearchRepositoryContextCommandHandler(
            this.dependencies.searchContextService
        );

        const disposable = vscode.commands.registerCommand(
            this.id,
            () => handler.execute()
        );

        context.subscriptions.push(disposable);
    }
}

