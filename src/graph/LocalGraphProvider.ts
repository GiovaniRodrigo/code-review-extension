import { GraphProvider, ReviewGraph, GraphNode, GraphEdge } from '../contracts';
import { SourceAst, findAstNodes, getImportSources } from '../domain/ast/sourceAst';

export class LocalGraphProvider implements GraphProvider {
  async buildFromAst(asts: SourceAst[]): Promise<ReviewGraph> {
    const nodes: GraphNode[] = [];
    const edges: GraphEdge[] = [];

    for (const ast of asts) {
      const fileId = `file:${ast.path}`;
      nodes.push({ id: fileId, type: 'file', label: ast.path, metadata: { local: true } });

      for (const source of getImportSources(ast)) {
        const depId = `dependency:${source}`;
        if (!nodes.some((node) => node.id === depId)) {
          nodes.push({ id: depId, type: 'dependency', label: source });
        }
        edges.push({ from: fileId, to: depId, type: 'depends_on', weight: 1 });
      }

      const declarations = findAstNodes(ast, (node) => node.kind === 'ClassDeclaration' || node.kind === 'InterfaceDeclaration' || node.kind === 'MethodDeclaration');
      for (const declaration of declarations) {
        const nodeType = declaration.kind === 'MethodDeclaration' ? 'method' : 'class';
        const declarationId = `${nodeType}:${ast.path}:${declaration.name ?? declaration.line}`;
        nodes.push({ id: declarationId, type: nodeType, label: declaration.name ?? `${nodeType}@${declaration.line}`, metadata: { line: declaration.line } });
        edges.push({ from: fileId, to: declarationId, type: 'contains' });
      }
    }

    return { nodes, edges };
  }

  async getImpactContext(graph: ReviewGraph, changedFiles: string[]): Promise<ReviewGraph> {
    const changedIds = new Set(changedFiles.map((file) => `file:${file}`));
    const impactedIds = new Set<string>(changedIds);

    for (const edge of graph.edges) {
      if (changedIds.has(edge.from) || changedIds.has(edge.to)) {
        impactedIds.add(edge.from);
        impactedIds.add(edge.to);
      }
    }

    return {
      nodes: graph.nodes.filter((node) => impactedIds.has(node.id)),
      edges: graph.edges.filter((edge) => impactedIds.has(edge.from) && impactedIds.has(edge.to))
    };
  }
}
