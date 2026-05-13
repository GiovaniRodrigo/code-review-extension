import * as vscode from 'vscode';

import { IExtensionDependencies }
  from '../contracts/IExtensionDependencies';

export class IndexRepositoryRagCommand {

    constructor(
        private readonly dependencies:
            IExtensionDependencies
    ) {}

    register(): void {

        const disposable =
            vscode.commands.registerCommand(
                'code-review.indexRepositoryRag',

                async () => {

                    await this.dependencies
                        .indexRepositoryRagCommandHandler
                        .execute();
                }
            );

        this.dependencies.context.subscriptions
            .push(disposable);
    }
}