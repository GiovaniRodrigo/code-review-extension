import { ChunkCodeService } from './ChunkCodeService';
import { BuildEmbeddingService } from './BuildEmbeddingService';
import { VectorStoreService } from './VectorStoreService';

export class RepositoryIndexerService {

    constructor(
        private readonly chunker:
            ChunkCodeService,

        private readonly embeddings:
            BuildEmbeddingService,

        private readonly vectorStore:
            VectorStoreService
    ) { }

    async index(): Promise<void> {

        const workspacePath =
            process.cwd();

        const chunks =
            await this.chunker
                .chunkRepository(
                    workspacePath
                );

        for (const chunk of chunks) {

            const embedding =
                await this.embeddings
                    .build(chunk.content);

            await this.vectorStore
                .insert({
                    id: chunk.id,
                    embedding,
                    metadata: {
                        file: chunk.file,
                        language:
                            chunk.language,
                        startLine:
                            chunk.startLine,
                        endLine:
                            chunk.endLine
                    },
                    content:
                        chunk.content
                });
        }
    }
}