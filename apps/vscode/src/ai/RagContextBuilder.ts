import { VectorChunk } from "../services/rag/types/VectorChunk";


export class RagContextBuilder {

    build(
        chunks: VectorChunk[]
    ): string {

        return chunks
            .map(chunk => {

                return [
                    `FILE: ${chunk.metadata.file}`,
                    `LINES: ${chunk.metadata.startLine}-${chunk.metadata.endLine}`,
                    chunk.content
                ].join('\n');

            })
            .join('\n\n');
    }
}