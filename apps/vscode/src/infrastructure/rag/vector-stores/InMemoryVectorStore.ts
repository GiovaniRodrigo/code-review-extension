import { IVectorStore } from '../../../contracts/IVectorStore';
import { VectorChunk } from '../../../services/rag/types/VectorChunk';

export class InMemoryVectorStore
    implements IVectorStore {

    private readonly chunks:
        VectorChunk[] = [];

    async insert(
        chunk: VectorChunk
    ): Promise<void> {

        this.chunks.push(chunk);
    }

    async clear(): Promise<void> {

        this.chunks.length = 0;
    }

    async similaritySearch(
        embedding: number[],
        limit: number
    ): Promise<VectorChunk[]> {

        return this.chunks
            .slice(0, limit);
    }
}