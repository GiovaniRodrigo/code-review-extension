import { AstNodeSummary } from './astTypes';

export function flattenAstNodes(root: AstNodeSummary): AstNodeSummary[] {
  if (!root) return [];
  const nodes = [root];
  if (root.children && Array.isArray(root.children)) {
    root.children.forEach(child => {
      nodes.push(...flattenAstNodes(child));
    });
  }
  return nodes;
}
