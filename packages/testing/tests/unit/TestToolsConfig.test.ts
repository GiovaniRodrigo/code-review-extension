import { describe, expect, it } from 'vitest';
import { parseTestToolsConfig } from '../../src/application/TestToolsConfig';

describe('TestToolsConfig', () => {
  it('aplica defaults determinísticos', () => {
    const config = parseTestToolsConfig({
      coverage: {},
      commands: {}
    });

    expect(config.coverage.domain).toBe(95);
    expect(config.coverage.application).toBe(90);
    expect(config.coverage.infra).toBe(80);
    expect(config.commands.vitest).toBe('vitest');
  });
});
