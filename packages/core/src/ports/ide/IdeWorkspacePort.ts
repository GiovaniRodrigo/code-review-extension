export interface IdeWorkspacePort {
  getWorkspacePath(): string | undefined;
  findFiles(pattern: string): Promise<string[]>;
}
