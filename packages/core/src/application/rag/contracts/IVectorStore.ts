import { VectorChunk } from "../VectorChunk";

export interface IVectorStore {

    insert(
        chunk: VectorChunk
    ): Promise<void>;

    clear(): Promise<void>;

    similaritySearch(
        embedding: number[],
        limit: number
    ): Promise<VectorChunk[]>;
}
