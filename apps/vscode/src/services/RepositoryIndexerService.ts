import { ChunkCodeService } from './rag/ChunkCodeService';
import { BuildEmbeddingService } from './rag/BuildEmbeddingService';
import { VectorStoreService } from './rag/VectorStoreService';

export class RepositoryIndexerService {
    private readonly maxChunkCharacters = 1200;

    constructor(
        private readonly chunker: ChunkCodeService,
        private readonly embeddings: BuildEmbeddingService,
        private readonly vectorStore: VectorStoreService
    ) { }

    async index(): Promise<void> {
        const workspacePath = process.cwd();

        const chunks =
            await this.chunker.chunkRepository(workspacePath);

        for (const chunk of chunks) {
            if (chunk.content.length > this.maxChunkCharacters) {
                console.warn(
                    '[RAG] Chunk skipped (too large):',
                    chunk.file
                );

                continue;
            }

            try {
                const embedding =
                    await this.embeddings.build(chunk.content);

                await this.vectorStore.insert({
                    id: chunk.id,
                    embedding,
                    metadata: {
                        file: chunk.file,
                        language: chunk.language,
                        startLine: chunk.startLine,
                        endLine: chunk.endLine
                    },
                    content: chunk.content
                });
            } catch (error) {
                console.error(
                    '[RAG] Failed embedding:',
                    chunk.file,
                    error
                );
            }
        }
    }
}