import { vi } from 'vitest';

export class Position {
  constructor(public readonly line: number, public readonly character: number) {}
}

export class Range {
  public readonly start: Position;
  public readonly end: Position;

  constructor(
    startLine: number | Position,
    startCharacter: number | Position,
    endLine?: number,
    endCharacter?: number
  ) {
    if (startLine instanceof Position && startCharacter instanceof Position) {
      this.start = startLine;
      this.end = startCharacter;
      return;
    }

    this.start = new Position(startLine as number, startCharacter as number);
    this.end = new Position(endLine ?? (startLine as number), endCharacter ?? (startCharacter as number));
  }
}

export class Selection extends Range {}

export class Diagnostic {
  public source?: string;
  public code?: string;

  constructor(
    public readonly range: Range,
    public readonly message: string,
    public readonly severity: DiagnosticSeverity
  ) {}
}

export enum DiagnosticSeverity {
  Error = 0,
  Warning = 1,
  Information = 2,
  Hint = 3
}

export enum TextEditorRevealType {
  Default = 0,
  InCenter = 1,
  InCenterIfOutsideViewport = 2,
  AtTop = 3
}

export const Uri = {
  file: vi.fn((fsPath: string) => ({ fsPath, path: fsPath, scheme: 'file' }))
};

export const languages = {
  createDiagnosticCollection: vi.fn(() => ({
    set: vi.fn(),
    clear: vi.fn(),
    dispose: vi.fn()
  }))
};

export const workspace = {
  workspaceFolders: [{ name: 'main', uri: { fsPath: '/tmp/workspace' } }],

  getConfiguration: vi.fn(() => ({
    get: vi.fn((_key: string, defaultValue?: unknown) => defaultValue)
  })),

  openTextDocument: vi.fn()
};

export const commands = {
  registerCommand: vi.fn(() => ({ dispose: vi.fn() })),
  executeCommand: vi.fn(),
  getCommands: vi.fn(async () => [])
};

export const window = {
  activeTextEditor: undefined as any,
  visibleTextEditors: [] as any[],

  showInformationMessage: vi.fn(),
  showErrorMessage: vi.fn(),
  showWarningMessage: vi.fn(),
  showInputBox: vi.fn(),

  showTextDocument: vi.fn(),
  createWebviewPanel: vi.fn(),
  registerWebviewViewProvider: vi.fn(() => ({ dispose: vi.fn() }))
};

export const extensions = {
  getExtension: vi.fn(() => ({
    activate: vi.fn(),
    isActive: true,
    exports: {
      getAPI: () => ({ repositories: [] })
    }
  }))
};
