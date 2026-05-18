import { DependencyGraph, DependencyGraphPort, DependencyNode } from '@code-review/core';
import path from 'path';

const IMPORT_PATTERNS = [
  /import\s+(?:type\s+)?(?:[^'";]+?\s+from\s+)?['"]([^'"]+)['"]/g,
  /export\s+(?:type\s+)?[^'";]+?\s+from\s+['"]([^'"]+)['"]/g,
  /require\(\s*['"]([^'"]+)['"]\s*\)/g,
  /import\(\s*['"]([^'"]+)['"]\s*\)/g,
  /(?:include|include_once|require|require_once)\s*(?:\(\s*)?['"]([^'"]+)['"]\s*\)?/g
];

const EXTENSIONS = [
  '',
  '.ts',
  '.tsx',
  '.js',
  '.jsx',
  '.mjs',
  '.cjs',
  '.php',
  '.vue',
  '/index.ts',
  '/index.tsx',
  '/index.js',
  '/index.jsx',
  '/index.php'
];

export class TypeScriptDependencyGraphBuilder implements DependencyGraphPort {
  async buildGraph(files: { filePath: string, code: string }[]): Promise<DependencyGraph> {
    const normalizedFiles = files.map(file => ({
      filePath: normalizePath(file.filePath),
      code: file.code ?? ''
    }));
    const byPath = new Map(normalizedFiles.map(file => [file.filePath, file]));
    const nodes = new Map<string, DependencyNode>();

    for (const file of normalizedFiles) {
      nodes.set(file.filePath, {
        filePath: file.filePath,
        imports: extractImports(file.code),
        dependsOn: [],
        dependedBy: []
      });
    }

    for (const node of nodes.values()) {
      const uniqueDependencies = new Set<string>();
      for (const importPath of node.imports) {
        const resolvedPath = this.resolveImport(node.filePath, importPath, byPath);
        if (resolvedPath && resolvedPath !== node.filePath) {
          uniqueDependencies.add(resolvedPath);
        }
      }

      node.dependsOn = Array.from(uniqueDependencies).sort();
      for (const dependency of node.dependsOn) {
        const dependencyNode = nodes.get(dependency);
        if (dependencyNode && !dependencyNode.dependedBy.includes(node.filePath)) {
          dependencyNode.dependedBy.push(node.filePath);
          dependencyNode.dependedBy.sort();
        }
      }
    }

    return { nodes };
  }

  private resolveImport(
    fromPath: string,
    importPath: string,
    files: Map<string, { filePath: string, code: string }>
  ): string | null {
    if (!importPath || isExternalImport(importPath)) return null;

    const fromDir = normalizePath(path.posix.dirname(normalizePath(fromPath)));
    const base = normalizePath(path.posix.resolve(fromDir, importPath));

    for (const extension of EXTENSIONS) {
      const candidate = normalizePath(base + extension);
      if (files.has(candidate)) return candidate;
    }

    return null;
  }
}

function extractImports(code: string): string[] {
  const imports = new Set<string>();
  for (const pattern of IMPORT_PATTERNS) {
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(code)) !== null) {
      if (match[1]) imports.add(match[1].trim());
    }
  }
  return Array.from(imports).sort();
}

function isExternalImport(importPath: string): boolean {
  return !importPath.startsWith('.') && !importPath.startsWith('/');
}

function normalizePath(value: string): string {
  return value.replace(/\\/g, '/').replace(/\/+/g, '/').replace(/\/$/, '');
}
