import { SourceFile } from '../architectureRules';

export type AstNodeKind =
  | 'SourceFile'
  | 'ImportDeclaration'
  | 'ClassDeclaration'
  | 'InterfaceDeclaration'
  | 'MethodDeclaration'
  | 'ConditionalStatement'
  | 'ThrowStatement'
  | 'ExternalCall';

export interface AstNode {
  kind: AstNodeKind;
  name?: string;
  value?: string;
  line: number;
  children: AstNode[];
  metadata?: Record<string, string | boolean | number>;
}

export interface SourceAst extends AstNode {
  kind: 'SourceFile';
  path: string;
  content: string;
}

export interface SourceAstBuilder {
  build(file: SourceFile): SourceAst;
}

export function createAstNode(input: Omit<AstNode, 'children'> & { children?: AstNode[] }): AstNode {
  return {
    children: [],
    ...input
  };
}

export function findAstNodes(root: AstNode, predicate: (node: AstNode) => boolean): AstNode[] {
  const matches: AstNode[] = [];
  const visit = (node: AstNode): void => {
    if (predicate(node)) matches.push(node);
    node.children.forEach(visit);
  };

  visit(root);
  return matches;
}

export function countAstNodes(root: AstNode, kind: AstNodeKind): number {
  return findAstNodes(root, (node) => node.kind === kind).length;
}

export function getImportSources(root: AstNode): string[] {
  return findAstNodes(root, (node) => node.kind === 'ImportDeclaration')
    .map((node) => node.value)
    .filter((value): value is string => Boolean(value));
}
