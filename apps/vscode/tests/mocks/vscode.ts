import { vi } from 'vitest';
import path from 'node:path';

export interface Disposable {
  dispose(): void;
}

export const Disposable = {
  from: (...items: Disposable[]) => ({
    dispose: () => items.forEach(item => item?.dispose?.())
  })
};

const makeDisposable = (): Disposable => ({ dispose: vi.fn() });

export class Uri {
  fsPath: string;
  path: string;
  scheme: string;

  constructor(fsPath: string, scheme = 'file') {
    this.fsPath = fsPath;
    this.path = fsPath;
    this.scheme = scheme;
  }

  static file(filePath: string): Uri {
    return new Uri(path.resolve(filePath));
  }

  static parse(value: string): Uri {
    return new Uri(value, value.includes(':') ? value.split(':')[0] : 'file');
  }

  toString(): string {
    return this.fsPath;
  }
}

export class Position {
  constructor(public line: number, public character: number) {}
}

export class Range {
  start: Position;
  end: Position;

  constructor(startLine: number | Position, startCharacter: number | Position, endLine?: number, endCharacter?: number) {
    if (startLine instanceof Position && startCharacter instanceof Position) {
      this.start = startLine;
      this.end = startCharacter;
      return;
    }

    this.start = new Position(Number(startLine), Number(startCharacter));
    this.end = new Position(Number(endLine ?? startLine), Number(endCharacter ?? startCharacter));
  }
}

export class Selection extends Range {}

export enum DiagnosticSeverity {
  Error = 0,
  Warning = 1,
  Information = 2,
  Hint = 3
}

export class Diagnostic {
  source?: string;
  code?: string;

  constructor(
    public range: Range,
    public message: string,
    public severity: DiagnosticSeverity
  ) {}
}

export enum ProgressLocation {
  SourceControl = 1,
  Window = 10,
  Notification = 15
}

export enum TextEditorRevealType {
  Default = 0,
  InCenter = 1,
  InCenterIfOutsideViewport = 2,
  AtTop = 3
}

export enum ViewColumn {
  Active = -1,
  Beside = -2,
  One = 1,
  Two = 2,
  Three = 3
}

export const workspace: any = {
  workspaceFolders: [
    {
      name: 'workspace',
      uri: Uri.file('/tmp/workspace')
    }
  ],
  getConfiguration: vi.fn(() => ({
    get: vi.fn((key: string, defaultValue?: any) => defaultValue),
    update: vi.fn(async () => undefined),
    has: vi.fn(() => false),
    inspect: vi.fn(() => undefined)
  })),
  findFiles: vi.fn(async () => []),
  openTextDocument: vi.fn(async (uriOrPath: Uri | string) => ({
    uri: typeof uriOrPath === 'string' ? Uri.file(uriOrPath) : uriOrPath,
    getText: vi.fn(() => ''),
    lineAt: vi.fn(() => ({ text: '', range: new Range(0, 0, 0, 0) }))
  })),
  fs: {
    readFile: vi.fn(async () => new Uint8Array()),
    writeFile: vi.fn(async () => undefined),
    stat: vi.fn(async () => ({ type: 1 }))
  },
  onDidChangeConfiguration: vi.fn(() => makeDisposable()),
  onDidSaveTextDocument: vi.fn(() => makeDisposable()),
  onDidChangeWorkspaceFolders: vi.fn(() => makeDisposable())
};

export const window: any = {
  activeTextEditor: undefined,
  visibleTextEditors: [],
  showInformationMessage: vi.fn(async (_message: string, ...items: any[]) => items[0]),
  showWarningMessage: vi.fn(async (_message: string, ...items: any[]) => items[0]),
  showErrorMessage: vi.fn(async (_message: string, ...items: any[]) => items[0]),
  showInputBox: vi.fn(async () => undefined),
  showQuickPick: vi.fn(async (items: any[]) => Array.isArray(items) ? items[0] : undefined),
  showTextDocument: vi.fn(async (document: any) => ({
    document,
    selection: undefined,
    revealRange: vi.fn(),
    edit: vi.fn(async (callback: any) => {
      callback({ replace: vi.fn() });
      return true;
    })
  })),
  withProgress: vi.fn(async (_options: any, task: any) => task({ report: vi.fn() }, { isCancellationRequested: false })),
  registerWebviewViewProvider: vi.fn(() => makeDisposable()),
  createWebviewPanel: vi.fn(() => ({
    webview: {
      html: '',
      postMessage: vi.fn(async () => true),
      onDidReceiveMessage: vi.fn(() => makeDisposable())
    },
    reveal: vi.fn(),
    dispose: vi.fn(),
    onDidDispose: vi.fn(() => makeDisposable())
  }))
};

export const commands: any = {
  registerCommand: vi.fn(() => makeDisposable()),
  executeCommand: vi.fn(async () => undefined),
  getCommands: vi.fn(async () => [])
};

export const languages: any = {
  createDiagnosticCollection: vi.fn(() => {
    const diagnostics = new Map<string, Diagnostic[]>();
    return {
      set: vi.fn((uri: Uri, items: Diagnostic[]) => diagnostics.set(uri.toString(), items)),
      get: vi.fn((uri: Uri) => diagnostics.get(uri.toString()) ?? []),
      clear: vi.fn(() => diagnostics.clear()),
      delete: vi.fn((uri: Uri) => diagnostics.delete(uri.toString())),
      dispose: vi.fn(() => diagnostics.clear())
    };
  })
};

export const extensions: any = {
  getExtension: vi.fn(() => undefined)
};

export const env: any = {
  appName: 'Visual Studio Code',
  machineId: 'test-machine',
  openExternal: vi.fn(async () => true),
  clipboard: {
    readText: vi.fn(async () => ''),
    writeText: vi.fn(async () => undefined)
  }
};

export class EventEmitter<T = any> {
  private listeners: Array<(event: T) => any> = [];
  event = (listener: (event: T) => any): Disposable => {
    this.listeners.push(listener);
    return makeDisposable();
  };
  fire(event: T): void {
    this.listeners.forEach(listener => listener(event));
  }
  dispose(): void {
    this.listeners = [];
  }
}

export function resetVscodeMock(): void {
  vi.clearAllMocks();
  workspace.workspaceFolders = [{ name: 'workspace', uri: Uri.file('/tmp/workspace') }];
  workspace.findFiles = vi.fn(async () => []);
  workspace.openTextDocument = vi.fn(async (uriOrPath: Uri | string) => ({
    uri: typeof uriOrPath === 'string' ? Uri.file(uriOrPath) : uriOrPath,
    getText: vi.fn(() => ''),
    lineAt: vi.fn(() => ({ text: '', range: new Range(0, 0, 0, 0) }))
  }));
  workspace.fs = {
    readFile: vi.fn(async () => new Uint8Array()),
    writeFile: vi.fn(async () => undefined),
    stat: vi.fn(async () => ({ type: 1 }))
  };
  window.activeTextEditor = undefined;
  window.visibleTextEditors = [];
  extensions.getExtension = vi.fn(() => undefined);
}
