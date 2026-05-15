import { describe, expect, it } from 'vitest';
import { TypeScriptAstBuilder } from '../../../src/ast/TypeScriptAstBuilder';

describe('TypeScriptAstBuilder', () => {
  it('deve extrair sumário básico de um arquivo TS', async () => {
    const builder = new TypeScriptAstBuilder();
    const code = `
      import { x } from './x';
      export class MyClass {
        constructor() {}
        myMethod() { return 1; }
      }
    `;

    const result = await builder.build({
      filePath: 'test.ts',
      code
    });

    expect(result.filePath).toBe('test.ts');
    expect(result.metrics.classes).toBe(1);
    expect(result.metrics.imports).toBe(1);
    expect(result.root.children.some(c => c.kind === 'class')).toBe(true);
  });
});
