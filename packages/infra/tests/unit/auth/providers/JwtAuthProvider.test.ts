import { describe, it, expect } from 'vitest';
import { JwtAuthProvider } from '../../../../src/auth/providers/JwtAuthProvider';

describe('JwtAuthProvider', () => {
  it('should be defined', () => {
    const provider = new JwtAuthProvider();
    expect(provider).toBeDefined();
  });
});
