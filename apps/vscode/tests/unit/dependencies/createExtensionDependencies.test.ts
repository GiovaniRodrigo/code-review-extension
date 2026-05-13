import { describe, expect, it } from 'vitest';
import { createExtensionDependencies } from '../../../src/dependencies/createExtensionDependencies';

describe('createExtensionDependencies', () => {
  it('cria o container de dependências da extensão', () => {
    const context = {
      extensionUri: { fsPath: '/fake/extension' },
      globalStorageUri: { fsPath: '/fake/storage' },
      subscriptions: [],
      secrets: {
        get: async () => undefined,
        store: async () => undefined
      }
    } as any;

    const dependencies = createExtensionDependencies(context);

    expect(dependencies.context).toBe(context);
    expect(dependencies.vscodeAdapter).toBeDefined();
    expect(dependencies.reviewRepository).toBeDefined();
    expect(dependencies.contextEngine).toBeDefined();
    expect(dependencies.validateFindingUseCase).toBeDefined();
    expect(dependencies.reviewViewProvider).toBeDefined();
  });
});
