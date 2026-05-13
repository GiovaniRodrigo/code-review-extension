export interface RagIndexerPort {
  indexRepository(rootPath: string): Promise<void>;
  clear(): Promise<void>;
}
