import { describe, it, expect } from 'vitest';
import { ValueObject } from '../../../src/shared/ValueObject';

class TestValueObject extends ValueObject<{ name: string }> {}

describe('ValueObject', () => {
  it('should be equal when props are equal', () => {
    const vo1 = new TestValueObject({ name: 'test' });
    const vo2 = new TestValueObject({ name: 'test' });
    expect(vo1.equals(vo2)).toBe(true);
  });

  it('should not be equal when props are different', () => {
    const vo1 = new TestValueObject({ name: 'test1' });
    const vo2 = new TestValueObject({ name: 'test2' });
    expect(vo1.equals(vo2)).toBe(false);
  });
});
