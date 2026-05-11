export interface EmbeddingVector {
  id: string;
  vector: number[];
  metadata?: Record<string, unknown>;
}

export interface EmbeddingProvider {
  readonly id: string;
  embed(input: string): Promise<EmbeddingVector>;
}

export interface ContextRetriever {
  retrieve(query: string, limit: number): Promise<string[]>;
}
