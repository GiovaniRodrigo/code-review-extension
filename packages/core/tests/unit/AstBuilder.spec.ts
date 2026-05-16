import { describe, expect, it } from 'vitest';
import { AstBuilder } from '../../src/AstBuilder';

describe('AstBuilder', () => {
  it('should build a serializable AST summary for TypeScript code', async () => {
    const builder = new AstBuilder();
    const result = await builder.build({
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

  it('should include class members with line ranges', async () => {
    const builder = new AstBuilder();
    const result = await builder.build({
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

  it('should detect constructors and export modifiers', async () => {
    const builder = new AstBuilder();
    const result = await builder.build({
      filePath: 'component.ts',
      code: `
        export class Component {
            constructor(public id: string) {}
        }
        export const version = 1;
      `
    });

    const classNode = result.root.children[0];
    expect(classNode.name).toBe('Component');
    expect(classNode.children[0].name).toBe('constructor');
    expect(result.root.children.some(c => c.kind === 'variable' && c.name === 'version')).toBe(true);
  });

  it('should parse interfaces with properties and methods', async () => {
    const builder = new AstBuilder();
    const result = await builder.build({
      filePath: 'types.ts',
      code: `
        interface IUser {
            id: string;
            getName(): string;
        }
      `
    });

    const node = result.root.children[0];
    expect(node.kind).toBe('interface');
    expect(node.children).toHaveLength(2);
  });

  it('should calculate cognitive complexity for switch and logical operators', async () => {
    const ast = await new AstBuilder().build({
      filePath: 'logic.ts',
      code: `
        function logic(a, b) {
          switch(a) { // +1
            case 1: break;
          }
          if (a || b) { // +1 (+1 operator) = 2
            return a ?? b; // +1 operator
          }
          return null;
        }
      `
    });

    const func = ast.root.children[0];
    // switch(1) + if(1) + ||(1) + ??(1) = 4
    expect(func.metadata?.cognitive).toBeGreaterThanOrEqual(4);
  });

  it('should handle unknown languages and extensions gracefully', async () => {
    const builder = new AstBuilder();
    const result = await builder.build({
      filePath: 'config.yaml',
      code: 'key: value'
    });

    expect(result.language).toBe('text');
    expect(result.root.children).toHaveLength(0);
    expect(result.metrics.maxDepth).toBe(1);
  });

  it('should support TSX and JSX files', async () => {
      const builder = new AstBuilder();
      const tsx = await builder.build({ filePath: 'App.tsx', code: 'const App = () => <div />' });
      const jsx = await builder.build({ filePath: 'App.jsx', code: 'const App = () => <div />' });
      
      expect(tsx.language).toBe('typescript');
      expect(jsx.language).toBe('javascript');
  });

  it('should parse JavaScript files', async () => {
    const builder = new AstBuilder();
    const result = await builder.build({
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

  it('should calculate cyclomatic complexity for functions', async () => {
    const ast = await new AstBuilder().build({
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

  it('should calculate cognitive complexity focusing on nesting', async () => {
    const ast = await new AstBuilder().build({
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

  it('should parse Python files using basic parser', async () => {
    const builder = new AstBuilder();
    const result = await builder.build({
      filePath: 'main.py',
      code: [
        'import os',
        'class User:',
        '    def __init__(self, name):',
        '        self.name = name',
        '    def say_hi(self):',
        '        print(f"Hi {self.name}")',
        'def main():',
        '    u = User("John")',
        '    u.say_hi()'
      ].join('\n')
    });

    expect(result.language).toBe('python');
    expect(result.metrics.classes).toBe(1);
    expect(result.metrics.functions).toBe(1);
    expect(result.metrics.methods).toBe(2);
    expect(result.metrics.imports).toBe(1);
  });

  it('should parse Go files including structs and interfaces', async () => {
    const builder = new AstBuilder();
    const result = await builder.build({
      filePath: 'main.go',
      code: `
        package main
        import "fmt"
        type Service interface {
            DoWork() error
        }
        type MyService struct {
            ID string
        }
        func (s *MyService) DoWork() error {
            fmt.Println("working")
            return nil
        }
        func main() {
            fmt.Println("hi")
        }
      `
    });

    expect(result.language).toBe('go');
    expect(result.metrics.interfaces).toBe(1);
    expect(result.metrics.classes).toBe(1); // Struct mapped to class
    expect(result.metrics.methods).toBe(1);
    expect(result.metrics.functions).toBe(1);
    expect(result.metrics.imports).toBe(1);
    
    expect(result.root.children.some(c => c.kind === 'interface' && c.name === 'Service')).toBe(true);
    expect(result.root.children.some(c => c.kind === 'class' && c.name === 'MyService')).toBe(true);
  });
});
