import * as vscode from 'vscode';

import {
    AIProvider,
    MockAIProvider,
    OllamaProvider,
    OpenAIProvider
} from '@code-review/infra';

export async function createAIProvider(
    context: vscode.ExtensionContext
): Promise<AIProvider> {

    const config =
        vscode.workspace.getConfiguration(
            'codeReview'
        );

    const provider =
        config.get<string>(
            'provider',
            'mock'
        );

    if (provider === 'ollama') {

        const baseUrl =
            config.get<string>(
                'ollama.baseUrl',
                'http://localhost:11434'
            );

        const model =
            config.get<string>(
                'ollama.model',
                'llama3'
            );

        return new OllamaProvider(
            baseUrl,
            model
        );
    }

    if (provider === 'openai') {

        const apiKey =
            await context.secrets.get(
                'codeReview.openai.apiKey'
            );

        if (!apiKey) {
            throw new Error(
                'OpenAI API key not configured.'
            );
        }

        return new OpenAIProvider(apiKey);
    }

    return new MockAIProvider();
}