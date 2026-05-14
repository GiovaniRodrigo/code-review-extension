import { describe, expect, it } from 'vitest';
import { ArchitectureAnalyzer } from '../../src/infra/ArchitectureAnalyzer';

describe('ArchitectureAnalyzer', () => {
  it('detecta caminho inválido entre domain e infra', async () => {
    const analyzer = new ArchitectureAnalyzer();
    const findings = await analyzer.analyze([
      'packages/domain/src/infra/Invalid.ts'
    ]);

    expect(findings).toHaveLength(1);
    expect(findings[0].file).toBe('packages/domain/src/infra/Invalid.ts');
    expect(findings[0].rule).toBe('clean-architecture.domain-no-infra');
    expect(findings[0].message).toBe('Domain must not depend on infra.');
    expect(findings[0].severity).toBe('critical');
  });

  it('não detecta erro em caminhos válidos', async () => {
    const analyzer = new ArchitectureAnalyzer();
    const findings = await analyzer.analyze([
      'packages/domain/src/entities/User.ts',
      'packages/infra/src/adapters/Git.ts'
    ]);

    expect(findings).toHaveLength(0);
  });
});
