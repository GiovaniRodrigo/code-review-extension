export interface RagEmbeddingProviderPort {
  generateEmbedding(text: string): Promise<number[]>;
}
