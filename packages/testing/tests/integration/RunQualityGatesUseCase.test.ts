import { describe, expect, it } from 'vitest';
import { RunQualityGatesUseCase } from '../../src/application/RunQualityGatesUseCase';
import { TestToolPort } from '../../src/ports/TestToolPort';

describe('RunQualityGatesUseCase', () => {
  it('executa ferramentas registradas e retorna relatório consolidado', async () => {
    const tool: TestToolPort = {
      name: 'fake-unit',
      kind: 'unit',
      async run() {
        return {
          tool: 'fake-unit',
          kind: 'unit',
          passed: true,
          details: 'ok'
        };
      }
    };

    const report = await new RunQualityGatesUseCase([tool]).execute();

    expect(report.passed).toBe(true);
    expect(report.results).toHaveLength(1);
  });
});
