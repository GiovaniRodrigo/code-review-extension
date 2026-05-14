import { describe, it, expect, vi } from 'vitest';
import { GitDiffProvider } from '../../../src/git/GitDiffProvider';
import { GitRepositoryProvider } from '../../../src/git/GitRepositoryProvider';

describe('Git Providers Smoke Tests', () => {
  it('should instantiate GitDiffProvider', () => {
    expect(new GitDiffProvider()).toBeDefined();
  });

  it('should instantiate GitRepositoryProvider', () => {
    expect(new GitRepositoryProvider()).toBeDefined();
  });
});
