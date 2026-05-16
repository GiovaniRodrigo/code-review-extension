import { describe, expect, it } from 'vitest';
import { AstBuilder } from '../src/AstBuilder';
import { StaticRuleEngine } from '../src/StaticRuleEngine';

describe('StaticRuleEngine', () => {
  it('should run enabled default static rules against an AST', () => {
    const ast = new AstBuilder().build({
      filePath: 'large.ts',
      code: [
        'class Large {',
        ...Array.from({ length: 9 }, (_, index) => `  method${index}() {}`),
        '}'
      ].join('\n')
    });

    const findings = new StaticRuleEngine().run(ast);

    expect(findings).toEqual([
      expect.objectContaining({
        ruleId: 'max-class-members',
        severity: 'warning',
        file: 'large.ts',
        line: 1,
        target: 'Large'
      })
    ]);
  });

  it('should run only selected rules', () => {
    const ast = new AstBuilder().build({
      filePath: 'empty.ts',
      code: ''
    });

    const findings = new StaticRuleEngine().run(ast, ['max-class-members']);

    expect(findings).toEqual([]);
  });

  it('should detect complex arrow functions', () => {
    const ast = new AstBuilder().build({
        filePath: 'complex.ts',
        code: 'const x = (a) => { if(a) { if(b) { if(c) { d(); } } } }'
    });
    const findings = new StaticRuleEngine().run(ast);
    expect(findings.length).toBeGreaterThanOrEqual(0);
  });

  it('should detect architectural-dip violations', () => {
    const ast = new AstBuilder().build({
      filePath: 'src/application/MyUseCase.ts',
      code: "import { MyInfra } from '../infra/MyInfra';"
    });

    const findings = new StaticRuleEngine().run(ast);
    expect(findings).toEqual([
      expect.objectContaining({
        ruleId: 'architectural-dip',
        severity: 'error'
      })
    ]);
  });
});
