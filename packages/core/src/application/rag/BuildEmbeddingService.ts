import { IEmbeddingProvider } from './contracts/IEmbeddingProvider';

export class BuildEmbeddingService {

    constructor(
        private readonly provider:
            IEmbeddingProvider
    ) { }

    async build(
        content: string
    ): Promise<number[]> {

        return this.provider
            .generateEmbedding(content);
    }
}