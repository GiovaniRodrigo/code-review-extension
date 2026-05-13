import * as vscode from 'vscode';

import { ICommand }
    from '../contracts/ICommand';

import { IExtensionDependencies }
    from '../contracts/IExtensionDependencies';

import { AnalyzeBranchCommitsCommandHandler }
    from '../command-handlers/AnalyzeBranchCommitsCommandHandler';

export class AnalyzeBranchCommitsCommand
    implements ICommand {

    readonly id =
        'code-review.analyzeBranchCommits';

    constructor(
        private readonly dependencies:
            IExtensionDependencies
    ) { }

    register(): void {

        const handler =
            new AnalyzeBranchCommitsCommandHandler(
                this.dependencies
            );

        const disposable =
            vscode.commands.registerCommand(
                this.id,
                () => handler.execute()
            );

        this.dependencies.context.subscriptions.push(
            disposable
        );
    }
}