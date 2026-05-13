import { IVectorStore } from '../../contracts/IVectorStore';
import { VectorChunk } from './types/VectorChunk';

export class VectorStoreService {

    constructor(
        private readonly store:
            IVectorStore
    ) { }

    async insert(
        chunk: VectorChunk
    ): Promise<void> {

        await this.store.insert(chunk);
    }

    async clear(): Promise<void> {

        await this.store.clear();
    }

    async search(
        embedding: number[],
        limit: number
    ): Promise<VectorChunk[]> {

        return this.store
            .similaritySearch(
                embedding,
                limit
            );
    }
}