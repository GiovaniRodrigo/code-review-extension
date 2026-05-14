import { describe, it, expect, vi } from 'vitest';
import { SimpleRagSearch } from '../../../../src/rag/search/SimpleRagSearch';

describe('SimpleRagSearch Smoke Test', () => {
  it('should instantiate', () => {
    expect(new SimpleRagSearch({} as any)).toBeDefined();
  });
});
