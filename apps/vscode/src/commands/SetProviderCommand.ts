import * as vscode from 'vscode';

import { IExtensionDependencies }
    from '../contracts/IExtensionDependencies';

export class SetProviderCommand {

    constructor(
        private readonly dependencies:
            IExtensionDependencies
    ) { }

    register(): void {

        const disposable =
            vscode.commands.registerCommand(
                'code-review.setProvider',

                async () => {

                    const provider =
                        await vscode.window
                            .showQuickPick(
                                [
                                    'openai',
                                    'ollama',
                                    'mock'
                                ],
                                {
                                    title:
                                        'Escolha o provider de IA'
                                }
                            );

                    if (!provider) {
                        return;
                    }

                    await vscode.workspace
                        .getConfiguration(
                            'codeReview'
                        )
                        .update(
                            'provider',
                            provider,
                            vscode.ConfigurationTarget.Global
                        );

                    vscode.window
                        .showInformationMessage(
                            `Provider alterado para: ${provider}`
                        );
                }
            );

        this.dependencies.context
            .subscriptions
            .push(disposable);
    }
}