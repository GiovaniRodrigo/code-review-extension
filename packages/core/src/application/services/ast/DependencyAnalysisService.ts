import { DependencyGraph, DependencyNode } from '../../../ports/ast/DependencyGraphPort';

export interface Cycle {
  path: string[];
}

export class DependencyAnalysisService {
  findCycles(graph: DependencyGraph): Cycle[] {
    const cycles: Cycle[] = [];
    const visited = new Set<string>();
    const stack = new Set<string>();

    const traverse = (nodePath: string[], currentNode: string) => {
      visited.add(currentNode);
      stack.add(currentNode);

      const node = graph.nodes.get(currentNode);
      if (node) {
        for (const neighbor of node.dependsOn) {
          if (!visited.has(neighbor)) {
            traverse([...nodePath, neighbor], neighbor);
          } else if (stack.has(neighbor)) {
            // Cycle detected
            const cyclePath = nodePath.slice(nodePath.indexOf(neighbor));
            cycles.push({ path: [...cyclePath, neighbor] });
          }
        }
      }

      stack.delete(currentNode);
    };

    for (const filePath of graph.nodes.keys()) {
      if (!visited.has(filePath)) {
        traverse([filePath], filePath);
      }
    }

    return cycles;
  }
}
