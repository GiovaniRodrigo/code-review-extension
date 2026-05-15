import { describe, expect, it, vi } from 'vitest';
import { SOLIDAnalyzer } from '../../../src/infra/SOLIDAnalyzer';
import { AstBuilderPort } from '@code-review/core';
import * as fs from 'fs';

vi.mock('fs');

describe('SOLIDAnalyzer', () => {
  it('deve identificar violações básicas (mock)', async () => {
    const astBuilder: AstBuilderPort = {
      build: vi.fn().mockResolvedValue({
        root: {
          kind: 'sourceFile',
          children: [
            {
              kind: 'class',
              name: 'BigClass',
              children: Array(11).fill({ kind: 'method', children: [] })
            }
          ]
        }
      })
    };

    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue('');

    const analyzer = new SOLIDAnalyzer(astBuilder);
    const findings = await analyzer.analyze(['test.ts']);
    
    expect(findings.length).toBe(1);
    expect(findings[0].rule).toBe('solid.srp');
  });
});
