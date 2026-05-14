import { describe, it, expect, vi } from 'vitest';
import { MarkdownLoader } from '../../../../src/rag/loaders/MarkdownLoader';

describe('MarkdownLoader Smoke Test', () => {
  it('should instantiate', () => {
    expect(new MarkdownLoader()).toBeDefined();
  });
});
