import * as vscode from 'vscode';

import { ICommand }
    from '../contracts/ICommand';

import { IExtensionDependencies }
    from '../contracts/IExtensionDependencies';

import { AnalyzePrCommandHandler }
    from '../command-handlers/AnalyzePrCommandHandler';

export class AnalyzePrCommand
    implements ICommand {

    readonly id =
        'code-review.analyzePr';

    constructor(
        private readonly dependencies:
            IExtensionDependencies
    ) { }

    register(): void {
        const handler =
            new AnalyzePrCommandHandler(
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