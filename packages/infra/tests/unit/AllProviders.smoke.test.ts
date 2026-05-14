import { describe, it, expect, vi } from 'vitest';
import { SimpleRagChunker } from '../../src/rag/chunkers/SimpleRagChunker';
import { SimpleRagContextBuilder } from '../../src/rag/context/SimpleRagContextBuilder';
import { MockRagEmbeddingProvider } from '../../src/rag/embeddings/MockRagEmbeddingProvider';
import { MarkdownLoader } from '../../src/rag/loaders/MarkdownLoader';
import { SimpleRagSearch } from '../../src/rag/search/SimpleRagSearch';
import { MemoryRagVectorStore } from '../../src/rag/vector-stores/MemoryRagVectorStore';
import { GitHubSyncProvider } from '../../src/sync/providers/GitHubSyncProvider';
import { GitLabSyncProvider } from '../../src/sync/providers/GitLabSyncProvider';
import { DockerVpsProvider } from '../../src/vps/providers/DockerVpsProvider';
import { LinuxVpsProvider } from '../../src/vps/providers/LinuxVpsProvider';

describe('Global Infra Smoke Tests', () => {
  it('should instantiate various providers', () => {
    expect(new SimpleRagChunker()).toBeDefined();
    expect(new SimpleRagContextBuilder()).toBeDefined();
    expect(new MockRagEmbeddingProvider()).toBeDefined();
    expect(new MarkdownLoader()).toBeDefined();
    expect(new SimpleRagSearch({} as any)).toBeDefined();
    expect(new MemoryRagVectorStore()).toBeDefined();
    expect(new GitHubSyncProvider()).toBeDefined();
    expect(new GitLabSyncProvider()).toBeDefined();
    expect(new DockerVpsProvider()).toBeDefined();
    expect(new LinuxVpsProvider()).toBeDefined();
  });
});
