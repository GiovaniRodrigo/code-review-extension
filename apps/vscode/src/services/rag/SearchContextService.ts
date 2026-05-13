import { IEmbeddingProvider } from '../../contracts/IEmbeddingProvider';
import { IVectorStore } from '../../contracts/IVectorStore';

export class SearchContextService {

    constructor(
        private readonly embeddings:
            IEmbeddingProvider,

        private readonly vectorStore:
            IVectorStore
    ) { }

    async search(
        query: string,
        limit = 10
    ) {

        const embedding =
            await this.embeddings
                .generateEmbedding(query);

        return this.vectorStore
            .similaritySearch(
                embedding,
                limit
            );
    }
}