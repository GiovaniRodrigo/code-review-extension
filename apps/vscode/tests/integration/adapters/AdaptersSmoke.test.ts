import { describe, it, expect, vi } from 'vitest';
import * as vscode from 'vscode';
import { VSCodeFileSystemAdapter } from '../../../src/adapters/ide/VSCodeFileSystemAdapter';
import { VSCodeProgressAdapter } from '../../../src/adapters/ide/VSCodeProgressAdapter';

describe('Adapters Smoke Tests', () => {
  it('VSCodeFileSystemAdapter should be instantiable and call vscode.fs', async () => {
    const adapter = new VSCodeFileSystemAdapter();
    (vscode.workspace as any).fs = {
        readFile: vi.fn().mockResolvedValue(new Uint8Array())
    };
    
    await adapter.readFile('/test');
    expect(vscode.workspace.fs.readFile).toHaveBeenCalled();
  });

  it('VSCodeProgressAdapter should be instantiable and call vscode.window.withProgress', async () => {
    const adapter = new VSCodeProgressAdapter();
    (vscode.window as any).withProgress = vi.fn().mockResolvedValue('result' as any);
    (vscode as any).ProgressLocation = { Notification: 15 };
    
    const result = await adapter.run('test', async () => 'result');
    expect(result).toBe('result');
    expect(vscode.window.withProgress).toHaveBeenCalled();
  });
});
