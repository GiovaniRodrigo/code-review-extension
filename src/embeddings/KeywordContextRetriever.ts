import { ContextRetriever } from '../contracts';

export class KeywordContextRetriever implements ContextRetriever {
  constructor(private readonly documents: string[]) {}

  async retrieve(query: string, limit: number): Promise<string[]> {
    const tokens = query.toLowerCase().split(/\W+/).filter(Boolean);
    return this.documents
      .map((document) => ({
        document,
        score: tokens.reduce((total, token) => total + (document.toLowerCase().includes(token) ? 1 : 0), 0)
      }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map((entry) => entry.document);
  }
}
