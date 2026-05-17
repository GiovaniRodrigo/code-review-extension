import { describe, it, expect, vi } from 'vitest';
import * as vscode from 'vscode';
import { getAIProviderConfigs } from '../../src/dependencies/buildContainer';

describe('AI Provider Configuration Regression Test', () => {
  it('should return default providers if none are configured in settings', async () => {
    // Mock getConfiguration to return empty array for ai.providers
    (vscode.workspace.getConfiguration as any).mockReturnValue({
      get: vi.fn((key: string, defaultValue: any) => {
        if (key === 'ai.providers') return [];
        return defaultValue;
      })
    });

    const context: any = {};
    const configs = await getAIProviderConfigs(context);

    expect(configs.length).toBeGreaterThan(0);
    expect(configs.some(p => p.id === 'ollama-local')).toBe(true);
    expect(configs.some(p => p.id === 'openai-cloud')).toBe(true);
  });
});
