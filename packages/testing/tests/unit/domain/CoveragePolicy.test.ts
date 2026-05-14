import { describe, it, expect } from 'vitest';
import { DEFAULT_COVERAGE_THRESHOLDS } from '../../../src/domain/CoveragePolicy';

describe('CoveragePolicy', () => {
  it('should have default thresholds', () => {
    expect(DEFAULT_COVERAGE_THRESHOLDS.domain).toBe(95);
    expect(DEFAULT_COVERAGE_THRESHOLDS.application).toBe(90);
    expect(DEFAULT_COVERAGE_THRESHOLDS.infra).toBe(80);
  });
});
