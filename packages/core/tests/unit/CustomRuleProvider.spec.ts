import { describe, expect, it } from 'vitest';
import { AstBuilder } from '../../src/AstBuilder';
import { CustomRuleProvider, CustomRuleConfig } from '../../src/CustomRuleProvider';

describe('CustomRuleProvider', () => {
  it('should create rules from forbiddenImport config', async () => {
    const configs: CustomRuleConfig[] = [
      {
        id: 'no-moment',
        description: 'Do not use moment.js',
        severity: 'error',
        forbiddenImport: 'moment'
      }
    ];

    const ast = await new AstBuilder().build({
      filePath: 'test.ts',
      code: "import moment from 'moment';"
    });

    const rules = CustomRuleProvider.fromConfigs(configs);
    const findings = await rules[0].run({ ast });

    expect(findings).toHaveLength(1);
    expect(findings[0].ruleId).toBe('no-moment');
    expect(findings[0].severity).toBe('error');
  });

  it('should create rules from pattern and kind config', async () => {
    const configs: CustomRuleConfig[] = [
      {
        id: 'ui-naming-convention',
        description: 'React components should start with uppercase',
        severity: 'warning',
        kind: 'function',
        pattern: '^[a-z]' // Incorrect: lowercase starts
      }
    ];

    const ast = await new AstBuilder().build({
      filePath: 'component.tsx',
      code: "function myComponent() { return null; }"
    });

    const rules = CustomRuleProvider.fromConfigs(configs);
    const findings = await rules[0].run({ ast });

    expect(findings).toHaveLength(1);
    expect(findings[0].ruleId).toBe('ui-naming-convention');
  });
});
