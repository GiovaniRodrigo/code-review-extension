import { describe, expect, it } from 'vitest';
import { AstBuilder } from '../../src/AstBuilder';
import { RiskScorer } from '../../src/RiskScorer';
import { StaticRuleFinding } from '../../src/StaticRuleEngine';

describe('RiskScorer', () => {
  it('should score low risk when there are no findings and simple structure', async () => {
    const ast = await new AstBuilder().build({
      filePath: 'simple.ts',
      code: 'function ok() { return true; }'
    });

    const score = new RiskScorer().score(ast);
    expect(score.score).toBe(0);
    expect(score.level).toBe('low');
    expect(score.methods).toHaveLength(1);
    expect(score.methods[0].name).toBe('ok');
  });

  it('should score higher risk from findings and structure', async () => {
    const ast = await new AstBuilder().build({
      filePath: 'risky.ts',
      code: [
        ...Array.from({ length: 11 }, (_, index) => `function f${index}() { return ${index}; }`)
      ].join('\n')
    });
    const findings: StaticRuleFinding[] = [
      {
        ruleId: 'max-file-functions',
        message: 'Too many functions',
        severity: 'warning',
        file: 'risky.ts',
        line: 1,
        target: 'risky.ts'
      }
    ];

    const score = new RiskScorer().score(ast, findings);

    expect(score.level).toBe('medium');
    expect(score.score).toBeGreaterThanOrEqual(20);
    expect(score.reasons).toContain('1 total warning-level finding(s)');
    expect(score.reasons).toContain('many top-level functions in one file');
    expect(score.methods).toHaveLength(11);
  });
});
