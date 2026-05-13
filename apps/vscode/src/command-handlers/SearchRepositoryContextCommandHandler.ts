import * as vscode from 'vscode';

import { ICommandHandler } from '../contracts/ICommandHandler';
import { SearchContextService } from '../services/rag/SearchContextService';

export class SearchRepositoryContextCommandHandler
implements ICommandHandler {

    constructor(
        private readonly searchContext: SearchContextService
    ) {}

    async execute(): Promise<void> {
        const query = await vscode.window.showInputBox({
            title: 'Buscar contexto no RAG',
            prompt: 'Digite o termo ou pergunta para buscar no repositório',
            placeHolder: 'Ex: onde fica a regra de validação de comentários?'
        });

        if (!query) {
            return;
        }

        const results = await this.searchContext.search(query);

        await vscode.window.showInformationMessage(
            `RAG encontrou ${results.length} resultado(s).`
        );
    }
}