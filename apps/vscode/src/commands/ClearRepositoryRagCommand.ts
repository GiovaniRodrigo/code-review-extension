import * as vscode from 'vscode';

import { IExtensionDependencies }
    from '../contracts/IExtensionDependencies';

export class ClearRepositoryRagCommand {

    constructor(
        private readonly dependencies:
            IExtensionDependencies
    ) { }

    register(): void {

        const disposable =
            vscode.commands.registerCommand(
                'code-review.clearRepositoryRag',

                async () => {

                    await this.dependencies
                        .clearRepositoryRagCommandHandler
                        .execute();

                    vscode.window
                        .showInformationMessage(
                            'RAG limpo com sucesso.'
                        );
                }
            );

        this.dependencies.context
            .subscriptions
            .push(disposable);
    }
}