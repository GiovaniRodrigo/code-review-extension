import { describe, expect, it } from 'vitest';
import { TypeScriptDependencyGraphBuilder } from '../../../src/ast/TypeScriptDependencyGraphBuilder';
import path from 'path';

describe('TypeScriptDependencyGraphBuilder', () => {
  it('deve construir grafo de dependências entre dois arquivos', async () => {
    const builder = new TypeScriptDependencyGraphBuilder();
    
    const fileA = {
      filePath: '/src/a.ts',
      code: `import { b } from './b'; export const a = b + 1;`
    };
    const fileB = {
      filePath: '/src/b.ts',
      code: `export const b = 2;`
    };

    const graph = await builder.buildGraph([fileA, fileB]);

    expect(graph.nodes.size).toBe(2);
    
    const nodeA = graph.nodes.get('/src/a.ts');
    const nodeB = graph.nodes.get('/src/b.ts');

    expect(nodeA).toBeDefined();
    expect(nodeB).toBeDefined();

    expect(nodeA?.dependsOn).toContain('/src/b.ts');
    expect(nodeB?.dependedBy).toContain('/src/a.ts');
  });
});
