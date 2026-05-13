import { describe, expect, it } from 'vitest';
import { QualityGate } from '../../src/domain/QualityGate';

describe('QualityGate', () => {
  it('aprova quando todas as ferramentas passam', () => {
    const report = new QualityGate().evaluate([
      {
        tool: 'vitest',
        kind: 'unit',
        passed: true,
        details: ''
      }
    ]);

    expect(report.passed).toBe(true);
  });

  it('reprova quando uma ferramenta falha', () => {
    const report = new QualityGate().evaluate([
      {
        tool: 'eslint',
        kind: 'lint',
        passed: false,
        details: 'lint error'
      }
    ]);

    expect(report.passed).toBe(false);
  });
});
