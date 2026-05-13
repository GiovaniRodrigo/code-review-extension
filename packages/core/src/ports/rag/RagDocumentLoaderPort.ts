export interface RagDocumentLoaderPort {
  load(paths: string[]): Promise<Array<{ path: string; content: string }>>;
}
