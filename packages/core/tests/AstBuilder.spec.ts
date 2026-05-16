import { describe, expect, it } from 'vitest';
import { AstBuilder } from '../src/AstBuilder';

describe('AstBuilder', () => {
  it('should build a serializable AST summary for TypeScript code', () => {
    const builder = new AstBuilder();
    const result = builder.build({
      filePath: 'sample.ts',
      code: [
        "import { readFile } from 'node:fs/promises';",
        '',
        'export interface User {',
        '  id: string;',
        '  load(): Promise<void>;',
        '}',
        '',
        'export class UserService {',
        '  private cache = new Map<string, User>();',
        '',
        '  constructor() {}',
        '',
        '  async findUser(id: string): Promise<User | undefined> {',
        '    return this.cache.get(id);',
        '  }',
        '}',
        '',
        'export function createService() {',
        '  return new UserService();',
        '}',
        '',
        'const version = "1.0.0";'
      ].join('\n')
    });

    expect(result.filePath).toBe('sample.ts');
    expect(result.language).toBe('typescript');
    expect(result.root.kind).toBe('sourceFile');
    expect(result.root.children.map(child => child.kind)).toEqual([
      'import',
      'interface',
      'class',
      'function',
      'variable'
    ]);
    expect(result.metrics).toEqual({
      imports: 1,
      exports: 0,
      classes: 1,
      interfaces: 1,
      functions: 1,
      methods: 3,
      properties: 2,
      variables: 1,
      maxDepth: 3
    });
  });

  it('should include class members with line ranges', () => {
    const builder = new AstBuilder();
    const result = builder.build({
      filePath: 'service.ts',
      code: [
        'class Service {',
        '  name = "service";',
        '  run() {',
        '    return this.name;',
        '  }',
        '}'
      ].join('\n')
    });

    const classNode = result.root.children[0];

    expect(classNode).toEqual(expect.objectContaining({
      kind: 'class',
      name: 'Service',
      startLine: 1,
      endLine: 6
    }));
    expect(classNode.children).toEqual([
      expect.objectContaining({ kind: 'property', name: 'name', startLine: 2, endLine: 2 }),
      expect.objectContaining({ kind: 'method', name: 'run', startLine: 3, endLine: 5 })
    ]);
  });

  it('should parse JavaScript files', () => {
    const builder = new AstBuilder();
    const result = builder.build({
      filePath: 'index.js',
      code: 'function main() { return true; }'
    });

    expect(result.language).toBe('javascript');
    expect(result.metrics.functions).toBe(1);
    expect(result.root.children[0]).toEqual(expect.objectContaining({
      kind: 'function',
      name: 'main'
    }));
  });

  it('should calculate cyclomatic complexity for functions', () => {
    const ast = new AstBuilder().build({
      filePath: 'complexity.ts',
      code: `
        function complex(a, b) {
          if (a) {
            for (let i = 0; i < 10; i++) {
              if (b) {
                return true;
              }
            }
          }
          return false;
        }
      `
    });

    const func = ast.root.children[0];
    expect(func.metadata?.complexity).toBe(4); // 1 base + 2 ifs + 1 for
  });

  it('should calculate cognitive complexity focusing on nesting', () => {
    const ast = new AstBuilder().build({
      filePath: 'cognitive.ts',
      code: `
        function veryHard(a, b) {
          if (a) {          // +1
            if (b) {        // +2 (nesting)
              while(true) { // +3 (nesting)
                console.log('hi');
              }
            }
          }
          return false;
        }
      `
    });

    const func = ast.root.children[0];
    expect(func.metadata?.cognitive).toBe(6); // 1 + 2 + 3
  });
});
