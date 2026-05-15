import { Project } from 'ts-morph';
import { DependencyGraph, DependencyGraphPort, DependencyNode } from '@code-review/core';
import path from 'path';

export class TypeScriptDependencyGraphBuilder implements DependencyGraphPort {
  async buildGraph(files: { filePath: string, code: string }[]): Promise<DependencyGraph> {
    const project = new Project({ useInMemoryFileSystem: true });
    files.forEach(f => project.createSourceFile(f.filePath, f.code));

    const nodes = new Map<string, DependencyNode>();

    // Pass 1: Initialize nodes
    project.getSourceFiles().forEach(sourceFile => {
      const filePath = sourceFile.getFilePath();
      const imports = sourceFile.getImportDeclarations().map(imp => imp.getModuleSpecifierValue());
      
      nodes.set(filePath, {
        filePath,
        imports,
        dependsOn: [],
        dependedBy: []
      });
    });

    // Pass 2: Resolve dependencies
    nodes.forEach((node, filePath) => {
      node.imports.forEach(importPath => {
        const resolvedPath = this._resolveImport(filePath, importPath, nodes);
        if (resolvedPath && nodes.has(resolvedPath)) {
          node.dependsOn.push(resolvedPath);
          nodes.get(resolvedPath)!.dependedBy.push(filePath);
        }
      });
    });

    return { nodes };
  }

  private _resolveImport(fromPath: string, importPath: string, nodes: Map<string, DependencyNode>): string | null {
    if (!importPath.startsWith('.')) {
      return null; // External or alias (simplicity for now)
    }

    const absolutePath = path.resolve(path.dirname(fromPath), importPath);
    
    // Try common extensions
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.js'];
    for (const ext of extensions) {
      const fullPath = absolutePath + ext;
      if (nodes.has(fullPath)) return fullPath;
      
      const normalizedPath = fullPath.replace(/\/index\.(ts|js)$/, '');
      if (nodes.has(normalizedPath)) return normalizedPath;
    }

    // Try without extension if it's already there
    if (nodes.has(absolutePath)) return absolutePath;

    return null;
  }
}
