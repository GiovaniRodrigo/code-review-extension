import { Finding } from '@code-review/domain';

export interface IdeAdapterPort {
  getActiveFileContent(): Promise<string>;
  getActiveFilePath(): Promise<string>;
  getActiveBranch(): Promise<string>;
  showFinding(finding: Finding): Promise<void>;
  focusFinding(finding: Finding): Promise<void>;
  applyFix(finding: Finding): Promise<void>;
}
