import { describe, it, expect } from 'vitest';
import { buildContainer } from '../../apps/vscode/src/dependencies/buildContainer';

describe('Runtime Validation', () => {
  it('should bootstrap DI container successfully', async () => {
    // Mock context
    const mockContext: any = {
      subscriptions: [],
      globalStorageUri: { fsPath: '/tmp' },
      secrets: { get: async () => '', store: async () => {} },
      extensionPath: process.cwd(),
      globalState: { get: () => undefined, update: async () => {} }
    };

    const container = await buildContainer(mockContext);
    expect(container).toBeDefined();
    expect(container.ide).toBeDefined();
  });
});
