import { describe, it, expect, vi } from 'vitest';
import { VSCodeNotificationAdapter } from '../../../src/adapters/ide/VSCodeNotificationAdapter';
import { VSCodeWorkspaceAdapter } from '../../../src/adapters/ide/VSCodeWorkspaceAdapter';
import * as vscode from 'vscode';

describe('Adapters Functions Smoke Tests', () => {
  it('VSCodeNotificationAdapter should call vscode window methods', async () => {
    const adapter = new VSCodeNotificationAdapter();
    await adapter.info('test');
    expect(vscode.window.showInformationMessage).toHaveBeenCalledWith('test');
    await adapter.warning('test');
    expect(vscode.window.showWarningMessage).toHaveBeenCalledWith('test');
    await adapter.error('test');
    expect(vscode.window.showErrorMessage).toHaveBeenCalledWith('test');
  });

  it('VSCodeWorkspaceAdapter should call workspace methods', async () => {
    const adapter = new VSCodeWorkspaceAdapter();
    (vscode.workspace as any).findFiles = vi.fn().mockResolvedValue([]);
    
    adapter.getWorkspacePath();
    expect(vscode.workspace.workspaceFolders).toBeDefined();
    await adapter.findFiles('**/*.ts');
    expect(vscode.workspace.findFiles).toHaveBeenCalled();
  });
});
