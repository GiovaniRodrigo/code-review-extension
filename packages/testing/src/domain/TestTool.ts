export type TestToolKind =
  | 'unit'
  | 'integration'
  | 'architecture'
  | 'regression'
  | 'lint'
  | 'dependencies'
  | 'coverage';

export interface TestToolResult {
  tool: string;
  kind: TestToolKind;
  passed: boolean;
  details: string;
}

export interface TestTool {
  name: string;
  kind: TestToolKind;
  run(): Promise<TestToolResult>;
}
