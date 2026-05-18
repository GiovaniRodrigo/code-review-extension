import { DependencyGraphPort } from '../../../ports/ast/DependencyGraphPort';
import { IdeWorkspacePort } from '../../../ports/ide/IdeWorkspacePort';
import { IdeFileSystemPort } from '../../../ports/ide/IdeFileSystemPort';
import { DependencyAnalysisService, Cycle } from '../../services/ast/DependencyAnalysisService';

export interface DependencyAnalysisReport {
  totalFiles: number;
  renderedFiles: number;
  cycles: Cycle[];
  nodes: { id: string; filePath?: string; dependsOn: string[] }[];
}

const MAX_GRAPH_FILES = 120;

const IGNORED_SEGMENTS = new Set([
  '.git',
  '.next',
  '.nuxt',
  '.output',
  '.turbo',
  '.vscode-test',
  'build',
  'coverage',
  'dist',
  'node_modules',
  'out',
  'storage',
  'vendor'
]);

const IGNORED_SUFFIXES = [
  '.d.ts',
  '.map',
  '.min.js',
  '.spec.ts',
  '.test.ts',
  '.spec.tsx',
  '.test.tsx',
  '.snap'
];

export class AnalyzeWorkspaceDependenciesUseCase {
  constructor(
    private readonly workspace: IdeWorkspacePort,
    private readonly fileSystem: IdeFileSystemPort,
    private readonly graphBuilder: DependencyGraphPort,
    private readonly analysisService = new DependencyAnalysisService()
  ) {}

  async execute(): Promise<DependencyAnalysisReport> {
    const workspacePath = normalizePath(this.workspace.getWorkspacePath() ?? '');
    const discoveredPaths = await this.workspace.findFiles('**/*.{ts,tsx,js,jsx,php}');
    const filteredPaths = discoveredPaths
      .filter(filePath => shouldIncludeFile(filePath, workspacePath))
      .sort((a, b) => priorityScore(a, workspacePath) - priorityScore(b, workspacePath));

    const files: { filePath: string; code: string }[] = [];

    for (const filePath of filteredPaths.slice(0, MAX_GRAPH_FILES)) {
      try {
        const exists = typeof (this.fileSystem as any).exists === 'function'
          ? await this.fileSystem.exists(filePath)
          : true;
        if (!exists) continue;
        files.push({ filePath, code: await this.fileSystem.readFile(filePath) });
      } catch {
        // Broken symlinks, deleted files and unreadable generated files should not break the graph view.
      }
    }

    const graph = await this.graphBuilder.buildGraph(files);
    const cycles = this.analysisService.findCycles(graph).map(cycle => ({
      path: cycle.path.map(filePath => toDisplayPath(filePath, workspacePath))
    }));

    const nodes = Array.from(graph.nodes.values()).map(n => ({
      id: toDisplayPath(n.filePath, workspacePath),
      filePath: n.filePath,
      dependsOn: n.dependsOn.map(dep => toDisplayPath(dep, workspacePath))
    }));

    return {
      totalFiles: filteredPaths.length,
      renderedFiles: files.length,
      cycles,
      nodes
    };
  }
}

function shouldIncludeFile(filePath: string, workspacePath: string): boolean {
  const normalized = normalizePath(filePath);
  const relative = workspacePath && normalized.startsWith(`${workspacePath}/`)
    ? normalized.slice(workspacePath.length + 1)
    : normalized;

  const parts = relative.split('/').filter(Boolean);
  if (parts.some(part => IGNORED_SEGMENTS.has(part))) return false;
  if (IGNORED_SUFFIXES.some(suffix => normalized.endsWith(suffix))) return false;
  if (/\/(fixtures|fixture|__fixtures__|examples?|mocks?|__mocks__)\//i.test(`/${relative}/`)) return false;
  if (/\b(package-lock|pnpm-lock|yarn\.lock)\b/i.test(relative)) return false;
  return true;
}

function priorityScore(filePath: string, workspacePath: string): number {
  const relative = toDisplayPath(filePath, workspacePath);
  const normalized = relative.toLowerCase();
  if (normalized.startsWith('src/')) return 0;
  if (normalized.startsWith('app/')) return 1;
  if (normalized.startsWith('packages/')) return 2;
  if (normalized.startsWith('apps/')) return 3;
  if (normalized.startsWith('resources/js/')) return 4;
  if (normalized.startsWith('routes/')) return 5;
  if (normalized.startsWith('database/')) return 6;
  if (normalized.includes('/src/')) return 7;
  return 20;
}

function toDisplayPath(filePath: string, workspacePath: string): string {
  const normalized = normalizePath(filePath);
  if (workspacePath && normalized.startsWith(`${workspacePath}/`)) {
    return normalized.slice(workspacePath.length + 1);
  }
  return normalized;
}

function normalizePath(value: string): string {
  return value.replace(/\\/g, '/').replace(/\/+/g, '/').replace(/\/$/, '');
}
