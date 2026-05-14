import { describe, it, expect } from 'vitest';
import { OAuthProvider } from '../../../../src/auth/providers/OAuthProvider';

describe('OAuthProvider', () => {
  it('should be defined', () => {
    const provider = new OAuthProvider();
    expect(provider).toBeDefined();
  });
});
