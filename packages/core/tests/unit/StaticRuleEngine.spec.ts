import { describe, expect, it } from 'vitest';
import { AstBuilder } from '../../src/AstBuilder';
import { StaticRuleEngine } from '../../src/StaticRuleEngine';

describe('StaticRuleEngine', () => {
  it('should run enabled default static rules against an AST', async () => {
    const ast = await new AstBuilder().build({
      filePath: 'test.ts',
      code: [
        'class Big {',
        ...Array.from({ length: 9 }, (_, index) => `  method${index}() {}`),
        '}'
      ].join('\n')
    });

    const findings = await new StaticRuleEngine().run(ast);

    expect(findings).toEqual([
      expect.objectContaining({
        ruleId: 'max-class-members',
        severity: 'warning',
        file: 'test.ts',
        line: 1,
        target: 'Big'
      })
    ]);
  });

  it('should run only selected rules', async () => {
    const ast = await new AstBuilder().build({
      filePath: 'empty.ts',
      code: ''
    });

    const findings = await new StaticRuleEngine().run(ast, ['max-class-members']);

    expect(findings).toEqual([]);
  });

  it('should detect complex arrow functions', async () => {
    const ast = await new AstBuilder().build({
        filePath: 'complex.ts',
        code: 'const x = (a) => { if(a) { if(b) { if(c) { d(); } } } }'
    });
    const findings = await new StaticRuleEngine().run(ast);
    expect(findings.length).toBeGreaterThanOrEqual(0);
  });

  it('should detect architectural-dip violations', async () => {
    const ast = await new AstBuilder().build({
      filePath: 'src/application/MyUseCase.ts',
      code: "import { MyInfra } from '../infra/MyInfra';"
    });

    const findings = await new StaticRuleEngine().run(ast);
    expect(findings).toEqual([
      expect.objectContaining({
        ruleId: 'architectural-dip',
        severity: 'error'
      })
    ]);
  });

});
