import { describe, it, expect } from 'vitest';
import { ok, err } from '../../src/shared/result/Result';

describe('Result', () => {
  it('should create ok result', () => {
    const res = ok(123);
    expect(res.ok).toBe(true);
    if (res.ok) expect(res.value).toBe(123);
  });

  it('should create err result', () => {
    const error = new Error('fail');
    const res = err(error);
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error).toBe(error);
  });
});
