import { describe, it, expect, vi } from 'vitest';
import { JwtAuthProvider } from '../../../../src/auth/providers/JwtAuthProvider';
import { OAuthProvider } from '../../../../src/auth/providers/OAuthProvider';

describe('Auth Providers Smoke Tests', () => {
  it('should instantiate JwtAuthProvider', () => {
    expect(new JwtAuthProvider()).toBeDefined();
  });

  it('should instantiate OAuthProvider', () => {
    expect(new OAuthProvider()).toBeDefined();
  });
});
