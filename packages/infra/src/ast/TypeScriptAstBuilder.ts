import { Project, Node } from 'ts-morph';
import { 
  AstBuilderPort, 
  AstBuildInput, 
  AstBuildResult, 
  AstNodeSummary, 
  AstMetrics,
  AstNodeKind 
} from '@code-review/core';

export class TypeScriptAstBuilder implements AstBuilderPort {
  async build(input: AstBuildInput): Promise<AstBuildResult> {
    const ext = input.filePath.split('.').pop()?.toLowerCase();
    const isSupported = ['ts', 'tsx', 'js', 'jsx'].includes(ext || '');

    if (!isSupported) {
      return {
        filePath: input.filePath,
        language: input.language || 'unknown',
        root: {
          kind: 'sourceFile',
          name: input.filePath,
          startLine: 1,
          endLine: input.code.split('\n').length,
          children: []
        },
        metrics: {
          imports: 0, exports: 0, classes: 0, interfaces: 0,
          functions: 0, methods: 0, properties: 0, variables: 0,
          maxDepth: 1
        }
      };
    }

    const project = new Project({ useInMemoryFileSystem: true });
    const sourceFile = project.createSourceFile(input.filePath, input.code);

    const root: AstNodeSummary = {
      kind: 'sourceFile',
      name: input.filePath,
      startLine: 1,
      endLine: sourceFile.getEndLineNumber(),
      children: []
    };

    sourceFile.forEachChild(child => {
      const summary = this._summarizeNode(child);
      if (summary) {
        root.children.push(summary);
      }
    });

    return {
      filePath: input.filePath,
      language: input.language || 'typescript',
      root,
      metrics: this._collectMetrics(root)
    };
  }

  private _summarizeNode(node: Node): AstNodeSummary | null {
    let kind: AstNodeKind = 'unknown';
    let name = '';

    if (Node.isImportDeclaration(node)) {
      kind = 'import';
      name = node.getModuleSpecifierValue();
    } else if (Node.isExportDeclaration(node)) {
      kind = 'export';
      name = node.getModuleSpecifierValue() || 'named export';
    } else if (Node.isClassDeclaration(node)) {
      kind = 'class';
      name = node.getName() || 'anonymous class';
    } else if (Node.isInterfaceDeclaration(node)) {
      kind = 'interface';
      name = node.getName();
    } else if (Node.isMethodDeclaration(node) || Node.isMethodSignature(node)) {
      kind = 'method';
      name = node.getName();
    } else if (Node.isPropertyDeclaration(node) || Node.isPropertySignature(node)) {
      kind = 'property';
      name = node.getName();
    } else if (Node.isFunctionDeclaration(node)) {
      kind = 'function';
      name = node.getName() || 'anonymous function';
    } else if (Node.isVariableStatement(node)) {
      kind = 'variable';
      name = node.getDeclarations().map(d => d.getName()).join(', ');
    } else if (Node.isStringLiteral(node)) {
      kind = 'literal';
      name = node.getLiteralText();
    }

    if (kind === 'unknown' && !this._shouldRecurse(node)) {
      return null;
    }

    const summary: AstNodeSummary = {
      kind,
      name,
      startLine: node.getStartLineNumber(),
      endLine: node.getEndLineNumber(),
      children: []
    };

    node.forEachChild(child => {
      const childSummary = this._summarizeNode(child);
      if (childSummary) {
        summary.children.push(childSummary);
      }
    });

    return kind === 'unknown' && summary.children.length === 0 ? null : summary;
  }

  private _shouldRecurse(node: Node): boolean {
    return Node.isBlock(node) || Node.isSourceFile(node) || Node.isClassDeclaration(node) || Node.isInterfaceDeclaration(node);
  }

  private _collectMetrics(root: AstNodeSummary): AstMetrics {
    const metrics: AstMetrics = {
      imports: 0,
      exports: 0,
      classes: 0,
      interfaces: 0,
      functions: 0,
      methods: 0,
      properties: 0,
      variables: 0,
      maxDepth: 1
    };

    const visit = (node: AstNodeSummary, depth: number) => {
      metrics.maxDepth = Math.max(metrics.maxDepth, depth);

      if (node.kind === 'import') metrics.imports += 1;
      if (node.kind === 'export') metrics.exports += 1;
      if (node.kind === 'class') metrics.classes += 1;
      if (node.kind === 'interface') metrics.interfaces += 1;
      if (node.kind === 'function') metrics.functions += 1;
      if (node.kind === 'method') metrics.methods += 1;
      if (node.kind === 'property') metrics.properties += 1;
      if (node.kind === 'variable') metrics.variables += 1;

      node.children.forEach(child => visit(child, depth + 1));
    };

    visit(root, 1);
    return metrics;
  }
}
