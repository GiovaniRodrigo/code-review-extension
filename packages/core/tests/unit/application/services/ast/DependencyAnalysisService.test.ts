import { describe, expect, it } from 'vitest';
import { DependencyAnalysisService } from '../../../../../src/application/services/ast/DependencyAnalysisService';
import { DependencyGraph, DependencyNode } from '../../../../../src/ports/ast/DependencyGraphPort';

describe('DependencyAnalysisService', () => {
  it('should detect cycles in a dependency graph', () => {
    const nodes = new Map<string, DependencyNode>();
    
    // Cycle: A -> B -> C -> A
    nodes.set('A.ts', { filePath: 'A.ts', imports: [], dependsOn: ['B.ts'], dependedBy: ['C.ts'] });
    nodes.set('B.ts', { filePath: 'B.ts', imports: [], dependsOn: ['C.ts'], dependedBy: ['A.ts'] });
    nodes.set('C.ts', { filePath: 'C.ts', imports: [], dependsOn: ['A.ts'], dependedBy: ['B.ts'] });
    nodes.set('D.ts', { filePath: 'D.ts', imports: [], dependsOn: ['A.ts'], dependedBy: [] });

    const graph: DependencyGraph = { nodes };
    const service = new DependencyAnalysisService();
    const cycles = service.findCycles(graph);

    expect(cycles.length).toBeGreaterThan(0);
    expect(cycles[0].path).toEqual(['A.ts', 'B.ts', 'C.ts', 'A.ts']);
  });

  it('should return empty if no cycles', () => {
    const nodes = new Map<string, DependencyNode>();
    nodes.set('A.ts', { filePath: 'A.ts', imports: [], dependsOn: ['B.ts'], dependedBy: [] });
    nodes.set('B.ts', { filePath: 'B.ts', imports: [], dependsOn: [], dependedBy: ['A.ts'] });

    const graph: DependencyGraph = { nodes };
    const service = new DependencyAnalysisService();
    const cycles = service.findCycles(graph);

    expect(cycles).toHaveLength(0);
  });
});
