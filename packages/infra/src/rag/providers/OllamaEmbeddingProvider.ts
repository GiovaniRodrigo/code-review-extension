import { IEmbeddingProvider } from '@code-review/core';

export class OllamaEmbeddingProvider
    implements IEmbeddingProvider {

    async generateEmbedding(
        text: string
    ): Promise<number[]> {

        const response =
            await fetch(
                'http://localhost:11434/api/embeddings',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type':
                            'application/json'
                    },
                    body: JSON.stringify({
                        model:
                            'nomic-embed-text',
                        prompt: text
                    })
                }
            );

        const data =
            await response.json();

        return data.embedding;
    }
}