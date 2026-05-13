import { ICommandHandler } from '../contracts/ICommandHandler';
import { RepositoryIndexerService } from '../services/rag/RepositoryIndexerService';

export class IndexRepositoryRagCommandHandler
    implements ICommandHandler {

    constructor(
        private readonly repositoryIndexer:
            RepositoryIndexerService
    ) { }

    async execute(): Promise<void> {
        await this.repositoryIndexer.index();
    }
}