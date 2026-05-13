import ts from 'typescript';

export type AstNodeKind =
  | 'sourceFile'
  | 'import'
  | 'export'
  | 'class'
  | 'interface'
  | 'function'
  | 'method'
  | 'property'
  | 'variable'
  | 'unknown';

export interface AstNodeSummary {
  kind: AstNodeKind;
  name: string;
  startLine: number;
  endLine: number;
  children: AstNodeSummary[];
}

export interface AstMetrics {
  imports: number;
  exports: number;
  classes: number;
  interfaces: number;
  functions: number;
  methods: number;
  properties: number;
  variables: number;
  maxDepth: number;
}

export interface AstBuildInput {
  filePath: string;
  code: string;
  language?: string;
}

export interface AstBuildResult {
  filePath: string;
  language: string;
  root: AstNodeSummary;
  metrics: AstMetrics;
}

export class AstBuilder {
  build(input: AstBuildInput): AstBuildResult {
    const language = input.language || this._detectLanguage(input.filePath);
    const sourceFile = ts.createSourceFile(
      input.filePath,
      input.code,
      ts.ScriptTarget.Latest,
      true,
      this._scriptKindFor(language)
    );

    const root: AstNodeSummary = {
      kind: 'sourceFile',
      name: input.filePath,
      startLine: 1,
      endLine: this._lineOf(sourceFile, sourceFile.end),
      children: []
    };

    sourceFile.statements.forEach(statement => {
      const summary = this._summarizeNode(statement, sourceFile);
      if (summary) {
        root.children.push(summary);
      }
    });

    return {
      filePath: input.filePath,
      language,
      root,
      metrics: this._collectMetrics(root)
    };
  }

  private _summarizeNode(node: ts.Node, sourceFile: ts.SourceFile): AstNodeSummary | null {
    if (ts.isImportDeclaration(node)) {
      return this._createSummary('import', this._importName(node), node, sourceFile);
    }

    if (ts.isExportDeclaration(node)) {
      return this._createSummary('export', this._exportName(node), node, sourceFile);
    }

    if (ts.isClassDeclaration(node)) {
      const summary = this._createSummary('class', node.name?.getText(sourceFile) || 'anonymous class', node, sourceFile);
      node.members.forEach(member => {
        const child = this._summarizeClassMember(member, sourceFile);
        if (child) {
          summary.children.push(child);
        }
      });
      return summary;
    }

    if (ts.isInterfaceDeclaration(node)) {
      const summary = this._createSummary('interface', node.name.getText(sourceFile), node, sourceFile);
      node.members.forEach(member => {
        const child = this._summarizeInterfaceMember(member, sourceFile);
        if (child) {
          summary.children.push(child);
        }
      });
      return summary;
    }

    if (ts.isFunctionDeclaration(node)) {
      return this._createSummary('function', node.name?.getText(sourceFile) || 'anonymous function', node, sourceFile);
    }

    if (ts.isVariableStatement(node)) {
      const summary = this._createSummary('variable', this._variableNames(node, sourceFile), node, sourceFile);
      return summary;
    }

    if (this._hasExportModifier(node)) {
      return this._createSummary('export', this._nodeName(node, sourceFile), node, sourceFile);
    }

    return null;
  }

  private _summarizeClassMember(node: ts.ClassElement, sourceFile: ts.SourceFile): AstNodeSummary | null {
    if (ts.isMethodDeclaration(node) || ts.isConstructorDeclaration(node)) {
      return this._createSummary('method', this._nodeName(node, sourceFile), node, sourceFile);
    }

    if (ts.isPropertyDeclaration(node) || ts.isGetAccessorDeclaration(node) || ts.isSetAccessorDeclaration(node)) {
      return this._createSummary('property', this._nodeName(node, sourceFile), node, sourceFile);
    }

    return null;
  }

  private _summarizeInterfaceMember(node: ts.TypeElement, sourceFile: ts.SourceFile): AstNodeSummary | null {
    if (ts.isMethodSignature(node)) {
      return this._createSummary('method', this._nodeName(node, sourceFile), node, sourceFile);
    }

    if (ts.isPropertySignature(node)) {
      return this._createSummary('property', this._nodeName(node, sourceFile), node, sourceFile);
    }

    return null;
  }

  private _createSummary(kind: AstNodeKind, name: string, node: ts.Node, sourceFile: ts.SourceFile): AstNodeSummary {
    return {
      kind,
      name,
      startLine: this._lineOf(sourceFile, node.getStart(sourceFile)),
      endLine: this._lineOf(sourceFile, node.getEnd()),
      children: []
    };
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

  private _lineOf(sourceFile: ts.SourceFile, position: number): number {
    return sourceFile.getLineAndCharacterOfPosition(position).line + 1;
  }

  private _scriptKindFor(language: string): ts.ScriptKind {
    if (language === 'typescript' || language === 'ts') return ts.ScriptKind.TS;
    if (language === 'tsx') return ts.ScriptKind.TSX;
    if (language === 'javascript' || language === 'js') return ts.ScriptKind.JS;
    if (language === 'jsx') return ts.ScriptKind.JSX;
    return ts.ScriptKind.Unknown;
  }

  private _detectLanguage(filePath: string): string {
    const ext = filePath.split('.').pop()?.toLowerCase();
    if (ext === 'ts') return 'typescript';
    if (ext === 'tsx') return 'tsx';
    if (ext === 'js') return 'javascript';
    if (ext === 'jsx') return 'jsx';
    return 'text';
  }

  private _importName(node: ts.ImportDeclaration): string {
    return node.moduleSpecifier.getText().replace(/^['"]|['"]$/g, '');
  }

  private _exportName(node: ts.ExportDeclaration): string {
    return node.moduleSpecifier?.getText().replace(/^['"]|['"]$/g, '') || 'named export';
  }

  private _variableNames(node: ts.VariableStatement, sourceFile: ts.SourceFile): string {
    return node.declarationList.declarations
      .map(declaration => declaration.name.getText(sourceFile))
      .join(', ');
  }

  private _nodeName(node: ts.Node, sourceFile: ts.SourceFile): string {
    if (ts.isConstructorDeclaration(node)) {
      return 'constructor';
    }

    const namedNode = node as ts.Node & { name?: ts.Node };
    return namedNode.name?.getText(sourceFile) || 'anonymous';
  }

  private _hasExportModifier(node: ts.Node): boolean {
    if (!ts.canHaveModifiers(node)) {
      return false;
    }
    return Boolean(ts.getModifiers(node as any)?.some(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword));
  }
}
