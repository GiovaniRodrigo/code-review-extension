import { ICommandHandler }
    from '../contracts/ICommandHandler';

import { VectorStoreService }
    from '../services/rag/VectorStoreService';

export class ClearRepositoryRagCommandHandler
    implements ICommandHandler {

    constructor(
        private readonly vectorStore:
            VectorStoreService
    ) { }

    async execute(): Promise<void> {

        await this.vectorStore.clear();
    }
}