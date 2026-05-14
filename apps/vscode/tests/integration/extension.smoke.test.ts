import { describe, it, expect, vi } from 'vitest';
import * as vscode from 'vscode';

describe('Extension Entrypoint Smoke Test', () => {
  it('should have activate and deactivate functions', async () => {
    const extension = await import('../../src/extension');
    expect(extension.activate).toBeDefined();
    expect(extension.deactivate).toBeDefined();
  });
});
