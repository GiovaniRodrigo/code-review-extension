import { describe, expect, it, vi } from 'vitest';
import { SecurityAnalyzer } from '../../../src/infra/SecurityAnalyzer';
import { AstBuilderPort } from '@code-review/core';
import * as fs from 'fs';

vi.mock('fs');

describe('SecurityAnalyzer', () => {
  it('deve detectar segredos (mock)', async () => {
    const astBuilder: AstBuilderPort = {
      build: vi.fn().mockResolvedValue({
        root: {
          kind: 'sourceFile',
          children: [
            {
              kind: 'literal',
              name: 'my-secret-token',
              children: []
            }
          ]
        }
      })
    };

    vi.spyOn(fs, 'existsSync').mockReturnValue(true);
    vi.spyOn(fs, 'readFileSync').mockReturnValue('');

    const analyzer = new SecurityAnalyzer(astBuilder);
    const findings = await analyzer.analyze(['test.ts']);
    
    expect(findings.length).toBe(1);
    expect(findings[0].rule).toBe('security.hardcoded-secret');
  });
});
