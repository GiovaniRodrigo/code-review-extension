import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRagVectorStore } from '../../../../src/rag/vector-stores/MemoryRagVectorStore';

describe('MemoryRagVectorStore', () => {
  let store: MemoryRagVectorStore;

  beforeEach(() => {
    store = new MemoryRagVectorStore();
  });

  it('should insert and search chunks', async () => {
    const chunk = { content: 'test', metadata: { id: '1' } };
    const vector = [0.1, 0.2];
    
    await store.add(chunk as any, vector);
    const results = await store.search(vector, 1);
    
    expect(results).toHaveLength(1);
    expect(results[0].content).toBe('test');
  });

  it('should clear chunks', async () => {
    await store.add({ content: 'test' } as any, [0.1]);
    await store.clear();
    const results = await store.search([0.1], 1);
    expect(results).toHaveLength(0);
  });
});
