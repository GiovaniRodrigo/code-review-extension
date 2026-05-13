import * as vscode from 'vscode';

import { ICommandHandler }
    from '../contracts/ICommandHandler';

import { IExtensionDependencies }
    from '../contracts/IExtensionDependencies';

export class SetOpenAIKeyCommandHandler
    implements ICommandHandler {

    constructor(
        private readonly dependencies: IExtensionDependencies
    ) { }

    async execute(): Promise<void> {

        const { context } =
            this.dependencies;

        const apiKey =
            await vscode.window.showInputBox({
                prompt: 'Enter your OpenAI API key',
                password: true,
                ignoreFocusOut: true
            });

        if (!apiKey) {
            return;
        }

        await context.secrets.store(
            'openai-api-key',
            apiKey
        );

        vscode.window.showInformationMessage(
            'OpenAI API key saved securely.'
        );
    }
}