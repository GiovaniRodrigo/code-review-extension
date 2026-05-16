import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as vscode from 'vscode';
import { bootstrapContainer } from '../../src/bootstrap/bootstrapContainer';

describe('Configuration Smoke Tests', () => {
  let context: any;

  beforeEach(() => {
    vi.clearAllMocks();
    context = {
      subscriptions: [],
      globalStorageUri: { fsPath: '/tmp/storage' },
      secrets: {
        get: vi.fn(async () => ''),
        store: vi.fn(async () => {})
      },
      globalState: {
        get: vi.fn(),
        update: vi.fn()
      }
    };

    // Default mock for getConfiguration
    (vscode.workspace.getConfiguration as any).mockReturnValue({
      get: vi.fn((key, defaultValue) => {
          if (key === 'ai.providers') return [];
          return defaultValue;
      }),
      update: vi.fn().mockResolvedValue(undefined)
    });
  });

  it('should initialize with default configuration', async () => {
    const container = await bootstrapContainer(context);
    expect(container).toBeDefined();
    expect(container.aiProviderRegistry).toBeDefined();
    
    // Check if we can at least check health (which means a provider is active)
    const status = await container.aiProviderRegistry.checkHealth();
    expect(status).toBeDefined();
  });

  it('should handle configuration updates', async () => {
    const container = await bootstrapContainer(context);
    
    // Simulating what happens when a user updates configuration
    // Currently, the container doesn't automatically update its internal registry.
    // This test document that behavior or the fix if implemented.
    
    const newProviderConfig = {
      id: 'custom-ollama',
      type: 'ollama',
      label: 'Custom Ollama',
      enabled: true,
      model: 'mistral'
    };

    (vscode.workspace.getConfiguration as any).mockReturnValue({
      get: vi.fn((key, defaultValue) => {
          if (key === 'ai.providers') return [newProviderConfig];
          return defaultValue;
      }),
      update: vi.fn().mockResolvedValue(undefined)
    });

    // We might need a way to refresh the container or registry
    // For now, let's just see if we can trigger a re-registration
  });
});
