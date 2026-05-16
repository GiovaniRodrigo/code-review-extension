import { describe, expect, it } from 'vitest';
import { flattenAstNodes } from '../../../src/shared/astUtils';
import { AstNodeSummary } from '../../../src/shared/astTypes';

describe('astUtils', () => {
  it('should flatten nested AST nodes', () => {
    const root: AstNodeSummary = {
      kind: 'sourceFile',
      name: 'root',
      startLine: 1,
      endLine: 10,
      children: [
        { kind: 'class', name: 'C1', startLine: 2, endLine: 5, children: [
            { kind: 'method', name: 'M1', startLine: 3, endLine: 4, children: [] }
        ]},
        { kind: 'function', name: 'F1', startLine: 6, endLine: 8, children: [] }
      ]
    };

    const flattened = flattenAstNodes(root);
    expect(flattened).toHaveLength(4);
    expect(flattened.map(n => n.name)).toEqual(['root', 'C1', 'M1', 'F1']);
  });

  it('should handle null or undefined children gracefully', () => {
      const root = { name: 'root', children: null } as any;
      expect(flattenAstNodes(root)).toHaveLength(1);
      expect(flattenAstNodes(undefined as any)).toHaveLength(0);
  });
});
