export interface IdeAdapterPort {
  getActiveFileContent(): Promise<string>;
  getActiveFilePath(): Promise<string>;
  getActiveBranch(): Promise<string>;
}
