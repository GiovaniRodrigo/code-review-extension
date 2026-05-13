import { describe, expect, it } from 'vitest';
import { ArchitectureAnalyzer } from '../../src/infra/ArchitectureAnalyzer';

describe('ArchitectureAnalyzer', () => {
  it('detecta caminho inválido entre domain e infra', async () => {
    const findings = await new ArchitectureAnalyzer().analyze([
      'packages/domain/src/infra/Invalid.ts'
    ]);

    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe('critical');
  });
});
