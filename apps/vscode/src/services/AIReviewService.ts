import * as vscode from 'vscode';

import {
    AIAnalysisInput,
    AIAnalysisResult,
    AIProvider
} from '@code-review/infra';

import { createAIProvider }
    from '../providers/createAIProvider';

export interface AIReviewInput {
    context: vscode.ExtensionContext;
    code: string;
    filePath: string;
    language?: string;
}

export class AIReviewService {

    async createProvider(
        context: vscode.ExtensionContext
    ): Promise<AIProvider> {

        return createAIProvider(
            context
        );
    }

    async analyze(
        input: AIReviewInput
    ): Promise<AIAnalysisResult> {

        const provider =
            await this.createProvider(
                input.context
            );

        const request: AIAnalysisInput = {
            code: input.code,
            filePath: input.filePath,
            language: input.language
        };

        return provider.analyzeCode(
            request
        );
    }
}