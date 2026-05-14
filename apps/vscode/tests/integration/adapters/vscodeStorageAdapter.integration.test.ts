import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as vscode from 'vscode';
import { VSCodeStorageAdapter } from '../../../src/adapters/ide/VSCodeStorageAdapter';

describe('VSCodeStorageAdapter Integration', () => {
  let adapter: VSCodeStorageAdapter;
  let mockContext: vscode.ExtensionContext;

  beforeEach(() => {
    vi.clearAllMocks();
    mockContext = {
      workspaceState: {
        get: vi.fn(),
        update: vi.fn()
      }
    } as any;
    adapter = new VSCodeStorageAdapter(mockContext);
  });

  it('deve buscar um valor do workspaceState', () => {
    vi.mocked(mockContext.workspaceState.get).mockReturnValue('test value');
    const value = adapter.get('test key');
    expect(value).toBe('test value');
    expect(mockContext.workspaceState.get).toHaveBeenCalledWith('test key');
  });

  it('deve salvar um valor no workspaceState', async () => {
    await adapter.set('test key', 'test value');
    expect(mockContext.workspaceState.update).toHaveBeenCalledWith('test key', 'test value');
  });

  it('deve deletar um valor do workspaceState', async () => {
    await adapter.delete('test key');
    expect(mockContext.workspaceState.update).toHaveBeenCalledWith('test key', undefined);
  });
});
