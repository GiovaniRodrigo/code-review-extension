import { SourceAst } from '../../domain/ast/sourceAst';

export type GraphNodeType = 'file' | 'class' | 'function' | 'method' | 'dependency' | 'diagnostic' | 'comment' | 'review';
export type GraphEdgeType = 'contains' | 'depends_on' | 'violates' | 'commented_on' | 'impacts' | 'belongs_to';

export interface GraphNode {
  id: string;
  type: GraphNodeType;
  label: string;
  metadata?: Record<string, unknown>;
}

export interface GraphEdge {
  from: string;
  to: string;
  type: GraphEdgeType;
  weight?: number;
}

export interface ReviewGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GraphProvider {
  buildFromAst(asts: SourceAst[]): Promise<ReviewGraph>;
  getImpactContext(graph: ReviewGraph, changedFiles: string[]): Promise<ReviewGraph>;
}
