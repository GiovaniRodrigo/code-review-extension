import { describe, it, expect } from 'vitest';
import { ApplicationError } from '../../src/shared/errors/ApplicationError';

describe('ApplicationError', () => {
  it('should instantiate with message and default code', () => {
    const error = new ApplicationError('test');
    expect(error.message).toBe('test');
    expect(error.code).toBe('APPLICATION_ERROR');
  });
});
