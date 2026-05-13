import { EmbeddingProvider, VectorStore } from './interfaces';

export class MockEmbeddingProvider implements EmbeddingProvider {
  async generateEmbedding(text: string): Promise<number[]> {
    // Return a dummy vector based on text length
    return Array.from({ length: 1536 }, (_, i) => text.length + i);
  }
}

export class MockVectorStore implements VectorStore {
  private store = new Map<string, { vector: number[], metadata: any }>();

  async add(id: string, vector: number[], metadata: any): Promise<void> {
    this.store.set(id, { vector, metadata });
  }

  async query(vector: number[], limit: number): Promise<any[]> {
    // Return everything (very mocky)
    return [...this.store.values()]
      .slice(0, limit)
      .map(item => item.metadata);
  }
}
