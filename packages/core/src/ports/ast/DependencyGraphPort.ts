export interface DependencyNode {
  filePath: string;
  imports: string[];
  dependsOn: string[];
  dependedBy: string[];
}

export interface DependencyGraph {
  nodes: Map<string, DependencyNode>;
}

export interface DependencyGraphPort {
  buildGraph(files: { filePath: string, code: string }[]): Promise<DependencyGraph>;
}
