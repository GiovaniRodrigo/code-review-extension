import { describe, it, expect } from 'vitest';
import { DomainError } from '../../../src/shared/DomainError';

describe('DomainError', () => {
  it('should instantiate with message and default code', () => {
    const error = new DomainError('test message');
    expect(error.message).toBe('test message');
    expect(error.code).toBe('DOMAIN_ERROR');
    expect(error.name).toBe('DomainError');
  });

  it('should instantiate with custom code', () => {
    const error = new DomainError('test message', 'CUSTOM_CODE');
    expect(error.code).toBe('CUSTOM_CODE');
  });
});
