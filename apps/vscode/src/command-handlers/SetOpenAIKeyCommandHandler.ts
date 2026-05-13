import * as vscode from 'vscode';

import { ICommandHandler }
    from '../contracts/ICommandHandler';

import { IExtensionDependencies }
    from '../contracts/IExtensionDependencies';
import { UIHelper } from '../helpers/UIHelper';

export class SetOpenAIKeyCommandHandler
    implements ICommandHandler {

    constructor(
        private readonly dependencies: IExtensionDependencies
    ) { }

    async execute(): Promise<void> {

        const { context } =
            this.dependencies;

        const apiKey =
            await UIHelper.showInputBox({
                prompt: 'Enter your OpenAI API key',
                password: true
            });

        if (!apiKey) {
            return;
        }

        await context.secrets.store(
            'codeReview.openai.apiKey',
            apiKey
        );

        vscode.window.showInformationMessage(
            'OpenAI API key saved securely.'
        );
    }
}